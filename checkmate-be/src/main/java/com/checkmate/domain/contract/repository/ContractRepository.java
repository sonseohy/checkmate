package com.checkmate.domain.contract.repository;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.entity.EditStatus;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
    List<Contract> findAllByUser(User user);

    // 사용자, 카테고리, 편집 상태로 계약서 조회
    Optional<Contract> findByUserAndCategoryAndEditStatus(User user, ContractCategory category, EditStatus editStatus);

    Optional<Contract> findBySignatureRequestId(String signatureRequestId);
}
