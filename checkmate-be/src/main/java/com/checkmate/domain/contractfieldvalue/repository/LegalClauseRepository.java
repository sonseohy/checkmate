package com.checkmate.domain.contractfieldvalue.repository;

import com.checkmate.domain.contractfieldvalue.entity.LegalClause;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface LegalClauseRepository extends MongoRepository<LegalClause, String>, LegalClauseCustomRepository {

    // 활성 상태의 모든 법조항을 표시 순서로 정렬하여 조회
    @Query("{'isActive': true}")
    List<LegalClause> findAllActiveOrderByDisplayOrder();
}