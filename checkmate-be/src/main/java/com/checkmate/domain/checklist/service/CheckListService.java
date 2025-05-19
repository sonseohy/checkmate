package com.checkmate.domain.checklist.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.checkmate.domain.checklist.dto.response.CheckListResponseDto;
import com.checkmate.domain.checklist.entity.CheckList;
import com.checkmate.domain.checklist.repository.CheckListRepository;
import com.checkmate.domain.contractcategory.repository.ContractCategoryRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckListService {
	private final ContractCategoryRepository contractCategoryRepository;
	private final CheckListRepository checkListRepository;

	/**
	 * 카테고리 별로 데이터베이스에 있는 체크 리스트를 조회
	 *
	 * @param categoryId 카테고리 ID
	 * @return checkListResponseDto -> 체크리스트ID, 카테고리 ID, 체크리스트 내용
	 */
	@Transactional(readOnly = true)
	public List<CheckListResponseDto> getCheckListByContractCategoryId(int categoryId) {
		if(!contractCategoryRepository.existsById(categoryId)) {
			throw new CustomException(ErrorCode.CATEGORY_NOT_FOUND);
		}
		List<CheckList> checkLists = checkListRepository.findAllByCategoryId(categoryId);
		return checkLists.stream()
			.map(CheckListResponseDto::fromEntity)
			.collect(Collectors.toList());

	}
}
