package com.checkmate.domain.contractcategory.repository;

import com.checkmate.domain.contractcategory.entity.ContractCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContractCategoryRepository extends JpaRepository<ContractCategory, Integer> {

    List<ContractCategory> findAllByParent_IdOrderByNameAsc(Integer parentId);
    List<ContractCategory> findAllByParentIsNull();
}
