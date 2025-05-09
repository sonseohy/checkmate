package com.checkmate.domain.chatbot.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Usage {
	private int prompt_tokens;
	private int completion_tokens;
	private int total_tokens;
}
