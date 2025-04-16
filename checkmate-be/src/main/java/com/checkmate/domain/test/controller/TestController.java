package com.checkmate.domain.test.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Swagger Test", description = "Swagger Test API 엔드포인트")
@RestController
public class TestController {

    @GetMapping("/test")
    @Operation(summary = "스웨거 테스트", description = "테스트용")
    public String Test(){
        return "Test 성공";
    }
}
