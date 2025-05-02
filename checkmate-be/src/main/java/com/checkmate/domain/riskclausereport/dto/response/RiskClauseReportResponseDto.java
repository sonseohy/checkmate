package com.checkmate.domain.riskclausereport.dto.response;

import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;

import lombok.Builder;

@Builder
public record RiskClauseReportResponseDto (String riskClauseReportId, String aiAnalysisReportId,
										   int riskLevel, String originalText, String description) {
	public static RiskClauseReportResponseDto fromEntity(RiskClauseReport riskClauseReport) {
		return new RiskClauseReportResponseDto(
			riskClauseReport.getRiskClauseReportId(),
			riskClauseReport.getAiAnalysisReportId(),
			riskClauseReport.getRiskLevel(),
			riskClauseReport.getOriginalText(),
			riskClauseReport.getDescription()
		);
	}
}
