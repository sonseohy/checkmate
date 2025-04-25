package com.checkmate.domain.contract.repository;

import com.checkmate.domain.contract.entity.ContractFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractFileRepository extends JpaRepository<ContractFile, Integer> {
}
