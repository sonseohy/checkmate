package com.checkmate.domain.auth.controller;

import com.checkmate.domain.auth.dto.TokenPair;
import com.checkmate.domain.auth.dto.request.KakaoLoginRequest;
import com.checkmate.domain.auth.dto.request.RefreshTokenRequest;
import com.checkmate.domain.auth.dto.response.KakaoLoginResponse;
import com.checkmate.domain.auth.service.AuthService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.global.common.response.ApiResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    /**
     * 카카오 로그인을 처리하거나 회원가입을 진행합니다.
     *
     * <p>
     * 카카오 액세스 토큰을 기반으로 사용자를 인증하거나 신규 사용자를 등록한 후,
     * 액세스 토큰과 리프레시 토큰이 포함된 응답을 반환합니다.
     * </p>
     *
     * @param kakaoLoginRequest 카카오 로그인 요청 정보
     * @return 액세스 토큰과 리프레시 토큰이 포함된 {@link ApiResult} 객체
     */
    @PostMapping("/login")
    public ApiResult<KakaoLoginResponse> kakaoLogin(@Valid @RequestBody KakaoLoginRequest kakaoLoginRequest) {
        log.info("kakaoLoginRequest: {}", kakaoLoginRequest);
        KakaoLoginResponse kakaoLoginResponse = authService.kakaoLoginOrRegister(kakaoLoginRequest);
        return ApiResult.ok(kakaoLoginResponse);
    }

    /**
     * 인증된 사용자의 로그아웃을 처리합니다.
     *
     * <p>
     * 이 메서드는 현재 로그인한 사용자의 세션 또는 리프레시 토큰을 무효화합니다.
     * </p>
     *
     * @param userDetails 인증된 사용자 정보
     * @return HTTP 204 No Content 응답을 포함한 {@link ApiResult} 객체
     */
    @PostMapping("/logout")
    public ApiResult<?> logout(@AuthenticationPrincipal CustomUserDetails userDetails) {
        authService.logout(userDetails.getUserId());
        return ApiResult.noContent();
    }

    /**
     * 리프레시 토큰을 이용해 새로운 액세스 토큰을 발급받습니다.
     *
     * <p>
     * 유효한 리프레시 토큰을 검증한 후 새로운 액세스 토큰과 리프레시 토큰을 발급하여 반환합니다.
     * </p>
     *
     * @param refreshTokenRequest 리프레시 토큰 요청 정보
     * @return 새로운 토큰 정보가 포함된 {@link ApiResult} 객체
     */
    @PostMapping("/reissue-token")
    public ApiResult<?> refreshAccessToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        TokenPair refreshTokenResponse = authService.refreshAccessToken(refreshTokenRequest);
        return ApiResult.ok(refreshTokenResponse);
    }
}
