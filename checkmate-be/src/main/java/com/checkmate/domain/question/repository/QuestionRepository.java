package com.checkmate.domain.question.repository;

import java.util.List;

import com.checkmate.domain.question.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
	/**
	 * 계약서 ID로 모든 질문 조회
	 * 특정 계약서와 관련된 모든 질문을 조회
	 *
	 * @param contractId 계약서 ID
	 * @return 해당 계약서의 모든 질문 목록
	 */
	List<Question> findAllByContractId(int contractId);
}
