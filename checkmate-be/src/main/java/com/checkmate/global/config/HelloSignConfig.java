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

    @Bean
    public ApiClient helloSignApiClient() {
        ApiClient client = com.dropbox.sign.Configuration.getDefaultApiClient();
        client.setUsername(apiKey);
        return client;
    }

    @Bean
    public SignatureRequestApi signatureRequestApi(ApiClient apiClient) {
        return new SignatureRequestApi(apiClient);
    }
}