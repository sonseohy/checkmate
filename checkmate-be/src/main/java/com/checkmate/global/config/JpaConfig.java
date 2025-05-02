package com.checkmate.global.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.checkmate.domain.aianalysisreport.repository.AiAnalysisReportRepository;
import com.checkmate.domain.riskclausereport.repository.RiskClauseReportRepository;

@Configuration
@EnableJpaAuditing
@EnableJpaRepositories(
	basePackages = "com.checkmate.domain",
	excludeFilters = @ComponentScan.Filter(
		type = FilterType.ASSIGNABLE_TYPE,
		classes = {AiAnalysisReportRepository.class,
			RiskClauseReportRepository.class,}
	)
)
public class JpaConfig {
}