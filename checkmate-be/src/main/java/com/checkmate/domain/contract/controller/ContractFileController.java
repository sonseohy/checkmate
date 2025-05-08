package com.checkmate.domain.contract.controller;

import com.checkmate.domain.contract.entity.ContractFile;
import com.checkmate.domain.contract.service.ContractFileService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.global.common.service.S3Service;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "ContractFile API", description = "계약서 파일 API")
public class ContractFileController {

    private final ContractFileService contractFileService;
    private final S3Service s3Service;

    @GetMapping("/{contractId}/download")
    public ResponseEntity<StreamingResponseBody> downloadPdf(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable int contractId) {

        ContractFile file = contractFileService.findViewerFile(
                userDetails.getUserId(), contractId);

        String key    = file.getFileAddress()
                .replace("https://"+/*cloudFrontDomain*/""+"/", "");
        byte[] iv     = file.getIv();
        byte[] shareA = file.getEncryptedDataKey();
        long   fileId = file.getId();

        StreamingResponseBody body = out -> {
            try {
                s3Service.streamDecryptToOutput(key, iv, shareA, fileId, out);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        };

        String filename = file.getContract().getTitle() + ".pdf";
        System.out.println("filename: "+filename);

        String fallback = "contract-" + contractId + ".pdf";
        ContentDisposition contentDisposition = ContentDisposition.builder("attachment")
                .filename(fallback)
                .filename(filename, StandardCharsets.UTF_8)
                .build();
        System.out.println("마지막");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                .contentType(MediaType.APPLICATION_PDF)
                .body(body);

    }

}
