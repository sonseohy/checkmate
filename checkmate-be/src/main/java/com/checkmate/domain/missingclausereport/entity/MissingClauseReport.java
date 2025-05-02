package com.checkmate.domain.missingclausereport.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.checkmate.domain.aianalysisreport.entity.AiAnalysisReport;
import com.checkmate.domain.clause.entity.Clause;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Document("missing_clause_report")
public class MissingClauseReport {

    @Id
    private String missingClauseReportId;

    private String aiAnalysisReportId;

    private Importance importance;

    private String description;

}
