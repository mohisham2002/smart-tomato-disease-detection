package com.tomatoleaf.repository;

import com.tomatoleaf.entity.DetectionHistory;
import com.tomatoleaf.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface DetectionHistoryRepository extends JpaRepository<DetectionHistory, Long> {

    List<DetectionHistory> findByUserOrderByDetectedAtDesc(User user);

    List<DetectionHistory> findByUserIdOrderByDetectedAtDesc(Long userId);

    List<DetectionHistory> findAllByOrderByDetectedAtDesc();

    List<DetectionHistory> findByDiseaseNameContainingIgnoreCase(String diseaseName);

    List<DetectionHistory> findByResult(String result);

    @Modifying
    @Transactional
    void deleteByUser(User user);
}
