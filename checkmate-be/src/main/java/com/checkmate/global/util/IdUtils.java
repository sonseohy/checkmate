package com.checkmate.global.util;

import org.bson.types.ObjectId;

import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;

public final class IdUtils {
	private IdUtils() {}

	public static ObjectId toObjectId(String hex) {
		if (!ObjectId.isValid(hex)) {
			throw new CustomException(ErrorCode.INVALID_ID_FORMAT);
		}
		return new ObjectId(hex);
	}
}
