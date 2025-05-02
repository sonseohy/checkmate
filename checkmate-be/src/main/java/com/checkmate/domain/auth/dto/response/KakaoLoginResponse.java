package com.checkmate.domain.auth.dto.response;

import com.checkmate.domain.auth.dto.LoginResultType;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record KakaoLoginResponse(
        String accessToken,
        String refreshToken,
        Long expiresIn,
        LoginResultType resultType
) {
}
