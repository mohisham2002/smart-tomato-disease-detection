package com.tomatoleaf.repository;

import com.tomatoleaf.entity.Feedback;
import com.tomatoleaf.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByStatus(String status);

    List<Feedback> findByUserId(Long userId);

    @Modifying
    @Transactional
    void deleteByUser(User user);
}
