package com.checkmate.domain.missingclausereport.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
