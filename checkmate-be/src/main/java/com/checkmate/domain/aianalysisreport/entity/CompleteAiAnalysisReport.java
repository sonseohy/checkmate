package com.checkmate.domain.aianalysisreport.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;

import com.checkmate.domain.improvementreport.entity.ImprovementReport;
import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;
import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CompleteAiAnalysisReport {

	@Id
	private String aiAnalysisReportId;

	private Integer contractId;

	private LocalDateTime createdAt;

	// 집계 파이프라인으로 채워질 필드들
	private List<ImprovementReport> improvements;

	private List<MissingClauseReport> missingClauses;

	private List<RiskClauseReport> riskClauses;
}
