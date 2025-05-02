package com.checkmate.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = {
	"com.checkmate.domain.riskclausereport.repository",
	"com.checkmate.domain.aianalysisreport.repository"
})
public class MongoConfig {
}
