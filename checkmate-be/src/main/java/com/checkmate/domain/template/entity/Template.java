package com.checkmate.domain.template.entity;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
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
}
