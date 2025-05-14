package com.checkmate.domain.contractfieldvalue.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LegalClauseDto {
    private String titleText;
    private List<String> content;
    private Integer order;
}