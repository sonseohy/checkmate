package com.checkmate.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.dropbox.sign.ApiClient;
import com.dropbox.sign.api.SignatureRequestApi;

@Configuration
public class HelloSignConfig {
    @Value("${hs.api.key}")
    private String apiKey;

    /**
     * HelloSign API 클라이언트 생성
     * API 키를 사용하여 인증된 HelloSign API 클라이언트 생성
     *
     * @return 설정된 ApiClient 인스턴스
     */
    @Bean
    public ApiClient helloSignApiClient() {
        ApiClient client = com.dropbox.sign.Configuration.getDefaultApiClient();
        client.setUsername(apiKey);
        return client;
    }

    /**
     * 서명 요청 API 인스턴스 생성
     * 서명 요청 관련 API 호출을 위한 인스턴스 생성
     *
     * @param apiClient HelloSign API 클라이언트
     * @return 설정된 SignatureRequestApi 인스턴스
     */
    @Bean
    public SignatureRequestApi signatureRequestApi(ApiClient apiClient) {
        return new SignatureRequestApi(apiClient);
    }
}