package com.checkmate.domain.notification.repository;

import com.checkmate.domain.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserUserIdOrderByCreatedAtDesc(int userId);
    List<Notification> findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(int userId);
    long countByUserUserIdAndIsReadFalse(int userId);

}
