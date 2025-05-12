package com.checkmate.domain.templatefieldcategory.dto.response;

import com.checkmate.domain.contractcategory.entity.Level;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class FieldKeysByCategoryResponseDto {

    private Integer categoryId;
    private String categoryName;
    private Level categoryLevel;
    private List<String> fieldKeys;

    public FieldKeysByCategoryResponseDto(
            Integer categoryId, String categoryName, Level categoryLevel, List<String> fieldKeys) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryLevel = categoryLevel;
        this.fieldKeys = fieldKeys;
    }
}