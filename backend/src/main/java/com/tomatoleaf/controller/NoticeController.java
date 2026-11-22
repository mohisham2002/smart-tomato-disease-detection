package com.tomatoleaf.controller;

import com.tomatoleaf.dto.*;
import com.tomatoleaf.service.NoticeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NoticeDTO> createNotice(@Valid @RequestBody CreateNoticeRequestDTO request) {
        NoticeDTO createdNotice = noticeService.createNotice(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNotice);
    }

    @GetMapping
    public ResponseEntity<List<NoticeDTO>> getAllNotices() {
        List<NoticeDTO> notices = noticeService.getAllNotices();
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/active")
    public ResponseEntity<List<NoticeDTO>> getActiveNotices() {
        List<NoticeDTO> notices = noticeService.getActiveNotices();
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeDTO> getNoticeById(@PathVariable Long id) {
        NoticeDTO notice = noticeService.getNoticeById(id);
        return ResponseEntity.ok(notice);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NoticeDTO> updateNotice(@PathVariable Long id,
                                                  @Valid @RequestBody UpdateNoticeRequestDTO request) {
        NoticeDTO updatedNotice = noticeService.updateNotice(id, request);
        return ResponseEntity.ok(updatedNotice);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }
}
