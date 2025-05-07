package com.checkmate.domain.improvementreport.dto.response;

import com.checkmate.domain.improvementreport.entity.ImprovementReport;

import lombok.Builder;

@Builder
public record ImprovementResponseDto (String improvementReportId, String aiAnalysisReportId, String description) {
	public static ImprovementResponseDto fromEntity(ImprovementReport improvementReport) {
		return ImprovementResponseDto.builder()
			.improvementReportId(improvementReport.getImprovementReportId())
			.aiAnalysisReportId(improvementReport.getAiAnalysisReportId())
			.description(improvementReport.getDescription())
			.build();
	}
}
