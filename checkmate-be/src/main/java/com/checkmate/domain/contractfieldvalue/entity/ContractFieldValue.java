package com.checkmate.domain.contractfieldvalue.entity;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.templatefield.entity.TemplateField;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "contract_field_value")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
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

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "DATETIME(6)")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", columnDefinition = "DATETIME(6)")
    private LocalDateTime updatedAt;

    public static ContractFieldValue create(Contract contract, TemplateField field, String value) {
        ContractFieldValue contractFieldValue = new ContractFieldValue();
        contractFieldValue.setContract(contract);
        contractFieldValue.setField(field);
        contractFieldValue.setValue(value);
        return contractFieldValue;
    }
}
