package com.checkmate.domain.riskclausereport.dto.response;

import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;

import lombok.Builder;

@Builder
public record RiskClauseReportResponseDto (String riskClauseReportId, String aiAnalysisReportId,
										   int riskLevel, String originalText, String description) {
	public static RiskClauseReportResponseDto fromEntity(RiskClauseReport riskClauseReport) {
		return RiskClauseReportResponseDto.builder()
			.riskClauseReportId(riskClauseReport.getRiskClauseReportId())
			.aiAnalysisReportId(riskClauseReport.getAiAnalysisReportId())
			.riskLevel(riskClauseReport.getRiskLevel())
			.originalText(riskClauseReport.getOriginalText())
			.description(riskClauseReport.getDescription())
			.build();
	}
}
