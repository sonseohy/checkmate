package com.checkmate.domain.contract.service;

import com.checkmate.domain.contract.dto.response.FileNumberResponse;
import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.entity.ContractFile;
import com.checkmate.domain.contract.repository.ContractFileRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.common.service.FileConversionService;
import com.checkmate.global.common.service.ImagePreprocessingService;
import com.checkmate.global.common.service.MalwareScanService;
import com.checkmate.global.common.service.PdfProcessingService;
import com.checkmate.global.common.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import io.micrometer.core.instrument.MeterRegistry;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractFileService {

    private final S3Service s3Service;
    private final ContractFileRepository contractFileRepository;
    private final MalwareScanService malwareScan;
    private final FileConversionService fileConversion;
    private final ImagePreprocessingService imgPreprocess;
    private final PdfProcessingService pdfProcessing;
    private final MeterRegistry meterRegistry;

    @Transactional
    public FileNumberResponse uploadContractFiles(Contract contract, List<MultipartFile> files) {
        log.info("uploadContractFiles 시작: contractId={} 파일수={}", contract.getId(), files == null ? 0 : files.size());
        if (files == null || files.isEmpty()) {
            throw new CustomException(ErrorCode.FILE_NOT_FOUND);
        }
        StopWatch sw = new StopWatch();
        sw.start();
        List<String> uploadedUrls = new ArrayList<>();
        int totalPages = 0;
        try {
            for (MultipartFile file : files) {
                validateFile(file);
                try (InputStream in = file.getInputStream()) {
                    if (!malwareScan.isCleanSync(in)) {
                        throw new CustomException(ErrorCode.FILE_VIRUS_DETECTED);
                    }
                }
                String originalUrl = s3Service.uploadFile(file, S3Service.ORIGINAL_PREFIX);
                uploadedUrls.add(originalUrl);
                contract.addFile(ContractFile.builder()
                        .contract(contract)
                        .fileType(StringUtils.getFilenameExtension(file.getOriginalFilename()))
                        .fileAddress(originalUrl)
                        .uploadAt(LocalDateTime.now())
                        .build());
                String pdfUrl = processToPdf(file);
                uploadedUrls.add(pdfUrl);
                contract.addFile(ContractFile.builder()
                        .contract(contract)
                        .fileType("pdf")
                        .fileAddress(pdfUrl)
                        .uploadAt(LocalDateTime.now())
                        .build());
                totalPages += calculatePages(file);
                log.info("파일 처리 완료: {} → 누적 페이지 수={}", file.getOriginalFilename(), totalPages);
            }
            return FileNumberResponse.builder()
                    .pageNo(totalPages)
                    .build();
        } catch (Exception e) {
            log.error("uploadContractFiles 중 오류 롤백 시작", e);
            for (String url : uploadedUrls) {
                try {
                    s3Service.deleteFile(url);
                    log.info("롤백 삭제 성공 {}", url);
                } catch (Exception ex) {
                    log.warn("롤백 삭제 실패 {}", url, ex);
                }
            }
            throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
        } finally {
            if (sw.isRunning()) {
                sw.stop();
            }
            long duration = sw.getTotalTimeMillis();
            log.info("uploadContractFiles 완료 ({} ms)", duration);
            meterRegistry.timer("contract_file_upload.duration")
                    .record(duration, TimeUnit.MILLISECONDS);
        }
    }

    private void validateFile(MultipartFile file) {
        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename()).toLowerCase();
        long size = file.getSize();
        if (ext == null || !List.of("pdf", "hwp", "png", "jpg", "jpeg").contains(ext)) {
            throw new CustomException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
        if (size > 100 * 1024 * 1024) {
            throw new CustomException(ErrorCode.FILE_TOO_LARGE);
        }
    }

    private String processToPdf(MultipartFile file) throws Exception {
        String ext = Objects.requireNonNull(StringUtils.getFilenameExtension(file.getOriginalFilename())).toLowerCase();
        byte[] pdfBytes;
        switch (ext) {
            case "pdf":
                boolean imageBased = pdfProcessing.isImageBasedPdf(file.getInputStream());
                pdfBytes = imageBased
                        ? pdfProcessing.preprocessImageBasedPdf(file.getBytes())
                        : file.getBytes();
                break;
            case "hwp":
                pdfBytes = fileConversion.hwpToPdf(file.getBytes());
                break;
            default:
                byte[] preprocessed = imgPreprocess.preprocessForOcr(file.getBytes());
                pdfBytes = fileConversion.imageToPdf(preprocessed);
        }
        return s3Service.uploadBytes(
                pdfBytes,
                file.getOriginalFilename().replaceAll("\\.[^.]+$", "") + ".pdf",
                "application/pdf",
                S3Service.PDF_PREFIX
        );
    }

    private int calculatePages(MultipartFile file) throws Exception {
        String ext = Objects.requireNonNull(StringUtils.getFilenameExtension(file.getOriginalFilename())).toLowerCase();
        return switch (ext) {
            case "pdf" -> pdfProcessing.countPages(file.getInputStream());
            case "hwp" -> {
                byte[] pdfBytes = fileConversion.hwpToPdf(file.getBytes());
                yield pdfProcessing.countPages(new ByteArrayInputStream(pdfBytes));
            }
            default -> 1;
        };
    }
}