package com.checkmate.domain.courthouse.dto.response;

import com.checkmate.domain.courthouse.entity.Courthouse;

import lombok.Builder;

@Builder
public record CourthouseResponseDto (int courthouseId, String courthouseName, String courthouseAddress,
									 String courthousePhoneNumber, double longitude, double latitude) {
	public static CourthouseResponseDto fromEntity(Courthouse courthouse) {
		return new CourthouseResponseDto(
			courthouse.getCourthouseId(),
			courthouse.getCourthouseName(),
			courthouse.getCourthouseAddress(),
			courthouse.getCourthousePhoneNumber(),
			courthouse.getLocation().getX(),
			courthouse.getLocation().getY()
		);
	}
}
