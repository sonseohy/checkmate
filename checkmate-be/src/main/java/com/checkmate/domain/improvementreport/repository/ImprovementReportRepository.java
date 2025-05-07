package com.checkmate.domain.improvementreport.repository;

import java.util.List;

import com.checkmate.domain.improvementreport.entity.ImprovementReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImprovementReportRepository extends MongoRepository<ImprovementReport, String> {
	List<ImprovementReport> findAllByAiAnalysisReportId(String aiAnalysisReportId);
}
