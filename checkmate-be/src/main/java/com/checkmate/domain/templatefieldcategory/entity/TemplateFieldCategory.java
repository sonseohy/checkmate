package com.checkmate.domain.templatefieldcategory.entity;

import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.templatefield.entity.TemplateField;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "template_field_category",
        uniqueConstraints = @UniqueConstraint(columnNames = {"field_id", "category_id"}))
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TemplateFieldCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "template_field_category_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    private TemplateField templateField;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ContractCategory contractCategory;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = false;

    @Column(name = "label_override", length = 100)
    private String labelOverride;

    // 생성자
    public TemplateFieldCategory(TemplateField templateField, ContractCategory contractCategory) {
        this.templateField = templateField;
        this.contractCategory = contractCategory;
        this.isRequired = false;
    }

    // 추가 생성자
    public TemplateFieldCategory(TemplateField templateField, ContractCategory contractCategory,
                                 Boolean isRequired, String labelOverride) {
        this.templateField = templateField;
        this.contractCategory = contractCategory;
        this.isRequired = isRequired;
        this.labelOverride = labelOverride;
    }
}