package com.checkmate.domain.template.repository;

import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.template.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TemplateRepository extends JpaRepository<Template, Integer> {
    Optional<Template> findTopByCategoryOrderByVersionDesc(ContractCategory category);
}