package com.checkmate.domain.contractfieldvalue.repository;

import com.checkmate.domain.contractfieldvalue.entity.LegalClause;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LegalClauseRepository extends MongoRepository<LegalClause, String>, LegalClauseCustomRepository {
}