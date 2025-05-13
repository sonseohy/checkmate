package com.checkmate.domain.summaryreport.controller;

import com.checkmate.domain.summaryreport.entity.SummaryReport;
import com.checkmate.domain.summaryreport.service.SummaryReportService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.global.common.response.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/summary")
@RequiredArgsConstructor
@Tag(name = "Summary API", description = "계약서 요약 API")
public class SummaryReportController {

    private final SummaryReportService summaryReportService;

    @Operation(summary = "내 계약서 요약", description = "계약서를 요약을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "계약서 요약 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping("/{contractId}")
    public ApiResult<SummaryReport> getMyContractSummary (
            @Parameter(description = "유저 ID", required = true) @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "계약서 ID", required = true) @PathVariable Integer contractId
    ) {
        SummaryReport response = summaryReportService.getMyContractSummary(userDetails.getUserId(), contractId);
        return ApiResult.ok(response);
    }

}
