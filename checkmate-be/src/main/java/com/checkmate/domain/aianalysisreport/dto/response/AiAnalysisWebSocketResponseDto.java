package com.checkmate.domain.aianalysisreport.dto.response;

import lombok.Builder;

@Builder
public record AiAnalysisWebSocketResponseDto(
	String jobId,
	int contractId,
	int contractCategoryId,
	String status,
	String message,
	String error) {
	public static AiAnalysisWebSocketResponseDto completed(int contractId, String jobId, int contractCategoryId) {
		return new AiAnalysisWebSocketResponseDto(
			jobId,
			contractId,
			contractCategoryId,
			"completed",
			"계약서 분석이 완료되었습니다.",
			null
		);
	}

	public static AiAnalysisWebSocketResponseDto failed(int contractId, String jobId, String error, int contractCategoryId) {
		return new AiAnalysisWebSocketResponseDto(
			jobId,
			contractId,
			contractCategoryId,
			"failed",
			"계약서 분석에 실패했습니다.",
			error
		);
	}
}
