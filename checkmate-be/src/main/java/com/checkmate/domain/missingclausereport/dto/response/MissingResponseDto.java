package com.checkmate.domain.missingclausereport.dto.response;

import com.checkmate.domain.missingclausereport.entity.Importance;
import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;

import lombok.Builder;

@Builder
public record MissingResponseDto(String missingClauseReportId, String aiAnalysisReportId,
								 Importance importance, String description) {
	public static MissingResponseDto fromEntity(MissingClauseReport missingClauseReport) {
		return MissingResponseDto.builder()
			.missingClauseReportId(missingClauseReport.getId().toHexString())
			.aiAnalysisReportId(missingClauseReport.getAiAnalysisReportId().toHexString())
			.importance(missingClauseReport.getImportance())
			.description(missingClauseReport.getDescription())
			.build();
	}
}
