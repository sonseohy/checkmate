package com.checkmate.domain.section.repository;

import com.checkmate.domain.section.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SectionRepository extends JpaRepository<Section, Integer> {
}
