package com.checkmate.domain.contractfieldvalue.repository;

import com.checkmate.domain.contractfieldvalue.entity.LegalClause;
import java.util.List;

public interface LegalClauseCustomRepository {
    // 여러 필드 ID와 카테고리 ID로 법조항 검색
    List<LegalClause> findByFieldIdsAndCategoryId(List<Integer> fieldIds, Integer categoryId);

    // 카테고리 ID로 모든 법조항 검색
    List<LegalClause> findByCategoryId(Integer categoryId);

    // 그룹 ID와 카테고리 ID로 법조항 검색
    List<LegalClause> findByGroupIdAndCategoryId(String groupId, Integer categoryId);
}