package com.tomatoleaf.dto;

import com.tomatoleaf.entity.LeafImage;

import java.time.LocalDateTime;

public record LeafImageDTO(
    Long id,
    Long userId,
    String userName,
    String imageName,
    String imageData,
    String contentType,
    Long fileSize,
    String description,
    LocalDateTime uploadedAt,
    LocalDateTime updatedAt
) {
    public static LeafImageDTO fromEntity(LeafImage leafImage) {
        return new LeafImageDTO(
            leafImage.getId(),
            leafImage.getUser() != null ? leafImage.getUser().getId() : null,
            leafImage.getUser() != null ? leafImage.getUser().getName() : null,
            leafImage.getImageName(),
            leafImage.getImageData(),
            leafImage.getContentType(),
            leafImage.getFileSize(),
            leafImage.getDescription(),
            leafImage.getUploadedAt(),
            leafImage.getUpdatedAt()
        );
    }
}
