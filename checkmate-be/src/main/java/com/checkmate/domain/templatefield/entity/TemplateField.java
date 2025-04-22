package com.checkmate.domain.templatefield.entity;

import com.checkmate.domain.section.entity.Section;
import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = false;

    @Column(name = "sequence_no", nullable = false)
    private Integer sequenceNo;


}
