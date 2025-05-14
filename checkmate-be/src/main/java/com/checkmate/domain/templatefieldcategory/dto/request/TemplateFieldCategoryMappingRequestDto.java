package com.checkmate.domain.templatefieldcategory.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TemplateFieldCategoryMappingRequestDto {

    @NotNull(message = "필드 ID는 필수입니다.")
    private Integer fieldId;

    @NotNull(message = "카테고리 ID는 필수입니다.")
    private Integer categoryId;

    private Boolean isRequired = false;

    private String labelOverride;
}