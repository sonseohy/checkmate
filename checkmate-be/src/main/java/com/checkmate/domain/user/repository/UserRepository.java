package com.checkmate.domain.user.repository;

import com.checkmate.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    /**
     * OAuth providerId를 기반으로 사용자를 조회합니다.
     *
     * @param providerId 소셜 로그인 provider ID (예: Kakao, Apple 등)
     * @return 해당 providerId를 가진 사용자 정보 (Optional)
     */
    Optional<User> findByProviderId(String providerId);
}
