package com.checkmate.domain.checklist.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.checklist.dto.response.CheckListResponseDto;
import com.checkmate.domain.checklist.service.CheckListService;
import com.checkmate.global.common.response.ApiResponse;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CheckListController {
	private final CheckListService checkListService;

	/**
	 * 카테고리 ID 별로 체크해야할 체크 리스트 조회
	 *
	 * @param categoryId
	 * @return CheckListResponseDto -> 체크 리스트 DTO(카테고리 ID, 체크리스트 내용, 체크 리스트 ID)
	 */
	@GetMapping("/check-list/{categoryId}")
	// @PreAuthorize("isAuthenticated()")
	public ApiResponse<List<CheckListResponseDto>> getCheckListsByContractCategoryId(
		@PathVariable(value = "categoryId") int categoryId) {
		List<CheckListResponseDto> data = checkListService.getCheckListByContractCategoryId(categoryId);
			return ApiResponse.ok(data);
	}
}
