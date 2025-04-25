package com.checkmate.domain.contractclause.entity;

import com.checkmate.domain.clause.entity.Clause;
import com.checkmate.domain.contract.entity.Contract;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contract_clause")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ContractClause {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="contract_id", nullable=false)
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="clause_id", nullable=false)
    private Clause clause;

}
