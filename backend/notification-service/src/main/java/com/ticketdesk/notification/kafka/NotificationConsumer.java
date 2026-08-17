package com.ticketdesk.notification.kafka;

import com.ticketdesk.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class NotificationConsumer {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(NotificationConsumer.class);
    private final NotificationService notificationService;

    public NotificationConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(topics = "user-events", groupId = "notification-group")
    public void consumeUserEvent(Map<String, Object> event) {
        log.info("Received User Event Kafka Message: {}", event);
        String eventType = String.valueOf(event.getOrDefault("eventType", "USER_EVENT"));
        String email = String.valueOf(event.getOrDefault("userEmail", "unknown"));
        String status = String.valueOf(event.getOrDefault("status", "N/A"));
        Long userId = parseLong(event.get("userId"));

        String msg;
        if ("APPROVED".equalsIgnoreCase(status) || "USER_APPROVED".equalsIgnoreCase(eventType)) {
            msg = String.format("Your account (%s) has been approved by Admin! You can now access full support features.", email);
        } else if ("REJECTED".equalsIgnoreCase(status)) {
            msg = String.format("Your registration request (%s) was declined by Admin.", email);
        } else {
            msg = String.format("User Account (%s) status updated to %s.", email, status);
        }

        notificationService.logNotification("USER_EVENT", eventType, msg, userId, email, null, null);
    }

    @KafkaListener(topics = "ticket-events", groupId = "notification-group")
    public void consumeTicketEvent(Map<String, Object> event) {
        log.info("Received Ticket Event Kafka Message: {}", event);
        String eventType = String.valueOf(event.getOrDefault("eventType", "TICKET_EVENT"));
        Long ticketId = parseLong(event.get("ticketId"));
        String title = String.valueOf(event.getOrDefault("ticketTitle", "Untitled"));
        String status = String.valueOf(event.getOrDefault("status", "N/A"));

        Long createdById = parseLong(event.get("createdById"));
        String createdByEmail = (String) event.get("createdByEmail");
        Long assignedToId = parseLong(event.get("assignedToId"));
        String assignedToName = (String) event.get("assignedToName");

        String msg;
        if ("TICKET_ASSIGNED".equals(eventType)) {
            msg = String.format("Ticket #%s '%s' was assigned to IT Support%s.", ticketId != null ? ticketId : "N/A", title, (assignedToName != null && !assignedToName.isEmpty()) ? " (" + assignedToName + ")" : "");
        } else if ("TICKET_STATUS_UPDATED".equals(eventType)) {
            msg = String.format("Ticket #%s '%s' status updated to %s.", ticketId != null ? ticketId : "N/A", title, status);
        } else if ("COMMENT_ADDED".equals(eventType)) {
            msg = String.format("New response posted on Ticket #%s '%s'.", ticketId != null ? ticketId : "N/A", title);
        } else if ("TICKET_CREATED".equals(eventType)) {
            msg = String.format("Ticket #%s '%s' was created successfully.", ticketId != null ? ticketId : "N/A", title);
        } else {
            msg = String.format("Ticket #%s '%s' - %s", ticketId != null ? ticketId : "N/A", title, status);
        }

        notificationService.logNotification("TICKET_EVENT", eventType, msg, createdById, createdByEmail, assignedToId, ticketId);
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
