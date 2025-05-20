package com.checkmate.domain.missingclausereport.repository;

import java.util.List;

import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MissingClauseReportRepository extends MongoRepository<MissingClauseReport, ObjectId> {
	/**
	 * AI 분석 보고서 ID로 모든 누락 사항 조회
	 *
	 * @param aiAnalysisId AI 분석 보고서 ID
	 * @return 해당 분석 보고서에 포함된 모든 누락 사항 목록
	 */
	List<MissingClauseReport> findAllByAiAnalysisReportId(ObjectId aiAnalysisId);
}
