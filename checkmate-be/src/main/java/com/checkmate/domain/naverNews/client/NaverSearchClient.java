package com.checkmate.domain.naverNews.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;

@Component
@Slf4j
public class NaverSearchClient {

    private final RestTemplate rt;
    private final String baseUrl;

    public NaverSearchClient(@Qualifier("naver") RestTemplate rt,
                             @Qualifier("naverBaseUrl") String baseUrl) {
        this.rt = rt;
        this.baseUrl = baseUrl;
    }

    public String searchNews(int start, int display) {
        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/news.json")
                .queryParam("query", "계약")
                .queryParam("sort", "sim")
                .queryParam("start", start)
                .queryParam("display", display)
                .encode(StandardCharsets.UTF_8)
                .toUriString();

        log.debug("Naver News Request URL = {}", url);
        return rt.getForObject(url, String.class);
    }
}
