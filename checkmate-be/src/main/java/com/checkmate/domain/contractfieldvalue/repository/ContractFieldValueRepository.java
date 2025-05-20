package com.checkmate.domain.contractfieldvalue.repository;

import com.checkmate.domain.contractfieldvalue.entity.ContractFieldValue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContractFieldValueRepository extends JpaRepository<ContractFieldValue, Integer> {

    /**
     * 계약서 ID와 필드 ID로 필드값 조회
     * 특정 계약서의 특정 필드에 해당하는 값 조회
     *
     * @param contractId 계약서 ID
     * @param fieldId 필드 ID
     * @return 해당 조건에 맞는 필드값
     */
    Optional<ContractFieldValue> findByContractIdAndFieldId(Integer contractId, Integer fieldId);

    /**
     * 계약서 ID로, 해당 계약서의 모든 필드값 조회
     *
     * @param contractId 계약서 ID
     * @return 해당 계약서의 모든 필드값 목록
     */
    List<ContractFieldValue> findByContractId(Integer contractId);
}