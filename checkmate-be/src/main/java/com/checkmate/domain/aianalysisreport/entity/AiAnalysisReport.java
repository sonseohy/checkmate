package com.checkmate.domain.aianalysisreport.entity;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.improvementreport.entity.ImprovementReport;
import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;
import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "ai_analysis_report")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class AiAnalysisReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Column(name = "analysis_date", nullable = false, columnDefinition = "DATETIME(6)")
    private LocalDateTime analysisDate;

    @OneToMany(mappedBy = "analysisReport", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ImprovementReport> improvements = new ArrayList<>();

    @OneToMany(mappedBy = "analysisReport", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<MissingClauseReport> missingClauses = new ArrayList<>();

    @OneToMany(mappedBy = "analysisReport", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RiskClauseReport> riskClauses = new ArrayList<>();
}
