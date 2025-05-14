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

    @Column(name = "display_name")
    private String displayName;

    public TemplateSection(Template template, Section section, Integer templateSectionNo) {
        this.template = template;
        this.section = section;
        this.templateSectionNo = templateSectionNo;
        this.isRequiredInTemplate = true;
    }

    // displayName을 포함한 생성자
    public TemplateSection(Template template, Section section, Integer templateSectionNo, String displayName) {
        this(template, section, templateSectionNo);
        this.displayName = displayName;
    }

    // 섹션 이름 표시 우선순위 메소드
    public String getDisplaySectionName() {
        // displayName이 null이거나 빈 문자열이 아니면 displayName 반환
        if (displayName != null && !displayName.trim().isEmpty()) {
            return displayName;
        }
        return section.getName();
    }
}