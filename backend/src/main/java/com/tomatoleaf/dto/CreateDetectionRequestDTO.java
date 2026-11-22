package com.tomatoleaf.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateDetectionRequestDTO(
    @NotBlank(message = "Image name is required")
    @Size(max = 500, message = "Image name must not exceed 500 characters")
    String imageName,

    @NotBlank(message = "Image data is required")
    String imageData,

    @NotBlank(message = "Disease name is required")
    @Size(max = 255, message = "Disease name must not exceed 255 characters")
    String diseaseName,

    @NotNull(message = "Confidence is required")
    @Positive(message = "Confidence must be positive")
    Double confidence,

    @NotBlank(message = "Result is required")
    @Size(max = 100, message = "Result must not exceed 100 characters")
    String result
) {
}
