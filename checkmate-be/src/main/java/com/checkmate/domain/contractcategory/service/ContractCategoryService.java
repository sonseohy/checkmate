package com.checkmate.domain.contractcategory.service;


import com.checkmate.domain.contractcategory.dto.response.CategoryResponse;
import com.checkmate.domain.contractcategory.dto.response.SubCategoryResponse;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.contractcategory.repository.ContractCategoryRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContractCategoryService {

    private final ContractCategoryRepository categoryRepository;

    /**
     * 상위 카테고리 목록 조회
     * 부모 카테고리가 없는 최상위 카테고리 목록을 조회
     *
     * @return 상위 카테고리 응답 목록
     */
    @Transactional(readOnly = true)
    public List<CategoryResponse> getMajorCategories() {

        return categoryRepository.findAllByParentIsNull().stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getId())
                        .name(category.getName())
                        .level(category.getLevel())
                        .build())
                .collect(Collectors.toList());

    }

    /**
     * 하위 카테고리 목록 조회
     * 특정 부모 카테고리 하위의 카테고리 목록을 조회
     *
     * @param parentId 부모 카테고리 ID
     * @return 하위 카테고리 응답 목록
     */
    @Transactional(readOnly = true)
    public List<SubCategoryResponse> getSubCategories(Integer parentId) {

        if (!categoryRepository.existsById(parentId)) {
            throw new CustomException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        return categoryRepository.findAllByParent_IdOrderByNameAsc(parentId).stream()
                .map(category -> SubCategoryResponse.builder()
                        .categoryId(category.getId())
                        .parentId(category.getParent().getId())
                        .name(category.getName())
                        .level(category.getLevel())
                        .build())
                .collect(Collectors.toList());

    }

    /**
     * 카테고리 ID로 카테고리 조회
     * 지정된 ID의 카테고리를 조회
     *
     * @param categoryId 카테고리 ID
     * @return 카테고리 엔티티
     */
    @Transactional(readOnly = true)
    public ContractCategory findContractCategoryById(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));
    }

}
