package com.checkmate.domain.contractcategory.service;


import com.checkmate.domain.contractcategory.dto.response.CategoryResponse;
import com.checkmate.domain.contractcategory.dto.response.SubCategoryResponse;
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
@Transactional
public class ContractCategoryService {

    private final ContractCategoryRepository categoryRepository;

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

    @Transactional(readOnly = true)
    public List<SubCategoryResponse> getSubCategories(Integer parentId) {

        if (!categoryRepository.existsById(parentId)) {
            throw new CustomException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        return categoryRepository.findAllByParent_Id(parentId).stream()
                .map(category -> SubCategoryResponse.builder()
                        .categoryId(category.getId())
                        .parentId(category.getParent().getId())
                        .name(category.getName())
                        .level(category.getLevel())
                        .build())
                .collect(Collectors.toList());

    }
}
