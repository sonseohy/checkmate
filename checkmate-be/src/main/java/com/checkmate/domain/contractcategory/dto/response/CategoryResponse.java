package com.checkmate.domain.contractcategory.dto.response;

import com.checkmate.domain.contractcategory.entity.Level;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CategoryResponse {

    private Integer categoryId;

    private String name;

    private Level level;

}
