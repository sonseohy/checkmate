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

    // 필드 ID로 매핑 찾기
    List<TemplateFieldCategory> findByTemplateFieldId(Integer fieldId);

    // 카테고리 ID로 매핑 찾기
    List<TemplateFieldCategory> findByContractCategoryId(Integer categoryId);

    // 필드 ID와 카테고리 ID로 매핑 찾기
    Optional<TemplateFieldCategory> findByTemplateFieldIdAndContractCategoryId(
            Integer fieldId, Integer categoryId);

    // 카테고리 ID로 필드 키 목록 조회
    @Query("SELECT tf.fieldKey FROM TemplateField tf JOIN tf.categoryMappings tfc " +
            "WHERE tfc.contractCategory.id = :categoryId")
    List<String> findFieldKeysByCategoryId(@Param("categoryId") Integer categoryId);

    // 특정 섹션에 속한 모든 필드 중 특정 카테고리에 매핑된 필드 찾기
    @Query("SELECT tfc FROM TemplateFieldCategory tfc " +
            "WHERE tfc.templateField.section.id = :sectionId " +
            "AND tfc.contractCategory.id = :categoryId")
    List<TemplateFieldCategory> findBySectionIdAndCategoryId(
            @Param("sectionId") Integer sectionId,
            @Param("categoryId") Integer categoryId);

    // 필드 ID와 카테고리 ID로 MongoDB ID 목록 조회
    @Query("SELECT tfc.mongoClauseId FROM TemplateFieldCategory tfc " +
            "WHERE tfc.templateField.id = :fieldId " +
            "AND tfc.contractCategory.id = :categoryId " +
            "AND tfc.mongoClauseId IS NOT NULL")
    List<String> findMongoClauseIdsByFieldIdAndCategoryId(
            @Param("fieldId") Integer fieldId,
            @Param("categoryId") Integer categoryId);

    // 여러 필드 ID와 카테고리 ID로 MongoDB ID 목록 조회
    @Query("SELECT DISTINCT tfc.mongoClauseId FROM TemplateFieldCategory tfc " +
            "WHERE tfc.templateField.id IN :fieldIds " +
            "AND tfc.contractCategory.id = :categoryId " +
            "AND tfc.mongoClauseId IS NOT NULL")
    List<String> findMongoClauseIdsByFieldIdsAndCategoryId(
            @Param("fieldIds") List<Integer> fieldIds,
            @Param("categoryId") Integer categoryId);
}