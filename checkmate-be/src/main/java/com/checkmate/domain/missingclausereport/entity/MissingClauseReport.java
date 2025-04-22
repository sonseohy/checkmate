package com.checkmate.domain.missingclausereport.entity;

import com.checkmate.domain.aianalysisreport.entity.AiAnalysisReport;
import com.checkmate.domain.clause.entity.Clause;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "missing_clause_report")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MissingClauseReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "missing_clause_report_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_analysis_id", nullable = false)
    private AiAnalysisReport analysisReport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clause_id", nullable = false)
    private Clause clause;

    @Enumerated(EnumType.STRING)
    @Column(name = "importance", length = 6, nullable = false)
    private Importance importance;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

}
