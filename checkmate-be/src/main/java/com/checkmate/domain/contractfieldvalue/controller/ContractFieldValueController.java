package com.checkmate.domain.contractfieldvalue.controller;

import com.checkmate.domain.contractfieldvalue.dto.request.ContractFieldValueRequestDto;
import com.checkmate.domain.contractfieldvalue.dto.response.ContractFieldValueResponseDto;
import com.checkmate.domain.contractfieldvalue.service.ContractFieldValueService;
import com.checkmate.global.common.response.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contract")
@RequiredArgsConstructor
@Tag(name = "Contract Field Value API", description = "계약서 필드값 저장 및 법조항 렌더링 API")
public class ContractFieldValueController {
    private final ContractFieldValueService contractFieldValueService;

    /**
     * 필드값 저장 및 법조항 렌더링
     * 여러 섹션의 필드값을 한 번에 저장하고, 저장된 값을 기반으로 법조항을 렌더링하여 반환
     *
     * @param contractId 계약서 ID
     * @param request 필드값 저장 요청 (섹션별 필드값 목록)
     * @return 렌더링된 법조항 목록
     */
    @Operation(summary = "필드값 저장 및 법조항 렌더링",
            description = "여러 섹션의 필드값을 한 번에 저장하고, 법조항을 렌더링하여 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "필드값 저장 성공")
    })
    @PostMapping("/{contractId}/inputs")
    public ApiResult<List<ContractFieldValueResponseDto>> saveFieldValues(
            @Parameter(description = "계약서 ID", required = true)
            @PathVariable Integer contractId,

            @Parameter(description = "필드값 저장 요청", required = true)
            @Valid @RequestBody ContractFieldValueRequestDto request) {

        List<ContractFieldValueResponseDto> responses = contractFieldValueService.saveFieldValues(contractId, request);
        return ApiResult.ok(responses);
    }

    /**
     * 계약서 필드값 초기화
     * 계약서의 모든 필드값을 초기화(삭제)
     *
     * @param contractId 계약서 ID
     * @return 초기화 결과 정보 (삭제된 필드값 개수 등)
     */
    @Operation(summary = "계약서 필드값 초기화",
            description = "계약서의 모든 필드값을 초기화(삭제)합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "필드값 초기화 성공")
    })
    @DeleteMapping("/{contractId}/inputs")
    public ApiResult<Map<String, Object>> resetFieldValues(
            @Parameter(description = "계약서 ID", required = true)
            @PathVariable Integer contractId) {

        int deletedCount = contractFieldValueService.deleteAllFieldValues(contractId);

        Map<String, Object> response = new HashMap<>();
        response.put("contractId", contractId);
        response.put("deletedCount", deletedCount);
        response.put("message", "계약서 필드값이 성공적으로 초기화되었습니다.");

        return ApiResult.ok(response);
    }
}