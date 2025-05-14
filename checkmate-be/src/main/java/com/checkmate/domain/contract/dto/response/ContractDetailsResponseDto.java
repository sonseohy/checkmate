package com.checkmate.domain.contract.dto.response;

import com.checkmate.domain.template.dto.response.TemplateResponseDto;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class ContractDetailsResponseDto {
    private TemplateResponseDto.ContractDto contract;
    private TemplateResponseDto.TemplateDto template;
    private List<TemplateResponseDto.SectionDto> sections;
    private Map<String, Object> values;
}