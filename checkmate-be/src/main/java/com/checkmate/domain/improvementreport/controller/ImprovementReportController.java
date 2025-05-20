package com.checkmate.domain.improvementreport.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.improvementreport.dto.response.ImprovementResponseDto;
import com.checkmate.domain.improvementreport.service.ImprovementReportService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.global.common.response.ApiResult;

@RestController
@RequestMapping("/api/improvement")
@RequiredArgsConstructor
@Tag(name = "Improvement API", description = "개선 사항 리포트 조회 API")
public class ImprovementReportController {
	private final ImprovementReportService improvementReportService;

	/**
	 * 각 ai 분석 리포트에 해당되는 개선 사항 리포트 조회
	 *
	 * @param aiAnalysisId ai 분석 리포트 ID
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @return 개선 사항 ID, ai 분석 리포트 ID, 개선 사항 내용
	 */
	@Operation(summary = "개선 사항 리포트 조회", description = "개선 사항 리포트를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "개선 사항 리포트 조회 성공")
	})
	@GetMapping("{aiAnalysisId}")
	@PreAuthorize("isAuthenticated()")
	public ApiResult<List<ImprovementResponseDto>> getImprovementReport(
		@Parameter(description = "AI 분석 리포트 ID", required = true)
		@PathVariable(value = "aiAnalysisId") String aiAnalysisId,
		@Parameter(description = "현재 로그인한 사용자 정보", required = true)
		@AuthenticationPrincipal CustomUserDetails userDetails) {
		List<ImprovementResponseDto> data = improvementReportService.getImprovementReport(aiAnalysisId,
			userDetails.getUserId());
		return ApiResult.ok(data);
	}

}
