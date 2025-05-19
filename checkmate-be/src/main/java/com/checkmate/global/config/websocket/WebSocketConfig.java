package com.checkmate.global.config.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;
    private final StompErrorHandler stompErrorHandler;

    /**
     * 메시지 브로커 설정
     * 구독 접두사, 메시지 발행 접두사, 사용자별 목적지 접두사 설정
     *
     * @param registry 메시지 브로커 레지스트리
     */
    @Override
    public void configureMessageBroker(final MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/sub", "/queue");
        registry.setApplicationDestinationPrefixes("/pub");
        registry.setUserDestinationPrefix("/user");
    }

    /**
     * STOMP 엔드포인트 등록
     * 클라이언트가 웹소켓 연결을 맺기 위한 엔드포인트 설정
     *
     * @param registry STOMP 엔드포인트 레지스트리
     */
    @Override
    public void registerStompEndpoints(final StompEndpointRegistry registry) {
        registry
                .addEndpoint("/app/")
                .setAllowedOrigins("*");

        registry.setErrorHandler(stompErrorHandler);
    }

    /**
     * 웹소켓 전송 설정
     * 메시지 크기 제한, 전송 시간 제한, 버퍼 크기 제한 설정
     *
     * @param registry 웹소켓 전송 레지스트리
     */
    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry.setMessageSizeLimit(160 * 64 * 1024);
        registry.setSendTimeLimit(100 * 10000);
        registry.setSendBufferSizeLimit(3 * 512 * 1024);
    }

    /**
     * 클라이언트 인바운드 채널 설정
     * 사용자 인증을 위한 인터셉터 등록
     *
     * @param registration 채널 등록 객체
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);
    }
}


