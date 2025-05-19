package com.checkmate.domain.webhook.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.checkmate.domain.contract.entity.QuestionGenerationStatus;
import com.checkmate.domain.webhook.dto.request.WebhookRequestDto;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookService {
	private final ContractRepository contractRepository;
	private final NotificationRepository notificationRepository;
	private final NotificationService notificationService;
	private final SimpMessagingTemplate messagingTemplate;

	/**
	 * 웹소켓으로 분석 완료 상태 보내기
	 *
	 * @param webhookApiKey 보안을 위한 api key
	 * @param ApiKey 보안을 위한 api key
	 * @param requestDto 웹소켓 요청 DTO
	 */
	public void handleAnalysisWebhook(String webhookApiKey, String ApiKey , WebhookRequestDto requestDto) {

		if (!verifyWebhookApiKey(webhookApiKey, ApiKey)) {
			throw new CustomException(ErrorCode.UNAUTHORIZED);
		}
		// 계약서 정보 조회
		Contract contract = contractRepository.findById(requestDto.contractId())
			.orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

		String notificationMessage = "";
		NotificationType type = null;
		if ("QUESTION_GENERATION".equals(requestDto.type())) {
			if ("completed".equals(requestDto.status())) {
				contract.setQuestionGenerationStatus(QuestionGenerationStatus.COMPLETED);
				notificationMessage = " 질문 생성이 완료되었습니다.";
				type = NotificationType.QUESTION_GENERATION;
			} else if ("failed".equals(requestDto.status())) {
				contract.setQuestionGenerationStatus(QuestionGenerationStatus.FAILED);
				notificationMessage = " 질문 생성에 실패했습니다.";
				type = NotificationType.QUESTION_GENERATION;
			}
		} else {
			if ("completed".equals(requestDto.status())) {
				contract.setQuestionGenerationStatus(QuestionGenerationStatus.COMPLETED);
				notificationMessage = " 분석이 완료되었습니다.";
				type = NotificationType.CONTRACT_ANALYSIS;

			} else if ("failed".equals(requestDto.status())) {
				contract.setQuestionGenerationStatus(QuestionGenerationStatus.FAILED);
				notificationMessage = " 분석에 실패했습니다.";
				type = NotificationType.CONTRACT_ANALYSIS;
			}
		}
		contractRepository.save(contract);

		// 알림 생성 및 저장
		Notification notification = Notification.builder()
			.user(contract.getUser())
			.contract(contract)
			.type(type)
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
