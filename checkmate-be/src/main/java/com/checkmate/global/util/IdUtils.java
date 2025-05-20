package com.checkmate.global.util;

import org.bson.types.ObjectId;

import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;

public final class IdUtils {
	private IdUtils() {}

	/**
	 * 16진수 문자열을 MongoDB ObjectId로 변환
	 * 유효하지 않은 형식이면 예외 발생
	 *
	 * @param hex 변환할 16진수 문자열
	 * @return 변환된 ObjectId 인스턴스
	 */
	public static ObjectId toObjectId(String hex) {
		if (!ObjectId.isValid(hex)) {
			throw new CustomException(ErrorCode.INVALID_ID_FORMAT);
		}
		return new ObjectId(hex);
	}
}
