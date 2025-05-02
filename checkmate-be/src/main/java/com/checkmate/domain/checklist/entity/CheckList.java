package com.checkmate.domain.checklist.entity;

import com.checkmate.domain.contractcategory.entity.ContractCategory;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "check_list")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Builder
public class CheckList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer checklistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_category_id", nullable = false)
    private ContractCategory category;

    @Lob
    @Column(name = "check_list_detail", nullable = false, columnDefinition = "TEXT")
    private String checkListDetail;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "DATETIME(6)")
    private LocalDateTime createdAt;
}
