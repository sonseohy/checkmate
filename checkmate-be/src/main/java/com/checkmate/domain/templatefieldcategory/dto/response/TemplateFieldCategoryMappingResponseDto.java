package com.checkmate.domain.templatefieldcategory.dto.response;

import com.checkmate.domain.templatefieldcategory.entity.TemplateFieldCategory;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TemplateFieldCategoryMappingResponseDto {

    private Integer id;
    private Integer fieldId;
    private String fieldKey;
    private String fieldLabel;
    private Integer categoryId;
    private String categoryName;
    private String categoryLevel;
    private Boolean isRequired;
    private String labelOverride;

    // 엔티티에서 DTO 생성
    public static TemplateFieldCategoryMappingResponseDto from(TemplateFieldCategory entity) {
        TemplateFieldCategoryMappingResponseDto dto = new TemplateFieldCategoryMappingResponseDto();
        dto.setId(entity.getId());
        dto.setFieldId(entity.getTemplateField().getId());
        dto.setFieldKey(entity.getTemplateField().getFieldKey());
        dto.setFieldLabel(entity.getTemplateField().getLabel());
        dto.setCategoryId(entity.getContractCategory().getId());
        dto.setCategoryName(entity.getContractCategory().getName());
        dto.setCategoryLevel(entity.getContractCategory().getLevel().name());
        dto.setIsRequired(entity.getIsRequired());
        dto.setLabelOverride(entity.getLabelOverride());
        return dto;
    }
}