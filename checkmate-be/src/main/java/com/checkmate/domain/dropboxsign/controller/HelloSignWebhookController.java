package com.checkmate.domain.dropboxsign.controller;

import com.checkmate.domain.dropboxsign.service.HelloSignCallbackService;
import com.checkmate.global.common.response.ApiResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/hellosign")
@Tag(name = "Electronic Signature API", description = "전자 서명 API")
public class HelloSignWebhookController {

    private final HelloSignCallbackService callbackService;

    /**
     * HelloSign 웹훅 콜백 처리
     * 전자서명 완료 등의 이벤트 발생 시 HelloSign에서 호출하는 엔드포인트
     *
     * @param payloadJson JSON 형태의 이벤트 데이터
     * @param signatureHeader HelloSign에서 제공하는 HMAC 서명 (보안 검증용)
     * @return 처리 결과
     */
    @Operation(summary = "HelloSign 웹훅 콜백 처리", description = "HelloSign 웹훅 콜백 처리를 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "HelloSign 웹훅 콜백 처리 성공"),
    })
    @PostMapping(value = "/callback", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResult<?> callback(
            @Parameter(description = "PayLoad", required = true)
            @RequestParam("json") String payloadJson,
            @Parameter(description = "HelloSign-Signature Header")
            @RequestHeader(value = "X-HelloSign-Signature", required = false)
            String signatureHeader
    ) throws Exception {
        callbackService.handleCallback(payloadJson, signatureHeader);
        return ApiResult.ok(null);
    }
}
