package com.checkmate.domain.contractfieldvalue.entity;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.templatefield.entity.TemplateField;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contract_field_value")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ContractFieldValue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    private TemplateField field;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Lob
    @Column(name = "value", columnDefinition = "TEXT")
    private String value;

}
