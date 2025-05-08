package com.checkmate.domain.user.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.util.Map;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record UserUpdateResponse(
        Map<String, Object> updated
) {
    public static UserUpdateResponse of(Map<String, Object> updatedFields) {
        return new UserUpdateResponse(updatedFields);
    }
}
