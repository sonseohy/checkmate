package com.checkmate.domain.aianalysisreport.repository;

import java.util.Optional;

import com.checkmate.domain.aianalysisreport.entity.AiAnalysisReport;
import com.checkmate.domain.aianalysisreport.entity.CompleteAiAnalysisReport;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiAnalysisReportRepository extends MongoRepository<AiAnalysisReport, String> {
	@Aggregation(pipeline = {
		"{ $match: { 'contractId': ?0 } }",
		"{ $lookup: { from: 'improvement_report', localField: 'aiAnalysisReportId', foreignField: 'aiAnalysisReportId', as: 'improvements' } }",
		"{ $lookup: { from: 'missing_clause_report', localField: 'aiAnalysisReportId', foreignField: 'aiAnalysisReportId', as: 'missingClauses' } }",
		"{ $lookup: { from: 'risk_clause_report', localField: 'aiAnalysisReportId', foreignField: 'aiAnalysisReportId', as: 'riskClauses' } }"
	})
	Optional<CompleteAiAnalysisReport> getCompleteReportByContractId(Integer contractId);
}
