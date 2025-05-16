package com.checkmate.domain.aianalysisreport.dto.request;

import lombok.Builder;

@Builder
public record AiContractAnalysisRequestDto(int contractId, int contractCategoryId) {
}
