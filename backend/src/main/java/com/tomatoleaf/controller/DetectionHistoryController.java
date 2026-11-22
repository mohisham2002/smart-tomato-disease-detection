package com.tomatoleaf.controller;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.service.DetectionHistoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detections")
public class DetectionHistoryController {

    private final DetectionHistoryService detectionHistoryService;

    public DetectionHistoryController(DetectionHistoryService detectionHistoryService) {
        this.detectionHistoryService = detectionHistoryService;
    }

    @PostMapping
    public ResponseEntity<DetectionHistoryDTO> createDetection(@Valid @RequestBody CreateDetectionRequestDTO request) {
        DetectionHistoryDTO createdDetection = detectionHistoryService.createDetection(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDetection);
    }

    @GetMapping
    public ResponseEntity<List<DetectionHistoryDTO>> getAllDetections() {
        List<DetectionHistoryDTO> detections = detectionHistoryService.getAllDetections();
        return ResponseEntity.ok(detections);
    }

    @GetMapping("/my")
    public ResponseEntity<List<DetectionHistoryDTO>> getCurrentUserDetections() {
        List<DetectionHistoryDTO> detections = detectionHistoryService.getCurrentUserDetections();
        return ResponseEntity.ok(detections);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetectionHistoryDTO> getDetectionById(@PathVariable Long id) {
        DetectionHistoryDTO detection = detectionHistoryService.getDetectionById(id);
        return ResponseEntity.ok(detection);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DetectionHistoryDTO>> getUserDetections(@PathVariable Long userId) {
        List<DetectionHistoryDTO> detections = detectionHistoryService.getUserDetections(userId);
        return ResponseEntity.ok(detections);
    }

    @GetMapping("/disease/{diseaseName}")
    public ResponseEntity<List<DetectionHistoryDTO>> getDetectionsByDiseaseName(@PathVariable String diseaseName) {
        List<DetectionHistoryDTO> detections = detectionHistoryService.getDetectionsByDiseaseName(diseaseName);
        return ResponseEntity.ok(detections);
    }

    @GetMapping("/result/{result}")
    public ResponseEntity<List<DetectionHistoryDTO>> getDetectionsByResult(@PathVariable String result) {
        List<DetectionHistoryDTO> detections = detectionHistoryService.getDetectionsByResult(result);
        return ResponseEntity.ok(detections);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetectionHistoryDTO> updateDetection(@PathVariable Long id, 
                                                                 @Valid @RequestBody UpdateDetectionRequestDTO request) {
        DetectionHistoryDTO updatedDetection = detectionHistoryService.updateDetection(id, request);
        return ResponseEntity.ok(updatedDetection);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDetection(@PathVariable Long id) {
        detectionHistoryService.deleteDetection(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/my")
    public ResponseEntity<Void> deleteAllCurrentUserDetections() {
        detectionHistoryService.deleteAllUserDetections();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalDetectionsCount() {
        Long count = detectionHistoryService.getTotalDetectionsCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/healthy")
    public ResponseEntity<Long> getHealthyCount() {
        Long count = detectionHistoryService.getHealthyCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/diseased")
    public ResponseEntity<Long> getDiseasedCount() {
        Long count = detectionHistoryService.getDiseasedCount();
        return ResponseEntity.ok(count);
    }
}
