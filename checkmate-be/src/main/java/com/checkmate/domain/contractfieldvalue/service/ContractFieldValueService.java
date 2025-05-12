package com.checkmate.domain.contractfieldvalue.service;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.domain.contractfieldvalue.dto.request.ContractFieldValueRequestDto;
import com.checkmate.domain.contractfieldvalue.dto.response.ContractFieldValueResponseDto;
import com.checkmate.domain.contractfieldvalue.dto.response.LegalClauseDto;
import com.checkmate.domain.contractfieldvalue.entity.ContractFieldValue;
import com.checkmate.domain.contractfieldvalue.entity.LegalClause;
import com.checkmate.domain.contractfieldvalue.repository.ContractFieldValueRepository;
import com.checkmate.domain.contractfieldvalue.repository.LegalClauseRepository;
import com.checkmate.domain.templatefield.entity.InputType;
import com.checkmate.domain.templatefield.entity.TemplateField;
import com.checkmate.domain.templatefield.repository.TemplateFieldRepository;
import com.checkmate.domain.templatefieldcategory.service.TemplateFieldCategoryService;
import com.checkmate.domain.templatesection.entity.TemplateSection;
import com.checkmate.domain.templatesection.repository.TemplateSectionRepository;
import com.checkmate.domain.section.entity.Section;
import com.checkmate.domain.section.repository.SectionRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContractFieldValueService {

    private final ContractRepository contractRepository;
    private final TemplateSectionRepository templateSectionRepository;
    private final SectionRepository sectionRepository;
    private final TemplateFieldRepository templateFieldRepository;
    private final ContractFieldValueRepository contractFieldValueRepository;
    private final LegalClauseRepository legalClauseRepository;
    private final TemplateFieldCategoryService templateFieldCategoryService;

    /**
     * 여러 섹션의 필드값을 한 번에 저장하고 법조항 렌더링
     */
    @Transactional
    public List<ContractFieldValueResponseDto> saveFieldValues(Integer contractId, ContractFieldValueRequestDto request) {
        List<ContractFieldValueResponseDto> responses = new ArrayList<>();

        // 각 섹션별로 필드값 저장 및 법조항 렌더링
        for (ContractFieldValueRequestDto.SectionFieldValues sectionValues : request.getSections()) {
            ContractFieldValueResponseDto response = saveFieldValuesForSection(contractId, sectionValues);
            responses.add(response);
        }

        return responses;
    }

    /**
     * 단일 섹션의 필드값 저장 및 법조항 렌더링
     */
    @Transactional // 중첩 트랜잭션 처리
    protected ContractFieldValueResponseDto saveFieldValuesForSection(
            Integer contractId,
            ContractFieldValueRequestDto.SectionFieldValues sectionValues) {

        // 1. 계약서 존재 확인
        Contract contract = findContractById(contractId);

        // 2. 섹션 존재 확인
        Section section = findSectionEntityById(sectionValues.getSectionId());

        // 3. 템플릿 섹션 조회
        TemplateSection templateSection = findTemplateSectionByTemplateAndSectionId(
                contract.getTemplate().getId(), section.getId());

        // 4. 모든 필드 ID 목록 추출
        List<Integer> allFieldIds = sectionValues.getFieldValues().stream()
                .map(ContractFieldValueRequestDto.FieldValueDto::getFieldId)
                .collect(Collectors.toList());

        // 5. 필드값 저장/업데이트
        saveOrUpdateFieldValues(contract, sectionValues.getFieldValues());

        // 6. 응답 생성
        ContractFieldValueResponseDto response = new ContractFieldValueResponseDto();
        response.setContractId(contractId);
        response.setSectionId(sectionValues.getSectionId());

        // 7. 법조항 렌더링
        List<LegalClauseDto> renderedClauses = renderLegalClausesForFields(contractId, section, allFieldIds);
        response.setLegalClauses(renderedClauses);

        return response;
    }


    /**
     * 특정 필드 ID 목록에 해당하는 법조항을 렌더링
     */
    private List<LegalClauseDto> renderLegalClausesForFields(Integer contractId, Section section, List<Integer> fieldIds) {
        // 1. 계약서 카테고리 ID 가져오기
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));
        Integer categoryId = contract.getTemplate().getCategory().getId();

        log.debug("계약서 카테고리 ID: {}, 필드 ID 목록: {}", categoryId, fieldIds);

        // 2. 필드값 맵 구성
        Map<Integer, String> fieldIdValueMap = getFieldIdValueMap(contractId);
        Map<Integer, String> fieldIdToKeyMap = getFieldIdToKeyMap(fieldIds);

        // 3. 필드-카테고리 매핑에서 MongoDB ID 목록 조회 (최적화!)
        List<String> mongoClauseIds = templateFieldCategoryService
                .getMongoClauseIdsByFieldIdsAndCategoryId(fieldIds, categoryId);

        List<LegalClause> legalClauses;

        // 4. MongoDB ID가 있으면 직접 조회, 없으면 필터 조건으로 검색
        if (!mongoClauseIds.isEmpty()) {
            // 최적화: 저장된 MongoDB ID로 직접 조회
            log.debug("최적화: 저장된 MongoDB ID로 법조항 직접 조회: {} 개", mongoClauseIds.size());
            legalClauses = legalClauseRepository.findAllById(mongoClauseIds);
        } else if (!fieldIds.isEmpty()) {
            // MongoDB ID가 없는 경우만 기존 방식으로 검색
            log.debug("MongoDB ID가 없어 기존 방식으로 검색");
            legalClauses = legalClauseRepository.findByFieldIdsAndCategoryId(fieldIds, categoryId);

            // 검색 결과를 매핑 테이블에 저장 (다음 조회를 위한 최적화)
            saveLegalClauseMappings(fieldIds, categoryId, legalClauses);
        } else {
            legalClauses = Collections.emptyList();
            log.debug("필드 ID가 없어 법조항 조회를 건너뜁니다.");
        }

        // 5. 법조항 렌더링 (최신 필드값 적용)
        List<LegalClauseDto> result = renderLegalClauses(legalClauses, fieldIdValueMap, fieldIdToKeyMap);
        log.debug("렌더링된 법조항 수: {}", result.size());
        return result;
    }

    /**
     * 검색된 법조항을 필드-카테고리 매핑 테이블에 저장
     */
    private void saveLegalClauseMappings(List<Integer> fieldIds, Integer categoryId, List<LegalClause> legalClauses) {
        if (legalClauses.isEmpty()) {
            return;
        }

        for (LegalClause clause : legalClauses) {
            if (clause.getTargetFields() != null) {
                // 현재 법조항과 관련된 필드 ID 목록 (필드 ID 목록과의 교집합)
                List<Integer> relevantFieldIds = clause.getTargetFields().stream()
                        .filter(fieldIds::contains)
                        .collect(Collectors.toList());

                // 각 관련 필드에 대해 MongoDB ID 매핑 저장
                if (!relevantFieldIds.isEmpty()) {
                    templateFieldCategoryService.saveMongoClauseIdForMultipleFields(
                            relevantFieldIds, categoryId, clause.getId());
                }
            }
        }
    }

    /**
     * 계약서 ID로 계약서 정보를 조회
     */
    private Contract findContractById(Integer contractId) {
        return contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));
    }

    /**
     * 섹션 ID로 섹션 엔티티 정보를 조회
     */
    private Section findSectionEntityById(Integer sectionId) {
        return sectionRepository.findById(sectionId)
                .orElseThrow(() -> new CustomException(ErrorCode.SECTION_NOT_FOUND));
    }

    /**
     * 템플릿 ID와 섹션 ID로 템플릿 섹션 정보를 조회
     */
    private TemplateSection findTemplateSectionByTemplateAndSectionId(Integer templateId, Integer sectionId) {
        // 템플릿 ID와 섹션 ID로 템플릿 섹션 검색
        List<TemplateSection> templateSections = templateSectionRepository.findAll().stream()
                .filter(ts -> ts.getTemplate().getId().equals(templateId) &&
                        ts.getSection().getId().equals(sectionId))
                .collect(Collectors.toList());

        if (templateSections.isEmpty()) {
            throw new CustomException(ErrorCode.SECTION_NOT_FOUND);
        }

        return templateSections.get(0);
    }

    /**
     * 필드 ID로 템플릿 필드 정보를 조회
     */
    private TemplateField findFieldById(Integer fieldId) {
        return templateFieldRepository.findById(fieldId)
                .orElseThrow(() -> new CustomException(ErrorCode.FIELD_NOT_FOUND));
    }

    /**
     * 필드값 목록을 저장하거나 업데이트
     */
    private void saveOrUpdateFieldValues(Contract contract, List<ContractFieldValueRequestDto.FieldValueDto> fieldValues) {
        for (ContractFieldValueRequestDto.FieldValueDto fieldValueDto : fieldValues) {
            // 필드 존재 확인
            TemplateField field = findFieldById(fieldValueDto.getFieldId());

            // 필드 유효성 검증
            validateFieldValue(field, fieldValueDto.getValue());

            // 기존 값 찾기
            Optional<ContractFieldValue> existingValue = contractFieldValueRepository
                    .findByContractIdAndFieldId(contract.getId(), fieldValueDto.getFieldId());

            if (existingValue.isPresent()) {
                ContractFieldValue fieldValue = existingValue.get();
                fieldValue.setValue(fieldValueDto.getValue());
                contractFieldValueRepository.save(fieldValue);
            } else {
                ContractFieldValue fieldValue = ContractFieldValue.create(contract, field, fieldValueDto.getValue());
                contractFieldValueRepository.save(fieldValue);
            }
        }
    }

    /**
     * 필드 값의 유효성을 검증
     */
    private void validateFieldValue(TemplateField field, String value) {
        // 값이 없는 경우
        if (value == null || value.trim().isEmpty()) {
            if (field.getIsRequired()) {
                throw new CustomException(ErrorCode.MISSING_REQUIRED_FIELD);
            }
            return;
        }

        // 필드 타입별 검증 로직
        InputType inputType = field.getInputType();
        switch (inputType) {
            case NUMBER:
                try {
                    Double.parseDouble(value);
                } catch (NumberFormatException e) {
                    throw new CustomException(ErrorCode.INVALID_FIELD_VALUE);
                }
                break;

            case DATE:
                try {
                    String dateValue = value.trim();
                    DateTimeFormatter formatter;

                    if (dateValue.contains("-")) {
                        formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    } else if (dateValue.contains(".")) {
                        formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
                    } else {
                        throw new CustomException(ErrorCode.INVALID_FIELD_VALUE);
                    }

                    LocalDate.parse(dateValue, formatter);
                } catch (DateTimeParseException e) {
                    throw new CustomException(ErrorCode.INVALID_FIELD_VALUE);
                }
                break;

            case CHECKBOX:
                // CHECKBOX는 0, 1 값만 허용
                if (!value.equals("0") && !value.equals("1")) {
                    throw new CustomException(ErrorCode.INVALID_FIELD_VALUE);
                }
                break;

            case RADIO:
                // RADIO 타입은 옵션에 있는 값인지 확인 로직 추가
                if (field.getOptions() != null && !field.getOptions().isEmpty()) {
                    if (!field.getOptions().contains(value)) {
                        throw new CustomException(ErrorCode.INVALID_FIELD_VALUE);
                    }
                }
                break;
        }
    }

    /**
     * 계약서의 모든 필드값을 필드ID-값 맵으로 반환
     */
    private Map<Integer, String> getFieldIdValueMap(Integer contractId) {
        List<ContractFieldValue> fieldValues = contractFieldValueRepository.findByContractId(contractId);
        Map<Integer, String> fieldIdValueMap = new HashMap<>();

        for (ContractFieldValue fieldValue : fieldValues) {
            fieldIdValueMap.put(fieldValue.getField().getId(), fieldValue.getValue());
        }

        return fieldIdValueMap;
    }

    /**
     * 필드 ID 목록의 필드 ID-키 매핑을 반환
     */
    private Map<Integer, String> getFieldIdToKeyMap(List<Integer> fieldIds) {
        if (fieldIds.isEmpty()) {
            return Collections.emptyMap();
        }

        List<TemplateField> fields = templateFieldRepository.findAllById(fieldIds);
        return fields.stream()
                .collect(Collectors.toMap(
                        TemplateField::getId,
                        TemplateField::getFieldKey,
                        (key1, key2) -> key1 // 중복 키 처리
                ));
    }

    /**
     * 법조항 목록을 필드값을 적용하여 렌더링
     */
    private List<LegalClauseDto> renderLegalClauses(
            List<LegalClause> legalClauses,
            Map<Integer, String> fieldIdValueMap,
            Map<Integer, String> fieldIdToKeyMap) {

        if (legalClauses == null || legalClauses.isEmpty()) {
            return Collections.emptyList();
        }

        // 필드 키-값 맵 생성
        Map<String, String> fieldKeyValueMap = new HashMap<>();
        for (Map.Entry<Integer, String> entry : fieldIdValueMap.entrySet()) {
            Integer fieldId = entry.getKey();
            String value = entry.getValue();
            String fieldKey = fieldIdToKeyMap.get(fieldId);

            if (fieldKey != null && !fieldKey.isEmpty()) {
                fieldKeyValueMap.put(fieldKey, value);
            }
        }

        return legalClauses.stream().map(clause -> {
            LegalClauseDto dto = new LegalClauseDto();
            dto.setTitleText(clause.getTitleText());
            dto.setOrder(clause.getDisplayOrder());

            // 구성요소별 렌더링
            List<String> renderedContent = new ArrayList<>();
            if (clause.getComponents() != null) {
                // 컴포넌트 처리 및 정렬
                clause.getComponents().stream()
                        .sorted(Comparator.comparing(LegalClause.Component::getOrder))
                        .forEach(component -> {
                            // 조건부 컴포넌트 처리
                            if (component.getConditions() != null) {
                                if (!evaluateCondition(component.getConditions(), fieldIdValueMap)) {
                                    return;
                                }
                            }

                            // 카테고리 필터링 처리
                            if (component.getCategoryIds() != null && !component.getCategoryIds().isEmpty()) {
                                Integer categoryId = clause.getCategoryId();
                                if (!component.getCategoryIds().contains(categoryId)) {
                                    return;
                                }
                            }

                            String renderedText = component.getText();
                            renderedText = renderText(renderedText, fieldKeyValueMap);
                            renderedContent.add(renderedText);
                        });
            }

            dto.setContent(renderedContent);
            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * 복합 조건을 평가
     */
    private boolean evaluateCondition(LegalClause.CompositeCondition condition, Map<Integer, String> fieldIdValueMap) {
        if (condition == null) {
            return true;
        }

        // 1. 단일 조건 평가
        if (condition.getFieldId() != null) {
            String actualValue = fieldIdValueMap.get(condition.getFieldId());
            return evaluateSingleCondition(actualValue, condition.getOperator(), condition.getValue());
        }

        // 2. OR 조건 평가
        if (condition.getOr() != null && !condition.getOr().isEmpty()) {
            return condition.getOr().stream()
                    .anyMatch(subCondition -> evaluateCondition(subCondition, fieldIdValueMap));
        }

        // 3. AND 조건 평가
        if (condition.getAnd() != null && !condition.getAnd().isEmpty()) {
            return condition.getAnd().stream()
                    .allMatch(subCondition -> evaluateCondition(subCondition, fieldIdValueMap));
        }

        return true;
    }

    /**
     * 단일 조건을 평가
     */
    private boolean evaluateSingleCondition(String actualValue, String operator, Object targetValue) {
        if (actualValue == null) {
            actualValue = "";
        }

        if (targetValue == null) {
            targetValue = "";
        }

        switch (operator) {
            case "eq":
                return actualValue.equals(targetValue.toString());
            case "neq":
                return !actualValue.equals(targetValue.toString());
            case "gt":
                try {
                    double actual = Double.parseDouble(actualValue);
                    double target = Double.parseDouble(targetValue.toString());
                    return actual > target;
                } catch (NumberFormatException e) {
                    return false;
                }
            case "lt":
                try {
                    double actual = Double.parseDouble(actualValue);
                    double target = Double.parseDouble(targetValue.toString());
                    return actual < target;
                } catch (NumberFormatException e) {
                    return false;
                }
            case "contains":
                return actualValue.contains(targetValue.toString());
            default:
                return false;
        }
    }

    /**
     * 텍스트 내의 필드 키를 값으로 치환
     */
    private String renderText(String text, Map<String, String> fieldKeyValueMap) {
        if (text == null || text.isEmpty()) {
            return "";
        }

        String renderedText = text;
        Pattern pattern = Pattern.compile("\\{([^}]+)\\}");
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            String fieldKey = matcher.group(1);
            // 필드값이 없으면 빈 문자열 사용
            String value = fieldKeyValueMap.getOrDefault(fieldKey, "");
            renderedText = renderedText.replace("{" + fieldKey + "}", value);
        }

        return renderedText;
    }
}