package com.checkmate.domain.templatefieldcategory.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class BatchTemplateFieldCategoryMappingRequestDto {

    @NotNull(message = "필드 ID는 필수입니다.")
    private Integer fieldId;

    @NotEmpty(message = "적어도 하나의 카테고리 ID가 필요합니다.")
    private List<Integer> categoryIds;

    private Boolean isRequired = false;

    private String labelOverride;
}