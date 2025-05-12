package com.checkmate.domain.template.service;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.entity.EditStatus;
import com.checkmate.domain.contract.entity.ProcessStatus;
import com.checkmate.domain.contract.entity.SourceType;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.contractcategory.repository.ContractCategoryRepository;
import com.checkmate.domain.section.entity.Section;
import com.checkmate.domain.section.repository.SectionRepository;
import com.checkmate.domain.template.dto.response.TemplateResponseDto;
import com.checkmate.domain.template.entity.Template;
import com.checkmate.domain.template.repository.TemplateRepository;
import com.checkmate.domain.templatefield.entity.TemplateField;
import com.checkmate.domain.templatefield.repository.TemplateFieldRepository;
import com.checkmate.domain.templatesection.entity.TemplateSection;
import com.checkmate.domain.user.entity.User;
import com.checkmate.domain.user.repository.UserRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
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
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final ContractCategoryRepository categoryRepository;

    public TemplateResponseDto getTemplate(Integer templateId) {
        // 1. 템플릿 조회
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND));

        // 응답 구성을 위한 메서드 호출
        return buildTemplateResponse(template, null);
    }

    @Transactional
    public TemplateResponseDto createEmptyContractByCategory(Integer categoryId, String userId) {
        // 1. 카테고리 ID로 카테고리 조회
        ContractCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

        // 2. 카테고리로부터 최신 템플릿 조회
        Template template = templateRepository.findTopByCategoryOrderByVersionDesc(category)
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND_FOR_CATEGORY));

        // 3. 사용자 조회
        User user = userRepository.findById(Integer.valueOf(userId))
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 4. 빈 계약서 생성
        Contract contract = Contract.builder()
                .user(user)
                .category(category)
                .template(template)
                .title(template.getName())
                .editStatus(EditStatus.EDITING)
                .sourceType(SourceType.SERVICE_GENERATED)
                .processStatus(ProcessStatus.IN_PROGRESS)
                .build();

        // 5. 계약서 저장
        Contract savedContract = contractRepository.save(contract);

        // 6. 템플릿 응답 생성 (계약서 정보 포함)
        return buildTemplateResponse(template, savedContract);
    }

    // 템플릿 응답 구성을 위한 공통 메서드
    private TemplateResponseDto buildTemplateResponse(Template template, Contract contract) {
        // 1. 템플릿에 속한 모든 섹션 조회
        List<Section> sections = sectionRepository.findSectionsByTemplateId(template.getId());

        // 2. 모든 섹션의 ID 추출
        List<Integer> sectionIds = sections.stream()
                .map(Section::getId)
                .collect(Collectors.toList());

        // 3. 모든 섹션에 속한 필드를 한 번의 쿼리로 조회
        List<TemplateField> allFields = templateFieldRepository.findFieldsBySectionIds(sectionIds);

        // 4. 섹션별로 필드 그룹화
        Map<Integer, List<TemplateField>> fieldsBySectionId = allFields.stream()
                .collect(Collectors.groupingBy(field -> field.getSection().getId()));

        // 5. TemplateSection에서 섹션별 추가 정보 가져오기
        Map<Integer, TemplateSection> templateSectionMap = template.getTemplateSections().stream()
                .collect(Collectors.toMap(
                        ts -> ts.getSection().getId(),
                        ts -> ts,
                        (ts1, ts2) -> ts1 // 중복 시 처리
                ));

        // 6. DTO 변환 및 응답 구성
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

        // 7. 계약서 정보 포함 (있는 경우에만)
        TemplateResponseDto.ContractDto contractDto = null;
        if (contract != null) {
            contractDto = TemplateResponseDto.ContractDto.builder()
                    .id(contract.getId())
                    .build();
        }

        return TemplateResponseDto.builder()
                .contract(contractDto)
                .template(TemplateResponseDto.TemplateDto.builder()
                        .id(template.getId())
                        .name(template.getName())
                        .version(template.getVersion())
                        .categoryId(template.getCategory() != null ? template.getCategory().getId() : null)
                        .build())
                .sections(sectionDtos)
                .build();
    }

    // mapSectionToDto 메소드
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

    // mapFieldToDto 메소드
    private TemplateResponseDto.FieldDto mapFieldToDto(TemplateField field) {
        return TemplateResponseDto.FieldDto.builder()
                .id(field.getId())
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
}