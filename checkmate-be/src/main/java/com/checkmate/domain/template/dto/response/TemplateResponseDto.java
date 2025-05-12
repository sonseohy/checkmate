package com.checkmate.domain.template.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class TemplateResponseDto {
    private ContractDto contract;
    private TemplateDto template;
    private List<SectionDto> sections;

    @Getter
    @Builder
    public static class ContractDto {
        private Integer id;
    }

    @Getter
    @Builder
    public static class TemplateDto {
        private Integer id;
        private String name;
        private Integer version;
        private Integer categoryId;
    }

    @Getter
    @Builder
    public static class SectionDto {
        private Integer id;
        private String name;
        private String description;
        private boolean required;
        private Integer sequenceNo;
        private List<FieldDto> fields;
    }

    @Getter
    @Builder
    public static class FieldDto {
        private Integer id;
        private String fieldKey;
        private String label;
        private String inputType;
        private boolean required;
        private Integer sequenceNo;
        private String options;
        private String dependsOn;
        private String description;
    }
}