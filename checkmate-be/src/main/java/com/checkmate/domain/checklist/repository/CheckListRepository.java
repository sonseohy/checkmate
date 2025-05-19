package com.checkmate.domain.checklist.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.checkmate.domain.checklist.entity.CheckList;

public interface CheckListRepository extends JpaRepository<CheckList, Integer> {
	List<CheckList> findAllByCategoryId(int categoryId);
}
