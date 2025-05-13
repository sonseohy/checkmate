package com.checkmate.domain.summaryreport.entity;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AutoCloseable.class)
@Document("summary_report")
public class SummaryReport {

    @Id
    private ObjectId id;

    @Indexed
    private ObjectId aiAnalysisReportId;

    private String description;

    @CreatedDate
    private LocalDateTime createdAt;

}
