package com.checkmate.domain.template.service;

import com.checkmate.domain.section.entity.Section;
import com.checkmate.domain.section.repository.SectionRepository;
import com.checkmate.domain.template.dto.response.TemplateResponseDto;
import com.checkmate.domain.template.entity.Template;
import com.checkmate.domain.template.repository.TemplateRepository;
import com.checkmate.domain.templatefield.entity.TemplateField;
import com.checkmate.domain.templatefield.repository.TemplateFieldRepository;
import com.checkmate.domain.templatesection.entity.TemplateSection;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TemplateService {
    private final TemplateRepository templateRepository;
    private final SectionRepository sectionRepository;
    private final TemplateFieldRepository templateFieldRepository;
    private final ObjectMapper objectMapper;  // JSON 파싱용

    public TemplateResponseDto getTemplate(Integer templateId) {
        // 1. 템플릿 조회
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND));

        // 2. 템플릿에 속한 모든 섹션 조회 (새로운 관계 사용)
        List<Section> sections = sectionRepository.findSectionsByTemplateId(templateId);

        // 3. 모든 섹션의 ID 추출
        List<Integer> sectionIds = sections.stream()
                .map(Section::getId)
                .collect(Collectors.toList());

        // 4. 모든 섹션에 속한 필드를 한 번의 쿼리로 조회 (N+1 문제 해결)
        List<TemplateField> allFields = templateFieldRepository.findFieldsBySectionIds(sectionIds);

        // 5. 섹션별로 필드 그룹화
        Map<Integer, List<TemplateField>> fieldsBySectionId = allFields.stream()
                .collect(Collectors.groupingBy(field -> field.getSection().getId()));

        // 6. TemplateSection에서 섹션별 추가 정보 가져오기
        Map<Integer, TemplateSection> templateSectionMap = template.getTemplateSections().stream()
                .collect(Collectors.toMap(
                        ts -> ts.getSection().getId(),
                        ts -> ts
                ));

        // 7. DTO 변환 및 응답 구성
        List<TemplateResponseDto.SectionDto> sectionDtos = sections.stream()
                .map(section -> {
                    TemplateSection templateSection = templateSectionMap.get(section.getId());
                    boolean isRequiredInTemplate = templateSection != null ?
                            templateSection.getIsRequiredInTemplate() : false;

                    return mapSectionToDto(
                            section,
                            fieldsBySectionId.getOrDefault(section.getId(), Collections.emptyList()),
                            isRequiredInTemplate,
                            templateSection != null ? templateSection.getTemplateSectionNo() : 0
                    );
                })
                .collect(Collectors.toList());

        return TemplateResponseDto.builder()
                .template(TemplateResponseDto.TemplateDto.builder()
                        .id(template.getId())
                        .name(template.getName())
                        .version(template.getVersion())
                        .categoryId(template.getCategory() != null ? template.getCategory().getId() : null)
                        .build())
                .sections(sectionDtos)
                .build();
    }

    // mapSectionToDto 메소드 수정
    private TemplateResponseDto.SectionDto mapSectionToDto(
            Section section,
            List<TemplateField> fields,
            boolean isRequiredInTemplate,
            Integer sequenceNo) {

        List<TemplateResponseDto.FieldDto> fieldDtos = fields.stream()
                .map(this::mapFieldToDto)
                .collect(Collectors.toList());

        return TemplateResponseDto.SectionDto.builder()
                .id(section.getId())
                .name(section.getName())
                .description(section.getDescription())
                .required(isRequiredInTemplate) // 템플릿에서의 필수 여부
                .sequenceNo(sequenceNo) // 템플릿에서의 순서
                .fields(fieldDtos)
                .build();
    }

    private TemplateResponseDto.FieldDto mapFieldToDto(TemplateField field) {
        return TemplateResponseDto.FieldDto.builder()
                .fieldKey(field.getFieldKey())
                .label(field.getLabel())
                .description(field.getDescription())
                .inputType(field.getInputType().toString())
                .required(field.getIsRequired())
                .sequenceNo(field.getSequenceNo())
                .options(field.getOptions())
                .dependsOn(field.getDependsOn())
                .build();
    }

    private List<String> parseOptions(String optionsJson) {
        if (optionsJson == null || optionsJson.isEmpty()) {
            return Collections.emptyList();
        }

        try {
            return objectMapper.readValue(optionsJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            log.error("옵션 파싱 중 오류 발생: {}", optionsJson, e);
            return Collections.emptyList();
        }
    }
}
