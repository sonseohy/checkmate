package com.checkmate.domain.checklist.dto.response;

import com.checkmate.domain.checklist.entity.CheckList;

import lombok.Builder;

@Builder
public record CheckListResponseDto (int checkListId, String title, int contractCategoryId, String checkListDetail) {
	public static CheckListResponseDto fromEntity(CheckList checkList) {
		return new CheckListResponseDto(
			checkList.getChecklistId(),
			checkList.getTitle(),
			checkList.getCategory().getId(),
			checkList.getCheckListDetail()
		);
	}
}
