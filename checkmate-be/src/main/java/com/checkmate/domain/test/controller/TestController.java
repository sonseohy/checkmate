package com.checkmate.domain.test.controller;

import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Swagger Test", description = "Swagger Test API 엔드포인트")
public class TestController {

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
}