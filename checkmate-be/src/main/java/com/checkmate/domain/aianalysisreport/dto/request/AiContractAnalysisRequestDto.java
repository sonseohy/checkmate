package com.checkmate.domain.aianalysisreport.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;

@Builder
public record AiContractAnalysisRequestDto(
	@JsonProperty("contract_id") int contractId,
	@JsonProperty("contract_category_id") int contractCategoryId,
	@JsonProperty("contract_category_name") String contractCategoryName) {
}
