package com.checkmate.domain.naverNews.service;

import com.checkmate.domain.naverNews.dto.response.NewsResponse;
import com.checkmate.global.config.NaverApiConfig;
import com.checkmate.global.config.WebClientConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsService {

    private final NaverApiConfig naverApiConfig;
    private final WebClientConfig webClient;
    private static final String CACHE_NAME = "contractNews";

    @Cacheable(value = CACHE_NAME, key = "'contractNews'", unless = "#result == null || #result.items.isEmpty()")
    public NewsResponse getContractNews() {

        URI uri = UriComponentsBuilder.
                fromUriString(naverApiConfig.newsUrl)
                .queryParam("query", "계약")
                .queryParam("display", 20)
                .queryParam("start", 1)
                .queryParam("sort", "sim")
                .build()
                .encode()
                .toUri();

        return webClient.naverWebClient()
                .get()
                .uri(uri)
                .retrieve()
                .bodyToMono(NewsResponse.class)
                .block();
    }

}