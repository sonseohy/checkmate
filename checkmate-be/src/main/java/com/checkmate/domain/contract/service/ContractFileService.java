package com.checkmate.domain.contract.service;

import com.checkmate.domain.contract.dto.response.ContractFilesResponse;
import com.checkmate.domain.contract.dto.response.FileNumberResponse;
import com.checkmate.domain.contract.dto.response.PdfMetadata;
import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.entity.ContractFile;
import com.checkmate.domain.contract.entity.FileCategory;
import com.checkmate.domain.contract.repository.ContractFileRepository;
import com.checkmate.domain.contract.repository.ContractRepository;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractFileService {

    private final S3Service s3Service;
    private final KeyShareMongoService keyShareMongo;
    private final ContractFileRepository contractFileRepository;
    private final MalwareScanService malwareScan;
    private final FileConversionService fileConversion;
    private final PdfProcessingService pdfProcessing;
    private final MeterRegistry meterRegistry;
    private final ContractRepository contractRepository;

    /**
     * 계약서 파일 업로드
     * 사용자가 업로드한 계약서 파일을 처리하여 저장하고, 필요한 경우 PDF로 변환
     *
     * @param contract 계약서 엔티티
     * @param files 업로드된 파일 목록
     * @return 파일 처리 결과 (총 페이지 수 등)
     */
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
                    pdfBytes    = fileConversion.imageToPdf(file.getBytes());
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

    /**
     * 파일 유효성 검사
     * 업로드된 파일의 형식과 크기를 검증
     *
     * @param file 검증할 파일
     */
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

    /**
     * PDF 파일 병합
     * 여러 PDF 파일을 하나로 병합
     *
     * @param pdfBytesList 병합할 PDF 파일 바이트 배열 목록
     * @return 병합된 PDF 파일 바이트 배열
     */
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

    /**
     * 파일 주소로 파일 삭제
     * S3에 저장된 파일을 삭제
     *
     * @param fileAddress 삭제할 파일 주소
     */
    @Transactional
    public void deleteFileByAddress(String fileAddress) {
        s3Service.deleteFile(fileAddress);
    }

    /**
     * 뷰어용 파일 조회
     * 계약서 ID로 뷰어용 파일을 조회하고 접근 권한 확인
     *
     * @param userId 사용자 ID
     * @param contractId 계약서 ID
     * @return 뷰어용 계약서 파일
     */
    @Transactional(readOnly = true)
    public ContractFile findViewerFile(int userId, int contractId) {
        ContractFile file = contractFileRepository.findByContractIdAndFileCategory(contractId, FileCategory.VIEWER)
                .orElseThrow(() -> new CustomException(ErrorCode.FILE_NOT_FOUND));

        if (!file.getContract().getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.CONTRACT_ACCESS_DENIED);
        }
        return file;
    }

    /**
     * 뷰어용 PDF 메타데이터 로드
     * 계약서 미리보기를 위한 PDF 메타데이터 조회
     *
     * @param userId 사용자 ID
     * @param contractId 계약서 ID
     * @return PDF 메타데이터 (파일 URL, 암호화 정보, 파일명 등)
     */
    @Transactional(readOnly = true)
    public PdfMetadata loadViewerPdfMetadata(int userId, int contractId) {

        ContractFile file = contractFileRepository
                .findByContractIdAndFileCategory(contractId, FileCategory.VIEWER)
                .orElseThrow(() -> new CustomException(ErrorCode.FILE_NOT_FOUND));

        if (!file.getContract().getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.CONTRACT_ACCESS_DENIED);
        }

        String key = file.getFileAddress()
                .split("\\?")[0]
                .replaceFirst("https://[^/]+/", "");
        long contentLength = s3Service.getObjectContentLength(key);

        String filename    = file.getContract().getTitle() + ".pdf";
        String contentType = MediaType.APPLICATION_PDF_VALUE;

        return new PdfMetadata(
                file.getFileAddress(),
                file.getIv(),
                file.getEncryptedDataKey(),
                file.getId(),
                filename,
                contentType,
                contentLength
        );
    }

    /**
     * 계약서 관련 파일 목록 조회
     * 특정 계약서와 관련된 파일 목록을 조회
     *
     * @param userId 사용자 ID
     * @param contractId 계약서 ID
     * @return 계약서 관련 파일 목록
     */
    @Transactional(readOnly = true)
    public List<ContractFilesResponse> listContractFiles(int userId, int contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

        if(!contract.getUser().getUserId().equals(userId)){
            throw new CustomException(ErrorCode.CONTRACT_ACCESS_DENIED);
        }

        return contract.getFiles().stream()
                .filter(file -> file.getFileType().equals(FileCategory.ASSET))
                .map(file -> ContractFilesResponse.builder()
                        .fileId(file.getId())
                        .fileType(file.getFileType())
                        .fileAddress(file.getFileAddress())
                        .uploadAt(file.getUploadAt())
                        .build())
                .collect(Collectors.toList());
    }
}
