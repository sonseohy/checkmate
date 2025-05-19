package com.checkmate.domain.contractcategory.repository;

import com.checkmate.domain.contractcategory.entity.ContractCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContractCategoryRepository extends JpaRepository<ContractCategory, Integer> {

    /**
     * 부모 카테고리 ID로 하위 카테고리 조회
     * 특정 부모 카테고리 하위의 모든 카테고리를 이름 오름차순으로 정렬하여 반환
     *
     * @param parentId 부모 카테고리 ID
     * @return 해당 부모 카테고리 하위의 카테고리 목록
     */
    List<ContractCategory> findAllByParent_IdOrderByNameAsc(Integer parentId);

    /**
     * 최상위 카테고리 조회
     * 부모 카테고리가 없는 모든 최상위 카테고리 조회
     *
     * @return 부모 카테고리가 없는 최상위 카테고리 목록
     */
    List<ContractCategory> findAllByParentIsNull();
}
