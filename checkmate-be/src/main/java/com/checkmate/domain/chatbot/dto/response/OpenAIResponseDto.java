package com.checkmate.domain.chatbot.dto.response;

import java.util.List;

import com.checkmate.domain.chatbot.entity.Choice;
import com.checkmate.domain.chatbot.entity.Usage;

import lombok.Builder;

@Builder
public record OpenAIResponseDto(String id, String object, long created, String model, List<Choice> choices,
								Usage usage) {
}
