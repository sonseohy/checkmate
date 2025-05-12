package com.checkmate.domain.improvementreport.entity;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.EntityListeners;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Document("improvement_report")
public class ImprovementReport {

    @Id
    private ObjectId id;

    @Indexed
    private ObjectId aiAnalysisReportId;

    private String description;

    @CreatedDate
    private LocalDateTime createdAt;
}
