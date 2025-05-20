package com.checkmate.global.config.websocket;

import com.checkmate.domain.notification.service.NotificationService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import java.security.Principal;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessagingTemplate template;
    private final NotificationService notificationService;

    /**
     * 세션 연결 완료 이벤트 처리
     * 사용자가 웹소켓에 연결되면 해당 사용자의 읽지 않은 알림 개수를 전송
     *
     * @param event 세션 연결 이벤트
     */
    @EventListener
    public void handleSessionConnected(SessionConnectedEvent event) {
        Principal principal = event.getUser();
        Integer userId = null;

        if (principal instanceof UsernamePasswordAuthenticationToken auth) {
            Object rawPrincipal = auth.getPrincipal();
            if (rawPrincipal instanceof CustomUserDetails userDetails) {
                userId = userDetails.getUserId();
            } else {
                try {
                    userId = Integer.valueOf(rawPrincipal.toString());
                } catch (NumberFormatException ignore) {
                    return;
                }
            }
        } else {
            try {
                userId = Integer.valueOf(principal.getName());
            } catch (Exception ignore) {
                return;
            }
        }

        long unreadCount = notificationService.countUnreadNotifications(userId);
        template.convertAndSendToUser(
                userId.toString(),
                "/queue/notification-count",
                unreadCount
        );
    }
}
