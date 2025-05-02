package com.checkmate.domain.riskclausereport.entity;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Document(collection = "risk_clause_report")
public class RiskClauseReport {

    @Id
    private String riskClauseReportId;

    @Indexed
    private String  aiAnalysisReportId;

    private Integer riskLevel;

    private String originalText;

    private String description;

    private LocalDateTime createdAt;

}
