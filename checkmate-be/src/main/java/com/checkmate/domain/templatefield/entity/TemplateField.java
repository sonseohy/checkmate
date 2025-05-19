package com.checkmate.domain.templatefield.entity;

import com.checkmate.domain.section.entity.Section;
import com.checkmate.domain.templatefieldcategory.entity.TemplateFieldCategory;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "template_field")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TemplateField {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @Column(name = "field_key", length = 50, nullable = false)
    private String fieldKey;

    @Column(name = "label", length = 100, nullable = false)
    private String label;

    @Enumerated(EnumType.STRING)
    @Column(name = "input_type", length = 20, nullable = false)
    private InputType inputType;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = false;

    @Column(name = "sequence_no", nullable = false)
    private Integer sequenceNo;

    @Lob
    @Column(name = "options", columnDefinition = "TEXT")
    private String options;

    @Column(name = "depends_on", length = 100)
    private String dependsOn;

    @OneToMany(mappedBy = "templateField", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TemplateFieldCategory> categoryMappings = new ArrayList<>();
}