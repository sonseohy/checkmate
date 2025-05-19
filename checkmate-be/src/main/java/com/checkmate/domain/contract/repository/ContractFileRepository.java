package com.checkmate.domain.contract.repository;

import com.checkmate.domain.contract.entity.ContractFile;
import com.checkmate.domain.contract.entity.FileCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContractFileRepository extends JpaRepository<ContractFile, Integer> {
    /**
     * 계약서 ID와 파일 카테고리로 파일 조회
     * 원본 파일, 뷰어용 파일 등 특정 카테고리의 파일을 조회
     *
     * @param contractId 계약서 ID
     * @param fileCategory 파일 카테고리 (ORIGINAL, VIEWER 등)
     * @return 해당 조건에 맞는 계약서 파일
     */
    Optional<ContractFile> findByContractIdAndFileCategory(Integer contractId,
                                                            FileCategory fileCategory);
}
