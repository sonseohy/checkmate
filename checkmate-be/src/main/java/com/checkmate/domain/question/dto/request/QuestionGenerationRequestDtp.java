package com.checkmate.domain.question.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;

@Builder
public record QuestionGenerationRequestDtp(
	@JsonProperty("contract_id") int contractId,
	@JsonProperty("contract_category_id") int contractCategoryId) {
}
