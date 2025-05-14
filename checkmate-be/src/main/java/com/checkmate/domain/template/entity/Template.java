package com.checkmate.domain.template.entity;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.section.entity.Section;
import com.checkmate.domain.templatesection.entity.TemplateSection;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "template")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ContractCategory category;

    @Column(length = 30, nullable = false)
    private String name;

    @Version
    @Column(nullable = false)
    private Integer version;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "DATETIME(6)")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TemplateSection> templateSections = new ArrayList<>();

    @OneToMany(mappedBy = "template",
            fetch = FetchType.LAZY)
    private List<Contract> contracts = new ArrayList<>();

    public Template(Integer id, ContractCategory category, String name, Integer version) {
        this.id = id;
        this.category = category;
        this.name = name;
        this.version = version;
    }

    // 섹션 추가 메소드
    // 기존 메소드 유지
    public void addSection(Section section, Integer templateSectionNo, Boolean isRequiredInTemplate) {
        // 새 메소드 호출, displayName은 null로 전달
        addSection(section, templateSectionNo, isRequiredInTemplate, null);
    }

    // 새로운 메소드 추가 (displayName 포함)
    public void addSection(Section section, Integer templateSectionNo, Boolean isRequiredInTemplate, String displayName) {
        // 기존 생성자 사용 (TemplateSection 클래스도 수정 필요)
        TemplateSection templateSection = new TemplateSection(this, section, templateSectionNo);

        // displayName 설정
        templateSection.setDisplayName(displayName);

        // isRequiredInTemplate 값이 null이 아니면 설정
        if (isRequiredInTemplate != null) {
            templateSection.setIsRequiredInTemplate(isRequiredInTemplate);
        }

        this.templateSections.add(templateSection);
    }

    // 섹션 제거 메소드
    public void removeSection(Section section) {
        this.templateSections.removeIf(ts -> ts.getSection().equals(section));
    }
}
