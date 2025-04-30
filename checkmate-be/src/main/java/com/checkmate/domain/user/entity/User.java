package com.checkmate.domain.user.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(nullable = false, length = 20)
    private String name;

    private LocalDate birth;

    @Column(nullable = false, length = 100)
    @Email
    private String email;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(length = 7, nullable = false)
    private Status status = Status.ACTIVE;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "DATETIME(6)")
    private LocalDateTime createdAt;

    @Column(name = "deleted_at", columnDefinition = "DATETIME(6)")
    private LocalDateTime deletedAt;

    @Column(name = "provider_id", length = 255, nullable = false, unique = true)
    private String providerId;

    /**
     * 사용자 계정을 소프트 삭제합니다.
     */
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
        this.status = Status.DELETED;  // 상태도 DELETED로 변경
    }

    /**
     * 계정 복구 가능 여부를 판단합니다.
     * 삭제된 시점으로부터 30일 이내인 경우 복구 가능으로 간주합니다.
     *
     * @return 복구 가능하면 true, 아니면 false
     */
    public boolean isRecoverable() {
        if (this.deletedAt == null) {
            return false;
        }

        LocalDateTime recoverableUntil = this.deletedAt.plusDays(30);
        return LocalDateTime.now().isBefore(recoverableUntil);
    }

    /**
     * 사용자의 계정을 복구 처리합니다.
     * 복구 가능 상태일 때 deletedAt 값을 null로 초기화합니다.
     */
    public void recover() {
        if (isRecoverable()) {
            this.deletedAt = null;
            this.status = Status.ACTIVE;
        }
    }
}
