package com.checkmate.domain.aianalysisreport.dto.request;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record AiAnalysisWebhookRequestDto(
	String jobId,
	int contractId,
	int contractCategoryId,
	String status,
	LocalDateTime timestamp,
	String error) {
}
