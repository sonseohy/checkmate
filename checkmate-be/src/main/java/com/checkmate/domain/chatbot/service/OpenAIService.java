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
import com.checkmate.domain.chatbot.entity.Message;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class OpenAIService {
	private final WebClient openaiWebClient;

	@Value("${openai.model}")
	private String model;

	@Value("${openai.temperature:0.7}")
	private Double temperature;

	public OpenAIService(@Qualifier("openaiWebClient") WebClient openaiWebClient) {
		this.openaiWebClient = openaiWebClient;
	}

	/**
	 * 응답 생성
	 *
	 * @param userMessage 유저가 보낸 메세지
	 * @return openai api로 요청 보내기
	 */
	public Mono<ChatbotResponseDto> generateResponse(String userMessage) {
		List<Message> messages = new ArrayList<>();
		messages.add(Message.builder()
			.role("system")
			.content("""
                    당신은 법률 전문 AI입니다. 답변을 제공할 때는 일반인들도 쉽게 이해할 수 있도록 답변해주세요.
                    답변은 한국어로 해주시고, 되도록이면 간결하게 답변해주세요.""")
			.build());
		messages.add(Message.builder()
			.role("user")
			.content(userMessage)
			.build());

		// API 요청 생성
		OpenAIRequestDto requestDto = new OpenAIRequestDto(
			model,
			messages,
			temperature);

		return callOpenAI(requestDto)
			.map(response -> ChatbotResponseDto.builder()
				.response(response)
				.build());
	}

	/**
	 * OpenAI API 호출 공통 메서드
	 *
	 * @param requestDto openai api로 보낼 정보들
	 * @return 응답 메세지
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
				log.info("OpenAI API 호출 중 오류: {}", e.getMessage());
				return Mono.just("서비스에 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
			});
	}
}
