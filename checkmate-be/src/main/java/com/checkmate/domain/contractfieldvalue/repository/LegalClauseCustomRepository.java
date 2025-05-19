package com.checkmate.domain.contractfieldvalue.repository;

import com.checkmate.domain.contractfieldvalue.entity.LegalClause;
import java.util.List;

public interface LegalClauseCustomRepository {
    // 카테고리 ID로 모든 법조항 검색
    List<LegalClause> findByCategoryId(Integer categoryId);

}