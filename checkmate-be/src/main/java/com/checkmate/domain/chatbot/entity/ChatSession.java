package com.checkmate.domain.chatbot.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatSession implements Serializable {
	private static final long serialVersionUID = 1L;
	private String sessionId;
	List<Message> messages;

	public static ChatSession create(String sessionId) {
		List<Message> messages = new ArrayList<>();
		messages.add(Message.builder()
				.role("system")
				.content("""
					당신은 법률 전문 AI입니다. 답변을 제공할 때는 일반인들도 쉽게 이해할 수 있도록 답변해주세요.
					답변은 한국어로 해주시고, 되도록이면 간결하게 답변해주세요.""")
				.build());
		return new ChatSession(sessionId, messages);
	}

	public ChatSession addUserMessage(String content) {
		List<Message> newMessages = new ArrayList<>(messages);
		newMessages.add(Message.builder().role("user").content(content).build());
		return new ChatSession(sessionId, newMessages);
	}

	public ChatSession addAssistantMessage(String content) {
		List<Message> newMessages = new ArrayList<>(messages);
		newMessages.add(Message.builder().role("assistant").content(content).build());
		return new ChatSession(sessionId, newMessages);
	}
}
