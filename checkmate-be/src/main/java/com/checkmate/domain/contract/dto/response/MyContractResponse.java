package com.checkmate.domain.contract.dto.response;

import com.checkmate.domain.contract.entity.SourceType;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class MyContractResponse {

    private Integer contractId;

    private Integer categoryId;

    private String title;

    private SourceType sourceType;

    private LocalDateTime updatedAt;

}
