package com.checkmate.domain.aianalysisreport.repository;

import com.checkmate.domain.aianalysisreport.entity.AiAnalysisReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiAnalysisReportRepository extends MongoRepository<AiAnalysisReport, String> {
}
