package com.checkmate.domain.courthouse.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.checkmate.domain.courthouse.dto.response.CourthouseResponseDto;
import com.checkmate.domain.courthouse.entity.Courthouse;
import com.checkmate.domain.courthouse.repository.CourthouseRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class CourthouseService {
	private final CourthouseRepository courthouseRepository;

	/**
	 * db에 저장되어 있는 모든 법원 정보를 list로 가져오기
	 *
	 * @return 전국 법원 정보 리스트
	 */
	@Transactional(readOnly = true)
	public List<CourthouseResponseDto> getAllCourthouseInfo() {
		List<Courthouse> courthouses = courthouseRepository.findAll();
		if (courthouses.isEmpty()) {
			throw new CustomException(ErrorCode.COURTHOUSE_NOT_FOUND);
		}
		return courthouses.stream()
			.map(CourthouseResponseDto::fromEntity)
			.collect(Collectors.toList());
	}
}
