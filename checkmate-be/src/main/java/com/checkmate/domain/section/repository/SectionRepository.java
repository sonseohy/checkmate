package com.checkmate.domain.section.repository;

import com.checkmate.domain.section.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SectionRepository extends JpaRepository<Section, Integer> {

    @Query("SELECT s FROM Section s JOIN s.templateSections ts WHERE ts.template.id = :templateId ORDER BY ts.templateSectionNo ASC")
    List<Section> findSectionsByTemplateId(@Param("templateId") Integer templateId);
}
