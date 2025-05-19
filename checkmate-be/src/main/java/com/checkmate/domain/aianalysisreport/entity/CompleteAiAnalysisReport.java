package com.checkmate.domain.aianalysisreport.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.checkmate.domain.improvementreport.entity.ImprovementReport;
import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;
import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;

import jakarta.persistence.EntityListeners;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class CompleteAiAnalysisReport {

	@Id
	private ObjectId id;

	private Integer contractId;

	private String categoryName;

	@CreatedDate
	private LocalDateTime createdAt;

	// 집계 파이프라인으로 채워질 필드들
	private List<ImprovementReport> improvements;

	private List<MissingClauseReport> missingClauses;

	private List<RiskClauseReport> riskClauses;

	private List<Document> summaries;
}
