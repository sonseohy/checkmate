package com.checkmate.domain.chatbot.dto.request;

import java.util.List;

import com.checkmate.domain.chatbot.entity.Message;

public record OpenAIRequestDto(String model, List<Message> messages, Double temperature) {
}
