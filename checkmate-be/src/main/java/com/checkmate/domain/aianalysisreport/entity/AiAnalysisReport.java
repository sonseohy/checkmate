package com.checkmate.domain.aianalysisreport.entity;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.improvementreport.entity.ImprovementReport;
import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;
import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Builder
@Document(collection = "ai_analysis_report")
public class AiAnalysisReport {

    @Id
    private String aiAnalysisReportId;

    @Indexed
    private String contractId;

    private LocalDateTime analysisDate;

    private List<ImprovementReport> improvements;

    private List<MissingClauseReport> missingClauses;

    private List<RiskClauseReport> riskClauses;
}
