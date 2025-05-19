package com.checkmate.domain.contractfieldvalue.repository;

import com.checkmate.domain.contractfieldvalue.entity.LegalClause;
import java.util.List;

public interface LegalClauseCustomRepository {

    /**
     * 카테고리 ID로 법조항 검색
     * 특정 카테고리에 적용 가능한 모든 법조항을 검색
     *
     * @param categoryId 계약서 카테고리 ID
     * @return 해당 카테고리에 적용 가능한 법조항 목록
     */
    List<LegalClause> findByCategoryId(Integer categoryId);

}