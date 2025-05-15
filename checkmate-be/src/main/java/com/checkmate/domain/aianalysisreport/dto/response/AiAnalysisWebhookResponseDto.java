package com.checkmate.domain.aianalysisreport.dto.response;

import lombok.Builder;

@Builder
public record AiAnalysisWebhookResponseDto(String status, String message) {
}
