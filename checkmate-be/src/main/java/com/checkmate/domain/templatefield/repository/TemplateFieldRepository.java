package com.checkmate.domain.templatefield.repository;

import com.checkmate.domain.templatefield.entity.TemplateField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TemplateFieldRepository extends JpaRepository<TemplateField, Integer> {

    @Query("SELECT tf FROM TemplateField tf WHERE tf.section.id IN :sectionIds ORDER BY tf.section.id, tf.sequenceNo")
    List<TemplateField> findFieldsBySectionIds(@Param("sectionIds") List<Integer> sectionIds);

}
