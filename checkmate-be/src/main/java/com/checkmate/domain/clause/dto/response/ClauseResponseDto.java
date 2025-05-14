package com.checkmate.domain.clause.dto.response;

import com.checkmate.domain.clause.entity.Clause;
import com.checkmate.domain.clause.entity.ClauseType;

import lombok.Builder;

@Builder
public record ClauseResponseDto(int clauseId, int contractId,
								String clauseTitle, String clauseContent,
								ClauseType clauseType, String clauseNumber) {
	public static ClauseResponseDto fromEntity(Clause clause) {
		return new ClauseResponseDto(
			clause.getClauseId(),
			clause.getContract().getId(),
			clause.getClauseTitle(),
			clause.getClauseContent(),
			clause.getClauseType(),
			clause.getClauseNumber()
		);
	}
}
