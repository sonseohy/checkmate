package com.checkmate.domain.improvementreport.entity;

import com.checkmate.domain.aianalysisreport.entity.AiAnalysisReport;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "improvement_report")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ImprovementReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_analysis_id", nullable = false)
    private AiAnalysisReport analysisReport;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;
}
