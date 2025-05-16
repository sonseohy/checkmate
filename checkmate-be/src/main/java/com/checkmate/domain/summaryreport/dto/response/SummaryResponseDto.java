package com.checkmate.domain.summaryreport.dto.response;

import lombok.Builder;

@Builder
public record SummaryResponseDto(
	String summaryReportId,
	String aiAnalysisReportId,
	String description
) {
}
