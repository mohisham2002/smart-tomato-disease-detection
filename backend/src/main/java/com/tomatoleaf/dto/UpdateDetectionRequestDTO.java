package com.tomatoleaf.dto;

import jakarta.validation.constraints.Size;

public record UpdateDetectionRequestDTO(
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    String notes,

    @Size(max = 500, message = "Tags must not exceed 500 characters")
    String tags
) {
}
