package com.checkmate.domain.contractcategory.controller;

import com.checkmate.domain.contractcategory.dto.response.CategoryResponse;
import com.checkmate.domain.contractcategory.dto.response.SubCategoryResponse;
import com.checkmate.domain.contractcategory.service.ContractCategoryService;
import com.checkmate.global.common.response.ApiResponse;
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
public class ContractCategoryController {

    private final ContractCategoryService contractCategoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getMajorCategories() {

        List<CategoryResponse> categoryResponses = contractCategoryService.getMajorCategories();

        return ApiResponse.ok(categoryResponses);

    }

    @GetMapping("{parentId}/subcategories")
    public ApiResponse<List<SubCategoryResponse>> getSubCategories(@PathVariable @Min(1) Integer parentId) {

        List<SubCategoryResponse> subCategoryResponses = contractCategoryService.getSubCategories(parentId);

        return ApiResponse.ok(subCategoryResponses);

    }

}
