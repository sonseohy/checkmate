package com.checkmate.domain.templatefieldcategory.repository;

import com.checkmate.domain.templatefieldcategory.entity.TemplateFieldCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TemplateFieldCategoryRepository extends JpaRepository<TemplateFieldCategory, Integer> {

    /**
     * 필드 ID로 매핑 찾기
     * 특정 필드에 매핑된 모든 카테고리 정보 조회
     *
     * @param fieldId 필드 ID
     * @return 해당 필드에 매핑된 모든 카테고리 정보
     */
    List<TemplateFieldCategory> findByTemplateFieldId(Integer fieldId);

    /**
     * 카테고리 ID로 매핑 찾기
     * 특정 카테고리에 매핑된 모든 필드 정보 조회
     *
     * @param categoryId 카테고리 ID
     * @return 해당 카테고리에 매핑된 모든 필드 정보
     */
    List<TemplateFieldCategory> findByContractCategoryId(Integer categoryId);

    /**
     * 필드 ID와 카테고리 ID로 매핑 찾기
     * 특정 필드와 카테고리 조합의 매핑 정보 조회
     *
     * @param fieldId 필드 ID
     * @param categoryId 카테고리 ID
     * @return 해당 필드와 카테고리의 매핑 정보
     */
    Optional<TemplateFieldCategory> findByTemplateFieldIdAndContractCategoryId(
            Integer fieldId, Integer categoryId);

    /**
     * 카테고리 ID로 필드 키 목록 조회
     * 특정 카테고리에 매핑된 모든 필드의 키 목록 조회
     *
     * @param categoryId 카테고리 ID
     * @return 해당 카테고리에 매핑된 모든 필드의 키 목록
     */
    @Query("SELECT tf.fieldKey FROM TemplateField tf JOIN tf.categoryMappings tfc " +
            "WHERE tfc.contractCategory.id = :categoryId")
    List<String> findFieldKeysByCategoryId(@Param("categoryId") Integer categoryId);

    /**
     * 특정 섹션에 속한 모든 필드 중 특정 카테고리에 매핑된 필드 찾기
     * 섹션과 카테고리 조합으로 필드 매핑 정보 조회
     *
     * @param sectionId 섹션 ID
     * @param categoryId 카테고리 ID
     * @return 해당 섹션과 카테고리에 매핑된 필드 정보 목록
     */
    @Query("SELECT tfc FROM TemplateFieldCategory tfc " +
            "WHERE tfc.templateField.section.id = :sectionId " +
            "AND tfc.contractCategory.id = :categoryId")
    List<TemplateFieldCategory> findBySectionIdAndCategoryId(
            @Param("sectionId") Integer sectionId,
            @Param("categoryId") Integer categoryId);

    /**
     * 필드 ID와 카테고리 ID로 라벨 오버라이드 조회
     * 특정 필드와 카테고리 조합에 설정된 라벨 오버라이드 값 조회
     *
     * @param fieldId 필드 ID
     * @param categoryId 카테고리 ID
     * @return 해당 필드와 카테고리에 설정된 라벨 오버라이드 값
     */
    @Query("SELECT tfc.labelOverride FROM TemplateFieldCategory tfc " +
            "WHERE tfc.templateField.id = :fieldId AND tfc.contractCategory.id = :categoryId")
    String findLabelOverrideByFieldIdAndCategoryId(
            @Param("fieldId") Integer fieldId,
            @Param("categoryId") Integer categoryId);
}