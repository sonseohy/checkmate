package com.checkmate.domain.contract.controller;

import com.checkmate.domain.contract.dto.response.PdfData;
import com.checkmate.domain.contract.service.ContractFileService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "ContractFile API", description = "계약서 파일 API")
public class ContractFileController {

    private final ContractFileService contractFileService;

    @GetMapping("/{contractId}/pdf/signed-url")
    public ResponseEntity<ByteArrayResource> streamViewerPdf(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Integer contractId
    ) {
        PdfData pdf = contractFileService.loadViewerPdf(user.getUserId(), contractId);

        ByteArrayResource resource = new ByteArrayResource(pdf.getData());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline()
                                .filename(pdf.getFilename())
                                .build()
                                .toString())
                .contentType(MediaType.parseMediaType(pdf.getContentType()))
                .contentLength(pdf.getData().length)
                .body(resource);
    }

}
