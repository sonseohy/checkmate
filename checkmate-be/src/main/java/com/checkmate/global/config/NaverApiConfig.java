package com.checkmate.global.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class NaverApiConfig {

    @Value("${naver.api.client-id}")
    private String clientId;

    @Value("${naver.api.client-secret}")
    private String clientSecret;

    @Bean
    @Qualifier("naver")
    public RestTemplate naverRestTemplate() {
        RestTemplate rest = new RestTemplate();
        rest.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().add("X-Naver-Client-Id", clientId);
            request.getHeaders().add("X-Naver-Client-Secret", clientSecret);
            return execution.execute(request, body);
        });
        return rest;
    }

    @Bean
    public String naverBaseUrl(@Value("${naver.api.base-url}") String baseUrl) {
        return baseUrl;
    }
}
