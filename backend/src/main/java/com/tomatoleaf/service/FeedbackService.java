package com.tomatoleaf.service;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.entity.Feedback;
import com.tomatoleaf.entity.User;
import com.tomatoleaf.repository.FeedbackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackService.class);

    private final FeedbackRepository feedbackRepository;
    private final UserService userService;

    public FeedbackService(FeedbackRepository feedbackRepository, UserService userService) {
        this.feedbackRepository = feedbackRepository;
        this.userService = userService;
    }

    @Transactional
    public FeedbackDTO createFeedback(CreateFeedbackRequestDTO request) {
        logger.info("Creating new feedback");

        User currentUser = userService.getCurrentUser();

        Feedback feedback = new Feedback();
        feedback.setUser(currentUser);
        feedback.setSubject(request.subject());
        feedback.setMessage(request.message());
        feedback.setStatus("PENDING");

        Feedback savedFeedback = feedbackRepository.save(feedback);
        logger.info("Feedback created successfully with id: {}", savedFeedback.getId());

        return FeedbackDTO.fromEntity(savedFeedback);
    }

    public FeedbackDTO getFeedbackById(Long id) {
        logger.debug("Fetching feedback by id: {}", id);
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with id: " + id));
        return FeedbackDTO.fromEntity(feedback);
    }

    public List<FeedbackDTO> getAllFeedback() {
        logger.debug("Fetching all feedback");
        return feedbackRepository.findAll().stream()
                .map(FeedbackDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getCurrentUserFeedback() {
        logger.debug("Fetching current user feedback");
        User currentUser = userService.getCurrentUser();
        return feedbackRepository.findByUserId(currentUser.getId()).stream()
                .map(FeedbackDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getFeedbackByStatus(String status) {
        logger.debug("Fetching feedback by status: {}", status);
        return feedbackRepository.findByStatus(status).stream()
                .map(FeedbackDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackDTO updateFeedbackStatus(Long id, UpdateFeedbackStatusRequestDTO request) {
        logger.info("Updating feedback status with id: {}", id);
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with id: " + id));

        feedback.setStatus(request.status());
        Feedback savedFeedback = feedbackRepository.save(feedback);
        logger.info("Feedback status updated successfully: {}", id);

        return FeedbackDTO.fromEntity(savedFeedback);
    }

    @Transactional
    public FeedbackDTO updateFeedback(Long id, UpdateFeedbackRequestDTO request) {
        logger.info("Updating feedback with id: {}", id);
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with id: " + id));

        if (request.subject() != null && !request.subject().isBlank()) {
            feedback.setSubject(request.subject());
        }

        if (request.message() != null && !request.message().isBlank()) {
            feedback.setMessage(request.message());
        }

        Feedback savedFeedback = feedbackRepository.save(feedback);
        logger.info("Feedback updated successfully: {}", id);

        return FeedbackDTO.fromEntity(savedFeedback);
    }

    @Transactional
    public void deleteFeedback(Long id) {
        logger.info("Deleting feedback with id: {}", id);
        if (!feedbackRepository.existsById(id)) {
            throw new IllegalArgumentException("Feedback not found with id: " + id);
        }
        feedbackRepository.deleteById(id);
        logger.info("Feedback deleted successfully: {}", id);
    }

    public Long getTotalFeedbackCount() {
        return feedbackRepository.count();
    }

    public Long getPendingCount() {
        return feedbackRepository.findByStatus("PENDING").stream().count();
    }

    public Long getApprovedCount() {
        return feedbackRepository.findByStatus("APPROVED").stream().count();
    }
}
