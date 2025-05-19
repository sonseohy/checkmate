package com.checkmate.domain.contractfieldvalue.repository;

import com.checkmate.domain.contractfieldvalue.entity.LegalClause;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

@Repository
@RequiredArgsConstructor
@Slf4j
public class LegalClauseCustomRepositoryImpl implements LegalClauseCustomRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public List<LegalClause> findByCategoryId(Integer categoryId) {
        if (categoryId == null) {
            return Collections.emptyList();
        }

        log.debug("MongoDB 쿼리 실행 - 카테고리 ID: {}", categoryId);

        Query query = new Query(Criteria.where("isActive").is(true)
                .and("categoryIds").in(categoryId));

        query.with(Sort.by(Sort.Direction.ASC, "displayOrder"));

        List<LegalClause> results = mongoTemplate.find(query, LegalClause.class);
        log.debug("카테고리 ID로 조회된 법조항 수: {}", results.size());

        return results;
    }
}