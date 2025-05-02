package com.checkmate.domain.contract.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "contract_file")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ContractFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Column(name = "file_type", length = 10, nullable = false)
    private String fileType;

    @Column(name = "file_address", length = 255, nullable = false)
    private String fileAddress;

    @CreatedDate
    @Column(name = "upload_at", nullable = false, updatable = false, columnDefinition = "DATETIME(6)")
    private LocalDateTime uploadAt;

}
