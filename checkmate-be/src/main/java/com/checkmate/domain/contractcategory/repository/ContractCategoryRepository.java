package com.checkmate.domain.contractcategory.repository;

import com.checkmate.domain.contractcategory.entity.ContractCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractCategoryRepository extends JpaRepository<ContractCategory, Integer> {
}
