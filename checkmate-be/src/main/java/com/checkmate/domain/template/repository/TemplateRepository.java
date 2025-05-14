package com.checkmate.domain.template.repository;

import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.template.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TemplateRepository extends JpaRepository<Template, Integer> {
    Optional<Template> findTopByCategoryOrderByVersionDesc(ContractCategory category);
    @Query("SELECT t FROM Template t LEFT JOIN FETCH t.category WHERE t.id = :id")
    Optional<Template> findByIdWithCategory(@Param("id") Integer id);
}