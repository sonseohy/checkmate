package com.checkmate.domain.aianalysisreport.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Document(collection = "ai_analysis_report")
public class AiAnalysisReport {

    @Id
    private String aiAnalysisReportId;

    @Indexed
    private Integer contractId;

    private LocalDateTime createdAt;
}
