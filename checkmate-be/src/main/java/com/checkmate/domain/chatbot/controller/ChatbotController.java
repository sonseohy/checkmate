package com.checkmate.domain.chatbot.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.chatbot.service.OpenAIService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@Slf4j
public class ChatbotController {
	private final OpenAIService openAIService;

	/**
	 * chatbot 기능
	 *
	 * @param message 질문 메세지
	 * @return gpt 응답 내용
	 */
	@PostMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<String> chatWithSession(
		@RequestBody String message) {
		return openAIService.generateStreamResponse(message);
	}
}
