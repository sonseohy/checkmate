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

    /**
     * 계약서 생성 파일 저장
     * 사용자가 작성 완료한 계약서 파일을 서버에 저장
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @param contractId 계약서 ID
     * @param file 저장할 PDF 파일
     * @param fileName 파일명 (선택사항)
     * @return 파일 저장 결과 정보
     */
    @Operation(
            summary = "계약서 생성 파일 저장",
            description = "사용자 입력으로 생성된 계약서 파일을 서버에 저장합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "파일 저장 성공",
                    content = @Content(schema = @Schema(implementation = ContractGeneratedFileResponseDto.class))
            )
    })
    @PostMapping(value = "/{contractId}/generate-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResult<ContractGeneratedFileResponseDto> saveGeneratedFile(
            @Parameter(description = "현재 로그인한 사용자 정보", required = true)
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