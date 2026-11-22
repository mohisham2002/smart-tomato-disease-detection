package com.tomatoleaf.repository;

import com.tomatoleaf.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    List<Notice> findAllByOrderByCreatedAtDesc();

    List<Notice> findByIsActiveTrueOrderByCreatedAtDesc();

    List<Notice> findByTypeContainingIgnoreCase(String type);
}
