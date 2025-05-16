package com.checkmate.domain.aianalysisreport.dto.request;

import lombok.Builder;

@Builder
public record AiAnalysisWebhookRequestDto(
	int contractId,
	int contractCategoryId,
	String status) {
}
