package com.tomatoleaf.controller;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.service.LeafImageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/images")
public class LeafImageController {

    private final LeafImageService leafImageService;

    public LeafImageController(LeafImageService leafImageService) {
        this.leafImageService = leafImageService;
    }

    @PostMapping
    public ResponseEntity<LeafImageDTO> createLeafImage(@Valid @RequestBody CreateLeafImageRequestDTO request) {
        LeafImageDTO createdImage = leafImageService.createLeafImage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdImage);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeafImageDTO>> getAllLeafImages() {
        List<LeafImageDTO> images = leafImageService.getAllLeafImages();
        return ResponseEntity.ok(images);
    }

    @GetMapping("/my")
    public ResponseEntity<List<LeafImageDTO>> getCurrentUserLeafImages() {
        List<LeafImageDTO> images = leafImageService.getCurrentUserLeafImages();
        return ResponseEntity.ok(images);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeafImageDTO> getLeafImageById(@PathVariable Long id) {
        LeafImageDTO image = leafImageService.getLeafImageById(id);
        return ResponseEntity.ok(image);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeafImageDTO>> getUserLeafImages(@PathVariable Long userId) {
        List<LeafImageDTO> images = leafImageService.getUserLeafImages(userId);
        return ResponseEntity.ok(images);
    }

    @GetMapping("/search")
    public ResponseEntity<List<LeafImageDTO>> searchByImageName(@RequestParam String name) {
        List<LeafImageDTO> images = leafImageService.searchByImageName(name);
        return ResponseEntity.ok(images);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeafImageDTO> updateLeafImage(@PathVariable Long id,
                                                        @Valid @RequestBody UpdateLeafImageRequestDTO request) {
        LeafImageDTO updatedImage = leafImageService.updateLeafImage(id, request);
        return ResponseEntity.ok(updatedImage);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeafImage(@PathVariable Long id) {
        leafImageService.deleteLeafImage(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/my")
    public ResponseEntity<Void> deleteAllCurrentUserLeafImages() {
        leafImageService.deleteAllUserLeafImages();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalImagesCount() {
        Long count = leafImageService.getTotalImagesCount();
        return ResponseEntity.ok(count);
    }
}
