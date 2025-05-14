package com.checkmate.domain.summary.dto.response;

import lombok.Builder;

@Builder
public record SummaryResponseDto(
	String summaryReportId,
	String aiAnalysisReportId,
	String description
) {
}
