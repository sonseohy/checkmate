package com.checkmate.domain.notification.service;

import com.checkmate.domain.notification.dto.response.NotificationResponse;
import com.checkmate.domain.notification.entity.Notification;
import com.checkmate.domain.notification.repository.NotificationRepository;
import com.checkmate.domain.user.service.UserService;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 알림 목록 조회
     * 사용자의 모든 알림을 조회
     *
     * @param userId 사용자 ID
     * @return 사용자의 알림 목록
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(int userId) {
        List<Notification> notifications = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);

        return notifications.stream()
                .map(notification -> NotificationResponse.builder()
                        .id(notification.getId())
                        .type(notification.getType())
                        .message(notification.getMessage())
                        .isRead(notification.isRead())
                        .createdAt(notification.getCreatedAt())
                        .userId(notification.getUser().getUserId())
                        .contractId(notification.getContract().getId())
                        .build())
                .toList();
    }

    /**
     * 읽지 않은 알림 목록 조회
     * 사용자의 읽지 않은 알림만 조회
     *
     * @param userId 사용자 ID
     * @return 사용자의 읽지 않은 알림 목록
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(int userId) {
        List<Notification> notifications = notificationRepository.findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        return notifications.stream()
                .map(notification -> NotificationResponse.builder()
                        .id(notification.getId())
                        .type(notification.getType())
                        .message(notification.getMessage())
                        .isRead(notification.isRead())
                        .createdAt(notification.getCreatedAt())
                        .userId(notification.getUser().getUserId())
                        .contractId(notification.getContract().getId())
                        .build())
                .toList();
    }

    /**
     * 알림 읽음 처리
     * 특정 알림을 읽음 상태로 변경하고 실시간 알림 상태 업데이트
     *
     * @param userId 사용자 ID
     * @param notificationId 알림 ID
     * @return 읽음 처리된 알림 정보
     */
    @Transactional
    public NotificationResponse NotificationRead(int userId, int notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (!notification.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.NOTIFICATION_ACCESS_DENIED);
        }

        notification.markAsRead();
        notificationRepository.save(notification);

        NotificationResponse response = NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .userId(notification.getUser().getUserId())
                .contractId(notification.getContract().getId())
                .build();

        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/queue/notification-status-changed",
                response
        );

        long unread = notificationRepository.countByUserUserIdAndIsReadFalse(userId);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/queue/notification-count",
                unread
        );

        return response;
    }

    /**
     * 읽지 않은 알림 개수 조회
     * 사용자의 읽지 않은 알림 개수를 반환
     *
     * @param userId 사용자 ID
     * @return 읽지 않은 알림 개수
     */
    @Transactional(readOnly = true)
    public long countUnreadNotifications(int userId) {
        return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
    }

    /**
     * 모든 알림 읽음 처리
     * 사용자의 모든 알림을 읽음 상태로 변경하고 실시간 알림 상태 업데이트
     *
     * @param userId 사용자 ID
     * @return 읽음 처리된 알림 목록
     */
    @Transactional
    public List<NotificationResponse> markAllAsRead(int userId) {
        List<Notification> notifications = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);

        for (Notification notification : notifications) {
            notification.markAsRead();
        }
        notificationRepository.saveAll(notifications);

        List<NotificationResponse> response = notifications.stream()
                .map(notification -> NotificationResponse.builder()
                        .id(notification.getId())
                        .type(notification.getType())
                        .message(notification.getMessage())
                        .isRead(notification.isRead())
                        .createdAt(notification.getCreatedAt())
                        .userId(notification.getUser().getUserId())
                        .contractId(notification.getContract().getId())
                        .build())
                .toList();

        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/queue/notification-status-changed",
                response
        );

        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/queue/notification-count",
                0L
        );

        return response;
    }

    /**
     * 알림 수신 확인
     * 알림이 클라이언트에 전달되었음을 확인하고 상태 업데이트
     *
     * @param userId 사용자 ID
     * @param notificationId 알림 ID
     */
    @Transactional
    public void markAsDelivered(int userId, Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (notification.getUser().getUserId() != userId) {
            throw new CustomException(ErrorCode.NOTIFICATION_ACCESS_DENIED);
        }

        notification.markAsDelivered();
        notificationRepository.save(notification);
    }
}
