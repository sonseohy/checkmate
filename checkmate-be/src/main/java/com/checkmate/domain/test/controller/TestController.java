package com.checkmate.domain.test.controller;

import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/test")
@Tag(name = "Swagger Test", description = "Swagger Test API 엔드포인트")
public class TestController {

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 단순한 문자열 응답 (200 OK, 자동 래핑)
     */
    @GetMapping("/hello")
    public String hello() {
        return "Hello, CheckMate!";
    }

    /**
     * Map 형태의 데이터 응답 (200 OK, 자동 래핑)
     */
    @GetMapping("/data")
    public Map<String, String> data() {
        return Map.of(
                "message", "This is a test",
                "timestamp", String.valueOf(System.currentTimeMillis())
        );
    }

    /**
     * 의도적으로 예외를 던져 실패 응답을 테스트
     */
    @GetMapping("/error")
    public void error() {
        throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    /**
     * Redis 연결 테스트
     */
    @GetMapping("/redis-connection")
    public String testRedisConnection() {
        try {
            // 연결 테스트
            Boolean result = redisTemplate.getConnectionFactory().getConnection().ping() != null;
            log.info("Redis connection test result: {}", result);
            return "Redis Connection Test: " + (result ? "Success" : "Failed");
        } catch (Exception e) {
            log.error("Redis connection test failed", e);
            return "Redis Connection Failed: " + e.getMessage();
        }
    }
}