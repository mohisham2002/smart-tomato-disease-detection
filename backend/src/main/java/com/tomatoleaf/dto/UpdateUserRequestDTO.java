package com.tomatoleaf.dto;

import jakarta.validation.constraints.Size;

public record UpdateUserRequestDTO(
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    String name,

    @Size(max = 255, message = "Bio must not exceed 255 characters")
    String bio
) {
}
