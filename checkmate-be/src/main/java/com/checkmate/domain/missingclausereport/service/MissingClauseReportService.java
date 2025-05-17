package com.checkmate.domain.missingclausereport.service;

import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.checkmate.domain.aianalysisreport.entity.AiAnalysisReport;
import com.checkmate.domain.aianalysisreport.repository.AiAnalysisReportRepository;
import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.domain.missingclausereport.dto.response.MissingResponseDto;
import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;
import com.checkmate.domain.missingclausereport.repository.MissingClauseReportRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.util.IdUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MissingClauseReportService {
	private final MissingClauseReportRepository missingClauseReportRepository;
	private final AiAnalysisReportRepository aiAnalysisReportRepository;
	private final ContractRepository contractRepository;

	/**
	 * 각 ai 분석 리포트에 해당되는 누락 사항 리포트를 데이터베이스에서 조회
	 *
	 * @param aiAnalysisIdHex ai 분석 리포트 ID
	 * @return 누락 사항 리포트 DTO 리스트
	 */
	public List<MissingResponseDto> getMissingClauseReportByAiAnalysisId(String aiAnalysisIdHex, int userId) {
		ObjectId aiAnalysisId = IdUtils.toObjectId(aiAnalysisIdHex);
		AiAnalysisReport aiAnalysisReport = aiAnalysisReportRepository.findById(aiAnalysisId)
			.orElseThrow(() -> new CustomException(ErrorCode.AI_ANALYSIS_REPORT_NOT_FOUND));
		Contract contract = contractRepository.findById(aiAnalysisReport.getContractId())
			.orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));
		if (!contract.getUser().getUserId().equals(userId)) {
			throw new CustomException(ErrorCode.CONTRACT_ACCESS_DENIED);
		}
		List<MissingClauseReport> missingClauseReport = missingClauseReportRepository
			.findAllByAiAnalysisReportId(aiAnalysisId);
		if (missingClauseReport.isEmpty()) {
			throw new CustomException(ErrorCode.MISSING_REPORT_NOT_FOUND);
		}
		return missingClauseReport.stream()
			.map(MissingResponseDto::fromEntity)
			.collect(Collectors.toList());
	}
}
