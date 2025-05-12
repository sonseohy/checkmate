package com.checkmate.domain.contractfieldvalue.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ContractFieldValueRequestDto {
    private Integer sectionId;
    private List<FieldValueDto> fieldValues;

    @Getter
    @Setter
    public static class FieldValueDto {
        private Integer fieldId;
        private String value;
    }
}