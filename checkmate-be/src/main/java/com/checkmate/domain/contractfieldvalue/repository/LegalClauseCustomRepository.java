package com.checkmate.domain.contractfieldvalue.repository;

import com.checkmate.domain.contractfieldvalue.entity.LegalClause;
import java.util.List;

public interface LegalClauseCustomRepository {
    // 여러 필드 ID와 카테고리 ID로 법조항 검색
    List<LegalClause> findByFieldIdsAndCategoryId(List<Integer> fieldIds, Integer categoryId);
}