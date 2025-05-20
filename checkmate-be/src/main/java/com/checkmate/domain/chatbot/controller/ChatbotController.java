package com.checkmate.domain.chatbot.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.chatbot.service.OpenAIService;
import com.checkmate.global.common.response.ApiResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Chatbot API", description = "챗봇 API")
public class ChatbotController {
	private final OpenAIService openAIService;

	/**
	 * chatbot 기능
	 *
	 * @param message 질문 메세지
	 * @return gpt 응답 내용
	 */
	@Operation(summary = "챗봇 채팅", description = "챗봇과 채팅합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "챗봇 채팅 성공"),
	})
	@PostMapping
	public Mono<ApiResult<String>> chatWithSession(
		@RequestBody String message) {
		return openAIService.generateResponse(message)
			.map(ApiResult::ok);
	}
}
