package com.checkmate.domain.aianalysisreport.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.aianalysisreport.dto.response.AiAnalysisReportResponseDto;
import com.checkmate.domain.aianalysisreport.service.AiAnalysisReportService;
import com.checkmate.domain.user.dto.CustomUserDetails;
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

	/**
	 * ai 분석 리포트 조회
	 *
	 * @param contractId 계약서 ID
	 * @param userDetails 유저
	 * @return ai 분석 리포트 ID, 계약서 ID, 개선 사항, 누락 사항, 위험 사항
	 */
	@Operation(summary = "AI 분석 리포트 조회", description = "AI 분석 리포트를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "AI 분석 리포트 조회 성공"),
	})
	@GetMapping("/{contractId}")
	@PreAuthorize("isAuthenticated()")
	public ApiResult<AiAnalysisReportResponseDto> getAiAnalysisReportByContractId(
		@PathVariable(value = "contractId") int contractId,
		@AuthenticationPrincipal CustomUserDetails userDetails) {
		AiAnalysisReportResponseDto data = aiAnalysisReportService.getAiAnalysisReportByContractId(contractId, userDetails.getUserId());
		return ApiResult.ok(data);
	}

}
