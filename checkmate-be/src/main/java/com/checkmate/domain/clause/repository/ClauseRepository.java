package com.checkmate.domain.clause.repository;

import java.util.List;

import com.checkmate.domain.clause.entity.Clause;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClauseRepository extends JpaRepository<Clause, Integer> {
	List<Clause> findAllByContract_Id(Integer contractId);
}
