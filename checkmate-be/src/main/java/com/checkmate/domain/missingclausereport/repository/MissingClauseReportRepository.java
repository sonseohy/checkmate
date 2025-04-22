package com.checkmate.domain.missingclausereport.repository;

import com.checkmate.domain.missingclausereport.entity.MissingClauseReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MissingClauseReportRepository extends JpaRepository<MissingClauseReport, Integer> {
}
