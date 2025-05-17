package com.checkmate.domain.question.dto.response;

import java.util.List;

import lombok.Builder;

@Builder
public record QuestionResultDto(
	String status,
	String message,
	List<QuestionResponseDto> questions
) {}