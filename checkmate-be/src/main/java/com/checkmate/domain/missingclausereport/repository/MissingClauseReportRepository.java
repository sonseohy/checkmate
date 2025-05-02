package com.checkmate.domain.missingclausereport.repository;

import java.util.List;

import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MissingClauseReportRepository extends MongoRepository<MissingClauseReport, String> {
	List<MissingClauseReport> findAllByAiAnalysisReportId(String aiAnalysisId);
}
