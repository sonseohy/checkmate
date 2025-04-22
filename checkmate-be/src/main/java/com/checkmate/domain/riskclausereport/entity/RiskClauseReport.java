package com.checkmate.domain.riskclausereport.entity;

import com.checkmate.domain.aianalysisreport.entity.AiAnalysisReport;
import com.checkmate.domain.clause.entity.Clause;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "risk_clause_report")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class RiskClauseReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "risk_clause_report_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_analysis_id", nullable = false)
    private AiAnalysisReport analysisReport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clause_id", nullable = false)
    private Clause clause;

    @Column(name = "risk_level", nullable = false)
    private Integer riskLevel;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

}
