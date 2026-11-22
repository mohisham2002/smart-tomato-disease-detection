package com.tomatoleaf.repository;

import com.tomatoleaf.entity.LeafImage;
import com.tomatoleaf.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface LeafImageRepository extends JpaRepository<LeafImage, Long> {

    List<LeafImage> findByUserOrderByUploadedAtDesc(User user);

    List<LeafImage> findByUserIdOrderByUploadedAtDesc(Long userId);

    List<LeafImage> findAllByOrderByUploadedAtDesc();

    List<LeafImage> findByImageNameContainingIgnoreCase(String imageName);

    @Modifying
    @Transactional
    void deleteByUser(User user);
}
