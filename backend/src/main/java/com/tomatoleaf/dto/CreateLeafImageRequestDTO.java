package com.tomatoleaf.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateLeafImageRequestDTO(
    @NotBlank(message = "Image name is required")
    @Size(max = 500, message = "Image name must not exceed 500 characters")
    String imageName,

    @NotBlank(message = "Image data is required")
    String imageData,

    String contentType,

    Long fileSize,

    @Size(max = 500, message = "Description must not exceed 500 characters")
    String description
) {
}
