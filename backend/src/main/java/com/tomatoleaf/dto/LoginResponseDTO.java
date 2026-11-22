package com.tomatoleaf.dto;

import com.tomatoleaf.entity.User;

public record LoginResponseDTO(
    String token,
    UserDTO user
) {
}
