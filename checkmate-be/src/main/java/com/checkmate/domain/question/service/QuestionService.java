package com.checkmate.domain.question.service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.checkmate.domain.contract.repository.ContractRepository;
import com.checkmate.domain.question.dto.response.QuestionResponseDto;
import com.checkmate.domain.question.entity.Question;
import com.checkmate.domain.question.repository.QuestionRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class QuestionService {
	private final QuestionRepository questionRepository;
	private final ContractRepository contractRepository;

	/**
	 * 각 계약서에 해당하는 질문 리스트를 데이터베이스에서 조회
	 *
 	 * @param contractId 계약서 ID
	 * @return 질문 리스트 DTO
	 */
	@Transactional(readOnly = true)
	public List<QuestionResponseDto> getQuestions(int contractId) {
		if (!contractRepository.existsById(contractId)) {
			throw new CustomException(ErrorCode.CONTRACT_NOT_FOUND);
		}
		List<Question> questions = questionRepository.findAllByContractId(contractId);
		return questions.stream()
			.map(QuestionResponseDto::fromEntity)
			.collect(Collectors.toList());
	}
}
