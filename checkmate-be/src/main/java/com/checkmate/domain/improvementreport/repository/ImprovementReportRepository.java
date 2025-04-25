package com.checkmate.domain.improvementreport.repository;

import com.checkmate.domain.improvementreport.entity.ImprovementReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImprovementReportRepository extends JpaRepository<ImprovementReport, Integer> {
}
