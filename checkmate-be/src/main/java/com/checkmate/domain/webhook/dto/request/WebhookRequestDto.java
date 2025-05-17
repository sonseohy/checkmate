package com.checkmate.domain.webhook.dto.request;

import lombok.Builder;

@Builder
public record WebhookRequestDto(
	int contractId,
	int contractCategoryId,
	String status,
	String type) {
}
