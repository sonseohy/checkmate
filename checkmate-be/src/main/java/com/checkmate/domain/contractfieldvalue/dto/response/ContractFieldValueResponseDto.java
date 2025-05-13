package com.checkmate.domain.contractfieldvalue.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ContractFieldValueResponseDto {
    private Integer contractId;
    private Integer sectionId;
    private List<LegalClauseDto> legalClauses;
    private String message;

    public ContractFieldValueResponseDto() {
        this.message = "필드 값이 성공적으로 저장되었습니다";
    }
}