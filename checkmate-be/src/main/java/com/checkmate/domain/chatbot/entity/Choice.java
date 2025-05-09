package com.checkmate.domain.chatbot.entity;

import java.io.Serializable;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Choice implements Serializable {
	private static final long serialVersionUID = 1L;
	private Message message;
	private int index;
	private String finish_reason;
}
