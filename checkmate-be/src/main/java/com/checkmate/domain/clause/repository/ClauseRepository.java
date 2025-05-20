package com.checkmate.domain.clause.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.checkmate.domain.clause.entity.Clause;

public interface ClauseRepository extends JpaRepository<Clause, Integer> {
	/**
	 * 계약서 ID로 모든 조항 조회
	 *
	 * @param contractId 계약서 ID
	 * @return 해당 계약서에 포함된 모든 조항 목록
	 */
	List<Clause> findAllByContract_Id(Integer contractId);
}
