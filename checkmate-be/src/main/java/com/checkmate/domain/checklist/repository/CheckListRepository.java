package com.checkmate.domain.checklist.repository;

import java.util.List;

import com.checkmate.domain.checklist.entity.CheckList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckListRepository extends JpaRepository<CheckList, Integer> {
	List<CheckList> findAllByCategoryId(int categoryId);
}
