package com.checkmate.domain.summaryreport.repository;

import com.checkmate.domain.summaryreport.entity.SummaryReport;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SummaryReportRepository extends MongoRepository<SummaryReport, ObjectId> {

    /**
     * AI 분석 보고서 ID로 최신 요약 정보 조회
     * 생성 시간 기준 내림차순으로 정렬하여 첫 번째 항목 반환
     *
     * @param id AI 분석 보고서 ID
     * @return 해당 분석 보고서의 최신 요약 정보
     */
    Optional<SummaryReport> findFirstByAiAnalysisReportIdOrderByCreatedAtDesc(ObjectId id);
}
