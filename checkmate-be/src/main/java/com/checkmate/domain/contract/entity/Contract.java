package com.checkmate.domain.contract.entity;

import com.checkmate.domain.contractclause.entity.ContractClause;
import com.checkmate.domain.contractfieldvalue.entity.ContractFieldValue;
import com.checkmate.domain.contractcategory.entity.ContractCategory;
import com.checkmate.domain.question.entity.Question;
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
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ContractCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id")
    private Template template;

    @Column(name = "title", length = 20, nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "process_status", length = 11)
    private ProcessStatus processStatus = ProcessStatus.IN_PROGRESS;

    @Enumerated(EnumType.STRING)
    @Column(name = "edit_status", length = 9, nullable = false)
    private EditStatus editStatus = EditStatus.EDITING;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", length = 17, nullable = false)
    private SourceType sourceType = SourceType.USER_UPLOAD;

    @Column(name = "page_no")
    private Integer pageNo;

    @Column(name = "signature_request_id", length = 100, unique = true)
    private String signatureRequestId;

    @Enumerated(EnumType.STRING)
    @Column(name = "signature_status", length = 20, nullable = false)
    private SignatureStatus signatureStatus = SignatureStatus.PENDING;

    @Column(name = "signed_at")
    private LocalDateTime signedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "DATETIME(6)")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false, columnDefinition = "DATETIME(6)")
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ContractFile> files = new ArrayList<>();

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Question> questions = new ArrayList<>();

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ContractFieldValue> fieldValues = new ArrayList<>();

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ContractClause> contractClauses = new ArrayList<>();

    public void addFile(ContractFile f) {
        files.add(f);
        f.setContract(this);
    }

    public void removeFile(ContractFile f) {
        files.remove(f);
        f.setContract(null);
    }

    public void addQuestion(Question q) {
        questions.add(q);
        q.setContract(this);
    }

    public void removeQuestion(Question q) {
        questions.remove(q);
        q.setContract(null);
    }

    public void addFieldValue(ContractFieldValue v) {
        fieldValues.add(v);
        v.setContract(this);
    }

    public void removeFieldValue(ContractFieldValue v) {
        fieldValues.remove(v);
        v.setContract(null);
    }

    public void addContractClause(ContractClause cc) {
        contractClauses.add(cc);
        cc.setContract(this);
    }
    public void removeContractClause(ContractClause cc) {
        contractClauses.remove(cc);
        cc.setContract(null);
    }

}
