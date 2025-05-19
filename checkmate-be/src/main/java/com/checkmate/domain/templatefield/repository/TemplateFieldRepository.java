package com.checkmate.domain.templatefield.repository;

import com.checkmate.domain.templatefield.entity.TemplateField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TemplateFieldRepository extends JpaRepository<TemplateField, Integer> {

    /**
     * 섹션 ID 목록으로 해당 섹션들에 속한 모든 필드 조회
     * 섹션 ID 및 필드 순서로 정렬하여 반환
     *
     * @param sectionIds 섹션 ID 목록
     * @return 해당 섹션들에 속한 모든 필드 목록 (섹션 ID 및 필드 순서 기준 정렬)
     */
    @Query("SELECT tf FROM TemplateField tf WHERE tf.section.id IN :sectionIds ORDER BY tf.section.id, tf.sequenceNo")
    List<TemplateField> findFieldsBySectionIds(@Param("sectionIds") List<Integer> sectionIds);

}
