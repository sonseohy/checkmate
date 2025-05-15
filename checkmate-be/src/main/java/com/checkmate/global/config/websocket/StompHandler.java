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

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        final StompHeaderAccessor accessor = StompHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        log.info("preSend: {}", accessor);

        if(StompCommand.CONNECT.equals(accessor.getCommand())) {
            validateJwt(accessor);
        }

        return message;
    }

    private String extractJwt(final StompHeaderAccessor accessor) {
        return accessor.getFirstNativeHeader("Authorization");
    }

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
