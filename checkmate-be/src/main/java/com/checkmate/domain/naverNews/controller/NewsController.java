package com.checkmate.domain.naverNews.controller;

import com.checkmate.domain.naverNews.dto.response.NewsResponse;
import com.checkmate.domain.naverNews.service.NewsService;
import com.checkmate.global.common.response.ApiResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public ApiResult<NewsResponse> fetchNews(
            @RequestParam(defaultValue = "1") int start,
            @RequestParam(defaultValue = "20") int display) throws Exception {
        NewsResponse response = newsService.getContractNews(start, display);
        return ApiResult.ok(response);
    }
}