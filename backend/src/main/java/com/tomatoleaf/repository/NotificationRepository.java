package com.tomatoleaf.repository;

import com.tomatoleaf.entity.Notification;
import com.tomatoleaf.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findAllByOrderByCreatedAtDesc();

    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    List<Notification> findByTypeContainingIgnoreCase(String type);

    long countByUserIdAndIsReadFalse(Long userId);

    @Modifying
    @Transactional
    void deleteByUser(User user);

    List<Notification> findByIsBroadcastTrueOrderByCreatedAtDesc();

    @Query("SELECT n FROM Notification n WHERE n.isBroadcast = true ORDER BY n.createdAt DESC")
    List<Notification> findAllBroadcastNotifications();

    List<Notification> findByBroadcastId(String broadcastId);

    @Query("SELECT n FROM Notification n WHERE n.isBroadcast = true OR n.user.id = :userId ORDER BY n.createdAt DESC")
    List<Notification> findBroadcastAndUserNotifications(Long userId);
}
