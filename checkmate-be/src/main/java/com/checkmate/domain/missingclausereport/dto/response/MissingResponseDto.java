package com.checkmate.domain.missingclausereport.dto.response;

import com.checkmate.domain.missingclausereport.entity.Importance;
import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;

import lombok.Builder;

@Builder
public record MissingResponseDto(String missingClauseReportId, String aiAnalysisReportId,
								 Importance importance, String description) {
	public static MissingResponseDto fromEntity(MissingClauseReport missingClauseReport) {
		return new MissingResponseDto(
			missingClauseReport.getMissingClauseReportId(),
			missingClauseReport.getAiAnalysisReportId(),
			missingClauseReport.getImportance(),
			missingClauseReport.getDescription()
		);
	}
}
