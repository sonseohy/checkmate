package com.checkmate.domain.template.repository;

import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.template.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TemplateRepository extends JpaRepository<Template, Integer> {
    /**
     * 카테고리별 최신 버전 템플릿 조회
     * 특정 카테고리의 템플릿 중 버전이 가장 높은 템플릿 반환
     *
     * @param category 계약서 카테고리
     * @return 해당 카테고리의 최신 버전 템플릿
     */
    Optional<Template> findTopByCategoryOrderByVersionDesc(ContractCategory category);
}