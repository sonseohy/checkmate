package com.checkmate.domain.checklist.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.checkmate.domain.checklist.entity.CheckList;

public interface CheckListRepository extends JpaRepository<CheckList, Integer> {
	/**
	 * 카테고리 ID로 모든 체크리스트 항목 조회
	 *
	 * @param categoryId 카테고리 ID
	 * @return 해당 카테고리에 속한 체크리스트 항목 목록
	 */
	List<CheckList> findAllByCategoryId(int categoryId);
}
