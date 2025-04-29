package com.checkmate.domain.question.dto.response;

import lombok.Builder;

@Builder
public record QuestionResponseDto (int contractId, int contractCategoryId, int questionId, String questionDetail) {

}
