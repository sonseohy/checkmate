package com.checkmate.domain.question.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.question.dto.response.QuestionResultDto;
import com.checkmate.domain.question.service.QuestionService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.global.common.response.ApiResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@Tag(name = "Question API", description = "질문 리스트 조회 API")
public class QuestionController {
	private final QuestionService questionService;

	/**
	 * 각 계약서에 해당되는 질문 리스트 조회
	 *
	 * @param contractId 계약서 ID
	 * @return 질문 내용과 질문 ID
	 */
	@Operation(summary = "질문 리스트 조회", description = "질문 리스트를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "질문 리스트 조회 성공"),
		@ApiResponse(responseCode = "401", description = "인증 실패"),
		@ApiResponse(responseCode = "404", description = "질문 리스트 없음"),
	})
	@GetMapping("/{contractId}")
	@PreAuthorize("isAuthenticated()")
	public ApiResult<QuestionResultDto> getQuestions(@PathVariable(value = "contractId") int contractId,
		@AuthenticationPrincipal CustomUserDetails userDetails) {
		QuestionResultDto data = questionService.getQuestions(contractId, userDetails.getUserId());
		return ApiResult.ok(data);
	}
}
