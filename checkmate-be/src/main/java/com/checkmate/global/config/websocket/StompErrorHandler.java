package com.checkmate.global.config.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

@RequiredArgsConstructor
@Configuration
public class StompErrorHandler extends StompSubProtocolErrorHandler {

    /**
     * 클라이언트 메시지 처리 중 발생한 오류를 핸들링
     * 클라이언트에게 보다 유용한 오류 메시지를 전달하도록 재정의
     *
     * @param clientMessage 클라이언트로부터 받은 원본 메시지
     * @param ex 처리 중 발생한 예외
     * @return 클라이언트에게 전송할 오류 메시지
     */
    @Override
    public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {
        String msg = "접속 중 오류가 발생했습니다: " + ex.getMessage();

        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.ERROR);
        accessor.setMessage(msg);
        accessor.setLeaveMutable(true);

        return MessageBuilder.createMessage(msg.getBytes(), accessor.getMessageHeaders());
    }
}


