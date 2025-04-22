package com.checkmate.domain.template.repository;

import com.checkmate.domain.template.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TemplateRepository extends JpaRepository<Template, Integer> {
}
