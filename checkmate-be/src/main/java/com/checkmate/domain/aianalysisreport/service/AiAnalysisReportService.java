package com.checkmate.domain.aianalysisreport.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.checkmate.domain.aianalysisreport.dto.request.AiAnalysisWebhookRequestDto;
import com.checkmate.domain.aianalysisreport.dto.response.AiAnalysisReportResponseDto;
import com.checkmate.domain.aianalysisreport.entity.CompleteAiAnalysisReport;
import com.checkmate.domain.aianalysisreport.repository.AiAnalysisReportRepository;
import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.domain.notification.dto.response.NotificationResponse;
import com.checkmate.domain.notification.entity.Notification;
import com.checkmate.domain.notification.entity.NotificationType;
import com.checkmate.domain.notification.repository.NotificationRepository;
import com.checkmate.domain.notification.service.NotificationService;
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
	private final NotificationRepository notificationRepository;
	private final NotificationService notificationService;

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
		// 계약서 정보 조회
		Contract contract = contractRepository.findById(requestDto.contractId())
			.orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

		String notificationMessage = "";

		if ("completed".equals(requestDto.status())) {
			notificationMessage = " 계약서 분석이 완료되었습니다.";

		} else if ("failed".equals(requestDto.status())) {
			notificationMessage = " 계약서 분석에 실패했습니다.";
		}

		// 알림 생성 및 저장
		Notification notification = Notification.builder()
			.user(contract.getUser())
			.contract(contract)
			.type(NotificationType.CONTRACT_ANALYSIS)
			.message(contract.getTitle() + notificationMessage)
			.isRead(false)
			.build();

		notificationRepository.save(notification);

		// 알림 응답 객체 생성
		NotificationResponse response = NotificationResponse.builder()
			.id(notification.getId())
			.type(notification.getType())
			.message(notification.getMessage())
			.isRead(notification.isRead())
			.createdAt(notification.getCreatedAt())
			.userId(notification.getUser().getUserId())
			.contractId(requestDto.contractId())
			.build();

		// 개인 알림 큐로 알림 전송
		messagingTemplate.convertAndSendToUser(
			String.valueOf(notification.getUser().getUserId()),
			"/queue/notifications",
			response
		);

		// 읽지 않은 알림 수 업데이트
		long updatedCount = notificationService.countUnreadNotifications(notification.getUser().getUserId());
		messagingTemplate.convertAndSendToUser(
			String.valueOf(notification.getUser().getUserId()),
			"/queue/notification-count",
			updatedCount
		);
	}

	public boolean verifyWebhookApiKey(String webhookApiKey, String apiKey) {
		return webhookApiKey.equals(apiKey);
	}
}
