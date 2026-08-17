package com.ticketdesk.notification.service;

import com.ticketdesk.notification.model.NotificationLog;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
public class NotificationService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(NotificationService.class);

    private final Queue<NotificationLog> notificationLogs = new ConcurrentLinkedQueue<>();
    private static final int MAX_LOGS = 100;

    @jakarta.annotation.PostConstruct
    public void init() {
        logNotification("SYSTEM_EVENT", "KAFKA_LISTENER_STARTED", "Kafka Real-Time Audit Consumer active and listening on topics 'user-events' and 'ticket-events'.");
        logNotification("SYSTEM_EVENT", "SERVICE_HEALTHY", "Notification & Audit Service initialized successfully.");
    }

    public void logNotification(String category, String eventType, String message) {
        logNotification(category, eventType, message, null, null, null, null);
    }

    public synchronized void logNotification(String category, String eventType, String message, Long targetUserId, String targetUserEmail, Long assignedToId, Long ticketId) {
        for (NotificationLog existing : notificationLogs) {
            if (Objects.equals(existing.getEventType(), eventType) &&
                Objects.equals(existing.getTicketId(), ticketId) &&
                Objects.equals(existing.getTargetUserId(), targetUserId) &&
                Objects.equals(existing.getMessage(), message)) {
                if (existing.getTimestamp() != null && existing.getTimestamp().plusSeconds(3).isAfter(LocalDateTime.now())) {
                    log.info("Suppressed duplicate notification: [{}/{}] - {}", category, eventType, message);
                    return;
                }
            }
        }

        log.info("NOTIFICATION RECEIVED [{}/{}] - {}", category, eventType, message);
        NotificationLog notificationLog = NotificationLog.builder()
                .id(UUID.randomUUID().toString())
                .category(category)
                .eventType(eventType)
                .message(message)
                .targetUserId(targetUserId)
                .targetUserEmail(targetUserEmail)
                .assignedToId(assignedToId)
                .ticketId(ticketId)
                .timestamp(LocalDateTime.now())
                .build();

        notificationLogs.add(notificationLog);
        if (notificationLogs.size() > MAX_LOGS) {
            notificationLogs.poll();
        }
    }

    public List<NotificationLog> getAllNotifications() {
        List<NotificationLog> list = new ArrayList<>(notificationLogs);
        Collections.reverse(list);
        return list;
    }

    public List<NotificationLog> getNotificationsForUser(Long userId, String userEmail, String userRole) {
        List<NotificationLog> all = getAllNotifications();
        if ("ROLE_ADMIN".equalsIgnoreCase(userRole)) {
            return all;
        }

        List<NotificationLog> filtered = new ArrayList<>();
        for (NotificationLog n : all) {
            // NEVER include SYSTEM_EVENT logs (e.g. SERVICE_HEALTHY, KAFKA_LISTENER_STARTED) for regular users or IT support!
            if ("SYSTEM_EVENT".equalsIgnoreCase(n.getCategory())) {
                continue;
            }

            if ("ROLE_IT_SUPPORT".equalsIgnoreCase(userRole)) {
                // If ticket was assigned to this IT Support staff member
                if (userId != null && userId.equals(n.getAssignedToId())) {
                    String friendlyMsg = n.getMessage();
                    if ("TICKET_ASSIGNED".equals(n.getEventType())) {
                        friendlyMsg = String.format("Ticket #%s has been assigned to you by Admin.", n.getTicketId() != null ? n.getTicketId() : "");
                    } else if ("COMMENT_ADDED".equals(n.getEventType())) {
                        friendlyMsg = String.format("New user response posted on assigned Ticket #%s.", n.getTicketId() != null ? n.getTicketId() : "");
                    }
                    filtered.add(NotificationLog.builder()
                            .id(n.getId())
                            .category(n.getCategory())
                            .eventType(n.getEventType())
                            .message(friendlyMsg)
                            .targetUserId(n.getTargetUserId())
                            .targetUserEmail(n.getTargetUserEmail())
                            .assignedToId(n.getAssignedToId())
                            .ticketId(n.getTicketId())
                            .timestamp(n.getTimestamp())
                            .build());
                    continue;
                }

                // General ticket events in queue for IT Support
                if ("TICKET_EVENT".equalsIgnoreCase(n.getCategory())) {
                    filtered.add(n);
                }
            } else if ("ROLE_USER".equalsIgnoreCase(userRole)) {
                // Match user tickets by ID or Email
                boolean isUserTicket = (userId != null && userId.equals(n.getTargetUserId())) ||
                        (userEmail != null && userEmail.equalsIgnoreCase(n.getTargetUserEmail()));

                if (isUserTicket) {
                    String friendlyMsg = n.getMessage();
                    if ("TICKET_ASSIGNED".equals(n.getEventType())) {
                        friendlyMsg = String.format("Your Ticket #%s has been assigned to IT Support.", n.getTicketId() != null ? n.getTicketId() : "");
                    } else if ("TICKET_STATUS_UPDATED".equals(n.getEventType())) {
                        friendlyMsg = String.format("Your Ticket #%s status has been updated.", n.getTicketId() != null ? n.getTicketId() : "");
                    } else if ("COMMENT_ADDED".equals(n.getEventType())) {
                        friendlyMsg = String.format("New response posted on your Ticket #%s.", n.getTicketId() != null ? n.getTicketId() : "");
                    } else if ("TICKET_CREATED".equals(n.getEventType())) {
                        friendlyMsg = String.format("Your Ticket #%s was created successfully.", n.getTicketId() != null ? n.getTicketId() : "");
                    }

                    filtered.add(NotificationLog.builder()
                            .id(n.getId())
                            .category(n.getCategory())
                            .eventType(n.getEventType())
                            .message(friendlyMsg)
                            .targetUserId(n.getTargetUserId())
                            .targetUserEmail(n.getTargetUserEmail())
                            .assignedToId(n.getAssignedToId())
                            .ticketId(n.getTicketId())
                            .timestamp(n.getTimestamp())
                            .build());
                }
            }
        }
        return filtered;
    }
}
