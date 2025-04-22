package com.checkmate.domain.section.entity;

import com.checkmate.domain.template.entity.Template;
import com.checkmate.domain.templatefield.entity.TemplateField;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "section")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @Column(name = "name", length = 30, nullable = false)
    private String name;

    @Column(name = "sequence_no", nullable = false)
    private Integer sequenceNo;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = true;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TemplateField> fields = new ArrayList<>();

    public void addField(TemplateField field) {
        fields.add(field);
        field.setSection(this);
    }

    public void removeField(TemplateField field) {
        fields.remove(field);
        field.setSection(null);
    }

}
