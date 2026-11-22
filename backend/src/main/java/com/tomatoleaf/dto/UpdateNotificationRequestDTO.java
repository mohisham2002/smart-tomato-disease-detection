package com.tomatoleaf.dto;

import jakarta.validation.constraints.Size;

public record UpdateNotificationRequestDTO(
    @Size(max = 255, message = "Title must not exceed 255 characters")
    String title,

    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    String message,

    @Size(max = 50, message = "Type must not exceed 50 characters")
    String type
) {
}
