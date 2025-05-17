package com.checkmate.domain.webhook.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.webhook.dto.request.WebhookRequestDto;
import com.checkmate.domain.webhook.service.WebhookService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
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
	@PostMapping
	public void handleAiAnalysisWebhook(
		@RequestHeader("X-API-Key") String apiKey,
		@RequestBody WebhookRequestDto webhookRequestDto) {
		webhookService.handleAnalysisWebhook(webhookApiKey, apiKey, webhookRequestDto);
	}
}
