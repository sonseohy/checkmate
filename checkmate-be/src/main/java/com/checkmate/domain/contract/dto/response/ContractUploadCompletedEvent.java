package com.checkmate.domain.contract.dto.response;

import lombok.Builder;

@Builder
public record ContractUploadCompletedEvent(int contractId, int contractCategoryId)  {
}
