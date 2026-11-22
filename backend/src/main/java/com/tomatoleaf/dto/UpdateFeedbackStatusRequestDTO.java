package com.tomatoleaf.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateFeedbackStatusRequestDTO(
    @NotBlank(message = "Status is required")
    String status
) {
}
