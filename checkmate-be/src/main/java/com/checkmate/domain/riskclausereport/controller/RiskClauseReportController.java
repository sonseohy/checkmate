package com.checkmate.domain.riskclausereport.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.riskclausereport.dto.response.RiskClauseReportResponseDto;
import com.checkmate.domain.riskclausereport.service.RiskClauseReportService;
import com.checkmate.global.common.response.ApiResult;

@RestController
@RequestMapping("/api/risk")
@RequiredArgsConstructor
public class RiskClauseReportController {
	private final RiskClauseReportService riskClauseReportService;

	@GetMapping("/{aiAnalysisId}")
	// @PreAuthorize("isAuthenticated()")
	public ApiResult<List<RiskClauseReportResponseDto>> getRiskClauseReportsByAnalysisId(
		@PathVariable(value = "aiAnalysisId") String aiAnalysisId) {
		List<RiskClauseReportResponseDto> data =
			riskClauseReportService.getImprovementReportsByAnalysisId(aiAnalysisId);
		return ApiResult.ok(data);
	}
}
