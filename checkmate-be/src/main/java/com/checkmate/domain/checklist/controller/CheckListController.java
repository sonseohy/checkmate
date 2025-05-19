package com.checkmate.domain.checklist.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.checklist.dto.response.CheckListResponseDto;
import com.checkmate.domain.checklist.service.CheckListService;
import com.checkmate.global.common.response.ApiResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/check-list")
@RequiredArgsConstructor
@Tag(name = "CheckList API", description = "체크 리스트 조회 API")
public class CheckListController {
	private final CheckListService checkListService;

	/**
	 * 카테고리 ID 별로 체크해야할 체크 리스트 조회
	 *
	 * @param categoryId 카테고리 ID
	 * @return CheckListResponseDto -> 체크 리스트 DTO(카테고리 ID, 체크리스트 내용, 체크 리스트 ID)
	 */
	@Operation(summary = "체크 리스트 조회", description = "체크 리스트를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "체크 리스트 조회 성공"),
		@ApiResponse(responseCode = "401", description = "인증 실패"),
		@ApiResponse(responseCode = "404", description = "체크 리스트 없음"),
	})
	@GetMapping("/{categoryId}")
	public ApiResult<List<CheckListResponseDto>> getCheckListsByContractCategoryId(
		@PathVariable(value = "categoryId") int categoryId) {
		List<CheckListResponseDto> data = checkListService.getCheckListByContractCategoryId(categoryId);
			return ApiResult.ok(data);
	}
}
