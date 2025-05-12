package com.checkmate.domain.contractfieldvalue.repository;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contractfieldvalue.entity.ContractFieldValue;
import com.checkmate.domain.templatefield.entity.TemplateField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ContractFieldValueRepository extends JpaRepository<ContractFieldValue, Integer> {
    // 특정 계약서와 필드에 해당하는 값 찾기
    Optional<ContractFieldValue> findByContractIdAndFieldId(Integer contractId, Integer fieldId);

    // 특정 계약서의 모든 필드값 찾기
    List<ContractFieldValue> findByContractId(Integer contractId);

    // 특정 섹션의 필드값 존재 여부 확인
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM ContractFieldValue c " +
            "JOIN c.field f " +
            "JOIN f.section s " +
            "WHERE c.contract.id = :contractId AND s.id = :sectionId")
    boolean existsByContractIdAndSectionId(@Param("contractId") Integer contractId,
                                           @Param("sectionId") Integer sectionId);
}