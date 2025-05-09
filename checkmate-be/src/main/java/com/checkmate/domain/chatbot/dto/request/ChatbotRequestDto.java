package com.checkmate.domain.chatbot.dto.request;

import lombok.Builder;

@Builder
public record ChatbotRequestDto(String message, String sessionId) {
}
