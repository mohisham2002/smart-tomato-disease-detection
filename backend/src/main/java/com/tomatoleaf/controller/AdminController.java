package com.tomatoleaf.controller;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsDTO> getAnalytics() {
        AdminAnalyticsDTO analytics = adminService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/users")
    public ResponseEntity<AdminAnalyticsDTO.UserAnalyticsDTO> getUserAnalytics() {
        AdminAnalyticsDTO.UserAnalyticsDTO analytics = adminService.getUserAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/detections")
    public ResponseEntity<AdminAnalyticsDTO.DetectionAnalyticsDTO> getDetectionAnalytics() {
        AdminAnalyticsDTO.DetectionAnalyticsDTO analytics = adminService.getDetectionAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/feedback")
    public ResponseEntity<AdminAnalyticsDTO.FeedbackAnalyticsDTO> getFeedbackAnalytics() {
        AdminAnalyticsDTO.FeedbackAnalyticsDTO analytics = adminService.getFeedbackAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/settings")
    public ResponseEntity<List<SystemSettingsDTO>> getAllSettings() {
        List<SystemSettingsDTO> settings = adminService.getAllSettings();
        return ResponseEntity.ok(settings);
    }

    @GetMapping("/settings/{key}")
    public ResponseEntity<SystemSettingsDTO> getSettingByKey(@PathVariable String key) {
        SystemSettingsDTO settings = adminService.getSettingByKey(key);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings/{key}")
    public ResponseEntity<SystemSettingsDTO> updateSetting(@PathVariable String key,
                                                          @Valid @RequestBody UpdateSettingsRequestDTO request) {
        SystemSettingsDTO settings = adminService.updateSetting(key, request);
        return ResponseEntity.ok(settings);
    }

    @PostMapping("/settings/{key}")
    public ResponseEntity<SystemSettingsDTO> createSetting(@PathVariable String key,
                                                           @Valid @RequestBody UpdateSettingsRequestDTO request,
                                                           @RequestParam(required = false) String description) {
        SystemSettingsDTO settings = adminService.createSetting(key, request, description);
        return ResponseEntity.status(201).body(settings);
    }

    @DeleteMapping("/cleanup/inactive")
    public ResponseEntity<Void> cleanupInactiveUsers() {
        adminService.cleanupInactiveUsers();
        return ResponseEntity.noContent().build();
    }
}
