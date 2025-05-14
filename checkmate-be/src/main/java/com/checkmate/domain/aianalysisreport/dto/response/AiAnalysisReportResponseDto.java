package com.checkmate.domain.aianalysisreport.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.checkmate.domain.aianalysisreport.entity.CompleteAiAnalysisReport;
import com.checkmate.domain.improvementreport.dto.response.ImprovementResponseDto;
import com.checkmate.domain.missingclausereport.dto.response.MissingResponseDto;
import com.checkmate.domain.riskclausereport.dto.response.RiskClauseReportResponseDto;
import com.checkmate.domain.summary.dto.response.SummaryResponseDto;

import lombok.Builder;

@Builder
public record AiAnalysisReportResponseDto (String aiAnalysisReportId, Integer contractId,
										   List<ImprovementResponseDto> improvements,
										   List<MissingResponseDto> missingClauses,
										   List<RiskClauseReportResponseDto> riskClauses,
										   List<SummaryResponseDto> summaries,
										   LocalDateTime createdAt) {
	public static AiAnalysisReportResponseDto fromEntity(CompleteAiAnalysisReport report) {
		return AiAnalysisReportResponseDto.builder()
			.aiAnalysisReportId(report.getId().toHexString())
			.contractId(report.getContractId())
			.improvements(report.getImprovements().stream()
				.map(ImprovementResponseDto::fromEntity)
				.collect(Collectors.toList()))
			.missingClauses(report.getMissingClauses().stream()
				.map(MissingResponseDto::fromEntity)
				.collect(Collectors.toList()))
			.riskClauses(report.getRiskClauses().stream()
				.map(RiskClauseReportResponseDto::fromEntity)
				.collect(Collectors.toList()))
			.summaries(report.getSummaries() != null ?
				report.getSummaries().stream()
					.map(doc -> SummaryResponseDto.builder()
						.summaryReportId(doc.getObjectId("_id").toHexString())
						.aiAnalysisReportId(doc.getObjectId("aiAnalysisReportId").toHexString())
						.description(doc.getString("description"))
						.build())
					.collect(Collectors.toList()) :
				List.of())
			.createdAt(report.getCreatedAt())
			.build();
	}
}
