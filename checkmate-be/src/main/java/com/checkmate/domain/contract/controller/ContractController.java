package com.checkmate.domain.contract.controller;

import com.checkmate.domain.contract.dto.request.ContractUploadsRequest;
import com.checkmate.domain.contract.dto.response.ContractUploadResponse;
import com.checkmate.domain.contract.dto.response.MyContractResponse;
import com.checkmate.domain.contract.service.ContractService;
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

import java.util.List;

@RestController
@RequestMapping("/api/contract")
@RequiredArgsConstructor
@Tag(name = "Contract API", description = "계약서 API")
public class ContractController {

    private final ContractService contractService;

    @Operation(
            summary     = "계약서 업로드",
            description = "계약서 파일(pdf, hwp, jpg, png)을 업로드하고 총 페이지 수를 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description  = "업로드 성공 / 반환: 총 페이지 수"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description  = "잘못된 요청 (파일 없음, 크기 초과 등)"
            ),
            @ApiResponse(
                    responseCode = "415",
                    description  = "지원하지 않는 파일 형식"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description  = "서버 내부 오류"
            )
    })
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(
                    mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                    schema    = @Schema(implementation = ContractUploadsRequest.class)
            )
    )
    public ApiResult<ContractUploadResponse> uploadContract(
            @Parameter(description = "유저 ID", required = true) @AuthenticationPrincipal CustomUserDetails userDetails,
            @ModelAttribute ContractUploadsRequest request) {

        ContractUploadResponse response = contractService.uploadContract(userDetails.getUserId(), request);

        return ApiResult.created(response);

    }

    @Operation(summary = "내 계약서 조회", description = "내 계약서들을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내 계약서 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping
    public ApiResult<List<MyContractResponse>> getMyContracts(
            @Parameter(description = "유저 ID", required = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<MyContractResponse> respone = contractService.getMyContracts(userDetails.getUserId());

        return ApiResult.ok(respone);
    }

    @Operation(summary = "내 계약서 삭제", description = "계약서를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "계약서 삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @DeleteMapping("/{contractId}")
    public ApiResult<?> deleteMyContract(
            @Parameter(description = "유저 ID", required = true) @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "계약 ID", required = true) @PathVariable Integer contractId) {
        contractService.deleteMyContract(userDetails.getUserId(), contractId);
        return ApiResult.noContent();
    }



}
