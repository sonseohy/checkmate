package com.checkmate.domain.contractfieldvalue.controller;

import com.checkmate.domain.contractfieldvalue.dto.request.ContractFieldValueRequestDto;
import com.checkmate.domain.contractfieldvalue.dto.response.ContractFieldValueResponseDto;
import com.checkmate.domain.contractfieldvalue.service.ContractFieldValueService;
import com.checkmate.global.common.response.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
@Tag(name = "Contract Field Value API", description = "계약서 필드값 저장 및 법조항 렌더링 API")
public class ContractFieldValueController {
    private final ContractFieldValueService contractFieldValueService;

    @Operation(summary = "필드값 저장 및 법조항 렌더링",
            description = "계약서 섹션의 필드값을 저장하고, 첫 저장 시 법조항을 렌더링하여 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "필드값 저장 성공",
                    content = @Content(schema = @Schema(implementation = ContractFieldValueResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content),
            @ApiResponse(responseCode = "404", description = "계약서 또는 섹션 없음", content = @Content)
    })
    @PostMapping("/{contractId}/inputs")
    public ApiResult<ContractFieldValueResponseDto> saveFieldValues(
            @Parameter(description = "계약서 ID", required = true)
            @PathVariable Integer contractId,

            @Parameter(description = "필드값 저장 요청", required = true)
            @Valid @RequestBody ContractFieldValueRequestDto request) {

        ContractFieldValueResponseDto response = contractFieldValueService.saveFieldValues(contractId, request);
        return ApiResult.ok(response);
    }
}