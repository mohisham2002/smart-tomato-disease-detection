package com.tomatoleaf.dto;

import com.tomatoleaf.entity.Feedback;

import java.time.LocalDateTime;

public record FeedbackDTO(
    Long id,
    Long userId,
    String userName,
    String subject,
    String message,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static FeedbackDTO fromEntity(Feedback feedback) {
        return new FeedbackDTO(
            feedback.getId(),
            feedback.getUser() != null ? feedback.getUser().getId() : null,
            feedback.getUser() != null ? feedback.getUser().getName() : null,
            feedback.getSubject(),
            feedback.getMessage(),
            feedback.getStatus(),
            feedback.getCreatedAt(),
            feedback.getUpdatedAt()
        );
    }
}
