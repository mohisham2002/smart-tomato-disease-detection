package com.tomatoleaf.service;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.entity.LeafImage;
import com.tomatoleaf.entity.User;
import com.tomatoleaf.repository.LeafImageRepository;
import com.tomatoleaf.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeafImageService {

    private static final Logger logger = LoggerFactory.getLogger(LeafImageService.class);

    private final LeafImageRepository leafImageRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public LeafImageService(LeafImageRepository leafImageRepository,
                           UserRepository userRepository,
                           UserService userService) {
        this.leafImageRepository = leafImageRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Transactional
    public LeafImageDTO createLeafImage(CreateLeafImageRequestDTO request) {
        logger.info("Creating new leaf image: {}", request.imageName());

        User currentUser = userService.getCurrentUser();

        LeafImage leafImage = new LeafImage();
        leafImage.setUser(currentUser);
        leafImage.setImageName(request.imageName());
        leafImage.setImageData(request.imageData());
        leafImage.setContentType(request.contentType() != null ? request.contentType() : "image/jpeg");
        leafImage.setFileSize(request.fileSize());
        leafImage.setDescription(request.description());

        LeafImage savedImage = leafImageRepository.save(leafImage);
        logger.info("Leaf image created successfully with id: {}", savedImage.getId());

        return LeafImageDTO.fromEntity(savedImage);
    }

    public LeafImageDTO getLeafImageById(Long id) {
        logger.debug("Fetching leaf image by id: {}", id);
        LeafImage leafImage = leafImageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leaf image not found with id: " + id));
        return LeafImageDTO.fromEntity(leafImage);
    }

    public List<LeafImageDTO> getAllLeafImages() {
        logger.debug("Fetching all leaf images");
        return leafImageRepository.findAllByOrderByUploadedAtDesc().stream()
                .map(LeafImageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LeafImageDTO> getCurrentUserLeafImages() {
        logger.debug("Fetching current user leaf images");
        User currentUser = userService.getCurrentUser();
        return leafImageRepository.findByUserOrderByUploadedAtDesc(currentUser).stream()
                .map(LeafImageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LeafImageDTO> getUserLeafImages(Long userId) {
        logger.debug("Fetching leaf images for user id: {}", userId);
        return leafImageRepository.findByUserIdOrderByUploadedAtDesc(userId).stream()
                .map(LeafImageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LeafImageDTO> searchByImageName(String imageName) {
        logger.debug("Searching leaf images by name: {}", imageName);
        return leafImageRepository.findByImageNameContainingIgnoreCase(imageName).stream()
                .map(LeafImageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeafImageDTO updateLeafImage(Long id, UpdateLeafImageRequestDTO request) {
        logger.info("Updating leaf image with id: {}", id);
        LeafImage leafImage = leafImageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leaf image not found with id: " + id));

        if (request.description() != null) {
            leafImage.setDescription(request.description());
        }

        LeafImage savedImage = leafImageRepository.save(leafImage);
        logger.info("Leaf image updated successfully: {}", id);

        return LeafImageDTO.fromEntity(savedImage);
    }

    @Transactional
    public void deleteLeafImage(Long id) {
        logger.info("Deleting leaf image with id: {}", id);
        if (!leafImageRepository.existsById(id)) {
            throw new IllegalArgumentException("Leaf image not found with id: " + id);
        }
        leafImageRepository.deleteById(id);
        logger.info("Leaf image deleted successfully: {}", id);
    }

    @Transactional
    public void deleteAllUserLeafImages() {
        logger.info("Deleting all leaf images for current user");
        User currentUser = userService.getCurrentUser();
        leafImageRepository.deleteByUser(currentUser);
        logger.info("All user leaf images deleted");
    }

    public Long getTotalImagesCount() {
        return leafImageRepository.count();
    }

    public Long getUserImagesCount(Long userId) {
        return leafImageRepository.findByUserIdOrderByUploadedAtDesc(userId).stream().count();
    }
}
