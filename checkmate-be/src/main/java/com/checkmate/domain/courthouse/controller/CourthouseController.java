package com.checkmate.domain.courthouse.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.courthouse.dto.response.CourthouseResponseDto;
import com.checkmate.domain.courthouse.service.CourthouseService;
import com.checkmate.global.common.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CourthouseController {

	private final CourthouseService courthouseService;
	/**
	 * 법원 정보 조회
	 *
	 * @return 전국 법원 정보(법원 이름, 주소, 대표 번호)
	 */
	@GetMapping("/courthouses")
	// @PreAuthorize("isAuthenticated()")
	public ApiResponse<List<CourthouseResponseDto>> getCourthouse() {
		List<CourthouseResponseDto> data = courthouseService.getAllCourthouseInfo();
		return ApiResponse.ok(data);
	}
}
