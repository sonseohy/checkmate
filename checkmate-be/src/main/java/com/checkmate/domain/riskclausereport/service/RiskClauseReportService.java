package com.checkmate.domain.riskclausereport.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.checkmate.domain.aianalysisreport.repository.AiAnalysisReportRepository;
import com.checkmate.domain.riskclausereport.dto.response.RiskClauseReportResponseDto;
import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;
import com.checkmate.domain.riskclausereport.repository.RiskClauseReportRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RiskClauseReportService {
	private final RiskClauseReportRepository riskClauseReportRepository;
	private final AiAnalysisReportRepository aiAnalysisReportRepository;

	public List<RiskClauseReportResponseDto> getImprovementReportsByAnalysisId(String analysisId) {
		if (!aiAnalysisReportRepository.existsById(analysisId)) {
			throw new CustomException(ErrorCode.AI_ANALYSIS_REPORT_NOT_FOUND);
		}
		List<RiskClauseReport> risks = riskClauseReportRepository.findAllByAiAnalysisReportId(analysisId);
		return risks.stream()
			.map(RiskClauseReportResponseDto::fromEntity)
			.collect(Collectors.toList());
	}
}
