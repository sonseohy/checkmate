package com.checkmate.domain.chatbot.service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.checkmate.domain.chatbot.entity.ChatSession;

import lombok.RequiredArgsConstructor;

@Service
public class ChatSessionService {
	private final RedisTemplate<String, Object> redisTemplate;

	public ChatSessionService(@Qualifier("chatSessionRedisTemplate") RedisTemplate<String, Object> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}

	@Value("${chat.session.expiry:30}") // 기본 30분
	private long sessionExpiryMinutes;

	private static final String CHAT_SESSION = "chat_session:";

	/**
	 * 세션 ID로 채팅 세션을 조회하거나 새로 생성합니다.
	 */
	public ChatSession getOrCreateSession(String sessionId) {
		String redisKey = getRedisKey(sessionId);

		if (sessionId == null || !redisTemplate.hasKey(redisKey)) {
			String newSessionId = UUID.randomUUID().toString();
			ChatSession session = ChatSession.create(newSessionId);
			saveSession(session);
			return session;
		}

		return (ChatSession) redisTemplate.opsForValue().get(redisKey);
	}

	/**
	 * 채팅 세션을 저장하고 만료 시간을 설정합니다.
	 */
	public void saveSession(ChatSession session) {
		String redisKey = getRedisKey(session.getSessionId());
		redisTemplate.opsForValue().set(redisKey, session);
		redisTemplate.expire(redisKey, sessionExpiryMinutes, TimeUnit.MINUTES);
	}

	/**
	 * 세션에 사용자 메시지를 추가하고 저장합니다.
	 */
	public ChatSession addUserMessage(String sessionId, String content) {
		ChatSession session = getOrCreateSession(sessionId);
		ChatSession updatedSession = session.addUserMessage(content);
		saveSession(updatedSession);
		return updatedSession;
	}

	/**
	 * 세션에 어시스턴트 메시지를 추가하고 저장합니다.
	 */
	public ChatSession addAssistantMessage(String sessionId, String content) {
		ChatSession session = getOrCreateSession(sessionId);
		ChatSession updatedSession = session.addAssistantMessage(content);
		saveSession(updatedSession);
		return updatedSession;
	}

	/**
	 * 세션 ID로 세션을 삭제합니다.
	 */
	public void deleteSession(String sessionId) {
		redisTemplate.delete(getRedisKey(sessionId));
	}

	/**
	 * Redis 키 생성 헬퍼 메서드
	 */
	private String getRedisKey(String sessionId) {
		return CHAT_SESSION + sessionId;
	}
}
