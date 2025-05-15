package com.checkmate.domain.notification.dto.response;

import com.checkmate.domain.notification.entity.NotificationType;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class NotificationResponse {
    private Integer id;
    private NotificationType type;
    private String message;
    private String targetUrl;
    private boolean isRead;
    private LocalDateTime createdAt;
    private Integer userId;
    private Integer contractId;
}
