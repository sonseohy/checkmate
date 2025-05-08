package com.checkmate.domain.contractfieldvalue.controller;

import com.checkmate.domain.contractfieldvalue.dto.request.ContractFieldValueRequestDto;
import com.checkmate.domain.contractfieldvalue.dto.response.ContractFieldValueResponseDto;
import com.checkmate.domain.contractfieldvalue.service.ContractFieldValueService;
import com.checkmate.global.common.response.ApiResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractFieldValueController {
    private final ContractFieldValueService contractFieldValueService;

    @PostMapping("/{contractId}/inputs")
    public ApiResult<ContractFieldValueResponseDto> saveFieldValues(
            @PathVariable Integer contractId,
            @Valid @RequestBody ContractFieldValueRequestDto request) {

        ContractFieldValueResponseDto response = contractFieldValueService.saveFieldValues(contractId, request);
        return ApiResult.ok(response);
    }
}