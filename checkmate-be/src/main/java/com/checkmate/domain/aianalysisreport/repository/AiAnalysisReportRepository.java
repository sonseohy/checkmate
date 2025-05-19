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
	@Aggregation(pipeline = {
		"{ $match: { 'contractId': ?0 } }",
		"{ $lookup: { from: 'improvement_report', localField: '_id', foreignField: 'aiAnalysisReportId', as: 'improvements' } }",
		"{ $lookup: { from: 'missing_clause_report', localField: '_id', foreignField: 'aiAnalysisReportId', as: 'missingClauses' } }",
		"{ $lookup: { from: 'risk_clause_report', localField: '_id', foreignField: 'aiAnalysisReportId', as: 'riskClauses' } }",
		"{ $lookup: { from: 'summary_report', localField: '_id', foreignField: 'aiAnalysisReportId', as: 'summaries' } }"
	})
	Optional<CompleteAiAnalysisReport> getCompleteReportByContractId(Integer contractId);

	Optional<AiAnalysisReport> findFirstByContractIdOrderByCreatedAtDesc(Integer contractId);
}
