package com.checkmate.domain.question.dto.response;

import com.checkmate.domain.question.entity.Question;

import lombok.Builder;

@Builder
public record QuestionResponseDto (int contractId, int contractCategoryId, int questionId, String questionDetail) {

	public static QuestionResponseDto fromEntity(Question question) {
		return new QuestionResponseDto(
			question.getContract().getId(),
			question.getCategory().getId(),
			question.getQuestionId(),
			question.getQuestionDetail()
		);
	}
}
