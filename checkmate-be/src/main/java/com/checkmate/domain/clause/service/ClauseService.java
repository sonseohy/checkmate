package com.checkmate.domain.clause.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.checkmate.domain.clause.dto.response.ClauseResponseDto;
import com.checkmate.domain.clause.entity.Clause;
import com.checkmate.domain.clause.repository.ClauseRepository;
import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ClauseService {
	private final ClauseRepository clauseRepository;
	private final ContractRepository contractRepository;

	/**
	 * 계약서 조항 조회
	 *
	 * @param contractId 계약서 ID
	 * @param userId 유저 ID
	 * @return 조항 리스트
	 */
	public List<ClauseResponseDto> getMyContractClauses(int contractId, int userId) {
		Contract contract = contractRepository.findById(contractId)
			.orElseThrow(() -> new CustomException(ErrorCode.CONTRACT_NOT_FOUND));

		if (!contract.getUser().getUserId().equals(userId)) {
			throw new CustomException(ErrorCode.CONTRACT_ACCESS_DENIED);
		}
		List<Clause> myClauses = clauseRepository.findAllByContract_Id(contractId);
		if (myClauses.isEmpty()) {
			throw new CustomException(ErrorCode.CLAUSE_NOT_FOUND);
		}
		return myClauses.stream()
			.map(ClauseResponseDto::fromEntity)
			.collect(Collectors.toList());

	}
}
