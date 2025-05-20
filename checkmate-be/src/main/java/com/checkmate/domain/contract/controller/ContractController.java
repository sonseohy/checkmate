package com.checkmate.domain.contract.controller;

import com.checkmate.domain.contract.dto.request.ContractUploadsRequest;
import com.checkmate.domain.contract.dto.response.*;
import com.checkmate.domain.contract.dto.request.SignatureRequest;
import com.checkmate.domain.contract.service.ContractFileService;
import com.checkmate.domain.contract.service.ContractService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.global.common.response.ApiResult;
import com.checkmate.global.common.service.S3Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/contract")
@RequiredArgsConstructor
@Tag(name = "Contract API", description = "계약서 API")
public class ContractController {

    private final ContractService contractService;
    private final ContractFileService contractFileService;
    private final S3Service s3Service;

    /**
     * 계약서 업로드
     * 계약서 파일(pdf, hwp, jpg, png)을 업로드하고 총 페이지 수를 반환
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @param request 계약서 업로드 요청 정보 (파일, 카테고리 등)
     * @return 업로드된 계약서 정보 (계약서 ID, 총 페이지 수 등)
     */
    @Operation(
            summary     = "계약서 업로드",
            description = "계약서 파일(pdf, hwp, jpg, png)을 업로드하고 총 페이지 수를 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description  = "업로드 성공 / 반환: 총 페이지 수"
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
            @Parameter(description = "현재 로그인한 사용자 정보", required = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @ModelAttribute ContractUploadsRequest request) {

        ContractUploadResponse response = contractService.uploadContract(userDetails.getUserId(), request);

        return ApiResult.created(response);

    }

    /**
     * 내 계약서 목록 조회
     * 현재 로그인한 사용자의 모든 계약서 목록 조회
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @return 사용자의 계약서 목록
     */
    @Operation(summary = "내 계약서 조회", description = "내 계약서들을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내 계약서 조회 성공")
    })
    @GetMapping
    public ApiResult<List<MyContractResponse>> getMyContracts(
            @Parameter(description = "현재 로그인한 사용자 정보", required = true)
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<MyContractResponse> respone = contractService.getMyContracts(userDetails.getUserId());

        return ApiResult.ok(respone);
    }

    /**
     * 내 계약서 삭제
     * 특정 계약서를 삭제
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @param contractId 삭제할 계약서 ID
     * @return 삭제 성공 여부
     */
    @Operation(summary = "내 계약서 삭제", description = "계약서를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "계약서 삭제 성공")
    })
    @DeleteMapping("/{contractId}")
    public ApiResult<?> deleteMyContract(
            @Parameter(description = "현재 로그인한 사용자 정보", required = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "계약서 ID", required = true) @PathVariable Integer contractId) {
        contractService.deleteMyContract(userDetails.getUserId(), contractId);
        return ApiResult.noContent();
    }

    /**
     * 계약서 PDF 미리보기
     * 브라우저 내에서 계약서를 바로 열어 미리보기
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @param contractId 미리볼 계약서 ID
     * @return 계약서 PDF 파일 리소스
     */
    @Operation(summary = "내 계약서 PDF 미리보기", description = "계약서를 브라우저 내에서 바로 엽니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping("/{contractId}")
    public ResponseEntity<Resource> previewPdf(
            @Parameter(description = "현재 로그인한 사용자 정보", required = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "계약서 ID", required = true) @PathVariable int contractId) throws Exception {

        PdfMetadata meta = contractFileService.loadViewerPdfMetadata(
                userDetails.getUserId(), contractId);

        // ↓ URL → key 변환
        String key = meta.getFileUrl()
                .split("\\?")[0]
                .replaceFirst("https://[^/]+/", "");

        InputStream decrypted = s3Service.getDecryptedStream(
                key, meta.getIv(), meta.getShareA(), meta.getFileId()
        );
        InputStreamResource resource = new InputStreamResource(decrypted);

        ContentDisposition cd = ContentDisposition.inline()
                .filename(meta.getFilename(), StandardCharsets.UTF_8)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, cd.toString())
                .contentType(MediaType.parseMediaType(meta.getContentType()))
                .body(resource);
    }

    /**
     * 계약서 관련 파일 목록 조회
     * 특정 계약서와 관련된 모든 파일 목록 조회
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @param contractId 계약서 ID
     * @return 계약서 관련 파일 목록
     */
    @Operation(summary = "계약서 관련 파일 목록 조회", description = "계약서 관련 파일 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping("/{contractId}/files")
    public ApiResult<List<ContractFilesResponse>> listContractFiles(
            @Parameter(description = "현재 로그인한 사용자 정보", required = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "계약서 ID", required = true) @PathVariable int contractId ) {
        List<ContractFilesResponse> response = contractFileService.listContractFiles(userDetails.getUserId(), contractId);
        return ApiResult.ok(response);
    }

    /**
     * 작성중인 계약서 조회
     * 계약서 ID로 작성중인 계약서 템플릿 구조와 저장된 값을 함께 조회
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @param contractId 계약서 ID
     * @return 계약서 템플릿 구조와 저장된 값이 포함된 계약서 상세 정보
     */
    @Operation(summary = "작성중인 계약서 조회", description = "계약서 ID로 작성중인 계약서 템플릿 구조와 저장된 값을 함께 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "계약서 조회 성공"),
    })
    @GetMapping("/{contractId}/edit")
    public ResponseEntity<ApiResult<ContractDetailsResponseDto>> getContractDetails(
            @Parameter(description = "현재 로그인한 사용자 정보", required = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "계약서 ID", required = true) @PathVariable Integer contractId) {
        ContractDetailsResponseDto response = contractService.getContractWithTemplateAndValues(userDetails.getUserId(), contractId);
        return ResponseEntity.ok(ApiResult.ok(response));
    }

    /**
     * 계약서 전자서명
     * 계약서에 전자서명을 첨부하고 서명 요청을 처리
     *
     * @param userDetails 현재 로그인한 사용자 정보
     * @param contractId 서명할 계약서 ID
     * @param signer 서명자 정보
     * @return 서명 업로드 결과 및 서명 요청 정보
     */
    @Operation(summary = "계약서 전자서명", description = "계약서를 전자서명합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "서명 성공")
    })

    @PostMapping(value = "/{contractId}/sign")
    public ApiResult<ContractSignatureUploadResponse> uploadAndSign(
            @Parameter(description = "현재 로그인한 사용자 정보", required = true)
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "계약서 ID", required = true) @PathVariable Integer contractId,
            @RequestBody SignatureRequest signer
    ) throws Exception {
        ContractSignatureUploadResponse response =
                contractService.uploadAndRequestSignature(userDetails.getUserId(), contractId, signer);
        return ApiResult.created(response);
    }

}
