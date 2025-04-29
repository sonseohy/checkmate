package com.checkmate.domain.courthouse.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.courthouse.dto.response.CourthouseResponseDto;
import com.checkmate.global.common.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CourthouseController {

	@GetMapping("/courthouses")
	public ApiResponse<CourthouseResponseDto> getCourthouse() {


		return ApiResponse.ok();
	}
}
