package com.checkmate.domain.question.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.question.dto.response.QuestionResponseDto;
import com.checkmate.domain.question.service.QuestionService;
import com.checkmate.global.common.response.ApiResponse;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuestionController {
	private final QuestionService questionService;

	/**
	 * 각 계약서에 해당되는 질문 리스트 조회
	 *
	 * @param contractId
	 * @return 질문 내용과 질문 ID
	 */
	@GetMapping("/contracts/{contractId}/questions")
	// @PreAuthorize("isAuthenticated()")
	public ApiResponse<List<QuestionResponseDto>> getQuestions(@PathVariable(value = "contractId") int contractId) {
		List<QuestionResponseDto> data = questionService.getQuestions(contractId);
		return ApiResponse.ok(data);
	}
}
