package com.tomatoleaf.dto;

import com.tomatoleaf.entity.Notification;

import java.time.LocalDateTime;

public record NotificationDTO(
    Long id,
    Long userId,
    String userName,
    String title,
    String message,
    String type,
    Boolean isRead,
    Boolean isBroadcast,
    String broadcastId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static NotificationDTO fromEntity(Notification notification) {
        return new NotificationDTO(
            notification.getId(),
            notification.getUser() != null ? notification.getUser().getId() : null,
            notification.getUser() != null ? notification.getUser().getName() : null,
            notification.getTitle(),
            notification.getMessage(),
            notification.getType(),
            notification.getIsRead(),
            notification.getIsBroadcast(),
            notification.getBroadcastId(),
            notification.getCreatedAt(),
            notification.getUpdatedAt()
        );
    }
}
