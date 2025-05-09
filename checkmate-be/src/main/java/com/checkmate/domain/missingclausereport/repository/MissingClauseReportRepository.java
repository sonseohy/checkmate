package com.checkmate.domain.missingclausereport.repository;

import java.util.List;

import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MissingClauseReportRepository extends MongoRepository<MissingClauseReport, ObjectId> {
	List<MissingClauseReport> findAllByAiAnalysisReportId(ObjectId aiAnalysisId);
}
