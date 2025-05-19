package com.checkmate.domain.improvementreport.repository;

import java.util.List;

import com.checkmate.domain.improvementreport.entity.ImprovementReport;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImprovementReportRepository extends MongoRepository<ImprovementReport, ObjectId> {
	/**
	 * AI 분석 보고서 ID로 모든 개선 사항 조회
	 *
	 * @param aiAnalysisReportId AI 분석 보고서 ID
	 * @return 해당 분석 보고서에 포함된 모든 개선 사항 목록
	 */
	List<ImprovementReport> findAllByAiAnalysisReportId(ObjectId aiAnalysisReportId);
}
