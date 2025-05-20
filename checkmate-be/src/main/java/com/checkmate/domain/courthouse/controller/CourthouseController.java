package com.checkmate.domain.courthouse.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.courthouse.dto.response.CourthouseResponseDto;
import com.checkmate.domain.courthouse.service.CourthouseService;
import com.checkmate.global.common.response.ApiResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/courthouses")
@Tag(name = "Courthouse API", description = "법원 정보 조회 API")
public class CourthouseController {

	private final CourthouseService courthouseService;
	/**
	 * 법원 정보 조회
	 *
	 * @return 전국 법원 정보(법원 이름, 주소, 대표 번호)
	 */
	@Operation(summary = "법원 정보 조회", description = "법원 정보를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "법원 정보 조회 성공")
	})
	@GetMapping
	public ApiResult<List<CourthouseResponseDto>> getCourthouse() {
		List<CourthouseResponseDto> data = courthouseService.getAllCourthouseInfo();
		return ApiResult.ok(data);
	}
}
