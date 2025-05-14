package com.checkmate.domain.dropboxsign.service;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.entity.ContractFile;
import com.checkmate.domain.contract.entity.FileCategory;
import com.checkmate.domain.contract.entity.SignatureStatus;
import com.checkmate.domain.contract.repository.ContractFileRepository;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.common.service.KeyShareMongoService;
import com.checkmate.global.common.service.S3Service;
import com.dropbox.sign.api.SignatureRequestApi;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class HelloSignCallbackService {

    @Value("${hs.api.key}")
    private String apiKey;

    private final ContractRepository contractRepository;
    private final ContractFileRepository contractFileRepository;
    private final SignatureRequestApi signatureRequestApi;
    private final S3Service s3Service;
    private final KeyShareMongoService keyShareMongoService;
    private final ObjectMapper objectMapper;

    /**
     * Webhook 페이로드(JSON)와 HMAC 서명값을 받아 처리합니다.
     */
    @Transactional
    public void handleCallback(String payloadJson, String signatureHeader) throws Exception {
        // 1) HMAC 검증
        if (signatureHeader != null) {
            if (!hmacMatches(apiKey, payloadJson, signatureHeader)) {
                throw new CustomException(ErrorCode.WEBHOOK_AUTH_FAILURE);
            }
        } else {
            log.warn("Missing X-HelloSign-Signature header, skipping HMAC validation");
        }

        // 2) JSON 파싱
        JsonNode root      = objectMapper.readTree(payloadJson);
        String eventType   = root.path("event").path("event_type").asText();
        String requestId   = root.path("signature_request").path("signature_request_id").asText();

        // 3) PDF 다운로드 가능한 이벤트만 처리
        if (!"signature_request_all_signed".equals(eventType)
                && !"signature_request_downloadable".equals(eventType)) {
            return;
        }

        // 4) Contract 조회
        Contract contract = contractRepository.findBySignatureRequestId(requestId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND_FOR_SIGNATURE));

        // 5) 서명된 PDF 다운로드
        File signedPdf = signatureRequestApi.signatureRequestFiles(requestId, "pdf");
        byte[] pdfBytes = Files.readAllBytes(signedPdf.toPath());
        if (!signedPdf.delete()) {
            log.warn("Could not delete temp file: {}", signedPdf.getAbsolutePath());
        }

        // 6) AES-GCM 암호화 후 S3 업로드
        S3Service.SplitEncryptedResult result = s3Service.uploadEncryptedBytesWithKeySplit(
                pdfBytes,
                contract.getTitle() + "-signed.pdf",
                "application/pdf",
                S3Service.PDF_PREFIX
        );

        // 7) Contract 상태 및 서명 시각 업데이트
        contract.setSignatureStatus(SignatureStatus.COMPLETED);
        contract.setSignedAt(LocalDateTime.now());
        contractRepository.save(contract);

        // 8) 기존 viewer 파일 제거
        ContractFile oldFile = contractFileRepository
                .findByContractIdAndFileCategory(contract.getId(), FileCategory.VIEWER)
                .orElseThrow(() -> new CustomException(ErrorCode.FILE_NOT_FOUND));
        s3Service.deleteFile(oldFile.getFileAddress());
        contractFileRepository.deleteById(oldFile.getId());

        // 9) 새 viewer 파일 메타 저장
        ContractFile signedFile = ContractFile.builder()
                .contract(contract)
                .fileType("pdf")
                .fileAddress(result.getUrl())
                .encryptedDataKey(result.getShareA())
                .fileCategory(FileCategory.VIEWER)
                .iv(result.getIv())
                .uploadAt(LocalDateTime.now())
                .build();
        contractFileRepository.save(signedFile);

        // 10) 키 공유 정보 저장
        keyShareMongoService.saveShareB(Long.valueOf(signedFile.getId()), result.getShareB());
    }

    /** HMAC-SHA256 계산 후 hex 비교 */
    private boolean hmacMatches(String apiKey, String payload, String signature) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec = new SecretKeySpec(
                apiKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"
        );
        mac.init(keySpec);
        byte[] rawHmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        String computed = Hex.encodeHexString(rawHmac);
        return computed.equals(signature);
    }
}
