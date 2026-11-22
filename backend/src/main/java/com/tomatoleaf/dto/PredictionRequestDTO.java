package com.tomatoleaf.dto;

import jakarta.validation.constraints.NotBlank;

public record PredictionRequestDTO(
    @NotBlank(message = "Image data is required")
    String imageData
) {
}
