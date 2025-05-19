package com.checkmate.domain.aianalysisreport.service;

import org.springframework.stereotype.Service;

import com.checkmate.domain.aianalysisreport.dto.response.AiAnalysisReportResponseDto;
import com.checkmate.domain.aianalysisreport.entity.CompleteAiAnalysisReport;
import com.checkmate.domain.aianalysisreport.repository.AiAnalysisReportRepository;
import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAnalysisReportService {
	private final AiAnalysisReportRepository aiAnalysisReportRepository;
	private final ContractRepository contractRepository;

	/**
	 * AI 분석 리포트 조회
	 * 계약서 ID를 기반으로 해당 계약서의 분석 리포트를 조회하고, 사용자 접근 권한을 확인
	 *
	 * @param contractId 계약서 ID
	 * @param userId 요청한 사용자 ID
	 * @return AI 분석 리포트 ID, 계약서 ID, 개선 사항, 위험 사항, 누락 사항, 생성 일자
	 */
	public AiAnalysisReportResponseDto getAiAnalysisReportByContractId(int contractId, int userId) {
		Contract contract = contractRepository.findById(contractId)
			.orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));
		String categoryName = contract.getCategory().getName();
		if (!contract.getUser().getUserId().equals(userId)) {
			throw new CustomException(ErrorCode.AI_ANALYSIS_ACCESS_DENIED);
		}
		CompleteAiAnalysisReport aiAnalysisReport = aiAnalysisReportRepository
			.getCompleteReportByContractId(contractId)
			.orElseThrow(() -> new CustomException(ErrorCode.AI_ANALYSIS_REPORT_NOT_FOUND));
		return AiAnalysisReportResponseDto.fromEntity(aiAnalysisReport, categoryName);
	}
}
