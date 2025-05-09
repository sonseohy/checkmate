package com.checkmate.domain.riskclausereport.dto.response;

import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;
import com.checkmate.domain.riskclausereport.entity.RiskLevel;

import lombok.Builder;

@Builder
public record RiskClauseReportResponseDto (String riskClauseReportId, String aiAnalysisReportId,
										   RiskLevel riskLevel, String originalText, String description) {
	public static RiskClauseReportResponseDto fromEntity(RiskClauseReport riskClauseReport) {
		return RiskClauseReportResponseDto.builder()
			.riskClauseReportId(riskClauseReport.getId().toHexString())
			.aiAnalysisReportId(riskClauseReport.getAiAnalysisReportId().toHexString())
			.riskLevel(riskClauseReport.getRiskLevel())
			.originalText(riskClauseReport.getOriginalText())
			.description(riskClauseReport.getDescription())
			.build();
	}
}
