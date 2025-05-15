package com.checkmate.domain.notification.controller;

import com.checkmate.domain.notification.dto.request.NotificationAckRequest;
import com.checkmate.domain.notification.dto.response.NotificationResponse;
import com.checkmate.domain.notification.service.NotificationService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.global.common.response.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification API", description = "알림 API")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "알림 조회", description = "내 알림을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내 알림 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping
    public ApiResult<List<NotificationResponse>> getNotifications(
            @Parameter(description = "유저 ID", required = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<NotificationResponse> response = notificationService.getNotifications(userDetails.getUserId());
        return ApiResult.ok(response);

    }

    @GetMapping("/unread")
    public ApiResult<List<NotificationResponse>> getUnreadNotifications(
            @Parameter(description = "유저 ID", required = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<NotificationResponse> response = notificationService.getUnreadNotifications(userDetails.getUserId());
        return ApiResult.ok(response);
    }

    @PutMapping("/{notificationId}/read")
    public ApiResult<NotificationResponse> NotificationRead(
            @Parameter(description = "알림 ID", required = true) @PathVariable Integer notificationId,
            @Parameter(description = "유저 ID", required = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        NotificationResponse response = notificationService.NotificationRead(userDetails.getUserId(), notificationId);
        return ApiResult.ok(response);
    }

    @PutMapping("/read-all")
    public ApiResult<List<NotificationResponse>> markAllAsRead(
            @Parameter(description = "유저 ID", required = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<NotificationResponse> response = notificationService.markAllAsRead(userDetails.getUserId());
        return ApiResult.ok(response);
    }

    @MessageMapping("/notifications/ack")
    public void acknowledgeNotification(NotificationAckRequest request,
                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationService.markAsDelivered(userDetails.getUserId(), request.getNotificationId());
    }

}
