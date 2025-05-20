package com.checkmate.global.config;

import java.util.concurrent.ThreadPoolExecutor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableAsync
public class AsyncConfig implements WebMvcConfigurer {

    /**
     * ClamAV 바이러스 검사용 스레드 풀 설정
     * 파일 업로드 시 멀웨어 검사를 위한 전용 스레드 풀
     *
     * @return 설정된 ThreadPoolTaskExecutor
     */
    @Bean(name = "clamavExecutor")
    public ThreadPoolTaskExecutor clamavExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("clamav-");
        executor.setKeepAliveSeconds(120);
        executor.initialize();
        return executor;
    }

    /**
     * 비동기 MVC 요청 처리 설정
     * 비동기 컨트롤러의 타임아웃 및 스레드 풀 설정
     *
     * @param configurer 비동기 지원 설정기
     */
    @Override
    public void configureAsyncSupport(AsyncSupportConfigurer configurer) {
        configurer.setTaskExecutor(mvcTaskExecutor());
        configurer.setDefaultTimeout(120000); // 120초
    }

    /**
     * 분석 작업용 비동기 스레드 풀 설정
     * AI 분석이나 문서 처리 같은 시간이 오래 걸리는 작업을 위한 스레드 풀
     *
     * @return 설정된 AsyncTaskExecutor
     */
    @Bean(name = "analysisTaskExecutor")
    public AsyncTaskExecutor mvcTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("mvc-async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setKeepAliveSeconds(300);
        executor.initialize();
        return executor;
    }

    /**
     * WebClient 빌더 설정
     * 비동기 HTTP 요청을 위한 WebClient 빌더 제공
     *
     * @return WebClient.Builder 인스턴스
     */
    @Bean
    public WebClient.Builder webClient() {
        return WebClient.builder();
    }
}
