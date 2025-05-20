package com.checkmate.domain.section.repository;

import com.checkmate.domain.section.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Integer> {

    /**
     * 템플릿 ID로 해당 템플릿의 모든 섹션 조회
     * 템플릿 섹션 순서대로 정렬하여 반환
     *
     * @param templateId 템플릿 ID
     * @return 해당 템플릿의 모든 섹션 목록 (템플릿 섹션 번호 기준 오름차순 정렬)
     */
    @Query("SELECT s FROM Section s JOIN s.templateSections ts WHERE ts.template.id = :templateId ORDER BY ts.templateSectionNo ASC")
    List<Section> findSectionsByTemplateId(@Param("templateId") Integer templateId);
}
