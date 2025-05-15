package com.checkmate.domain.notification.service;

import com.checkmate.domain.notification.dto.response.NotificationResponse;
import com.checkmate.domain.notification.entity.Notification;
import com.checkmate.domain.notification.repository.NotificationRepository;
import com.checkmate.domain.user.entity.User;
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
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(int userId) {
        User user = userService.findUserById(userId);
        List<Notification> notifications = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);

        return notifications.stream()
                .map(notification -> NotificationResponse.builder()
                        .id(notification.getId())
                        .type(notification.getType())
                        .message(notification.getMessage())
                        .targetUrl(notification.getTargetUrl())
                        .isRead(notification.isRead())
                        .createdAt(notification.getCreatedAt())
                        .userId(notification.getUser().getUserId())
                        .contractId(notification.getContract().getId())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(int userId) {
        User user = userService.findUserById(userId);
        List<Notification> notifications = notificationRepository.findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        return notifications.stream()
                .map(notification -> NotificationResponse.builder()
                        .id(notification.getId())
                        .type(notification.getType())
                        .message(notification.getMessage())
                        .targetUrl(notification.getTargetUrl())
                        .isRead(notification.isRead())
                        .createdAt(notification.getCreatedAt())
                        .userId(notification.getUser().getUserId())
                        .contractId(notification.getContract().getId())
                        .build())
                .toList();
    }

    @Transactional
    public NotificationResponse NotificationRead(int userId, int notificationId) {
        User user = userService.findUserById(userId);
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
                .targetUrl(notification.getTargetUrl())
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

    @Transactional(readOnly = true)
    public long countUnreadNotifications(int userId) {
        User user = userService.findUserById(userId);
        return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public List<NotificationResponse> markAllAsRead(int userId) {
        User user = userService.findUserById(userId);
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
                        .targetUrl(notification.getTargetUrl())
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
