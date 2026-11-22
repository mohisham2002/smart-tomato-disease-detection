package com.tomatoleaf.controller;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<FeedbackDTO> createFeedback(@Valid @RequestBody CreateFeedbackRequestDTO request) {
        FeedbackDTO createdFeedback = feedbackService.createFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFeedback);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackDTO>> getAllFeedback() {
        List<FeedbackDTO> feedbackList = feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedbackList);
    }

    @GetMapping("/my")
    public ResponseEntity<List<FeedbackDTO>> getCurrentUserFeedback() {
        List<FeedbackDTO> feedbackList = feedbackService.getCurrentUserFeedback();
        return ResponseEntity.ok(feedbackList);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackDTO>> getFeedbackByStatus(@PathVariable String status) {
        List<FeedbackDTO> feedbackList = feedbackService.getFeedbackByStatus(status);
        return ResponseEntity.ok(feedbackList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedbackDTO> getFeedbackById(@PathVariable Long id) {
        FeedbackDTO feedback = feedbackService.getFeedbackById(id);
        return ResponseEntity.ok(feedback);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeedbackDTO> updateFeedbackStatus(@PathVariable Long id,
                                                            @Valid @RequestBody UpdateFeedbackStatusRequestDTO request) {
        FeedbackDTO updatedFeedback = feedbackService.updateFeedbackStatus(id, request);
        return ResponseEntity.ok(updatedFeedback);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackDTO> updateFeedback(@PathVariable Long id,
                                                      @Valid @RequestBody UpdateFeedbackRequestDTO request) {
        FeedbackDTO updatedFeedback = feedbackService.updateFeedback(id, request);
        return ResponseEntity.ok(updatedFeedback);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}
