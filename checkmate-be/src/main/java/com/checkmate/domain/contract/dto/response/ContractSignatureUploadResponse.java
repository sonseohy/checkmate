package com.checkmate.domain.contract.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ContractSignatureUploadResponse {
    private Integer contractId;
    private LocalDateTime createdAt;
    private String signatureRequestId;
}
