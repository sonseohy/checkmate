package com.checkmate.domain.contract.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class PdfData {

    private final byte[] data;

    private final String filename;

    private final String contentType;
}
