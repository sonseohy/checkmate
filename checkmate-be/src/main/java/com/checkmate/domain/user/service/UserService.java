package com.checkmate.domain.user.service;

import com.checkmate.domain.auth.service.TokenService;
import com.checkmate.domain.user.dto.CustomUserDetails;
import com.checkmate.domain.user.dto.mapper.UserMapper;
import com.checkmate.domain.user.dto.request.UserUpdateRequest;
import com.checkmate.domain.user.dto.response.UserGetResponse;
import com.checkmate.domain.user.dto.response.UserUpdateResponse;
import com.checkmate.domain.user.entity.User;
import com.checkmate.domain.user.repository.UserRepository;
import com.checkmate.global.common.exception.CustomException;
import com.checkmate.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final TokenService tokenService;

    /**
     * 사용자 ID를 기반으로 {@link UserDetails}를 반환합니다. Spring Security 인증 과정에 사용됩니다.
     *
     * <p>
     * 이 메서드는 사용자의 ID를 기준으로 {@link UserDetails} 객체를 반환하며, 인증 및 권한 처리를 위해 사용됩니다.
     * </p>
     *
     * @param userId 사용자 ID (String)
     * @return 사용자 인증 정보 객체
     * @throws UsernameNotFoundException 사용자를 찾을 수 없는 경우 예외 발생
     */
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findById(Integer.valueOf(userId))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with userId: " + userId));

        return new CustomUserDetails(user.getUserId());
    }

    /**
     * 사용자 ID로 사용자 정보를 조회합니다.
     *
     * <p>
     * 이 메서드는 주어진 사용자 ID를 기반으로 사용자 정보를 조회하고, 사용자가 존재하지 않으면 예외를 발생시킵니다.
     * </p>
     *
     * @param userId 사용자 ID
     * @return 사용자 엔티티
     * @throws CustomException USER_NOT_FOUND 예외
     */
    @Transactional(readOnly = true)
    public User findUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * 사용자 ID를 기반으로 사용자 프로필 정보를 조회합니다.
     *
     * <p>
     * 이 메서드는 사용자 ID를 기반으로 사용자 프로필 정보를 조회하여 응답 DTO를 반환합니다.
     * </p>
     *
     * @param userId 사용자 ID
     * @return 사용자 조회 응답 DTO
     */
    public UserGetResponse getUser(int userId) {
        User user = findUserById(userId);

        return userMapper.mapToUserGetResponse(user);
    }

    /**
     * 사용자 정보를 수정합니다.
     *
     * <p>
     * 이 메서드는 사용자 정보를 수정하며, 주어진 요청 DTO를 기반으로 사용자의 프로필을 업데이트합니다.
     * </p>
     *
     * @param userId 사용자 ID
     * @param userUpdateRequest 사용자 수정 요청 DTO
     * @return 수정된 사용자 정보 응답 DTO
     */
    public UserUpdateResponse updateUser(int userId, UserUpdateRequest userUpdateRequest) {
        User user = findUserById(userId);

        userMapper.updateUserFromRequest(userUpdateRequest, user);

        return userMapper.mapToUserUpdateResponse(user);
    }

    /**
     * 사용자 계정을 탈퇴 처리합니다.
     * 소프트 삭제 방식으로 계정 정보를 보존하면서 삭제 처리합니다.
     *
     * @param userId 사용자 ID
     */
    public void deleteUser(int userId) {
        User user = findUserById(userId);
        user.softDelete(); // User 엔티티에 추가한 softDelete 메서드 호출
        userRepository.save(user); // 변경사항 저장

        // 토큰 삭제하여 로그아웃 처리
        tokenService.deleteRefreshToken(userId);
    }
}
