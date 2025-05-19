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

    /**
     * 알림 목록 조회
     * 사용자의 모든 알림을 조회
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @return 사용자의 알림 목록
     */
    @Operation(summary = "알림 조회", description = "내 알림을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내 알림 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping
    public ApiResult<List<NotificationResponse>> getNotifications(
        @Parameter(description = "현재 로그인한 사용자 정보", required = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<NotificationResponse> response = notificationService.getNotifications(userDetails.getUserId());
        return ApiResult.ok(response);

    }

    /**
     * 읽지 않은 알림 목록 조회
     * 사용자의 읽지 않은 알림만 조회
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @return 사용자의 읽지 않은 알림 목록
     */
    @Operation(summary = "읽지 않은 알림 목록 조회", description = "읽지 않은 알림 목록을 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "읽지 않은 알림 목록 조회 성공")
    })
    @GetMapping("/unread")
    public ApiResult<List<NotificationResponse>> getUnreadNotifications(
        @Parameter(description = "현재 로그인한 사용자 정보", required = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<NotificationResponse> response = notificationService.getUnreadNotifications(userDetails.getUserId());
        return ApiResult.ok(response);
    }

    /**
     * 알림 읽음 처리
     * 특정 알림을 읽음 상태로 변경
     *
     * @param notificationId 알림 ID
     * @param userDetails 현재 로그인한 사용자 정보
     * @return 읽음 처리된 알림 정보
     */
    @Operation(summary = "특정 알림 읽음 처리", description = "특정 알림 읽음 처리합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "특정 알림 읽음 처리 성공")
    })
    @PutMapping("/{notificationId}/read")
    public ApiResult<NotificationResponse> NotificationRead(
            @Parameter(description = "알림 ID", required = true) @PathVariable Integer notificationId,
            @Parameter(description = "현재 로그인한 사용자 정보", required = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        NotificationResponse response = notificationService.NotificationRead(userDetails.getUserId(), notificationId);
        return ApiResult.ok(response);
    }

    /**
     * 모든 알림 읽음 처리
     * 사용자의 모든 알림을 읽음 상태로 변경
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @return 읽음 처리된 알림 목록
     */
    @Operation(summary = "모든 알림 읽음 처리", description = "모든 알림 읽음 처리합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "모든 알림 읽음 처리 성공")
    })
    @PutMapping("/read-all")
    public ApiResult<List<NotificationResponse>> markAllAsRead(
        @Parameter(description = "현재 로그인한 사용자 정보", required = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<NotificationResponse> response = notificationService.markAllAsRead(userDetails.getUserId());
        return ApiResult.ok(response);
    }

    /**
     * 알림 수신 확인
     * 웹소켓을 통해 알림이 클라이언트에 전달되었음을 확인
     *
     * @param request 알림 확인 요청 정보
     * @param userDetails 현재 로그인한 사용자 정보
     */
    @MessageMapping("/notifications/ack")
    public void acknowledgeNotification(NotificationAckRequest request,
        @Parameter(description = "현재 로그인한 사용자 정보", required = true)
        @AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationService.markAsDelivered(userDetails.getUserId(), request.getNotificationId());
    }

}
