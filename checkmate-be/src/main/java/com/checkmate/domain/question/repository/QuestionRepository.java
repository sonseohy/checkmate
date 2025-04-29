package com.checkmate.domain.question.repository;

import java.util.List;

import com.checkmate.domain.question.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
	List<Question> findAllByContractId(int contractId);
}
