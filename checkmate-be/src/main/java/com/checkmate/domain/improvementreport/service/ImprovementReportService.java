package com.checkmate.domain.improvementreport.service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.checkmate.domain.aianalysisreport.repository.AiAnalysisReportRepository;
import com.checkmate.domain.improvementreport.dto.response.ImprovementResponseDto;
import com.checkmate.domain.improvementreport.entity.ImprovementReport;
import com.checkmate.domain.improvementreport.repository.ImprovementReportRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.util.IdUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImprovementReportService {
	private final ImprovementReportRepository improvementReportRepository;
	private final AiAnalysisReportRepository aiAnalysisReportRepository;

	/**
	 * 각 ai 분석 리포트에 해당되는 개선 사항 리포트를 데이터베이스에서 조회
	 *
	 * @param aiAnalysisIdHex ai 분석 리포트 ID
	 * @return 개선 사항 리포트 DTO 리스트
	 */
	public List<ImprovementResponseDto> getImprovementReport(String aiAnalysisIdHex) {
		ObjectId aiAnalysisId = IdUtils.toObjectId(aiAnalysisIdHex);
		if (!aiAnalysisReportRepository.existsById(aiAnalysisId)) {
			throw new CustomException(ErrorCode.AI_ANALYSIS_REPORT_NOT_FOUND);
		}
		List<ImprovementReport> improvementReports = improvementReportRepository
			.findAllByAiAnalysisReportId(aiAnalysisId);
		return improvementReports.stream()
			.map(ImprovementResponseDto::fromEntity)
			.collect(Collectors.toList());
	}

}
