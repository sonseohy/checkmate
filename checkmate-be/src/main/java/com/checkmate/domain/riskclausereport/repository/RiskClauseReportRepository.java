package com.checkmate.domain.riskclausereport.repository;

import java.util.List;

import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RiskClauseReportRepository extends MongoRepository<RiskClauseReport, ObjectId> {
	/**
	 * AI 분석 보고서 ID로 모든 위험 조항 조회
	 *
	 * @param aiAnalysisReportId AI 분석 보고서 ID
	 * @return 해당 분석 보고서에 포함된 모든 위험 조항 목록
	 */
	List<RiskClauseReport> findAllByAiAnalysisReportId(ObjectId aiAnalysisReportId);
}
