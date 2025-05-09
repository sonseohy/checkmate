package com.checkmate.domain.chatbot.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.checkmate.domain.chatbot.dto.request.OpenAIRequestDto;
import com.checkmate.domain.chatbot.dto.response.ChatbotResponseDto;
import com.checkmate.domain.chatbot.dto.response.OpenAIResponseDto;
import com.checkmate.domain.chatbot.entity.ChatSession;
import com.checkmate.domain.chatbot.entity.Message;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
public class OpenAIService {
	private final WebClient openaiWebClient;
	private final ChatSessionService chatSessionService;

	@Value("${openai.model}")
	private String model;

	@Value("${openai.temperature:0.7}")
	private Double temperature;

	public OpenAIService(@Qualifier("openaiWebClient") WebClient openaiWebClient,
		ChatSessionService chatSessionService) {
		this.openaiWebClient = openaiWebClient;
		this.chatSessionService = chatSessionService;
	}

	/**
	 * 세션 기반 응답 생성 (대화 컨텍스트 유지)
	 */
	public Mono<ChatbotResponseDto> generateResponseWithSession(String userMessage, String sessionId) {
		// 세션에 사용자 메시지 추가
		ChatSession session = chatSessionService.addUserMessage(sessionId, userMessage);

		// OpenAI API 요청
		OpenAIRequestDto requestDto = new OpenAIRequestDto(
			model,
			session.getMessages(),
			temperature);

		return callOpenAI(requestDto)
			.map(response -> {
				// API 응답을 세션에 저장
				chatSessionService.addAssistantMessage(session.getSessionId(), response);
				return ChatbotResponseDto.builder()
					.response(response)
					.sessionId(session.getSessionId())
					.build();
			});
	}

	/**
	 * OpenAI API 호출 공통 메서드
	 */
	private Mono<String> callOpenAI(OpenAIRequestDto requestDto) {
		return openaiWebClient.post()
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(requestDto)
			.retrieve()
			.bodyToMono(OpenAIResponseDto.class)
			.map(response -> {
				if (response.choices() != null && !response.choices().isEmpty()) {
					return response.choices().get(0).getMessage().getContent();
				}
				return "응답을 처리하는 중 오류가 발생했습니다.";
			})
			.onErrorResume(e -> {
				System.err.println("OpenAI API 호출 중 오류: " + e.getMessage());
				return Mono.just("서비스에 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
			});
	}
}
