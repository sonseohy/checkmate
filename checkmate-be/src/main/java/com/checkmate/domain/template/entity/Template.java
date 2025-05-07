package com.checkmate.domain.template.entity;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.section.entity.Section;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "template")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
    @OrderBy("sequenceNo ASC")
    private List<Section> sections = new ArrayList<>();

    @OneToMany(mappedBy = "template",
            fetch = FetchType.LAZY)
    private List<Contract> contracts = new ArrayList<>();

    @Builder
    public Template(Integer id, ContractCategory category, String name, Integer version) {
        this.id = id;
        this.category = category;
        this.name = name;
        this.version = version;
    }

    // 섹션 추가 메소드
    public void addSection(Section section) {
        this.sections.add(section);
        section.setTemplate(this);
    }

    // 섹션 제거 메소드
    public void removeSection(Section section) {
        this.sections.remove(section);
        section.setTemplate(null);
    }
}
