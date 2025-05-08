package com.checkmate.domain.aianalysisreport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.aianalysisreport.dto.response.AiAnalysisReportResponseDto;
import com.checkmate.domain.aianalysisreport.service.AiAnalysisReportService;
import com.checkmate.global.common.response.ApiResult;
import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
@Tag(name = "Analysis API", description = "AI 분석 리포트 조회 API")
public class AiAnalysisReportController {
	private final AiAnalysisReportService aiAnalysisReportService;

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

	/**
	 * 계약서 분석 요청
	 *
	 * @param contractId 계약서 ID
	 * @return 분석 결과를 포함한 AI 분석 리포트
	 */
	@Operation(summary = "계약서 분석 요청", description = "계약서를 분석하고 AI 분석 리포트를 생성합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "계약서 분석 성공"),
		@ApiResponse(responseCode = "401", description = "인증 실패"),
		@ApiResponse(responseCode = "404", description = "계약서 또는 OCR 결과 없음"),
		@ApiResponse(responseCode = "500", description = "서버 오류")
	})
	@PostMapping("/{contractId}")
	@PreAuthorize("isAuthenticated()")
	public Mono<ApiResult<JsonNode>> analyzeContractAsync(@PathVariable(value = "contractId") int contractId) {
		return aiAnalysisReportService.analyzeContractAsync(contractId)
			.map(ApiResult::ok);
	}
}
