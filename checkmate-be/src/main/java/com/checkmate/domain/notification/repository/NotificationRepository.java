package com.checkmate.domain.notification.repository;

import com.checkmate.domain.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    /**
     * 사용자 ID로 모든 알림 조회
     * 생성일 기준 내림차순으로 정렬
     *
     * @param userId 사용자 ID
     * @return 사용자의 알림 목록
     */
    List<Notification> findByUserUserIdOrderByCreatedAtDesc(int userId);

    /**
     * 사용자 ID로 읽지 않은 알림 조회
     * 생성일 기준 내림차순으로 정렬
     *
     * @param userId 사용자 ID
     * @return 사용자의 읽지 않은 알림 목록
     */
    List<Notification> findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(int userId);

    /**
     * 사용자 ID로 읽지 않은 알림 개수 조회
     *
     * @param userId 사용자 ID
     * @return 사용자의 읽지 않은 알림 개수
     */
    long countByUserUserIdAndIsReadFalse(int userId);

}
