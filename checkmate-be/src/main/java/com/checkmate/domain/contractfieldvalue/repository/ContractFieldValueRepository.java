package com.checkmate.domain.contractfieldvalue.repository;

import com.checkmate.domain.contractfieldvalue.entity.ContractFieldValue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContractFieldValueRepository extends JpaRepository<ContractFieldValue, Integer> {
    // 특정 계약서와 필드에 해당하는 값 찾기
    Optional<ContractFieldValue> findByContractIdAndFieldId(Integer contractId, Integer fieldId);

    // 특정 계약서의 모든 필드값 찾기
    List<ContractFieldValue> findByContractId(Integer contractId);
}