package com.checkmate.domain.aianalysisreport.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.checkmate.domain.aianalysisreport.entity.AiAnalysisReport;
import com.checkmate.domain.aianalysisreport.entity.CompleteAiAnalysisReport;

@Repository
public interface AiAnalysisReportRepository extends MongoRepository<AiAnalysisReport, ObjectId> {
	/**
	 * 계약서 ID로 완전한 AI 분석 리포트 조회
	 * 계약서 ID를 기반으로 분석 리포트와 관련된 개선 사항, 누락 조항, 위험 조항, 요약 정보를 함께 조회
	 *
	 * @param contractId 계약서 ID
	 * @return 완전한 AI 분석 리포트 (개선 사항, 누락 조항, 위험 조항, 요약 정보 포함)
	 */
	@Aggregation(pipeline = {
		"{ $match: { 'contractId': ?0 } }",
		"{ $lookup: { from: 'improvement_report', localField: '_id', foreignField: 'aiAnalysisReportId', as: 'improvements' } }",
		"{ $lookup: { from: 'missing_clause_report', localField: '_id', foreignField: 'aiAnalysisReportId', as: 'missingClauses' } }",
		"{ $lookup: { from: 'risk_clause_report', localField: '_id', foreignField: 'aiAnalysisReportId', as: 'riskClauses' } }",
		"{ $lookup: { from: 'summary_report', localField: '_id', foreignField: 'aiAnalysisReportId', as: 'summaries' } }"
	})
	Optional<CompleteAiAnalysisReport> getCompleteReportByContractId(Integer contractId);

	/**
	 * 계약서 ID로 최신 AI 분석 리포트 조회
	 * 생성 시간을 기준으로 내림차순 정렬하여 가장 최근에 생성된 분석 리포트를 반환
	 *
	 * @param contractId 계약서 ID
	 * @return 최신 AI 분석 리포트
	 */
	Optional<AiAnalysisReport> findFirstByContractIdOrderByCreatedAtDesc(Integer contractId);
}
