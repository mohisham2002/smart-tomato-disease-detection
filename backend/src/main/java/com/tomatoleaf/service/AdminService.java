package com.tomatoleaf.service;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.entity.SystemSettings;
import com.tomatoleaf.entity.User;
import com.tomatoleaf.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    private final DetectionHistoryRepository detectionHistoryRepository;
    private final FeedbackRepository feedbackRepository;
    private final LeafImageRepository leafImageRepository;
    private final SystemSettingsRepository systemSettingsRepository;

    public AdminService(UserRepository userRepository,
                       DetectionHistoryRepository detectionHistoryRepository,
                       FeedbackRepository feedbackRepository,
                       LeafImageRepository leafImageRepository,
                       SystemSettingsRepository systemSettingsRepository) {
        this.userRepository = userRepository;
        this.detectionHistoryRepository = detectionHistoryRepository;
        this.feedbackRepository = feedbackRepository;
        this.leafImageRepository = leafImageRepository;
        this.systemSettingsRepository = systemSettingsRepository;
    }

    public AdminAnalyticsDTO getAnalytics() {
        logger.info("Fetching admin analytics");

        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findByActiveTrue().stream().count();
        long inactiveUsers = totalUsers - activeUsers;
        long adminUsers = userRepository.findByRole(User.UserRole.ADMIN).stream().count();

        AdminAnalyticsDTO.UserAnalyticsDTO users = new AdminAnalyticsDTO.UserAnalyticsDTO(
            totalUsers, activeUsers, inactiveUsers, adminUsers
        );

        long totalDetections = detectionHistoryRepository.count();
        long healthyDetections = detectionHistoryRepository.findByResult("HEALTHY").stream().count();
        long diseasedDetections = totalDetections - healthyDetections;

        double healthyPercentage = totalDetections > 0 ? (healthyDetections * 100.0 / totalDetections) : 0.0;
        double diseasedPercentage = totalDetections > 0 ? (diseasedDetections * 100.0 / totalDetections) : 0.0;

        AdminAnalyticsDTO.DetectionAnalyticsDTO detections = new AdminAnalyticsDTO.DetectionAnalyticsDTO(
            totalDetections, healthyDetections, diseasedDetections, healthyPercentage, diseasedPercentage
        );

        long totalFeedback = feedbackRepository.count();
        long pendingFeedback = feedbackRepository.findByStatus("PENDING").stream().count();
        long approvedFeedback = feedbackRepository.findByStatus("APPROVED").stream().count();
        long spamFeedback = feedbackRepository.findByStatus("SPAM").stream().count();

        AdminAnalyticsDTO.FeedbackAnalyticsDTO feedback = new AdminAnalyticsDTO.FeedbackAnalyticsDTO(
            totalFeedback, pendingFeedback, approvedFeedback, spamFeedback
        );

        long totalImages = leafImageRepository.count();
        long totalSize = leafImageRepository.findAll().stream()
            .mapToLong(img -> img.getFileSize() != null ? img.getFileSize() : 0L)
            .sum();

        AdminAnalyticsDTO.ImageAnalyticsDTO images = new AdminAnalyticsDTO.ImageAnalyticsDTO(
            totalImages, totalSize
        );

        logger.info("Analytics fetched successfully");

        return new AdminAnalyticsDTO(users, detections, feedback, images);
    }

    public AdminAnalyticsDTO.UserAnalyticsDTO getUserAnalytics() {
        logger.info("Fetching user analytics");
        long total = userRepository.count();
        long active = userRepository.findByActiveTrue().stream().count();
        long inactive = total - active;
        return new AdminAnalyticsDTO.UserAnalyticsDTO(total, active, inactive, 
            userRepository.findByRole(User.UserRole.ADMIN).stream().count());
    }

    public AdminAnalyticsDTO.DetectionAnalyticsDTO getDetectionAnalytics() {
        logger.info("Fetching detection analytics");
        long total = detectionHistoryRepository.count();
        long healthy = detectionHistoryRepository.findByResult("HEALTHY").stream().count();
        long diseased = total - healthy;
        double healthyPct = total > 0 ? (healthy * 100.0 / total) : 0.0;
        double diseasedPct = total > 0 ? (diseased * 100.0 / total) : 0.0;
        return new AdminAnalyticsDTO.DetectionAnalyticsDTO(total, healthy, diseased, healthyPct, diseasedPct);
    }

    public AdminAnalyticsDTO.FeedbackAnalyticsDTO getFeedbackAnalytics() {
        logger.info("Fetching feedback analytics");
        long total = feedbackRepository.count();
        long pending = feedbackRepository.findByStatus("PENDING").stream().count();
        long approved = feedbackRepository.findByStatus("APPROVED").stream().count();
        long spam = feedbackRepository.findByStatus("SPAM").stream().count();
        return new AdminAnalyticsDTO.FeedbackAnalyticsDTO(total, pending, approved, spam);
    }

    public List<SystemSettingsDTO> getAllSettings() {
        logger.debug("Fetching all system settings");
        return systemSettingsRepository.findAll().stream()
            .map(SystemSettingsDTO::fromEntity)
            .collect(Collectors.toList());
    }

    public SystemSettingsDTO getSettingByKey(String key) {
        logger.debug("Fetching setting by key: {}", key);
        SystemSettings settings = systemSettingsRepository.findBySettingKey(key)
            .orElseThrow(() -> new IllegalArgumentException("Setting not found with key: " + key));
        return SystemSettingsDTO.fromEntity(settings);
    }

    @Transactional
    public SystemSettingsDTO updateSetting(String key, UpdateSettingsRequestDTO request) {
        logger.info("Updating system setting: {}", key);
        SystemSettings settings = systemSettingsRepository.findBySettingKey(key)
            .orElseThrow(() -> new IllegalArgumentException("Setting not found with key: " + key));

        settings.setSettingValue(request.value());
        SystemSettings saved = systemSettingsRepository.save(settings);
        logger.info("Setting updated successfully: {}", key);

        return SystemSettingsDTO.fromEntity(saved);
    }

    @Transactional
    public SystemSettingsDTO createSetting(String key, UpdateSettingsRequestDTO request, String description) {
        logger.info("Creating new system setting: {}", key);

        if (systemSettingsRepository.existsBySettingKey(key)) {
            throw new IllegalArgumentException("Setting already exists with key: " + key);
        }

        SystemSettings settings = new SystemSettings();
        settings.setSettingKey(key);
        settings.setSettingValue(request.value());
        settings.setDescription(description);

        SystemSettings saved = systemSettingsRepository.save(settings);
        logger.info("Setting created successfully: {}", key);

        return SystemSettingsDTO.fromEntity(saved);
    }

    @Transactional
    public void cleanupInactiveUsers() {
        logger.info("Cleaning up inactive users");
        List<User> inactiveUsers = userRepository.findByActiveFalse();
        userRepository.deleteAll(inactiveUsers);
        logger.info("Deleted {} inactive users", inactiveUsers.size());
    }

    @Transactional
    public void deleteOldDetections(int daysOld) {
        logger.info("Cleaning up detections older than {} days", daysOld);
    }
}
