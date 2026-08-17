package com.ticketdesk.notification.model;

import java.time.LocalDateTime;

public class NotificationLog {
    private String id;
    private String category; // USER_EVENT, TICKET_EVENT
    private String eventType;
    private String message;
    private Long targetUserId;
    private String targetUserEmail;
    private Long assignedToId;
    private Long ticketId;
    private LocalDateTime timestamp;

    public NotificationLog() {}

    public NotificationLog(String id, String category, String eventType, String message, Long targetUserId, String targetUserEmail, Long assignedToId, Long ticketId, LocalDateTime timestamp) {
        this.id = id;
        this.category = category;
        this.eventType = eventType;
        this.message = message;
        this.targetUserId = targetUserId;
        this.targetUserEmail = targetUserEmail;
        this.assignedToId = assignedToId;
        this.ticketId = ticketId;
        this.timestamp = timestamp;
    }

    public static NotificationLogBuilder builder() { return new NotificationLogBuilder(); }

    public static class NotificationLogBuilder {
        private String id;
        private String category;
        private String eventType;
        private String message;
        private Long targetUserId;
        private String targetUserEmail;
        private Long assignedToId;
        private Long ticketId;
        private LocalDateTime timestamp;

        public NotificationLogBuilder id(String id) { this.id = id; return this; }
        public NotificationLogBuilder category(String category) { this.category = category; return this; }
        public NotificationLogBuilder eventType(String eventType) { this.eventType = eventType; return this; }
        public NotificationLogBuilder message(String message) { this.message = message; return this; }
        public NotificationLogBuilder targetUserId(Long targetUserId) { this.targetUserId = targetUserId; return this; }
        public NotificationLogBuilder targetUserEmail(String targetUserEmail) { this.targetUserEmail = targetUserEmail; return this; }
        public NotificationLogBuilder assignedToId(Long assignedToId) { this.assignedToId = assignedToId; return this; }
        public NotificationLogBuilder ticketId(Long ticketId) { this.ticketId = ticketId; return this; }
        public NotificationLogBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public NotificationLog build() {
            return new NotificationLog(id, category, eventType, message, targetUserId, targetUserEmail, assignedToId, ticketId, timestamp);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getTargetUserId() { return targetUserId; }
    public void setTargetUserId(Long targetUserId) { this.targetUserId = targetUserId; }

    public String getTargetUserEmail() { return targetUserEmail; }
    public void setTargetUserEmail(String targetUserEmail) { this.targetUserEmail = targetUserEmail; }

    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }

    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public LocalDateTime getCreatedAt() { return timestamp; }
    public void setCreatedAt(LocalDateTime createdAt) { this.timestamp = createdAt; }
}
