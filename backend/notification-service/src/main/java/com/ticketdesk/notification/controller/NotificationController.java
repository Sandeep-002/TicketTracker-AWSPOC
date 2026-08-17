package com.ticketdesk.notification.controller;

import com.ticketdesk.notification.model.NotificationLog;
import com.ticketdesk.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationLog>> getNotifications(
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-User-Id", required = false) Long userId,
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-User-Role", required = false) String userRole) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId, userEmail, userRole));
    }

    @GetMapping("/all")
    public ResponseEntity<List<NotificationLog>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<Void> logNotificationEvent(@org.springframework.web.bind.annotation.RequestBody java.util.Map<String, Object> payload) {
        String category = String.valueOf(payload.getOrDefault("category", "AUDIT_EVENT"));
        String eventType = String.valueOf(payload.getOrDefault("eventType", "NOTIFICATION"));
        String message = String.valueOf(payload.getOrDefault("message", "System notification log."));
        
        Long targetUserId = parseLong(payload.get("targetUserId"));
        if (targetUserId == null) targetUserId = parseLong(payload.get("createdById"));
        
        String targetUserEmail = (String) payload.get("targetUserEmail");
        if (targetUserEmail == null) targetUserEmail = (String) payload.get("createdByEmail");
        
        Long assignedToId = parseLong(payload.get("assignedToId"));
        Long ticketId = parseLong(payload.get("ticketId"));

        notificationService.logNotification(category, eventType, message, targetUserId, targetUserEmail, assignedToId, ticketId);
        return ResponseEntity.ok().build();
    }

    private Long parseLong(Object val) {
        if (val == null) return null;
        try {
            return Long.parseLong(String.valueOf(val));
        } catch (Exception e) {
            return null;
        }
    }
}
