package com.checkmate.domain.templatesection.entity;

import com.checkmate.domain.section.entity.Section;
import com.checkmate.domain.template.entity.Template;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "template_section")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TemplateSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @Column(name = "template_section_no", nullable = false)
    private Integer templateSectionNo;

    @Column(name = "is_required_in_template", nullable = false)
    private Boolean isRequiredInTemplate = true;

    public TemplateSection(Template template, Section section, Integer templateSectionNo) {
        this.template = template;
        this.section = section;
        this.templateSectionNo = templateSectionNo;
        this.isRequiredInTemplate = true;
    }
}