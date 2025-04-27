package com.checkmate.domain.auth.service;

import com.checkmate.domain.auth.dto.TokenPair;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import com.checkmate.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class TokenService {

    private final RedisTemplate<String, String> redisTemplate;

    private final JwtUtil jwtUtil;

    /**
     * 사용자 ID를 기반으로 액세스 토큰과 리프레시 토큰을 생성하고 저장합니다.
     *
     * @param userId 토큰을 발급할 사용자 ID
     * @return 생성된 액세스 토큰과 리프레시 토큰을 포함한 {@link TokenPair}
     */
    public TokenPair generateTokens(int userId) {
        String accessToken = jwtUtil.generateAccessToken(userId);
        String refreshToken = jwtUtil.generateRefreshToken(userId);

        saveRefreshToken(userId, refreshToken);
        return new TokenPair(accessToken, refreshToken);
    }

    /**
     * 사용자 ID를 키로 하여 Redis에 리프레시 토큰을 저장합니다.
     *
     * <p>
     * 저장에 실패할 경우 {@link CustomException}을 발생시킵니다.
     * </p>
     *
     * @param userId 사용자 ID
     * @param refreshToken 저장할 리프레시 토큰
     */
    private void saveRefreshToken(int userId, String refreshToken) {
        try {
            redisTemplate.opsForValue().set(String.valueOf(userId), refreshToken, 30, TimeUnit.DAYS);
            log.info("Saved refresh token for user: {}", userId);
        } catch (Exception e) {
            log.error("Failed to save refresh token for user: {}", userId, e);
            throw new CustomException(ErrorCode.TOKEN_STORAGE_FAILED);
        }
    }

    /**
     * 사용자 ID에 해당하는 리프레시 토큰을 Redis에서 조회합니다.
     *
     * @param userId 사용자 ID
     * @return Redis에 저장된 리프레시 토큰
     */
    public String getRefreshToken(int userId) {
        return redisTemplate.opsForValue().get(String.valueOf(userId));
    }

    /**
     * 사용자 ID에 해당하는 리프레시 토큰을 Redis에서 삭제합니다.
     *
     * @param userId 사용자 ID
     */
    public void deleteRefreshToken(int userId) {
        redisTemplate.delete(String.valueOf(userId));
    }

    /**
     * 주어진 토큰의 유효성을 검증합니다.
     *
     * @param token 검증할 토큰
     * @return 유효하면 true, 그렇지 않으면 false
     */
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    /**
     * 리프레시 토큰에서 사용자 ID를 추출합니다.
     *
     * @param refreshToken 사용자 식별 정보를 담은 리프레시 토큰
     * @return 추출된 사용자 ID
     */
    public int getUserIdFromToken(String refreshToken) {
        return Integer.parseInt(jwtUtil.getUserIdFromToken(refreshToken));
    }
}
