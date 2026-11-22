package com.tomatoleaf.dto;

import com.tomatoleaf.entity.Notice;

import java.time.LocalDateTime;

public record NoticeDTO(
    Long id,
    String title,
    String message,
    String type,
    Boolean isActive,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static NoticeDTO fromEntity(Notice notice) {
        return new NoticeDTO(
            notice.getId(),
            notice.getTitle(),
            notice.getMessage(),
            notice.getType(),
            notice.getIsActive(),
            notice.getCreatedAt(),
            notice.getUpdatedAt()
        );
    }
}
