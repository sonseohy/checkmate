package com.checkmate.domain.template.controller;

import com.checkmate.domain.template.dto.response.TemplateResponseDto;
import com.checkmate.domain.template.service.TemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
@Tag(name = "Template", description = "템플릿 조회 API")
public class TemplateController {
    private final TemplateService templateService;

    @Operation(summary = "템플릿 조회", description = "템플릿 ID를 기반으로 템플릿 구조를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "템플릿 조회 성공",
                    content = @Content(schema = @Schema(implementation = TemplateResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "템플릿을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/{templateId}")
    public ResponseEntity<TemplateResponseDto> getTemplate(@PathVariable Integer templateId) {
        TemplateResponseDto response = templateService.getTemplate(templateId);
        return ResponseEntity.ok(response);
    }
}
