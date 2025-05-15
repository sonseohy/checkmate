package com.checkmate.domain.notification.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationAckRequest {
    private Integer notificationId;
}
