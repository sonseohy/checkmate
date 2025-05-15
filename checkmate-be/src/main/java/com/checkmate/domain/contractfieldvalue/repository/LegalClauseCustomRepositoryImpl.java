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
    public List<LegalClause> findByFieldIdsAndCategoryId(List<Integer> fieldIds, Integer categoryId) {
        if (fieldIds == null || fieldIds.isEmpty() || categoryId == null) {
            return Collections.emptyList();
        }

        log.debug("MongoDB 쿼리 실행 - fieldIds: {}, categoryId: {}", fieldIds, categoryId);

        Query query = new Query();

        // isActive가 true이고 categoryIds 배열에 categoryId가 포함된 문서 중에서
        Criteria criteria = Criteria.where("isActive").is(true)
                .and("categoryIds").in(categoryId);

        // targetFields 배열에 fieldIds 중 적어도 하나가 포함된 문서 검색
        criteria.and("targetFields").in(fieldIds);

        query.addCriteria(criteria);
        query.with(Sort.by(Sort.Direction.ASC, "displayOrder"));

        List<LegalClause> results = mongoTemplate.find(query, LegalClause.class);
        log.debug("MongoDB 쿼리 결과 수: {}", results.size());

        return results;
    }

    // 단일 필드 ID로 법조항 검색 메서드
    public List<LegalClause> findByFieldIdAndCategoryId(Integer fieldId, Integer categoryId) {
        if (fieldId == null || categoryId == null) {
            return Collections.emptyList();
        }

        Query query = new Query(Criteria.where("isActive").is(true)
                .and("categoryIds").in(categoryId)
                .and("targetFields").is(fieldId));

        query.with(Sort.by(Sort.Direction.ASC, "displayOrder"));

        return mongoTemplate.find(query, LegalClause.class);
    }

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

    // 추가: 그룹 ID와 카테고리 ID로 법조항 검색
    @Override
    public List<LegalClause> findByGroupIdAndCategoryId(String groupId, Integer categoryId) {
        if (groupId == null || categoryId == null) {
            return Collections.emptyList();
        }

        log.debug("MongoDB 쿼리 실행 - 그룹 ID: {}, 카테고리 ID: {}", groupId, categoryId);

        Query query = new Query(Criteria.where("isActive").is(true)
                .and("categoryIds").in(categoryId)
                .and("groupId").is(groupId));

        query.with(Sort.by(Sort.Direction.ASC, "displayOrder"));

        List<LegalClause> results = mongoTemplate.find(query, LegalClause.class);
        log.debug("그룹 ID와 카테고리 ID로 조회된 법조항 수: {}", results.size());

        return results;
    }
}