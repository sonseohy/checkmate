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
import com.checkmate.global.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final TokenService tokenService;
    private final EncryptionUtil encryptionUtil;

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
     * 전화번호 필드는 복호화하여 제공합니다.
     * </p>
     *
     * @param userId 사용자 ID
     * @return 사용자 조회 응답 DTO
     */
    public UserGetResponse getUser(int userId) {
        User user = findUserById(userId);

        // 일반적인 매핑 먼저 수행
        UserGetResponse response = userMapper.mapToUserGetResponse(user);

        // 복호화된 전화번호로 새 응답 객체 생성
        return new UserGetResponse(
                response.userId(),
                response.name(),
                response.birth(),
                response.email(),
                decryptPhoneIfNeeded(response.phone())
        );
    }

    /**
     * 사용자 정보를 수정합니다.
     *
     * <p>
     * 이 메서드는 사용자 정보를 수정하며, 주어진 요청 DTO를 기반으로 사용자의 프로필을 업데이트합니다.
     * 업데이트된 필드만 응답에 포함됩니다.
     * </p>
     *
     * @param userId 사용자 ID
     * @param userUpdateRequest 사용자 수정 요청 DTO
     * @return 수정된 사용자 정보 응답 DTO
     */
    public UserUpdateResponse updateUser(int userId, UserUpdateRequest userUpdateRequest) {
        User user = findUserById(userId);

        // 업데이트된 필드를 추적하기 위한 맵
        Map<String, Object> updatedFields = new HashMap<>();

        // 변경된 필드만 맵에 추가
        if (userUpdateRequest.birth() != null && !userUpdateRequest.birth().equals(user.getBirth())) {
            updatedFields.put("birth", userUpdateRequest.birth());
        }

        if (userUpdateRequest.phone() != null) {
            String decryptedCurrentPhone = decryptPhoneIfNeeded(user.getPhone());
            if (!userUpdateRequest.phone().equals(decryptedCurrentPhone)) {
                // 전화번호가 변경되었으면 맵에 추가 (복호화된 값으로)
                updatedFields.put("phone", userUpdateRequest.phone());
            }
        }

        // 여기에 다른 필드들도 필요에 따라 추가

        // 실제 사용자 엔티티 업데이트
        userMapper.updateUserFromRequest(userUpdateRequest, user);

        // 수정된 필드만 포함하는 응답 생성
        return new UserUpdateResponse(updatedFields);
    }

    /**
     * 전화번호가 암호화되어 있는 경우 복호화합니다.
     *
     * @param phoneNumber 전화번호 (암호화되었을 수 있음)
     * @return 복호화된 전화번호
     */
    private String decryptPhoneIfNeeded(String phoneNumber) {
        if (phoneNumber == null) {
            return null;
        }

        try {
           if (isEncrypted(phoneNumber)) {
                return encryptionUtil.decrypt(phoneNumber);
            }
            return phoneNumber;
        } catch (Exception e) {
            log.error("Error decrypting phone number: {}", e.getMessage());
            return phoneNumber;
        }
    }

    /**
     * 주어진 텍스트가 암호화되어 있는지 확인합니다.
     * Spring Security의 TextEncryptor는 16진수 문자로 된 암호화 형식을 사용합니다.
     *
     * @param text 확인할 텍스트
     * @return 암호화되어 있으면 true, 아니면 false
     */
    private boolean isEncrypted(String text) {

        return text.matches("^[0-9a-f]+$") && text.length() > 16;
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