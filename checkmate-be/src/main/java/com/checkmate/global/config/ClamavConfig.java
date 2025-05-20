package com.checkmate.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import xyz.capybara.clamav.ClamavClient;

@Configuration
public class ClamavConfig {

    @Value("${clamav.host}")
    private String host;

    @Value("${clamav.port}")
    private int port;

    /**
     * ClamAV 클라이언트 생성
     * 설정된 호스트와 포트로 ClamAV 서버에 연결하는 클라이언트 생성
     *
     * @return 설정된 ClamavClient 인스턴스
     */
    @Bean
    public ClamavClient clamAvClient() {
        return new ClamavClient(host, port);
    }

}
