package com.tomatoleaf.service;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.entity.DetectionHistory;
import com.tomatoleaf.entity.User;
import com.tomatoleaf.repository.DetectionHistoryRepository;
import com.tomatoleaf.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DetectionHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(DetectionHistoryService.class);

    private final DetectionHistoryRepository detectionHistoryRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public DetectionHistoryService(DetectionHistoryRepository detectionHistoryRepository,
                                   UserRepository userRepository,
                                   UserService userService) {
        this.detectionHistoryRepository = detectionHistoryRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Transactional
    public DetectionHistoryDTO createDetection(CreateDetectionRequestDTO request) {
        logger.info("Creating new detection record");

        User currentUser = userService.getCurrentUser();

        DetectionHistory detection = new DetectionHistory();
        detection.setUser(currentUser);
        detection.setImageName(request.imageName());
        detection.setImageData(request.imageData());
        detection.setDiseaseName(request.diseaseName());
        detection.setConfidence(request.confidence());
        detection.setResult(request.result());
        detection.setNotes(null);
        detection.setTags(null);

        DetectionHistory savedDetection = detectionHistoryRepository.save(detection);
        logger.info("Detection created successfully with id: {}", savedDetection.getId());

        return DetectionHistoryDTO.fromEntity(savedDetection);
    }

    public DetectionHistoryDTO getDetectionById(Long id) {
        logger.debug("Fetching detection by id: {}", id);
        DetectionHistory detection = detectionHistoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Detection not found with id: " + id));
        return DetectionHistoryDTO.fromEntity(detection);
    }

    public List<DetectionHistoryDTO> getAllDetections() {
        logger.debug("Fetching all detections");
        return detectionHistoryRepository.findAllByOrderByDetectedAtDesc().stream()
                .map(DetectionHistoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DetectionHistoryDTO> getCurrentUserDetections() {
        logger.debug("Fetching current user detections");
        User currentUser = userService.getCurrentUser();
        return detectionHistoryRepository.findByUserOrderByDetectedAtDesc(currentUser).stream()
                .map(DetectionHistoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DetectionHistoryDTO> getUserDetections(Long userId) {
        logger.debug("Fetching detections for user id: {}", userId);
        return detectionHistoryRepository.findByUserIdOrderByDetectedAtDesc(userId).stream()
                .map(DetectionHistoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DetectionHistoryDTO> getDetectionsByDiseaseName(String diseaseName) {
        logger.debug("Fetching detections by disease name: {}", diseaseName);
        return detectionHistoryRepository.findByDiseaseNameContainingIgnoreCase(diseaseName).stream()
                .map(DetectionHistoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DetectionHistoryDTO> getDetectionsByResult(String result) {
        logger.debug("Fetching detections by result: {}", result);
        return detectionHistoryRepository.findByResult(result).stream()
                .map(DetectionHistoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public DetectionHistoryDTO updateDetection(Long id, UpdateDetectionRequestDTO request) {
        logger.info("Updating detection with id: {}", id);
        DetectionHistory detection = detectionHistoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Detection not found with id: " + id));

        if (request.notes() != null) {
            detection.setNotes(request.notes());
        }

        if (request.tags() != null) {
            detection.setTags(request.tags());
        }

        DetectionHistory savedDetection = detectionHistoryRepository.save(detection);
        logger.info("Detection updated successfully: {}", savedDetection.getId());

        return DetectionHistoryDTO.fromEntity(savedDetection);
    }

    @Transactional
    public void deleteDetection(Long id) {
        logger.info("Deleting detection with id: {}", id);
        if (!detectionHistoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Detection not found with id: " + id);
        }
        detectionHistoryRepository.deleteById(id);
        logger.info("Detection deleted successfully: {}", id);
    }

    @Transactional
    public void deleteAllUserDetections() {
        logger.info("Deleting all detections for current user");
        User currentUser = userService.getCurrentUser();
        detectionHistoryRepository.deleteByUser(currentUser);
        logger.info("All user detections deleted");
    }

    public Long getTotalDetectionsCount() {
        return detectionHistoryRepository.count();
    }

    public Long getUserDetectionsCount(Long userId) {
        return detectionHistoryRepository.findByUserIdOrderByDetectedAtDesc(userId).stream().count();
    }

    public Long getHealthyCount() {
        return detectionHistoryRepository.findByResult("HEALTHY").stream().count();
    }

    public Long getDiseasedCount() {
        return detectionHistoryRepository.findAll().stream()
                .filter(d -> !"HEALTHY".equals(d.getResult()))
                .count();
    }
}
