package com.checkmate.domain.templatefieldcategory.service;

import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.contractcategory.repository.ContractCategoryRepository;
import com.checkmate.domain.templatefield.entity.TemplateField;
import com.checkmate.domain.templatefield.repository.TemplateFieldRepository;
import com.checkmate.domain.templatefieldcategory.dto.request.BatchTemplateFieldCategoryMappingRequestDto;
import com.checkmate.domain.templatefieldcategory.dto.request.TemplateFieldCategoryMappingRequestDto;
import com.checkmate.domain.templatefieldcategory.dto.response.FieldKeysByCategoryResponseDto;
import com.checkmate.domain.templatefieldcategory.dto.response.TemplateFieldCategoryMappingResponseDto;
import com.checkmate.domain.templatefieldcategory.entity.TemplateFieldCategory;
import com.checkmate.domain.templatefieldcategory.repository.TemplateFieldCategoryRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TemplateFieldCategoryService {

    private final TemplateFieldRepository templateFieldRepository;
    private final ContractCategoryRepository contractCategoryRepository;
    private final TemplateFieldCategoryRepository templateFieldCategoryRepository;

    /**
     * 필드와 카테고리 매핑 생성 또는 업데이트
     * 특정 템플릿 필드와 계약서 카테고리 간의 매핑을 생성하거나, 기존 매핑이 있으면 업데이트합니다.
     *
     * @param requestDto 필드-카테고리 매핑 요청 정보
     * @return 생성 또는 업데이트된 매핑 정보
     */
    @Transactional
    public TemplateFieldCategoryMappingResponseDto createMapping(
            TemplateFieldCategoryMappingRequestDto requestDto) {

        // 필드 조회
        TemplateField templateField = templateFieldRepository.findById(requestDto.getFieldId())
                .orElseThrow(() -> new CustomException(ErrorCode.FIELD_NOT_FOUND));

        // 카테고리 조회
        ContractCategory contractCategory = contractCategoryRepository.findById(requestDto.getCategoryId())
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

        // 이미 매핑이 존재하는지 확인
        Optional<TemplateFieldCategory> existingMapping = templateFieldCategoryRepository
                .findByTemplateFieldIdAndContractCategoryId(
                        requestDto.getFieldId(), requestDto.getCategoryId());

        if (existingMapping.isPresent()) {
            // 기존 매핑이 있으면 업데이트
            TemplateFieldCategory mapping = existingMapping.get();
            mapping.setIsRequired(requestDto.getIsRequired());
            mapping.setLabelOverride(requestDto.getLabelOverride());
            return TemplateFieldCategoryMappingResponseDto.from(templateFieldCategoryRepository.save(mapping));
        }

        // 새로운 매핑 생성
        TemplateFieldCategory newMapping = new TemplateFieldCategory(
                templateField,
                contractCategory,
                requestDto.getIsRequired(),
                requestDto.getLabelOverride()
        );

        TemplateFieldCategory savedMapping = templateFieldCategoryRepository.save(newMapping);

        return TemplateFieldCategoryMappingResponseDto.from(savedMapping);
    }

    /**
     * 필드와 여러 카테고리 일괄 매핑 생성 또는 업데이트
     * 하나의 필드를 여러 카테고리에 동시에 매핑하거나, 기존 매핑이 있으면 업데이트합니다.
     *
     * @param requestDto 일괄 매핑 요청 정보
     * @return 생성 또는 업데이트된 매핑 정보 목록
     */
    @Transactional
    public List<TemplateFieldCategoryMappingResponseDto> createBatchMapping(
            BatchTemplateFieldCategoryMappingRequestDto requestDto) {

        // 필드 조회
        TemplateField templateField = templateFieldRepository.findById(requestDto.getFieldId())
                .orElseThrow(() -> new CustomException(ErrorCode.FIELD_NOT_FOUND));

        List<TemplateFieldCategory> savedMappings = new ArrayList<>();

        for (Integer categoryId : requestDto.getCategoryIds()) {
            // 카테고리 조회
            ContractCategory contractCategory = contractCategoryRepository.findById(categoryId)
                    .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

            // 이미 매핑이 존재하는지 확인
            Optional<TemplateFieldCategory> existingMapping = templateFieldCategoryRepository
                    .findByTemplateFieldIdAndContractCategoryId(requestDto.getFieldId(), categoryId);

            if (existingMapping.isPresent()) {
                // 기존 매핑이 있으면 업데이트
                TemplateFieldCategory mapping = existingMapping.get();
                mapping.setIsRequired(requestDto.getIsRequired());
                mapping.setLabelOverride(requestDto.getLabelOverride());
                savedMappings.add(templateFieldCategoryRepository.save(mapping));
            } else {
                // 새로운 매핑 생성
                TemplateFieldCategory newMapping = new TemplateFieldCategory(
                        templateField,
                        contractCategory,
                        requestDto.getIsRequired(),
                        requestDto.getLabelOverride()
                );
                savedMappings.add(templateFieldCategoryRepository.save(newMapping));
            }
        }

        return savedMappings.stream()
                .map(TemplateFieldCategoryMappingResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * 필드 ID로 카테고리 매핑 목록 조회
     * 특정 필드에 매핑된 모든 카테고리 정보를 조회합니다.
     *
     * @param fieldId 필드 ID
     * @return 해당 필드에 매핑된 카테고리 정보 목록
     */
    @Transactional(readOnly = true)
    public List<TemplateFieldCategoryMappingResponseDto> getMappingsByFieldId(Integer fieldId) {
        // 해당 필드가 존재하는지 먼저 확인
        if (!templateFieldRepository.existsById(fieldId)) {
            throw new CustomException(ErrorCode.FIELD_NOT_FOUND);
        }

        List<TemplateFieldCategory> mappings = templateFieldCategoryRepository.findByTemplateFieldId(fieldId);

        return mappings.stream()
                .map(TemplateFieldCategoryMappingResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * 카테고리 ID로 필드 매핑 목록 조회
     * 특정 카테고리에 매핑된 모든 필드 정보를 조회합니다.
     *
     * @param categoryId 카테고리 ID
     * @return 해당 카테고리에 매핑된 필드 정보 목록
     */
    @Transactional(readOnly = true)
    public List<TemplateFieldCategoryMappingResponseDto> getMappingsByCategoryId(Integer categoryId) {
        // 해당 카테고리가 존재하는지 먼저 확인
        if (!contractCategoryRepository.existsById(categoryId)) {
            throw new CustomException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        List<TemplateFieldCategory> mappings = templateFieldCategoryRepository.findByContractCategoryId(categoryId);

        return mappings.stream()
                .map(TemplateFieldCategoryMappingResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * 카테고리 ID로 필드 키 목록 조회
     * 특정 카테고리에 매핑된 모든 필드의 키 정보와 카테고리 정보를 함께 조회합니다.
     *
     * @param categoryId 카테고리 ID
     * @return 카테고리 정보와 해당 카테고리에 매핑된 필드 키 목록
     */
    @Transactional(readOnly = true)
    public FieldKeysByCategoryResponseDto getFieldKeysByCategoryId(Integer categoryId) {
        ContractCategory category = contractCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

        List<String> fieldKeys = templateFieldCategoryRepository.findFieldKeysByCategoryId(categoryId);

        return new FieldKeysByCategoryResponseDto(
                category.getId(),
                category.getName(),
                category.getLevel(),
                fieldKeys
        );
    }

    /**
     * 필드와 카테고리 매핑 삭제
     * 특정 필드와 카테고리 간의 매핑을 삭제합니다.
     *
     * @param fieldId 필드 ID
     * @param categoryId 카테고리 ID
     */
    @Transactional
    public void deleteMapping(Integer fieldId, Integer categoryId) {
        // 매핑이 존재하는지 확인
        TemplateFieldCategory mapping = templateFieldCategoryRepository
                .findByTemplateFieldIdAndContractCategoryId(fieldId, categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.MAPPING_NOT_FOUND));

        templateFieldCategoryRepository.delete(mapping);
    }

    /**
     * 필드의 모든 카테고리 매핑 삭제
     * 특정 필드에 연결된 모든 카테고리 매핑을 삭제합니다.
     *
     * @param fieldId 필드 ID
     */
    @Transactional
    public void deleteMappingsByFieldId(Integer fieldId) {
        // 해당 필드가 존재하는지 먼저 확인
        if (!templateFieldRepository.existsById(fieldId)) {
            throw new CustomException(ErrorCode.FIELD_NOT_FOUND);
        }

        List<TemplateFieldCategory> mappings = templateFieldCategoryRepository.findByTemplateFieldId(fieldId);
        if (mappings.isEmpty()) {
            throw new CustomException(ErrorCode.MAPPING_NOT_FOUND);
        }

        templateFieldCategoryRepository.deleteAll(mappings);
    }

    /**
     * 섹션 내 필드의 카테고리 매핑 조회
     * 특정 섹션에 속한 필드 중 특정 카테고리에 매핑된 모든 필드 정보를 조회합니다.
     *
     * @param sectionId 섹션 ID
     * @param categoryId 카테고리 ID
     * @return 해당 섹션과 카테고리에 매핑된 필드 정보 목록
     */
    @Transactional(readOnly = true)
    public List<TemplateFieldCategoryMappingResponseDto> getMappingsBySectionIdAndCategoryId(
            Integer sectionId, Integer categoryId) {

        List<TemplateFieldCategory> mappings = templateFieldCategoryRepository
                .findBySectionIdAndCategoryId(sectionId, categoryId);

        return mappings.stream()
                .map(TemplateFieldCategoryMappingResponseDto::from)
                .collect(Collectors.toList());
    }
}