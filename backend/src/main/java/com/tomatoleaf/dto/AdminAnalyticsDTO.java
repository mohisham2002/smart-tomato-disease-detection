package com.tomatoleaf.dto;

public record AdminAnalyticsDTO(
    UserAnalyticsDTO users,
    DetectionAnalyticsDTO detections,
    FeedbackAnalyticsDTO feedback,
    ImageAnalyticsDTO images
) {
    public record UserAnalyticsDTO(
        Long total,
        Long active,
        Long inactive,
        Long admins
    ) {}

    public record DetectionAnalyticsDTO(
        Long total,
        Long healthy,
        Long diseased,
        Double healthyPercentage,
        Double diseasedPercentage
    ) {}

    public record FeedbackAnalyticsDTO(
        Long total,
        Long pending,
        Long resolved,
        Long spam
    ) {}

    public record ImageAnalyticsDTO(
        Long total,
        Long totalSize
    ) {}
}
