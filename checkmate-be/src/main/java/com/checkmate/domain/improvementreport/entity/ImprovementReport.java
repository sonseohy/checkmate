package com.checkmate.domain.improvementreport.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Document("improvement_report")
public class ImprovementReport {

    @Id
    private String improvementReportId;

    private String aiAnalysisReportId;

    private String description;
}
