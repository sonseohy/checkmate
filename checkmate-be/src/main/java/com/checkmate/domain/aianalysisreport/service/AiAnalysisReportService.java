package com.checkmate.domain.aianalysisreport.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.checkmate.domain.aianalysisreport.dto.request.AiAnalysisWebhookRequestDto;
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
	 * @param requestDto 웹소켓 요청 DTO
	 */
	public void handleAnalysisWebhook(String webhookApiKey, String ApiKey , AiAnalysisWebhookRequestDto requestDto) {
		if (!verifyWebhookApiKey(webhookApiKey, ApiKey)) {
			throw new CustomException(ErrorCode.UNAUTHORIZED);
		}
		if (!contractRepository.existsById(requestDto.contractId())) {
			throw new CustomException(ErrorCode.CONTRACT_NOT_FOUND);
		}
		if ("completed".equals(requestDto.status())) {
			messagingTemplate.convertAndSend(
				"/sub/contract/" + requestDto.contractId(),
				AiAnalysisWebSocketResponseDto.completed(
					requestDto.contractId(),
					requestDto.jobId(),
					requestDto.contractCategoryId()
				)
			);
		} else if ("failed".equals(requestDto.status())) {
			messagingTemplate.convertAndSend(
				"/sub/contract/" + requestDto.contractId(),
				AiAnalysisWebSocketResponseDto.failed(
					requestDto.contractId(),
					requestDto.jobId(),
					requestDto.error(),
					requestDto.contractCategoryId()
				)
			);
		}

	}

	public boolean verifyWebhookApiKey(String webhookApiKey, String apiKey) {
		return webhookApiKey.equals(apiKey);
	}
}
