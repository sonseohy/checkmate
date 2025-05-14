package com.checkmate.domain.dropboxsign.controller;

import com.checkmate.domain.dropboxsign.service.HelloSignCallbackService;
import com.checkmate.global.common.response.ApiResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/hellosign")
public class HelloSignWebhookController {

    private final HelloSignCallbackService callbackService;

    @PostMapping(value = "/callback", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResult<?> callback(
            @RequestParam("json") String payloadJson,
            @RequestHeader(value = "X-HelloSign-Signature", required = false)
            String signatureHeader
    ) throws Exception {
        callbackService.handleCallback(payloadJson, signatureHeader);
        return ApiResult.ok(null);
    }
}
