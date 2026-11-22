package com.tomatoleaf.dto;

import jakarta.validation.constraints.Size;

public record UpdateLeafImageRequestDTO(
    @Size(max = 500, message = "Description must not exceed 500 characters")
    String description
) {
}
