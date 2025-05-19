package com.checkmate.domain.clause.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.checkmate.domain.clause.entity.Clause;

public interface ClauseRepository extends JpaRepository<Clause, Integer> {
	List<Clause> findAllByContract_Id(Integer contractId);
}
