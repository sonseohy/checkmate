package com.checkmate.domain.contract.controller;

import com.checkmate.domain.contract.entity.ContractFile;
import com.checkmate.domain.contract.service.ContractFileService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.global.common.service.S3Service;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "ContractFile API", description = "계약서 파일 API")
public class ContractFileController {

    private final ContractFileService contractFileService;
    private final S3Service s3Service;

    @GetMapping("/{contractId}/download")
    public ResponseEntity<Resource> downloadPdf(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable int contractId) throws Exception {

        ContractFile file = contractFileService.findViewerFile(
                userDetails.getUserId(), contractId);

        String key = file.getFileAddress()
                .replaceFirst("https://[^/]+/", "");

        InputStream decrypted = s3Service.getDecryptedStream(
                key, file.getIv(), file.getEncryptedDataKey(), file.getId());

        InputStreamResource resource = new InputStreamResource(decrypted);

        String filename = file.getContract().getTitle() + ".pdf";
        ContentDisposition cd = ContentDisposition.builder("attachment")
                .filename(filename, StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, cd.toString())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

}
