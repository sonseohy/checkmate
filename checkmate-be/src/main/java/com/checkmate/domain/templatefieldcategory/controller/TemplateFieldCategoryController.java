package com.checkmate.domain.templatefieldcategory.controller;

import com.checkmate.domain.templatefieldcategory.dto.request.BatchTemplateFieldCategoryMappingRequestDto;
import com.checkmate.domain.templatefieldcategory.dto.request.TemplateFieldCategoryMappingRequestDto;
import com.checkmate.domain.templatefieldcategory.dto.response.FieldKeysByCategoryResponseDto;
import com.checkmate.domain.templatefieldcategory.dto.response.TemplateFieldCategoryMappingResponseDto;
import com.checkmate.domain.templatefieldcategory.service.TemplateFieldCategoryService;
import com.checkmate.global.common.response.ApiResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/field-category")
@RequiredArgsConstructor
@Tag(name = "Template Field Category API", description = "템플릿 필드-카테고리 매핑 API")
public class TemplateFieldCategoryController {

    private final TemplateFieldCategoryService templateFieldCategoryService;

    /**
     * 필드와 카테고리 매핑 생성
     * 템플릿 필드와 카테고리 간의 매핑을 생성하거나 업데이트
     *
     * @param requestDto 필드-카테고리 매핑 요청 정보
     * @return 생성된 매핑 정보
     */
    @Operation(summary = "필드와 카테고리 매핑 생성", description = "필드와 카테고리 매핑을 생성합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "필드와 카테고리 매핑 생성 성공")
    })
    @PostMapping("/mapping")
    public ResponseEntity<ApiResult<TemplateFieldCategoryMappingResponseDto>> createMapping(
            @Valid @RequestBody TemplateFieldCategoryMappingRequestDto requestDto) {

        TemplateFieldCategoryMappingResponseDto responseDto =
                templateFieldCategoryService.createMapping(requestDto);

        ApiResult<TemplateFieldCategoryMappingResponseDto> result = responseDto.getId() == null ?
                ApiResult.created(responseDto) : ApiResult.ok(responseDto);

        return ResponseEntity.status(result.status()).body(result);
    }

    /**
     * 필드와 여러 카테고리 일괄 매핑
     * 하나의 템플릿 필드를 여러 카테고리에 동시에 매핑
     *
     * @param requestDto 일괄 매핑 요청 정보
     * @return 생성된 매핑 정보 목록
     */
    @Operation(summary = "필드와 여러 카테고리 일괄 매핑", description = "필드와 여러 카테고리를 일괄 매핑합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "필드와 여러 카테고리 일괄 매핑 성공")
    })
    @PostMapping("/batch-mapping")
    public ResponseEntity<ApiResult<List<TemplateFieldCategoryMappingResponseDto>>> createBatchMapping(
            @Valid @RequestBody BatchTemplateFieldCategoryMappingRequestDto requestDto) {

        List<TemplateFieldCategoryMappingResponseDto> responseDtos =
                templateFieldCategoryService.createBatchMapping(requestDto);

        ApiResult<List<TemplateFieldCategoryMappingResponseDto>> result = ApiResult.created(responseDtos);
        return ResponseEntity.status(result.status()).body(result);
    }

    /**
     * 필드 ID로 카테고리 매핑 목록 조회
     * 특정 필드에 매핑된 모든 카테고리 정보를 조회
     *
     * @param fieldId 필드 ID
     * @return 필드에 매핑된 카테고리 목록
     */
    @Operation(summary = "필드 ID로 카테고리 매핑 목록 조회", description = "필드 ID로 카테고리 매핑 목록을 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "필드 ID로 카테고리 매핑 목록 조회 성공")
    })
    @GetMapping("/field/{fieldId}")
    public ResponseEntity<ApiResult<List<TemplateFieldCategoryMappingResponseDto>>> getMappingsByFieldId(
            @Parameter(description = "필드 Id", required = true) @PathVariable Integer fieldId) {

        List<TemplateFieldCategoryMappingResponseDto> responseDtos =
                templateFieldCategoryService.getMappingsByFieldId(fieldId);

        return ResponseEntity.ok(ApiResult.ok(responseDtos));
    }

    /**
     * 카테고리 ID로 필드 매핑 목록 조회
     * 특정 카테고리에 매핑된 모든 필드 정보를 조회
     *
     * @param categoryId 카테고리 ID
     * @return 카테고리에 매핑된 필드 목록
     */
    @Operation(summary = "카테고리 ID로 필드 매핑 목록 조회", description = "카테고리 ID로 필드 매핑 목록을 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "카테고리 ID로 필드 매핑 목록 조회 성공")
    })
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResult<List<TemplateFieldCategoryMappingResponseDto>>> getMappingsByCategoryId(
            @Parameter(description = "카테고리 Id", required = true) @PathVariable Integer categoryId) {

        List<TemplateFieldCategoryMappingResponseDto> responseDtos =
                templateFieldCategoryService.getMappingsByCategoryId(categoryId);

        return ResponseEntity.ok(ApiResult.ok(responseDtos));
    }

    /**
     * 카테고리 ID로 필드 키 목록 조회
     * 특정 카테고리에 매핑된 모든 필드의 키 목록 조회
     *
     * @param categoryId 카테고리 ID
     * @return 카테고리에 매핑된 필드 키 목록
     */
    @Operation(summary = "카테고리 ID로 필드 키 목록 조회", description = "카테고리 ID로 필드 키 목록을 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "카테고리 ID로 필드 키 목록 조회 성공")
    })
    @GetMapping("/field-keys/category-id/{categoryId}")
    public ResponseEntity<ApiResult<FieldKeysByCategoryResponseDto>> getFieldKeysByCategoryId(
            @Parameter(description = "카테고리 Id", required = true) @PathVariable Integer categoryId) {

        FieldKeysByCategoryResponseDto responseDto =
                templateFieldCategoryService.getFieldKeysByCategoryId(categoryId);

        return ResponseEntity.ok(ApiResult.ok(responseDto));
    }

    /**
     * 필드와 카테고리 매핑 삭제
     * 특정 필드와 카테고리 간의 매핑을 삭제
     *
     * @param fieldId 필드 ID
     * @param categoryId 카테고리 ID
     * @return 삭제 결과
     */
    @Operation(summary = "필드와 카테고리 매핑 삭제", description = "필드와 카테고리 매핑을 삭제합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "필드와 카테고리 매핑 삭제 성공")
    })
    @DeleteMapping("/mapping")
    public ResponseEntity<ApiResult<Void>> deleteMapping(
            @Parameter(description = "필드 Id", required = true)
            @RequestParam Integer fieldId,
            @Parameter(description = "카테고리 Id", required = true)
            @RequestParam Integer categoryId) {

        templateFieldCategoryService.deleteMapping(fieldId, categoryId);

        return ResponseEntity.ok(ApiResult.noContent());
    }

    /**
     * 필드의 모든 카테고리 매핑 삭제
     * 특정 필드와 관련된 모든 카테고리 매핑을 삭제
     *
     * @param fieldId 필드 ID
     * @return 삭제 결과
     */
    @Operation(summary = "필드의 모든 카테고리 매핑 삭제", description = "필드의 모든 카테고리 매핑을 삭제합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "필드의 모든 카테고리 매핑 삭제 성공")
    })
    @DeleteMapping("/field/{fieldId}")
    public ResponseEntity<ApiResult<Void>> deleteMappingsByFieldId(
            @Parameter(description = "필드 Id", required = true)
            @PathVariable Integer fieldId) {

        templateFieldCategoryService.deleteMappingsByFieldId(fieldId);

        return ResponseEntity.ok(ApiResult.noContent());
    }

    /**
     * 섹션 내 필드의 카테고리 매핑 조회
     * 특정 섹션과 카테고리 조합으로 매핑된 필드 정보 조회
     *
     * @param sectionId 섹션 ID
     * @param categoryId 카테고리 ID
     * @return 해당 섹션과 카테고리에 매핑된 필드 목록
     */
    @Operation(summary = "섹션 내 필드의 카테고리 매핑 조회", description = "섹션 내 필드의 카테고리 매핑을 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "섹션 내 필드의 카테고리 매핑 조회 성공")
    })
    @GetMapping("/section/{sectionId}/category/{categoryId}")
    public ResponseEntity<ApiResult<List<TemplateFieldCategoryMappingResponseDto>>> getMappingsBySectionIdAndCategoryId(
            @Parameter(description = "섹션 Id", required = true)
            @PathVariable Integer sectionId,
            @Parameter(description = "카테고리 Id", required = true)
            @PathVariable Integer categoryId) {

        List<TemplateFieldCategoryMappingResponseDto> responseDtos =
                templateFieldCategoryService.getMappingsBySectionIdAndCategoryId(sectionId, categoryId);

        return ResponseEntity.ok(ApiResult.ok(responseDtos));
    }
}