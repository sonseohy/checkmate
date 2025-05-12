package com.checkmate.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Autowired
    NaverApiConfig naverApiConfig;

    @Bean
    public WebClient naverWebClient() {
        return WebClient.builder()
                .baseUrl(naverApiConfig.newsUrl)
                .defaultHeader("X-Naver-Client-id", naverApiConfig.clientId)
                .defaultHeader("X-Naver-Client-Secret", naverApiConfig.clientSecret)
                .build();
    }

	@Bean
	public WebClient webClient(
		WebClient.Builder builder,
		@Value("${fastapi.baseUrl}") String baseUrl
	) {
		return builder.baseUrl(baseUrl).build();
	}
}
