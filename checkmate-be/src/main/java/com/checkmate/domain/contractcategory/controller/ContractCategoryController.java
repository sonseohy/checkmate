package com.checkmate.domain.contractcategory.controller;

import com.checkmate.domain.contractcategory.dto.response.CategoryResponse;
import com.checkmate.domain.contractcategory.dto.response.SubCategoryResponse;
import com.checkmate.domain.contractcategory.service.ContractCategoryService;
import com.checkmate.global.common.response.ApiResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Contract Category API", description = "계약서 카테고리 API")
public class ContractCategoryController {

    private final ContractCategoryService contractCategoryService;

    /**
     * 상위 카테고리 목록 조회
     * 부모 카테고리가 없는 최상위 카테고리 목록을 조회
     *
     * @return 상위 카테고리 목록
     */
    @Operation(summary = "계약서 카테고리 조회", description = "계약서 카테고리를 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계약서 카테고리 조회 조회 성공"),
    })
    @GetMapping
    public ApiResult<List<CategoryResponse>> getMajorCategories() {

        List<CategoryResponse> categoryResponses = contractCategoryService.getMajorCategories();

        return ApiResult.ok(categoryResponses);

    }

    /**
     * 하위 카테고리 목록 조회
     * 특정 부모 카테고리 하위의 카테고리 목록을 조회
     *
     * @param parentId 부모 카테고리 ID
     * @return 하위 카테고리 목록
     */
    @Operation(summary = "계약서 하위 카테고리 조회", description = "계약서 하위 카테고리를 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계약서 하위 카테고리 조회 성공"),
    })
    @GetMapping("{parentId}/subcategories")
    public ApiResult<List<SubCategoryResponse>> getSubCategories(@PathVariable @Min(1) Integer parentId) {

        List<SubCategoryResponse> subCategoryResponses = contractCategoryService.getSubCategories(parentId);

        return ApiResult.ok(subCategoryResponses);

    }

}
