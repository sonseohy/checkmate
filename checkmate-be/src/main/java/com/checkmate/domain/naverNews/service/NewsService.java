package com.checkmate.domain.naverNews.service;

import com.checkmate.domain.naverNews.client.NaverSearchClient;
import com.checkmate.domain.naverNews.dto.response.NewsResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Service
public class NewsService {

    private final NaverSearchClient client;
    private final ObjectMapper mapper;

    public NewsService(NaverSearchClient client, ObjectMapper mapper) {
        this.client = client;
        this.mapper = mapper;
    }

    @Cacheable(value = "news")
    public NewsResponse getContractNews(int start, int display) throws Exception {
        String json = client.searchNews(start, display);
        NewsResponse response = mapper.readValue(json, NewsResponse.class);

        for (NewsResponse.Item item : response.getItems()) {
            String noHtml = item.getDescription().replaceAll("<(/)?b>", "");
            String decoded = URLDecoder.decode(noHtml, StandardCharsets.UTF_8);

            String noUrls = decoded.replaceAll("https?://\\S+\\s?", "")
                    .replaceAll("www\\.\\S+\\s?", "");

            String cleaned = noUrls.replaceAll("[^가-힣a-zA-Z0-9\\s\\.,]", "")
                    .trim();

            if (cleaned.isEmpty()) {
                cleaned = "(본문 스니펫 없음)";
            }

            item.setDescription(cleaned);
        }

        return response;
    }
}