package com.checkmate.domain.template.controller;

import com.checkmate.domain.template.dto.request.CreateEmptyContractRequest;
import com.checkmate.domain.template.dto.response.TemplateResponseDto;
import com.checkmate.domain.template.service.TemplateService;
import com.checkmate.global.common.response.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
@Tag(name = "Template", description = "템플릿 조회 및 계약서 생성 API")
public class TemplateController {
    private final TemplateService templateService;

    @Operation(summary = "빈 계약서 생성", description = "카테고리 ID와 사용자 ID를 기반으로 빈 계약서를 생성하고 템플릿 정보를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "계약서 생성 성공",
                    content = @Content(schema = @Schema(implementation = TemplateResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "카테고리를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping("/{categoryId}/create-contract")
    public ResponseEntity<ApiResult<TemplateResponseDto>> createEmptyContract(
            @PathVariable Integer categoryId,
            @RequestBody CreateEmptyContractRequest request) {
        TemplateResponseDto response = templateService.createEmptyContractByCategory(categoryId, request.getUserId());
        return ResponseEntity.ok(ApiResult.ok(response));
    }
}