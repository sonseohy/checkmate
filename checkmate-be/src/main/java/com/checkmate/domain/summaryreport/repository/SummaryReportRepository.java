package com.checkmate.domain.summaryreport.repository;

import com.checkmate.domain.summaryreport.entity.SummaryReport;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SummaryReportRepository extends MongoRepository<SummaryReport, ObjectId> {
    Optional<SummaryReport> findFirstByAiAnalysisReportIdOrderByCreatedAtDesc(ObjectId id);
}
