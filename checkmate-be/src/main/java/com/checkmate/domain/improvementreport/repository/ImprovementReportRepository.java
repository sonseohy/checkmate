package com.checkmate.domain.improvementreport.repository;

import java.util.List;

import com.checkmate.domain.improvementreport.entity.ImprovementReport;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImprovementReportRepository extends MongoRepository<ImprovementReport, ObjectId> {
	List<ImprovementReport> findAllByAiAnalysisReportId(ObjectId aiAnalysisReportId);
}
