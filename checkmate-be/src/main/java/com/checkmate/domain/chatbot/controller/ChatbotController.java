package com.checkmate.domain.chatbot.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
	 * chatbot 기능
	 *
	 * @param request 요청 DTO
	 * @return gpt 응답 내용
	 */
	@PostMapping
	public Mono<ApiResult<ChatbotResponseDto>> chatWithSession(
		@RequestBody ChatbotRequestDto request) {

		return openAIService.generateResponse(request.message())
			.map(ApiResult::ok);
	}
}
