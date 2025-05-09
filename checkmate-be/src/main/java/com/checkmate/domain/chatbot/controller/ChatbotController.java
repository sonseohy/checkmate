package com.checkmate.domain.chatbot.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.chatbot.dto.request.ChatbotRequestDto;
import com.checkmate.domain.chatbot.dto.response.ChatbotResponseDto;
import com.checkmate.domain.chatbot.service.OpenAIService;
import com.checkmate.global.common.response.ApiResult;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {
	private final OpenAIService openAIService;

	/**
	 * 세션 기반 채팅 응답
	 */
	@PostMapping
	public Mono<ApiResult<ChatbotResponseDto>> chatWithSession(
		@RequestBody ChatbotRequestDto request) {

		return openAIService.generateResponseWithSession(request.message(), request.sessionId())
			.map(ApiResult::ok);
	}
}
