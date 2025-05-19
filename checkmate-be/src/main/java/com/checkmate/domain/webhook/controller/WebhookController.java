package com.checkmate.domain.webhook.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.webhook.dto.request.WebhookRequestDto;
import com.checkmate.domain.webhook.service.WebhookService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
@Tag(name = "Webhook API", description = "웹훅 처리 API")
public class WebhookController {
	private final WebhookService webhookService;

	@Value("${webhook.api-key}")
	private String webhookApiKey;

	/**
	 * 분석 완료 알림 웹훅
	 *
	 * @param apiKey 직접 작성한 api key -> 보완을 위해
	 * @param webhookRequestDto 분석 완료 웹훅 요청 dto
	 */
	@Operation(summary = "분석 완료 알림 웹훅", description = "분석 완료 알림 웹훅을 처리합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "분석 완료 알림 웹훅 성공")
	})
	@PostMapping
	public void handleAiAnalysisWebhook(
		@Parameter(description = "보안을 위한 키", required = true)
		@RequestHeader("X-API-Key") String apiKey,
		@RequestBody WebhookRequestDto webhookRequestDto) {
		webhookService.handleAnalysisWebhook(webhookApiKey, apiKey, webhookRequestDto);
	}
}
