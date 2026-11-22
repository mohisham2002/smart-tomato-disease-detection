package com.tomatoleaf.service;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.entity.Notice;
import com.tomatoleaf.repository.NoticeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeService {

    private static final Logger logger = LoggerFactory.getLogger(NoticeService.class);

    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    @Transactional
    public NoticeDTO createNotice(CreateNoticeRequestDTO request) {
        logger.info("Creating new notice");

        Notice notice = new Notice();
        notice.setTitle(request.title());
        notice.setMessage(request.message());
        notice.setType(request.type() != null ? request.type() : "UPDATES");
        notice.setIsActive(true);

        Notice savedNotice = noticeRepository.save(notice);
        logger.info("Notice created successfully with id: {}", savedNotice.getId());

        return NoticeDTO.fromEntity(savedNotice);
    }

    public NoticeDTO getNoticeById(Long id) {
        logger.debug("Fetching notice by id: {}", id);
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notice not found with id: " + id));
        return NoticeDTO.fromEntity(notice);
    }

    public List<NoticeDTO> getAllNotices() {
        logger.debug("Fetching all notices");
        return noticeRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(NoticeDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<NoticeDTO> getActiveNotices() {
        logger.debug("Fetching active notices");
        return noticeRepository.findByIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(NoticeDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public NoticeDTO updateNotice(Long id, UpdateNoticeRequestDTO request) {
        logger.info("Updating notice with id: {}", id);
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notice not found with id: " + id));

        if (request.title() != null && !request.title().isBlank()) {
            notice.setTitle(request.title());
        }

        if (request.message() != null && !request.message().isBlank()) {
            notice.setMessage(request.message());
        }

        if (request.type() != null && !request.type().isBlank()) {
            notice.setType(request.type());
        }

        Notice savedNotice = noticeRepository.save(notice);
        logger.info("Notice updated successfully: {}", id);

        return NoticeDTO.fromEntity(savedNotice);
    }

    @Transactional
    public void deleteNotice(Long id) {
        logger.info("Deleting notice with id: {}", id);
        if (!noticeRepository.existsById(id)) {
            throw new IllegalArgumentException("Notice not found with id: " + id);
        }
        noticeRepository.deleteById(id);
        logger.info("Notice deleted successfully: {}", id);
    }
}
