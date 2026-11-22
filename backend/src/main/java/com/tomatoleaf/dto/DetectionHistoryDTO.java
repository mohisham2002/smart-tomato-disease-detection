package com.tomatoleaf.dto;

import com.tomatoleaf.entity.DetectionHistory;

import java.time.LocalDateTime;

public record DetectionHistoryDTO(
    Long id,
    Long userId,
    String userName,
    String imageName,
    String imageData,
    String diseaseName,
    Double confidence,
    String result,
    String notes,
    String tags,
    LocalDateTime detectedAt,
    LocalDateTime updatedAt
) {
    public static DetectionHistoryDTO fromEntity(DetectionHistory detection) {
        return new DetectionHistoryDTO(
            detection.getId(),
            detection.getUser() != null ? detection.getUser().getId() : null,
            detection.getUser() != null ? detection.getUser().getName() : null,
            detection.getImageName(),
            detection.getImageData(),
            detection.getDiseaseName(),
            detection.getConfidence(),
            detection.getResult(),
            detection.getNotes(),
            detection.getTags(),
            detection.getDetectedAt(),
            detection.getUpdatedAt()
        );
    }
}
