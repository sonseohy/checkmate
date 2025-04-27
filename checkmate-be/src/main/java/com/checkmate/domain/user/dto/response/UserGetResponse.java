package com.checkmate.domain.user.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record UserGetResponse(
        Integer user_id,
        String name,
        String birth,
        String email,
        String phone,
        String created_at
) {
}
