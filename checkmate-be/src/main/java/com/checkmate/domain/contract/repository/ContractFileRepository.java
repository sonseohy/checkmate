package com.checkmate.domain.contract.repository;

import com.checkmate.domain.contract.entity.ContractFile;
import com.checkmate.domain.contract.entity.FileCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContractFileRepository extends JpaRepository<ContractFile, Integer> {
    Optional<ContractFile> findByContractIdAndFileCategory(Integer contractId,
                                                            FileCategory fileCategory);
}
