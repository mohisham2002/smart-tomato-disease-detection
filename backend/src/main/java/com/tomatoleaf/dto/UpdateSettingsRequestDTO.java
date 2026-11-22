package com.tomatoleaf.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateSettingsRequestDTO(
    @NotBlank(message = "Setting value is required")
    @Size(max = 2000, message = "Setting value must not exceed 2000 characters")
    String value
) {
}
