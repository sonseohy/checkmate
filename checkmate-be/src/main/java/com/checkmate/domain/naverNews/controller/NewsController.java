package com.checkmate.domain.naverNews.controller;

import com.checkmate.domain.naverNews.dto.response.NewsResponse;
import com.checkmate.domain.naverNews.service.NewsService;
import com.checkmate.global.common.response.ApiResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@Tag(name = "Naver News API", description = "네이버 뉴스 API")
public class NewsController {

    private final NewsService newsService;

    /**
     * 계약 관련 뉴스 조회
     * 계약과 관련된 최신 뉴스 정보를 조회
     *
     * @return 계약 관련 뉴스 정보
     */
    @GetMapping
    @Operation(summary = "계약 관련 뉴스 조회", description = "계약 관련 뉴스를 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계약 관련 뉴스 조회 성공")
    })
    public ApiResult<NewsResponse> fetchNews() {
        NewsResponse response = newsService.getContractNews();
        return ApiResult.ok(response);
    }
}