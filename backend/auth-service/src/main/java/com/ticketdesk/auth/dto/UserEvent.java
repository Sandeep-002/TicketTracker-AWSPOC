package com.ticketdesk.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class UserEvent {
    private String eventType; // USER_REGISTERED, USER_APPROVED, USER_REJECTED, IT_SUPPORT_CREATED
    private Long userId;
    private String userEmail;
    private String fullName;
    private String role;
    private String status;
    private LocalDateTime timestamp;

    public UserEvent() {}

    public UserEvent(String eventType, Long userId, String userEmail, String fullName, String role, String status, LocalDateTime timestamp) {
        this.eventType = eventType;
        this.userId = userId;
        this.userEmail = userEmail;
        this.fullName = fullName;
        this.role = role;
        this.status = status;
        this.timestamp = timestamp;
    }

    public static UserEventBuilder builder() {
        return new UserEventBuilder();
    }

    public static class UserEventBuilder {
        private String eventType;
        private Long userId;
        private String userEmail;
        private String fullName;
        private String role;
        private String status;
        private LocalDateTime timestamp;

        public UserEventBuilder eventType(String eventType) { this.eventType = eventType; return this; }
        public UserEventBuilder userId(Long userId) { this.userId = userId; return this; }
        public UserEventBuilder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public UserEventBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserEventBuilder role(String role) { this.role = role; return this; }
        public UserEventBuilder status(String status) { this.status = status; return this; }
        public UserEventBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public UserEvent build() {
            return new UserEvent(eventType, userId, userEmail, fullName, role, status, timestamp);
        }
    }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
