package com.tomatoleaf.dto;

import com.tomatoleaf.entity.SystemSettings;

import java.time.LocalDateTime;

public record SystemSettingsDTO(
    Long id,
    String settingKey,
    String settingValue,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static SystemSettingsDTO fromEntity(SystemSettings settings) {
        return new SystemSettingsDTO(
            settings.getId(),
            settings.getSettingKey(),
            settings.getSettingValue(),
            settings.getDescription(),
            settings.getCreatedAt(),
            settings.getUpdatedAt()
        );
    }
}
