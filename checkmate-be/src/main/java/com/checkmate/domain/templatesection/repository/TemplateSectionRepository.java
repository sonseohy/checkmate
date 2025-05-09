package com.checkmate.domain.templatesection.repository;

import com.checkmate.domain.templatesection.entity.TemplateSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TemplateSectionRepository extends JpaRepository<TemplateSection, Integer> {

    List<TemplateSection> findByTemplateIdOrderByTemplateSectionNoAsc(Integer templateId);

    void deleteByTemplateIdAndSectionId(Integer templatedId, Integer sectionId);
}