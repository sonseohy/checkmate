package com.checkmate.domain.missingclausereport.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.checkmate.domain.aianalysisreport.repository.AiAnalysisReportRepository;
import com.checkmate.domain.missingclausereport.dto.response.MissingResponseDto;
import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;
import com.checkmate.domain.missingclausereport.repository.MissingClauseReportRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MissingClauseReportService {
	private final MissingClauseReportRepository missingClauseReportRepository;
	private final AiAnalysisReportRepository aiAnalysisReportRepository;

	/**
	 * 각 ai 분석 리포트에 해당되는 누락 사항 리포트를 데이터베이스에서 조회
	 *
	 * @param aiAnalysisId ai 분석 리포트 ID
	 * @return 누락 사항 리포트 DTO 리스트
	 */
	public List<MissingResponseDto> getMissingClauseReportByAiAnalysisId(String aiAnalysisId) {
		if (!aiAnalysisReportRepository.existsById(aiAnalysisId)) {
			throw new CustomException(ErrorCode.AI_ANALYSIS_REPORT_NOT_FOUND);
		}
		List<MissingClauseReport> missingClauseReport = missingClauseReportRepository
			.findAllByAiAnalysisReportId(aiAnalysisId);
		return missingClauseReport.stream()
			.map(MissingResponseDto::fromEntity)
			.collect(Collectors.toList());
	}
}
