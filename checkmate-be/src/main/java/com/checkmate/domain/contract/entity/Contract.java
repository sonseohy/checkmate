package com.checkmate.domain.contract.entity;

import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.template.entity.Template;
import com.checkmate.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "contract")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id", nullable = false)
    private ContractCategory category;

    @ManyToOne
    @JoinColumn(name = "template_id", referencedColumnName = "id", nullable = true)
    private Template template;

    @Column(name = "title", length = 20, nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "process_status", length = 11, nullable = false)
    private ProcessStatus processStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "edit_status", length = 9, nullable = false)
    private EditStatus editStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", length = 17, nullable = false)
    private SourceType sourceType;

    @Column(name = "page_no", nullable = false)
    private Integer pageNo;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "DATETIME(6)")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false, columnDefinition = "DATETIME(6)")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContractFile> files = new ArrayList<>();

}
