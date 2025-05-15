package com.checkmate.domain.contractfieldvalue.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ContractFieldValueResponseDto {
    private Integer contractId;
    private String groupId;
    private List<LegalClauseDto> legalClauses;
}