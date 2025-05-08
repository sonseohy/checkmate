package com.checkmate.domain.riskclausereport.service;

import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.checkmate.domain.aianalysisreport.repository.AiAnalysisReportRepository;
import com.checkmate.domain.riskclausereport.dto.response.RiskClauseReportResponseDto;
import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;
import com.checkmate.domain.riskclausereport.repository.RiskClauseReportRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.util.IdUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RiskClauseReportService {
	private final RiskClauseReportRepository riskClauseReportRepository;
	private final AiAnalysisReportRepository aiAnalysisReportRepository;

	/**
	 * 각 ai 분석 리포트에 해당되는 위험 사항 리포트를 데이터베이스에서 조회
	 *
	 * @param aiAnalysisIdHex ai 분석 리포트 ID
	 * @return 위험 사항 리포트 DTO 리스트
	 */
	public List<RiskClauseReportResponseDto> getImprovementReportsByAnalysisId(String aiAnalysisIdHex) {
		ObjectId aiAnalysisId = IdUtils.toObjectId(aiAnalysisIdHex);
		if (!aiAnalysisReportRepository.existsById(aiAnalysisId)) {
			throw new CustomException(ErrorCode.AI_ANALYSIS_REPORT_NOT_FOUND);
		}
		List<RiskClauseReport> risks = riskClauseReportRepository.findAllByAiAnalysisReportId(aiAnalysisId);
		return risks.stream()
			.map(RiskClauseReportResponseDto::fromEntity)
			.collect(Collectors.toList());
	}
}
