package com.checkmate.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

	@Bean(name = "fastApiWebClient")
	public WebClient fastApiWebClient(
		WebClient.Builder builder,
		@Value("${fastapi.baseUrl}") String baseUrl
	) {
		return builder.baseUrl(baseUrl).build();
	}

	@Bean(name = "openaiWebClient")
	public WebClient openAIWebClient(
		WebClient.Builder builder,
		@Value("${openai.api.url}") String openaiApiUrl,
		@Value("${openai.api.key}") String openaiApiKey
	) {
		return builder.baseUrl(openaiApiUrl)
			.defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
			.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
			.build();
	}
}
