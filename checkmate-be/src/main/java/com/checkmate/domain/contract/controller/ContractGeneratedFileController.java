package com.checkmate.domain.contract.controller;

import com.checkmate.domain.contract.dto.response.ContractGeneratedFileResponseDto;
import com.checkmate.domain.contract.service.ContractGeneratedFileService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.global.common.response.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/contract")
@RequiredArgsConstructor
@Tag(name = "Contract Generated File API", description = "계약서 생성 파일 관리 API")
public class ContractGeneratedFileController {

    private final ContractGeneratedFileService contractGeneratedFileService;

    @Operation(
            summary = "계약서 생성 파일 저장",
            description = "사용자 입력으로 생성된 계약서 파일을 서버에 저장합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "파일 저장 성공",
                    content = @Content(schema = @Schema(implementation = ContractGeneratedFileResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청 (파일 없음, 지원하지 않는 파일 형식 등)",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증 실패",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "계약서를 찾을 수 없음",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "413",
                    description = "파일 크기 초과",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "서버 내부 오류",
                    content = @Content
            )
    })
    @PostMapping(value = "/{contractId}/generate-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResult<ContractGeneratedFileResponseDto> saveGeneratedFile(
            @Parameter(description = "유저 ID", required = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,

            @Parameter(description = "계약서 ID", required = true)
            @PathVariable Integer contractId,

            @Parameter(description = "PDF 파일", required = true)
            @RequestParam("file") MultipartFile file,

            @Parameter(description = "파일명 (선택사항)")
            @RequestParam(value = "fileName", required = false) String fileName) {

        ContractGeneratedFileResponseDto response = contractGeneratedFileService.saveGeneratedFile(
                userDetails.getUserId(),
                contractId,
                file,
                fileName
        );

        return ApiResult.created(response);
    }
}