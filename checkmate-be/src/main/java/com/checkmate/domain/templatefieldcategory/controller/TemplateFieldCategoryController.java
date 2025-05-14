package com.checkmate.domain.templatefieldcategory.controller;

import com.checkmate.domain.templatefieldcategory.dto.request.BatchTemplateFieldCategoryMappingRequestDto;
import com.checkmate.domain.templatefieldcategory.dto.request.TemplateFieldCategoryMappingRequestDto;
import com.checkmate.domain.templatefieldcategory.dto.response.FieldKeysByCategoryResponseDto;
import com.checkmate.domain.templatefieldcategory.dto.response.TemplateFieldCategoryMappingResponseDto;
import com.checkmate.domain.templatefieldcategory.service.TemplateFieldCategoryService;
import com.checkmate.global.common.response.ApiResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/field-category")
@RequiredArgsConstructor
public class TemplateFieldCategoryController {

    private final TemplateFieldCategoryService templateFieldCategoryService;

    /**
     * 필드와 카테고리 매핑 생성
     */
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
     */
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
     */
    @GetMapping("/field/{fieldId}")
    public ResponseEntity<ApiResult<List<TemplateFieldCategoryMappingResponseDto>>> getMappingsByFieldId(
            @PathVariable Integer fieldId) {

        List<TemplateFieldCategoryMappingResponseDto> responseDtos =
                templateFieldCategoryService.getMappingsByFieldId(fieldId);

        return ResponseEntity.ok(ApiResult.ok(responseDtos));
    }

    /**
     * 카테고리 ID로 필드 매핑 목록 조회
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResult<List<TemplateFieldCategoryMappingResponseDto>>> getMappingsByCategoryId(
            @PathVariable Integer categoryId) {

        List<TemplateFieldCategoryMappingResponseDto> responseDtos =
                templateFieldCategoryService.getMappingsByCategoryId(categoryId);

        return ResponseEntity.ok(ApiResult.ok(responseDtos));
    }

    /**
     * 카테고리 ID로 필드 키 목록 조회
     */
    @GetMapping("/field-keys/category-id/{categoryId}")
    public ResponseEntity<ApiResult<FieldKeysByCategoryResponseDto>> getFieldKeysByCategoryId(
            @PathVariable Integer categoryId) {

        FieldKeysByCategoryResponseDto responseDto =
                templateFieldCategoryService.getFieldKeysByCategoryId(categoryId);

        return ResponseEntity.ok(ApiResult.ok(responseDto));
    }

    /**
     * 필드와 카테고리 매핑 삭제
     */
    @DeleteMapping("/mapping")
    public ResponseEntity<ApiResult<Void>> deleteMapping(
            @RequestParam Integer fieldId, @RequestParam Integer categoryId) {

        templateFieldCategoryService.deleteMapping(fieldId, categoryId);

        return ResponseEntity.ok(ApiResult.noContent());
    }

    /**
     * 필드의 모든 카테고리 매핑 삭제
     */
    @DeleteMapping("/field/{fieldId}")
    public ResponseEntity<ApiResult<Void>> deleteMappingsByFieldId(
            @PathVariable Integer fieldId) {

        templateFieldCategoryService.deleteMappingsByFieldId(fieldId);

        return ResponseEntity.ok(ApiResult.noContent());
    }

    /**
     * 섹션 내 필드의 카테고리 매핑 조회
     */
    @GetMapping("/section/{sectionId}/category/{categoryId}")
    public ResponseEntity<ApiResult<List<TemplateFieldCategoryMappingResponseDto>>> getMappingsBySectionIdAndCategoryId(
            @PathVariable Integer sectionId, @PathVariable Integer categoryId) {

        List<TemplateFieldCategoryMappingResponseDto> responseDtos =
                templateFieldCategoryService.getMappingsBySectionIdAndCategoryId(sectionId, categoryId);

        return ResponseEntity.ok(ApiResult.ok(responseDtos));
    }
}