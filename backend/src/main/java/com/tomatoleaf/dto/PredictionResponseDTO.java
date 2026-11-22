package com.tomatoleaf.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PredictionResponseDTO(
    @JsonProperty("diseaseName")
    String diseaseName,
    
    @JsonProperty("displayName")
    String displayName,
    
    @JsonProperty("confidence")
    Double confidence,
    
    @JsonProperty("result")
    String result
) {
}
