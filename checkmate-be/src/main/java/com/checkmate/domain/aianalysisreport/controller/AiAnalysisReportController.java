package com.checkmate.domain.aianalysisreport.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.aianalysisreport.dto.response.AiAnalysisReportResponseDto;
import com.checkmate.domain.aianalysisreport.dto.request.AiAnalysisWebhookRequestDto;
import com.checkmate.domain.aianalysisreport.dto.response.AiAnalysisWebhookResponseDto;
import com.checkmate.domain.aianalysisreport.service.AiAnalysisReportService;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.common.response.ApiResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
@Tag(name = "Analysis API", description = "AI 분석 리포트 조회 API")
public class AiAnalysisReportController {
	private final AiAnalysisReportService aiAnalysisReportService;

	@Value("${webhook.api-key}")
	private String webhookApiKey;

	/**
	 * ai 분석 리포트 조회
	 *
	 * @param contractId 계약서 ID
	 * @return ai 분석 리포트 ID, 계약서 ID, 개선 사항, 누락 사항, 위험 사항
	 */
	@Operation(summary = "AI 분석 리포트 조회", description = "AI 분석 리포트를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "AI 분석 리포트 조회 성공"),
		@ApiResponse(responseCode = "401", description = "인증 실패"),
	})
	@GetMapping("/{contractId}")
	@PreAuthorize("isAuthenticated()")
	public ApiResult<AiAnalysisReportResponseDto> getAiAnalysisReportByContractId(
		@PathVariable(value = "contractId") int contractId) {
		AiAnalysisReportResponseDto data = aiAnalysisReportService.getAiAnalysisReportByContractId(contractId);
		return ApiResult.ok(data);
	}

	@PostMapping("/webhook")
	public ApiResult<AiAnalysisWebhookResponseDto> handleAiAnalysisWebhook(
		@RequestHeader("X-API-Key") String apiKey,
		@RequestBody AiAnalysisWebhookRequestDto webhookResponseDto) {

		AiAnalysisWebhookResponseDto data;
		if ("completed".equals(webhookResponseDto.status())) {
			data = aiAnalysisReportService.handleAnalysisCompleted(
				webhookApiKey,
				apiKey,
				webhookResponseDto.contractId(),
				webhookResponseDto.contractCategoryId(),
				webhookResponseDto.jobId()
			);
			return ApiResult.ok(data);
		}
		else if ("failed".equals(webhookResponseDto.status())) {
			aiAnalysisReportService.handleAnalysisFailed(
				webhookApiKey,
				apiKey,
				webhookResponseDto.contractId(),
				webhookResponseDto.contractCategoryId(),
				webhookResponseDto.jobId(),
				webhookResponseDto.error()
			);
			return ApiResult.fail(new CustomException(ErrorCode.ANALYSIS_FAIL), webhookResponseDto.error());
		}
		return ApiResult.fail(new CustomException(ErrorCode.UNKNOWN_ANALYSIS_STATUS));
	}
}
