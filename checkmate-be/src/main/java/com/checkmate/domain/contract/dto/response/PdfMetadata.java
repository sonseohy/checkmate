package com.checkmate.domain.contract.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class PdfMetadata {
    private final String fileUrl;
    private final byte[] iv;
    private final byte[] shareA;
    private final long fileId;
    private final String filename;
    private final String contentType;
    private final long contentLength;
}
