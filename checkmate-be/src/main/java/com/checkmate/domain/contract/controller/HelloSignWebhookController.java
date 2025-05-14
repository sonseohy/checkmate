package com.checkmate.domain.contract.controller;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.entity.ContractFile;
import com.checkmate.domain.contract.entity.FileCategory;
import com.checkmate.domain.contract.entity.SignatureStatus;
import com.checkmate.domain.contract.repository.ContractFileRepository;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.common.response.ApiResult;
import com.checkmate.global.common.service.KeyShareMongoService;
import com.checkmate.global.common.service.S3Service;
import com.dropbox.sign.api.SignatureRequestApi;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDateTime;


@RestController
@RequiredArgsConstructor
public class HelloSignWebhookController {

    private final KeyShareMongoService keyShareMongoService;
    @Value("${hs.api.key}")
    private String apiKey;

    private final ContractRepository contractRepository;
    private final SignatureRequestApi signatureRequestApi;
    private final S3Service s3Service;
    private final ContractFileRepository contractFileRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/api/hellosign/callback")
    public ApiResult<String> callback(
            @RequestParam("json") String payloadJson,
            @RequestHeader("X-HelloSign-Signature") String signatureHeader
    ) throws Exception {
        // --- 1. HMAC SHA256 검증 ---
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec key = new SecretKeySpec(
                apiKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"
        );
        mac.init(key);
        byte[] rawHmac = mac.doFinal(payloadJson.getBytes(StandardCharsets.UTF_8));
        String computedHex = Hex.encodeHexString(rawHmac);

        if (!computedHex.equals(signatureHeader)) {
            throw new CustomException(ErrorCode.WEBHOOK_AUTH_FAILURE);
        }

        // --- 2. JSON 파싱 ---
        JsonNode root = objectMapper.readTree(payloadJson);
        String eventType = root.path("event").path("event_type").asText();
        if (!"signature_request_signed".equals(eventType)) {
            return ApiResult.ok("Ignored event: " + eventType);
        }

        // signature_request 객체 내 signature_request_id 추출
        String requestId = root
                .path("signature_request")
                .path("signature_request_id")
                .asText();

        // --- 3. DB에서 Contract 조회 ---
        Contract contract = contractRepository
                .findBySignatureRequestId(requestId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND_FOR_SIGNATURE));

        // --- 4. 서명된 PDF 다운로드 (SDK 호출) ---
        File signedPdf = signatureRequestApi
                .signatureRequestFiles(requestId, "pdf");
        byte[] pdfBytes = Files.readAllBytes(signedPdf.toPath());

        // --- 5. AES-GCM 암호화 + S3 업로드 ---
        S3Service.SplitEncryptedResult result = s3Service.uploadEncryptedBytesWithKeySplit(
                pdfBytes,
                contract.getTitle() + "-signed.pdf",
                "application/pdf",
                S3Service.PDF_PREFIX
        );

        // --- 6. DB 상태·URL·서명 시각 업데이트 ---
        contract.setSignatureStatus(SignatureStatus.COMPLETED);
        contract.setSignedAt(LocalDateTime.now());
        contractRepository.save(contract);

        ContractFile file = contractFileRepository.findByContractIdAndFileCategory(contract.getId(), FileCategory.VIEWER)
                .orElseThrow(() -> new CustomException(ErrorCode.FILE_NOT_FOUND));

        s3Service.deleteFile(file.getFileAddress());
        contractFileRepository.deleteById(file.getId());

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

        keyShareMongoService.saveShareB(Long.valueOf(signedFile.getId()), result.getShareB());

        return ApiResult.ok("Event processed");
    }

}
