package com.checkmate.domain.riskclausereport.repository;

import java.util.List;

import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RiskClauseReportRepository extends MongoRepository<RiskClauseReport, String> {
	List<RiskClauseReport> findAllByAiAnalysisReportId(String analysisId);
}
