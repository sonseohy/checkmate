package com.checkmate.domain.user.repository;

import com.checkmate.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.checkmate.domain.user.entity.Status;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
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

    /**
     * 상태(ACTIVE/DELETED)를 기준으로 사용자를 조회하고, 삭제된 경우 삭제 일시 기준 내림차순으로 정렬합니다.
     *
     * @param status 조회할 사용자 상태
     * @return 해당 상태의 사용자 목록
     */
    List<User> findByStatusOrderByDeletedAtDesc(Status status);

    /**
     * 활성 상태(삭제되지 않은)의 사용자만 조회합니다.
     *
     * @return 활성 상태의 사용자 목록
     */
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL")
    List<User> findAllActive();

    /**
     * 사용자가 최근 30일 이내에 삭제됐는지 확인합니다.
     *
     * @param userId 사용자 ID
     * @return 30일 이내 삭제된 사용자가 있으면 true, 없으면 false
     */
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.userId = :userId AND u.deletedAt IS NOT NULL AND u.deletedAt > DATEADD(DAY, -30, CURRENT_TIMESTAMP)")
    boolean isUserDeletedWithin30Days(Integer userId);

}
