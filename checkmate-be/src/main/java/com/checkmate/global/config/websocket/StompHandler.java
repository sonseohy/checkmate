package com.checkmate.global.config.websocket;

import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class StompHandler implements ChannelInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(StompHandler.class);
    private final JwtUtil jwtUtil;

    /**
     * 메시지 전송 전 처리 메서드
     * CONNECT 명령에 대해 JWT 토큰 검증 수행
     *
     * @param message 처리할 메시지
     * @param channel 메시지가 전송될 채널
     * @return 처리된 메시지
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        final StompHeaderAccessor accessor = StompHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        log.info("preSend: {}", accessor);

        if(StompCommand.CONNECT.equals(accessor.getCommand())) {
            validateJwt(accessor);
        }

        return message;
    }

    /**
     * 헤더에서 JWT 토큰 추출
     *
     * @param accessor STOMP 헤더 접근자
     * @return Authorization 헤더 값
     */
    private String extractJwt(final StompHeaderAccessor accessor) {
        return accessor.getFirstNativeHeader("Authorization");
    }

    /**
     * JWT 토큰 유효성 검증 및 인증 정보 설정
     *
     * @param accessor STOMP 헤더 접근자
     * @throws CustomException 토큰이 유효하지 않은 경우
     */
    private void validateJwt(final StompHeaderAccessor accessor) {
        final String authorization = extractJwt(accessor);

        String token = authorization.substring(7);
        boolean isValid = jwtUtil.validateToken(token);

        if(!isValid) {
            logger.error("Invalid JWT");
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        Authentication auth = jwtUtil.getAuthentication(token);
        accessor.setUser(auth);
    }


}
