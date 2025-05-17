package com.checkmate.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import com.checkmate.domain.aianalysisreport.dto.request.AiContractAnalysisRequestDto;
import com.checkmate.domain.question.dto.request.QuestionGenerationRequestDtp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class WebClientConfig {

	private final WebClient.Builder webClient;

	@Value("${fastapi.baseUrl}")
	private String analysisApiUrl;

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

	public Mono<Void> analyzeContract(int contractId, int categoryId) {
		AiContractAnalysisRequestDto request = AiContractAnalysisRequestDto.builder()
			.contractId(contractId)
			.contractCategoryId(categoryId)
			.build();

		return webClient.build()
			.post()
			.uri(analysisApiUrl + "/ocr")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(request)
			.retrieve()
			.bodyToMono(Void.class)
			.doOnSuccess(v -> log.info("계약서 분석 요청 성공: contractId={}", contractId))
			.doOnError(e -> log.error("계약서 분석 요청 실패: contractId={}, error={}", contractId, e.getMessage()));
	}

	// WebClientConfig.java에 메서드 추가
	public Mono<Void> generateQuestions(int contractId, int categoryId) {
		QuestionGenerationRequestDtp request = QuestionGenerationRequestDtp.builder()
			.contractId(contractId)
			.contractCategoryId(categoryId)
			.build();

		return webClient.build()
			.post()
			.uri(analysisApiUrl + "/questions/generate")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(request)
			.retrieve()
			.bodyToMono(Void.class)
			.doOnSuccess(v -> log.info("계약서 질문 생성 요청 성공: contractId={}", contractId))
			.doOnError(e -> log.error("계약서 질문 생성 요청 실패: contractId={}, error={}",
				contractId, e.getMessage()));
	}
}
