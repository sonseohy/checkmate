package com.checkmate.domain.contract.service;

import com.checkmate.domain.contract.dto.response.FileNumberResponse;
import com.checkmate.domain.contract.dto.response.PdfData;
import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.entity.ContractFile;
import com.checkmate.domain.contract.entity.FileCategory;
import com.checkmate.domain.contract.repository.ContractFileRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.common.service.*;
import com.checkmate.global.common.service.S3Service.SplitEncryptedResult;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.io.MemoryUsageSetting;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.http.MediaType;
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
    private final KeyShareMongoService keyShareMongo;
    private final ContractFileRepository contractFileRepository;
    private final MalwareScanService malwareScan;
    private final FileConversionService fileConversion;
    private final ImagePreprocessingService imgPreprocess;
    private final PdfProcessingService pdfProcessing;
    private final MeterRegistry meterRegistry;

    @Transactional
    public FileNumberResponse uploadContractFiles(
            Contract contract,
            List<MultipartFile> files
    ) {
        log.info("uploadContractFiles 시작: contractId={} 파일수={}",
                contract.getId(), files == null ? 0 : files.size());
        if (files == null || files.isEmpty()) {
            throw new CustomException(ErrorCode.FILE_NOT_FOUND);
        }

        StopWatch sw = new StopWatch();
        sw.start();

        List<SplitEncryptedResult> splits = new ArrayList<>();
        List<byte[]> pdfList              = new ArrayList<>();
        int totalPages                    = 0;

        try {
            for (MultipartFile file : files) {
                validateFile(file);

                try (InputStream in = file.getInputStream()) {
                    if (!malwareScan.isCleanSync(in)) {
                        throw new CustomException(ErrorCode.FILE_VIRUS_DETECTED);
                    }
                }

                // 1) 암호화 + 키 분할 업로드
                SplitEncryptedResult res =
                        s3Service.uploadEncryptedFileWithKeySplit(
                                file, S3Service.ORIGINAL_PREFIX);
                splits.add(res);

                // 2) MySQL에 shareA + iv + URL 저장
                String ext = Objects.requireNonNull(
                                StringUtils.getFilenameExtension(file.getOriginalFilename()))
                        .toLowerCase();
                ContractFile cf = ContractFile.builder()
                        .contract(contract)
                        .fileType(ext)
                        .fileAddress(res.getUrl())
                        .encryptedDataKey(res.getShareA())
                        .fileCategory(FileCategory.ORIGINAL)
                        .iv(res.getIv())
                        .uploadAt(LocalDateTime.now())
                        .build();
                contractFileRepository.save(cf);

                // 3) MongoDB에 shareB 저장
                keyShareMongo.saveShareB(Long.valueOf(cf.getId()), res.getShareB());

                // 4) PDF 변환
                byte[] pdfBytes;
                if ("pdf".equals(ext)) {
                    pdfBytes = file.getBytes();
                } else if ("hwp".equals(ext)) {
                    pdfBytes = fileConversion.hwpToPdf(file.getBytes());
                } else {
                    byte[] pre = imgPreprocess.preprocessForOcr(file.getBytes());
                    pdfBytes    = fileConversion.imageToPdf(pre);
                }
                pdfList.add(pdfBytes);
                totalPages += pdfProcessing.countPages(
                        new ByteArrayInputStream(pdfBytes));
                log.info("파일 처리 완료: {} → 누적 페이지 수={}",
                        file.getOriginalFilename(), totalPages);
            }

            // 5) 여러 PDF 병합
            byte[] mergedPdf = mergePdfs(pdfList);

            // 6) 병합된 PDF도 암호화+키 분할 저장
            SplitEncryptedResult mergedRes =
                    s3Service.uploadEncryptedBytesWithKeySplit(
                            mergedPdf,
                            "merged-" + System.currentTimeMillis() + ".pdf",
                            "application/pdf",
                            S3Service.PDF_PREFIX
                    );
            splits.add(mergedRes);
            ContractFile mcf = ContractFile.builder()
                    .contract(contract)
                    .fileType("pdf")
                    .fileAddress(mergedRes.getUrl())
                    .encryptedDataKey(mergedRes.getShareA())
                    .fileCategory(FileCategory.VIEWER)
                    .iv(mergedRes.getIv())
                    .uploadAt(LocalDateTime.now())
                    .build();
            contractFileRepository.save(mcf);
            keyShareMongo.saveShareB(Long.valueOf(mcf.getId()), mergedRes.getShareB());

            return FileNumberResponse.builder()
                    .pageNo(totalPages)
                    .build();

        } catch (Exception e) {
            log.error("uploadContractFiles 중 오류 롤백 시작", e);
            // 업로드된 암호문만 삭제
            splits.forEach(r -> {
                try {
                    s3Service.deleteFile(r.getUrl());
                } catch (Exception ignored) {}
            });
            throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
        } finally {
            if (sw.isRunning()) sw.stop();
            long duration = sw.getTotalTimeMillis();
            log.info("uploadContractFiles 완료 ({} ms)", duration);
            meterRegistry.timer("contract_file_upload.duration")
                    .record(duration, java.util.concurrent.TimeUnit.MILLISECONDS);
        }
    }

    private void validateFile(MultipartFile file) {
        String ext = StringUtils.getFilenameExtension(
                file.getOriginalFilename()).toLowerCase();
        long size  = file.getSize();
        if (ext == null || !List.of("pdf","hwp","png","jpg","jpeg").contains(ext)) {
            throw new CustomException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
        if (size > 100L * 1024 * 1024) {
            throw new CustomException(ErrorCode.FILE_TOO_LARGE);
        }
    }

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

    @Transactional
    public void deleteFileByAddress(String fileAddress) {
        s3Service.deleteFile(fileAddress);
    }

    @Transactional(readOnly = true)
    public PdfData loadViewerPdf(int userId, Integer contractId) {

        ContractFile file = contractFileRepository.findByContractIdAndFileCategory(contractId, FileCategory.VIEWER)
                .orElseThrow(() -> new CustomException(ErrorCode.FILE_NOT_FOUND));

        if (!file.getContract().getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.CONTRACT_ACCESS_DENIED);
        }

        byte[] pdfBytes = s3Service.downloadAndDecryptWithKeySplit(
                file.getFileAddress(), file.getIv(), file.getEncryptedDataKey(), file.getId().longValue());

        String filename    = "contract-" + contractId + ".pdf";
        String contentType = MediaType.APPLICATION_PDF_VALUE;
        return new PdfData(pdfBytes, filename, contentType);

    }
}
