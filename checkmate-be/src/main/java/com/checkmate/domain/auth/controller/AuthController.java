package com.checkmate.domain.auth.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.checkmate.domain.auth.dto.TokenPair;
import com.checkmate.domain.auth.dto.request.KakaoLoginRequest;
import com.checkmate.domain.auth.dto.request.RefreshTokenRequest;
import com.checkmate.domain.auth.dto.response.KakaoLoginResponse;
import com.checkmate.domain.auth.service.AuthService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.global.common.response.ApiResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth API", description = "회원 인증 API")
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
    @Operation(summary = "카카오 로그인 처리 및 회원가입", description = "카카오 로그인을 처리하거나 회원가입을 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "카카오 로그인 처리 및 회원가입 성공"),
    })
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
     * @param userDetails 현재 로그인한 사용자 정보
     * @return HTTP 204 No Content 응답을 포함한 {@link ApiResult} 객체
     */
    @Operation(summary = "인증된 사용자의 로그아웃 처리", description = "인증된 사용자의 로그아웃을 처리합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "인증된 사용자의 로그아웃 처리 성공"),
    })
    @PostMapping("/logout")
    public ApiResult<?> logout(
        @Parameter(description = "현재 로그인한 사용자 정보", required = true)
        @AuthenticationPrincipal CustomUserDetails userDetails) {
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
    @Operation(summary = "리프레시 토큰을 이용해 새로운 액세스 토큰 발급", description = "리프레시 토큰을 이용해 새로운 액세스 토큰을 발급합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "리프레시 토큰을 이용해 새로운 액세스 토큰 발급 성공"),
    })
    @PostMapping("/reissue-token")
    public ApiResult<?> refreshAccessToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        TokenPair refreshTokenResponse = authService.refreshAccessToken(refreshTokenRequest);
        return ApiResult.ok(refreshTokenResponse);
    }
}
