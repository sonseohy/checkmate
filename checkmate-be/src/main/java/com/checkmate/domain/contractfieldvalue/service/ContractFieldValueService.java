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
    private final TemplateFieldRepository templateFieldRepository;
    private final ContractFieldValueRepository contractFieldValueRepository;
    private final LegalClauseRepository legalClauseRepository;

    /**
     * 여러 섹션의 필드값을 한 번에 저장하고 법조항 렌더링
     */
    @Transactional
    public List<ContractFieldValueResponseDto> saveFieldValues(Integer contractId, ContractFieldValueRequestDto request) {
        // 1. 필드값 저장
        for (ContractFieldValueRequestDto.SectionFieldValues sectionValues : request.getSections()) {
            saveFieldValuesForSection(contractId, sectionValues);
        }

        // 2. 그룹별 법조항 렌더링
        return renderLegalClausesByGroups(contractId);
    }

    /**
     * 필드값 저장 (법조항 렌더링 없음)
     */
    @Transactional
    protected void saveFieldValuesForSection(Integer contractId, ContractFieldValueRequestDto.SectionFieldValues sectionValues) {
        // 1. 계약서 존재 확인
        Contract contract = findContractById(contractId);

        // 2. 필드값 저장/업데이트
        saveOrUpdateFieldValues(contract, sectionValues.getFieldValues());
    }

    /**
     * 그룹별 법조항 렌더링
     */
    @Transactional
    public List<ContractFieldValueResponseDto> renderLegalClausesByGroups(Integer contractId) {
        // 1. 계약서 카테고리 ID 가져오기
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));
        Integer categoryId = contract.getTemplate().getCategory().getId();

        // 2. 모든 필드값 맵 구성
        Map<Integer, String> fieldIdValueMap = getFieldIdValueMap(contractId);
        Map<Integer, String> fieldIdToKeyMap = getFieldIdToKeyMap(
                new ArrayList<>(fieldIdValueMap.keySet()));

        // 3. 카테고리에 해당하는 모든 법조항 조회
        List<LegalClause> allClauses = legalClauseRepository.findByCategoryId(categoryId);

        // 4. 각 법조항을 그룹별로 분류
        Map<String, List<LegalClause>> groupedClauses = new HashMap<>();

        for (LegalClause clause : allClauses) {
            // 그룹 조건 평가 - 표시 여부 결정
            if (clause.getGroupCondition() != null &&
                    !evaluateCondition(clause.getGroupCondition(), fieldIdValueMap)) {
                continue; // 그룹 조건이 false면 제외
            }

            String groupId = clause.getGroupId();
            if (groupId == null) {
                groupId = "default";
            }

            // 해당 그룹에 법조항 추가
            if (!groupedClauses.containsKey(groupId)) {
                groupedClauses.put(groupId, new ArrayList<>());
            }
            groupedClauses.get(groupId).add(clause);
        }

        // 5. 각 그룹별로 응답 객체 생성
        List<ContractFieldValueResponseDto> result = new ArrayList<>();

        for (Map.Entry<String, List<LegalClause>> entry : groupedClauses.entrySet()) {
            String groupId = entry.getKey();
            List<LegalClause> clauses = entry.getValue();

            // 법조항 렌더링
            List<LegalClauseDto> renderedClauses = renderLegalClauses(clauses, fieldIdValueMap, fieldIdToKeyMap);

            // 렌더링된 법조항이 있는 경우에만 그룹 응답 생성
            if (!renderedClauses.isEmpty()) {
                ContractFieldValueResponseDto response = new ContractFieldValueResponseDto();
                response.setContractId(contractId);
                response.setGroupId(groupId);
                response.setLegalClauses(renderedClauses);

                result.add(response);
            }
        }

        // 6. 결과를 order 기준으로 정렬
        result.sort((r1, r2) -> {
            int order1 = r1.getLegalClauses().isEmpty() ? Integer.MAX_VALUE : r1.getLegalClauses().get(0).getOrder();
            int order2 = r2.getLegalClauses().isEmpty() ? Integer.MAX_VALUE : r2.getLegalClauses().get(0).getOrder();
            return Integer.compare(order1, order2);
        });

        return result;
    }

    /**
     * 계약서 ID로 계약서 정보를 조회
     */
    private Contract findContractById(Integer contractId) {
        return contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));
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

        // 중복 제거를 위한 Map
        Map<String, LegalClauseDto> uniqueClausesMap = new LinkedHashMap<>();

        legalClauses.forEach(clause -> {
            LegalClauseDto dto = new LegalClauseDto();
            dto.setTitleText(clause.getTitleText());
            dto.setOrder(clause.getDisplayOrder());

            // 구성요소별 렌더링
            List<String> renderedContent = new ArrayList<>();
            if (clause.getComponents() != null) {
                clause.getComponents().stream()
                        .sorted(Comparator.comparing(LegalClause.Component::getOrder))
                        .forEach(component -> {
                            // 조건부 컴포넌트 처리
                            if (component.getConditions() != null &&
                                    !evaluateCondition(component.getConditions(), fieldIdValueMap)) {
                                return;
                            }

                            // 카테고리 필터링 처리
                            if (component.getCategoryIds() != null &&
                                    !component.getCategoryIds().isEmpty() &&
                                    !component.getCategoryIds().contains(clause.getCategoryId())) {
                                return;
                            }

                            renderedContent.add(renderText(component.getText(), fieldKeyValueMap, fieldIdValueMap));
                        });
            }

            dto.setContent(renderedContent);

            // content가 비어있지 않은 경우에만 추가
            if (!renderedContent.isEmpty()) {
                // 중복 제거
                String uniqueKey = dto.getTitleText() + "_" + dto.getOrder();
                uniqueClausesMap.put(uniqueKey, dto);
            }
        });

        // 정렬하여 반환
        return uniqueClausesMap.values().stream()
                .sorted(Comparator.comparing(LegalClauseDto::getOrder))
                .collect(Collectors.toList());
    }

    /**
     * 복합 조건을 평가
     */
    private boolean evaluateCondition(LegalClause.CompositeCondition condition, Map<Integer, String> fieldIdValueMap) {
        if (condition == null) {
            return true;
        }

        // 1. 단일 필드 조건 평가
        if (condition.getFieldId() != null) {
            String actualValue = fieldIdValueMap.get(condition.getFieldId());
            return evaluateSingleCondition(actualValue, condition.getOperator(), condition.getValue());
        }

        // 2. SUM 조건 평가
        if (condition.getSumFields() != null && !condition.getSumFields().isEmpty() &&
                condition.getSumOperator() != null && condition.getSumValue() != null) {
            double sum = calculateSum(condition.getSumFields(), fieldIdValueMap);
            return evaluateNumericCondition(sum, condition.getSumOperator(), condition.getSumValue());
        }

        // 3. SUB 조건 평가
        if (condition.getSubFields() != null && !condition.getSubFields().isEmpty() &&
                condition.getSubOperator() != null && condition.getSubValue() != null) {
            double sub = calculateSubtraction(condition.getSubFields(), fieldIdValueMap);
            return evaluateNumericCondition(sub, condition.getSubOperator(), condition.getSubValue());
        }

        // 4. MUL 조건 평가
        if (condition.getMulFields() != null && !condition.getMulFields().isEmpty() &&
                condition.getMulOperator() != null && condition.getMulValue() != null) {
            double mul = calculateMultiplication(condition.getMulFields(), fieldIdValueMap);
            return evaluateNumericCondition(mul, condition.getMulOperator(), condition.getMulValue());
        }

        // 5. DIV 조건 평가
        if (condition.getDivFields() != null && !condition.getDivFields().isEmpty() &&
                condition.getDivOperator() != null && condition.getDivValue() != null) {
            double div = calculateDivision(condition.getDivFields(), fieldIdValueMap);
            return evaluateNumericCondition(div, condition.getDivOperator(), condition.getDivValue());
        }

        // 6. OR 조건 평가
        if (condition.getOr() != null && !condition.getOr().isEmpty()) {
            return condition.getOr().stream()
                    .anyMatch(subCondition -> evaluateCondition(subCondition, fieldIdValueMap));
        }

        // 7. AND 조건 평가
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
            case "gte":
                try {
                    double actual = Double.parseDouble(actualValue);
                    double target = Double.parseDouble(targetValue.toString());
                    return actual >= target;
                } catch (NumberFormatException e) {
                    return false;
                }
            case "lte":
                try {
                    double actual = Double.parseDouble(actualValue);
                    double target = Double.parseDouble(targetValue.toString());
                    return actual <= target;
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
     * 숫자 조건 평가
     */
    private boolean evaluateNumericCondition(double actual, String operator, Object targetValue) {
        if (targetValue == null) {
            return false;
        }

        double target;
        try {
            target = Double.parseDouble(targetValue.toString());
        } catch (NumberFormatException e) {
            return false;
        }

        switch (operator) {
            case "eq":
                return Math.abs(actual - target) < 0.00001;
            case "neq":
                return Math.abs(actual - target) >= 0.00001;
            case "gt":
                return actual > target;
            case "lt":
                return actual < target;
            case "gte":
                return actual >= target;
            case "lte":
                return actual <= target;
            default:
                return false;
        }
    }

    /**
     * 텍스트 내의 필드 키와 연산 패턴을 값으로 치환 (중첩 연산 지원)
     */
    private String renderText(String text, Map<String, String> fieldKeyValueMap, Map<Integer, String> fieldIdValueMap) {
        if (text == null || text.isEmpty()) {
            return "";
        }

        return processNestedOperations(text, fieldKeyValueMap, fieldIdValueMap, true);
    }

    /**
     * 중첩 연산을 재귀적으로 처리
     */
    private String processNestedOperations(String text, Map<String, String> fieldKeyValueMap,
                                           Map<Integer, String> fieldIdValueMap, boolean isTopLevel) {
        String renderedText = text;

        // 가장 안쪽의 연산부터 처리하는 패턴
        Pattern operationPattern = Pattern.compile("\\{(SUM|SUB|MUL|DIV):([^{}]+)}");
        Matcher operationMatcher = operationPattern.matcher(renderedText);

        // 중첩 패턴을 검색
        Pattern nestedPattern = Pattern.compile("\\{(SUM|SUB|MUL|DIV):[^{}]*\\{[^{}]+}[^{}]*}");
        boolean hasNestedOperation = nestedPattern.matcher(renderedText).find();

        // 중첩 연산이 있으면 재귀 처리
        if (hasNestedOperation) {
            // {} 안에 있는 모든 중첩된 패턴을 찾아 처리
            while (true) {
                Matcher nestedMatcher = Pattern.compile("\\{[^{}]*\\{([^{}]+)}[^{}]*}").matcher(renderedText);
                if (!nestedMatcher.find()) break;

                // 중첩된 내부 표현식
                String innerExpr = "{" + nestedMatcher.group(1) + "}";
                // 중첩된 내부 표현식 처리 (재귀 호출)
                String processed = processNestedOperations(innerExpr, fieldKeyValueMap, fieldIdValueMap, false);
                // 처리된 결과로 치환
                renderedText = renderedText.replaceFirst(Pattern.quote(innerExpr), processed);
            }
        }

        // 기본 연산 처리
        while (operationMatcher.find()) {
            String placeholder = operationMatcher.group(0);  // 예: {SUM:1,3,5,c:100}
            String operation = operationMatcher.group(1);   // 예: SUM, SUB, MUL, DIV
            String paramsStr = operationMatcher.group(2);   // 예: 1,3,5,c:100

            // 필드 ID 목록과 상수값 파싱
            List<Integer> fieldIds = new ArrayList<>();
            List<Double> constants = new ArrayList<>();

            for (String param : paramsStr.split(",")) {
                param = param.trim();
                if (param.startsWith("c:")) {
                    // 상수 처리
                    try {
                        double constant = Double.parseDouble(param.substring(2));
                        constants.add(constant);
                    } catch (NumberFormatException e) {
                    }
                } else {
                    // 필드 ID 처리
                    try {
                        int fieldId = Integer.parseInt(param);
                        fieldIds.add(fieldId);
                    } catch (NumberFormatException e) {
                    }
                }
            }

            // 연산 수행
            double result;
            String formattedResult;

            switch (operation) {
                case "SUM":
                    result = calculateSumWithConstants(fieldIds, fieldIdValueMap, constants);
                    // 최상위 연산이면서 최종 결과인 경우에만 형식화
                    if (isTopLevel) {
                        formattedResult = String.valueOf(Math.round(result));
                    } else {
                        // 중간 계산에서는 정확한 값 사용
                        formattedResult = String.valueOf(result);
                    }
                    break;
                case "SUB":
                    result = calculateSubtractionWithConstants(fieldIds, fieldIdValueMap, constants);
                    if (isTopLevel) {
                        formattedResult = String.valueOf(Math.round(result));
                    } else {
                        formattedResult = String.valueOf(result);
                    }
                    break;
                case "MUL":
                    result = calculateMultiplicationWithConstants(fieldIds, fieldIdValueMap, constants);
                    log.debug("MUL operation - Fields: {}, Constants: {}, Result: {}", fieldIds, constants, result);
                    if (isTopLevel) {
                        formattedResult = String.valueOf(Math.round(result));
                    } else {
                        formattedResult = String.valueOf(result);
                    }
                    break;
                case "DIV":
                    result = calculateDivisionWithConstants(fieldIds, fieldIdValueMap, constants);
                    if (isTopLevel) {
                        formattedResult = String.format("%.2f", result);
                    } else {
                        formattedResult = String.valueOf(result);
                    }
                    break;
                default:
                    formattedResult = "0";
                    break;
            }

            // 치환
            renderedText = renderedText.replace(placeholder, formattedResult);
        }

        // 최상위 호출인 경우만 일반 필드 키 처리
        if (isTopLevel) {
            Pattern fieldPattern = Pattern.compile("\\{([^{}]+)}");
            Matcher fieldMatcher = fieldPattern.matcher(renderedText);

            while (fieldMatcher.find()) {
                String fieldKey = fieldMatcher.group(1);
                if (!fieldKey.matches("(SUM|SUB|MUL|DIV):.*")) {
                    String value = fieldKeyValueMap.getOrDefault(fieldKey, "");
                    renderedText = renderedText.replace("{" + fieldKey + "}", value);
                }
            }
        }

        return renderedText;
    }

    /**
     * 필드 ID 목록의 값을 합산
     */
    private double calculateSum(List<Integer> fieldIds, Map<Integer, String> fieldIdValueMap) {
        if (fieldIds == null || fieldIds.isEmpty()) {
            return 0.0;
        }

        return fieldIds.stream()
                .filter(fieldId -> fieldIdValueMap.containsKey(fieldId))
                .mapToDouble(fieldId -> {
                    String value = fieldIdValueMap.get(fieldId);
                    try {
                        return Double.parseDouble(value);
                    } catch (NumberFormatException | NullPointerException e) {
                        return 0.0;
                    }
                })
                .sum();
    }

    /**
     * 필드 ID 목록의 값으로 뺄셈 수행 (첫 번째 값에서 나머지 값 차감)
     */
    private double calculateSubtraction(List<Integer> fieldIds, Map<Integer, String> fieldIdValueMap) {
        if (fieldIds == null || fieldIds.isEmpty()) {
            return 0.0;
        }

        double[] values = fieldIds.stream()
                .filter(fieldId -> fieldIdValueMap.containsKey(fieldId))
                .mapToDouble(fieldId -> {
                    String value = fieldIdValueMap.get(fieldId);
                    try {
                        return Double.parseDouble(value);
                    } catch (NumberFormatException | NullPointerException e) {
                        return 0.0;
                    }
                })
                .toArray();

        if (values.length == 0) {
            return 0.0;
        }

        double result = values[0];
        for (int i = 1; i < values.length; i++) {
            result -= values[i];
        }

        return result;
    }

    /**
     * 필드 ID 목록의 값을 모두 곱함
     */
    private double calculateMultiplication(List<Integer> fieldIds, Map<Integer, String> fieldIdValueMap) {
        if (fieldIds == null || fieldIds.isEmpty()) {
            return 0.0;
        }

        return fieldIds.stream()
                .filter(fieldId -> fieldIdValueMap.containsKey(fieldId))
                .mapToDouble(fieldId -> {
                    String value = fieldIdValueMap.get(fieldId);
                    try {
                        return Double.parseDouble(value);
                    } catch (NumberFormatException | NullPointerException e) {
                        return 0.0;
                    }
                })
                .reduce(1.0, (a, b) -> a * b);
    }

    /**
     * 필드 ID 목록의 값으로 나눗셈 수행
     */
    private double calculateDivision(List<Integer> fieldIds, Map<Integer, String> fieldIdValueMap) {
        if (fieldIds == null || fieldIds.isEmpty()) {
            return 0.0;
        }

        double[] values = fieldIds.stream()
                .filter(fieldId -> fieldIdValueMap.containsKey(fieldId))
                .mapToDouble(fieldId -> {
                    String value = fieldIdValueMap.get(fieldId);
                    try {
                        return Double.parseDouble(value);
                    } catch (NumberFormatException | NullPointerException e) {
                        return 0.0;
                    }
                })
                .toArray();

        if (values.length == 0) {
            return 0.0;
        }

        double result = values[0];
        for (int i = 1; i < values.length; i++) {
            // 0으로 나누기 방지
            if (Math.abs(values[i]) < 0.00001) {
                continue;
            }
            result /= values[i];
        }

        return result;
    }

    /**
     * 필드 ID 목록과 상수 목록의 값을 합산
     */
    private double calculateSumWithConstants(List<Integer> fieldIds, Map<Integer, String> fieldIdValueMap, List<Double> constants) {
        // 모든 필드값과 상수를 리스트로 모음
        List<Double> allValues = new ArrayList<>();

        // 필드값 추가
        if (fieldIds != null) {
            for (Integer fieldId : fieldIds) {
                if (fieldIdValueMap.containsKey(fieldId)) {
                    String value = fieldIdValueMap.get(fieldId);
                    try {
                        double numValue = Double.parseDouble(value);
                        allValues.add(numValue);
                        log.debug("Added field value for SUM: fieldId={}, value={}", fieldId, numValue);
                    } catch (NumberFormatException | NullPointerException e) {
                        log.warn("Failed to parse field value for sum: fieldId={}, value={}", fieldId, value);
                        // 합계의 경우 값이 없으면 0을 사용
                        allValues.add(0.0);
                    }
                } else {
                    log.warn("Field ID not found in value map: {}", fieldId);
                    // 필드 ID가 맵에 없는 경우 기본값 0 사용
                    allValues.add(0.0);
                }
            }
        }

        // 상수값 추가
        if (constants != null && !constants.isEmpty()) {
            allValues.addAll(constants);
            log.debug("Added constants for SUM: {}", constants);
        }

        // 모든 값 로깅
        log.debug("All values for SUM operation: {}", allValues);

        // 모든 값을 합산
        double sum = 0.0;
        for (Double value : allValues) {
            sum += value;
        }

        log.debug("SUM result: {}", sum);
        return sum;
    }

    /**
     * 필드 ID 목록과 상수 목록의 값으로 뺄셈 수행
     */
    private double calculateSubtractionWithConstants(List<Integer> fieldIds, Map<Integer, String> fieldIdValueMap, List<Double> constants) {
        // 모든 필드값과 상수를 리스트로 모음
        List<Double> allValues = new ArrayList<>();

        // 필드값 추가
        if (fieldIds != null) {
            for (Integer fieldId : fieldIds) {
                if (fieldIdValueMap.containsKey(fieldId)) {
                    String value = fieldIdValueMap.get(fieldId);
                    try {
                        double numValue = Double.parseDouble(value);
                        allValues.add(numValue);
                    } catch (NumberFormatException | NullPointerException e) {
                        // 뺄셈의 경우 값이 없으면 0을 사용
                        allValues.add(0.0);
                    }
                } else {
                    // 필드 ID가 맵에 없는 경우 기본값 0 사용
                    allValues.add(0.0);
                }
            }
        }

        // 상수값 추가
        if (constants != null && !constants.isEmpty()) {
            allValues.addAll(constants);
        }

        if (allValues.isEmpty()) {
            return 0.0;
        }

        // 첫 번째 값에서 나머지 값 차감
        double result = allValues.get(0);
        for (int i = 1; i < allValues.size(); i++) {
            result -= allValues.get(i);
        }

        return result;
    }

    /**
     * 필드 ID 목록과 상수 목록의 값을 모두 곱함
     */
    private double calculateMultiplicationWithConstants(List<Integer> fieldIds, Map<Integer, String> fieldIdValueMap, List<Double> constants) {
        // 연산이 비어있는 경우 0 반환 (곱셈이므로 0을 반환하는 것이 안전)
        if ((fieldIds == null || fieldIds.isEmpty()) && (constants == null || constants.isEmpty())) {
            return 0.0;
        }

        List<Double> allValues = new ArrayList<>();

        // 필드값 추가
        if (fieldIds != null) {
            for (Integer fieldId : fieldIds) {
                if (fieldIdValueMap.containsKey(fieldId)) {
                    String value = fieldIdValueMap.get(fieldId);
                    try {
                        double numValue = Double.parseDouble(value);
                        allValues.add(numValue);
                    } catch (NumberFormatException | NullPointerException e) {
                        // 곱셈의 경우 값이 없으면 1을 사용 (곱셈에 영향 없음)
                        allValues.add(1.0);
                    }
                } else {
                    // 필드 ID가 맵에 없는 경우 기본값 1 사용
                    allValues.add(1.0);
                }
            }
        }

        // 상수값 추가
        if (constants != null && !constants.isEmpty()) {
            allValues.addAll(constants);
        }

        if (allValues.isEmpty()) {
            return 0.0;
        }

        // 모든 값을 곱함
        double result = 1.0;
        for (Double value : allValues) {
            result *= value;
        }

        return result;
    }

    /**
     * 필드 ID 목록과 상수 목록의 값으로 나눗셈 수행
     */
    private double calculateDivisionWithConstants(List<Integer> fieldIds, Map<Integer, String> fieldIdValueMap, List<Double> constants) {
        // 모든 필드값과 상수를 리스트로 모음
        List<Double> allValues = new ArrayList<>();

        // 필드값 추가
        if (fieldIds != null) {
            for (Integer fieldId : fieldIds) {
                if (fieldIdValueMap.containsKey(fieldId)) {
                    String value = fieldIdValueMap.get(fieldId);
                    try {
                        double numValue = Double.parseDouble(value);
                        allValues.add(numValue);
                    } catch (NumberFormatException | NullPointerException e) {
                    }
                } else {
                }
            }
        }

        // 상수값 추가
        if (constants != null && !constants.isEmpty()) {
            allValues.addAll(constants);
        }

        if (allValues.isEmpty()) {
            return 0.0;
        }

        // 첫 번째 값을 나머지 값으로 순차적으로 나눔
        double result = allValues.get(0);
        for (int i = 1; i < allValues.size(); i++) {
            // 0으로 나누기 방지
            if (Math.abs(allValues.get(i)) < 0.00001) {
                continue;
            }
            result /= allValues.get(i);
        }

        return result;
    }

    /**
     * 계약서의 모든 필드값 삭제
     * @param contractId 계약서 ID
     * @return 삭제된 필드값 개수
     */
    @Transactional
    public int deleteAllFieldValues(Integer contractId) {
        // 계약서 존재 확인
        contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

        List<ContractFieldValue> fieldValues = contractFieldValueRepository.findByContractId(contractId);

        int count = fieldValues.size();
        contractFieldValueRepository.deleteAll(fieldValues);

        log.info("계약서 ID {}의 모든 필드값 {} 개가 삭제되었습니다.", contractId, count);

        return count;
    }
}