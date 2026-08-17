package com.ticketdesk.ticket.dto;

import java.time.LocalDateTime;

public class TicketEvent {
    private String eventType; // TICKET_CREATED, TICKET_STATUS_UPDATED, COMMENT_ADDED, TICKET_ASSIGNED
    private Long ticketId;
    private String ticketTitle;
    private String status;
    private String priority;
    private Long actorId;
    private String actorName;
    private Long createdById;
    private String createdByEmail;
    private Long assignedToId;
    private String assignedToName;
    private LocalDateTime timestamp;

    public TicketEvent() {}

    public TicketEvent(String eventType, Long ticketId, String ticketTitle, String status, String priority, Long actorId, String actorName, Long createdById, String createdByEmail, Long assignedToId, String assignedToName, LocalDateTime timestamp) {
        this.eventType = eventType;
        this.ticketId = ticketId;
        this.ticketTitle = ticketTitle;
        this.status = status;
        this.priority = priority;
        this.actorId = actorId;
        this.actorName = actorName;
        this.createdById = createdById;
        this.createdByEmail = createdByEmail;
        this.assignedToId = assignedToId;
        this.assignedToName = assignedToName;
        this.timestamp = timestamp;
    }

    public static TicketEventBuilder builder() { return new TicketEventBuilder(); }

    public static class TicketEventBuilder {
        private String eventType;
        private Long ticketId;
        private String ticketTitle;
        private String status;
        private String priority;
        private Long actorId;
        private String actorName;
        private Long createdById;
        private String createdByEmail;
        private Long assignedToId;
        private String assignedToName;
        private LocalDateTime timestamp;

        public TicketEventBuilder eventType(String eventType) { this.eventType = eventType; return this; }
        public TicketEventBuilder ticketId(Long ticketId) { this.ticketId = ticketId; return this; }
        public TicketEventBuilder ticketTitle(String ticketTitle) { this.ticketTitle = ticketTitle; return this; }
        public TicketEventBuilder status(String status) { this.status = status; return this; }
        public TicketEventBuilder priority(String priority) { this.priority = priority; return this; }
        public TicketEventBuilder actorId(Long actorId) { this.actorId = actorId; return this; }
        public TicketEventBuilder actorName(String actorName) { this.actorName = actorName; return this; }
        public TicketEventBuilder createdById(Long createdById) { this.createdById = createdById; return this; }
        public TicketEventBuilder createdByEmail(String createdByEmail) { this.createdByEmail = createdByEmail; return this; }
        public TicketEventBuilder assignedToId(Long assignedToId) { this.assignedToId = assignedToId; return this; }
        public TicketEventBuilder assignedToName(String assignedToName) { this.assignedToName = assignedToName; return this; }
        public TicketEventBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public TicketEvent build() {
            return new TicketEvent(eventType, ticketId, ticketTitle, status, priority, actorId, actorName, createdById, createdByEmail, assignedToId, assignedToName, timestamp);
        }
    }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }

    public String getTicketTitle() { return ticketTitle; }
    public void setTicketTitle(String ticketTitle) { this.ticketTitle = ticketTitle; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Long getActorId() { return actorId; }
    public void setActorId(Long actorId) { this.actorId = actorId; }

    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }

    public Long getCreatedById() { return createdById; }
    public void setCreatedById(Long createdById) { this.createdById = createdById; }

    public String getCreatedByEmail() { return createdByEmail; }
    public void setCreatedByEmail(String createdByEmail) { this.createdByEmail = createdByEmail; }

    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }

    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

