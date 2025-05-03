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
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.io.MemoryUsageSetting;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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

        List<byte[]> pdfList = new ArrayList<>();
        List<String> uploadedUrls = new ArrayList<>();
        int totalPages = 0;

        try {
            // 1) 각 파일에 대해: 검사 → 원본 업로드 → PDF 변환 → 페이지 수 집계
            for (MultipartFile file : files) {
                validateFile(file);

                // ClamAV 검사
                try (InputStream in = file.getInputStream()) {
                    if (!malwareScan.isCleanSync(in)) {
                        throw new CustomException(ErrorCode.FILE_VIRUS_DETECTED);
                    }
                }

                // 원본 파일 S3 업로드
                String originalUrl = s3Service.uploadFile(file, S3Service.ORIGINAL_PREFIX);
                uploadedUrls.add(originalUrl);
                contract.addFile(ContractFile.builder()
                        .contract(contract)
                        .fileType(StringUtils.getFilenameExtension(file.getOriginalFilename()))
                        .fileAddress(originalUrl)
                        .uploadAt(LocalDateTime.now())
                        .build());

                // 확장자별 PDF로 변환
                String ext = Objects.requireNonNull(StringUtils.getFilenameExtension(file.getOriginalFilename()))
                        .toLowerCase();
                byte[] pdfBytes;
                if ("pdf".equals(ext)) {
                    pdfBytes = file.getBytes();
                } else if ("hwp".equals(ext)) {
                    pdfBytes = fileConversion.hwpToPdf(file.getBytes());
                } else {
                    byte[] pre = imgPreprocess.preprocessForOcr(file.getBytes());
                    pdfBytes = fileConversion.imageToPdf(pre);
                }

                pdfList.add(pdfBytes);
                totalPages += pdfProcessing.countPages(new ByteArrayInputStream(pdfBytes));
                log.info("파일 처리 완료: {} → 누적 페이지 수={}", file.getOriginalFilename(), totalPages);
            }

            // 2) 여러 PDF 병합
            byte[] mergedPdf = mergePdfs(pdfList);

            // 3) 병합된 PDF S3 업로드
            String mergedUrl = s3Service.uploadBytes(
                    mergedPdf,
                    "merged-" + System.currentTimeMillis() + ".pdf",
                    "application/pdf",
                    S3Service.PDF_PREFIX
            );
            uploadedUrls.add(mergedUrl);
            contract.addFile(ContractFile.builder()
                    .contract(contract)
                    .fileType("pdf")
                    .fileAddress(mergedUrl)
                    .uploadAt(LocalDateTime.now())
                    .build());

            // 4) 결과 반환
            return FileNumberResponse.builder()
                    .pageNo(totalPages)
                    .build();

        } catch (Exception e) {
            log.error("uploadContractFiles 중 오류 롤백 시작", e);
            // 업로드된 모든 파일 삭제
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
            if (sw.isRunning()) sw.stop();
            long duration = sw.getTotalTimeMillis();
            log.info("uploadContractFiles 완료 ({} ms)", duration);
            meterRegistry.timer("contract_file_upload.duration")
                    .record(duration, java.util.concurrent.TimeUnit.MILLISECONDS);
        }
    }

    /** 지원 확장자 및 크기 검사 */
    private void validateFile(MultipartFile file) {
        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename()).toLowerCase();
        long size  = file.getSize();
        if (ext == null || !List.of("pdf","hwp","png","jpg","jpeg").contains(ext)) {
            throw new CustomException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
        if (size > 100L * 1024 * 1024) {
            throw new CustomException(ErrorCode.FILE_TOO_LARGE);
        }
    }

    /** PDFBox를 이용해 여러 PDF byte[] 리스트를 하나로 병합 */
    private byte[] mergePdfs(List<byte[]> pdfBytesList) throws Exception {
        PDFMergerUtility merger = new PDFMergerUtility();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        merger.setDestinationStream(out);
        for (byte[] bytes : pdfBytesList) {
            merger.addSource(new ByteArrayInputStream(bytes));
        }
        merger.mergeDocuments(MemoryUsageSetting.setupMainMemoryOnly());
        return out.toByteArray();
    }
}