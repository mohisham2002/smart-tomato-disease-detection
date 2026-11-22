package com.tomatoleaf.service;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.entity.Notification;
import com.tomatoleaf.entity.User;
import com.tomatoleaf.repository.NotificationRepository;
import com.tomatoleaf.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Transactional
    public NotificationDTO createNotification(CreateNotificationRequestDTO request) {
        logger.info("Creating new notification");

        User currentUser = userService.getCurrentUser();
        String target = request.target();

        if ("ALL_USERS".equals(target)) {
            return createBroadcastNotification(currentUser, request);
        }

        Notification notification = new Notification();
        notification.setUser(currentUser);
        notification.setTitle(request.title());
        notification.setMessage(request.message());
        notification.setType(request.type() != null ? request.type() : "INFO");
        notification.setIsRead(false);
        notification.setIsBroadcast(false);

        Notification savedNotification = notificationRepository.save(notification);
        logger.info("Notification created successfully with id: {}", savedNotification.getId());

        return NotificationDTO.fromEntity(savedNotification);
    }

    @Transactional
    public NotificationDTO createBroadcastNotification(User adminUser, CreateNotificationRequestDTO request) {
        logger.info("Creating broadcast notification");

        Notification notification = new Notification();
        notification.setUser(adminUser);
        notification.setTitle(request.title());
        notification.setMessage(request.message());
        notification.setType(request.type() != null ? request.type() : "INFO");
        notification.setIsRead(false);
        notification.setIsBroadcast(true);
        notification.setBroadcastId(java.util.UUID.randomUUID().toString());

        Notification savedNotification = notificationRepository.save(notification);
        logger.info("Broadcast notification created with id: {}", savedNotification.getId());

        return NotificationDTO.fromEntity(savedNotification);
    }

    @Transactional
    public NotificationDTO createNotificationForUser(Long userId, CreateNotificationRequestDTO request) {
        logger.info("Creating notification for user id: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(request.title());
        notification.setMessage(request.message());
        notification.setType(request.type() != null ? request.type() : "INFO");
        notification.setIsRead(false);

        Notification savedNotification = notificationRepository.save(notification);
        logger.info("Notification created successfully for user: {}", savedNotification.getId());

        return NotificationDTO.fromEntity(savedNotification);
    }

    public NotificationDTO getNotificationById(Long id) {
        logger.debug("Fetching notification by id: {}", id);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));
        return NotificationDTO.fromEntity(notification);
    }

    public List<NotificationDTO> getAllNotifications() {
        logger.debug("Fetching all broadcast notifications");
        return notificationRepository.findByIsBroadcastTrueOrderByCreatedAtDesc().stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getCurrentUserNotifications() {
        logger.debug("Fetching current user notifications");
        User currentUser = userService.getCurrentUser();
        List<Notification> allNotifications = notificationRepository.findBroadcastAndUserNotifications(currentUser.getId());
        
        java.util.Set<String> seenBroadcastIds = new java.util.HashSet<>();
        List<Notification> distinctNotifications = new java.util.ArrayList<>();
        
        for (Notification n : allNotifications) {
            if (n.getIsBroadcast() && n.getBroadcastId() != null) {
                if (!seenBroadcastIds.contains(n.getBroadcastId())) {
                    seenBroadcastIds.add(n.getBroadcastId());
                    distinctNotifications.add(n);
                }
            } else {
                distinctNotifications.add(n);
            }
        }
        
        return distinctNotifications.stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUserNotifications(Long userId) {
        logger.debug("Fetching notifications for user id: {}", userId);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications() {
        logger.debug("Fetching unread notifications for current user");
        User currentUser = userService.getCurrentUser();
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(currentUser.getId()).stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public long getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        List<Notification> userNotifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(currentUser.getId());
        return userNotifications.size();
    }

    @Transactional
    public NotificationDTO markAsRead(Long id) {
        logger.info("Marking notification as read: {}", id);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));

        notification.setIsRead(true);
        Notification savedNotification = notificationRepository.save(notification);
        logger.info("Notification marked as read: {}", id);

        return NotificationDTO.fromEntity(savedNotification);
    }

    @Transactional
    public void markAllAsRead() {
        logger.info("Marking all notifications as read for current user");
        User currentUser = userService.getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(currentUser.getId());
        
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
        
        logger.info("All notifications marked as read");
    }

    @Transactional
    public NotificationDTO updateNotification(Long id, UpdateNotificationRequestDTO request) {
        logger.info("Updating notification with id: {}", id);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));

        if (request.title() != null && !request.title().isBlank()) {
            notification.setTitle(request.title());
        }

        if (request.message() != null && !request.message().isBlank()) {
            notification.setMessage(request.message());
        }

        if (request.type() != null && !request.type().isBlank()) {
            notification.setType(request.type());
        }

        Notification savedNotification = notificationRepository.save(notification);
        logger.info("Notification updated successfully: {}", id);

        return NotificationDTO.fromEntity(savedNotification);
    }

    @Transactional
    public void deleteNotification(Long id) {
        logger.info("Deleting notification with id: {}", id);
        if (!notificationRepository.existsById(id)) {
            throw new IllegalArgumentException("Notification not found with id: " + id);
        }
        notificationRepository.deleteById(id);
        logger.info("Notification deleted successfully: {}", id);
    }

    @Transactional
    public void deleteBroadcastNotification(Long id) {
        logger.info("Deleting broadcast notification with id: {}", id);
        Notification broadcastNotification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));

        if (!broadcastNotification.getIsBroadcast()) {
            throw new IllegalArgumentException("Notification is not a broadcast notification");
        }

        notificationRepository.delete(broadcastNotification);
        logger.info("Broadcast notification deleted successfully: {}", id);
    }

    @Transactional
    public void deleteAllUserNotifications() {
        logger.info("Deleting all notifications for current user");
        User currentUser = userService.getCurrentUser();
        notificationRepository.deleteByUser(currentUser);
        logger.info("All user notifications deleted");
    }
}
