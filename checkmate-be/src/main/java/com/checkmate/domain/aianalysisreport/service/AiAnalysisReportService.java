package com.checkmate.domain.aianalysisreport.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.checkmate.domain.aianalysisreport.dto.response.AiAnalysisReportResponseDto;
import com.checkmate.domain.aianalysisreport.dto.response.AiAnalysisWebSocketResponseDto;
import com.checkmate.domain.aianalysisreport.entity.CompleteAiAnalysisReport;
import com.checkmate.domain.aianalysisreport.repository.AiAnalysisReportRepository;
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
	private final SimpMessagingTemplate messagingTemplate;

	/**
	 * AI 분석 리포트 조회
	 *
	 * @param contractId 계약서 ID
	 * @return AI 분석 리포트 ID, 계약서 ID, 개선 사항, 위험 사항, 누락 사항, 생성 일자
	 */
	public AiAnalysisReportResponseDto getAiAnalysisReportByContractId(int contractId) {
		if (!contractRepository.existsById(contractId)) {
			throw new CustomException(ErrorCode.CONTRACT_NOT_FOUND);
		}
		CompleteAiAnalysisReport aiAnalysisReport = aiAnalysisReportRepository
			.getCompleteReportByContractId(contractId)
			.orElseThrow(() -> new CustomException(ErrorCode.AI_ANALYSIS_REPORT_NOT_FOUND));
		return AiAnalysisReportResponseDto.fromEntity(aiAnalysisReport);
	}

	/**
	 * 웹소켓으로 분석 완료 상태 보내기
	 *
	 * @param webhookApiKey 보안을 위한 api key
	 * @param ApiKey 보안을 위한 api key
	 * @param contractId 계약서 ID
	 * @param contractCategoryId 계약서 카테고리 ID
	 * @param jobId 계약서 분석 작업 ID
	 */
	public void handleAnalysisCompleted(String webhookApiKey, String ApiKey ,int contractId, int contractCategoryId, String jobId) {
		if (!verifyWebhookApiKey(webhookApiKey, ApiKey)) {
			throw new CustomException(ErrorCode.UNAUTHORIZED);
		}
		if (!contractRepository.existsById(contractId)) {
			throw new CustomException(ErrorCode.CONTRACT_NOT_FOUND);
		}

		messagingTemplate.convertAndSend(
			"/sub/contract/" + contractId,
			AiAnalysisWebSocketResponseDto.completed(
				contractId,
				jobId,
				contractCategoryId
			)
		);
	}

	/**
	 *
	 * @param webhookApiKey 보안을 위한 api key
	 * @param ApiKey 보안을 위한 api key
	 * @param contractId 계약서 ID
	 * @param contractCategoryId 계약서 카테고리 ID
	 * @param jobId 계약서 분석 작업 ID
	 * @param error 에러 메세지
	 */
	public void handleAnalysisFailed(String webhookApiKey, String ApiKey ,int contractId, int contractCategoryId, String jobId, String error) {
		if (!verifyWebhookApiKey(webhookApiKey, ApiKey)) {
			throw new CustomException(ErrorCode.UNAUTHORIZED);
		}
		if (!contractRepository.existsById(contractId)) {
			throw new CustomException(ErrorCode.CONTRACT_NOT_FOUND);
		}

		messagingTemplate.convertAndSend(
			"/sub/contract/" + contractId,
			AiAnalysisWebSocketResponseDto.failed(
				contractId,
				jobId,
				error,
				contractCategoryId
			)
		);
	}

	public boolean verifyWebhookApiKey(String webhookApiKey, String apiKey) {
		return webhookApiKey.equals(apiKey);
	}
}
