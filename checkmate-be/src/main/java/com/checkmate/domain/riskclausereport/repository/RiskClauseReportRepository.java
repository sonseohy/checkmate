package com.checkmate.domain.riskclausereport.repository;

import com.checkmate.domain.riskclausereport.entity.RiskClauseReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskClauseReportRepository extends JpaRepository<RiskClauseReport, Integer> {
}
