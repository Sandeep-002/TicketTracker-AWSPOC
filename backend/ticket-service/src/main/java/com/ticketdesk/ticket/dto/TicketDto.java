package com.ticketdesk.ticket.dto;

import com.ticketdesk.ticket.model.TicketCategory;
import com.ticketdesk.ticket.model.TicketPriority;
import com.ticketdesk.ticket.model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class TicketDto {
    private Long id;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private Long createdById;
    private String createdByEmail;
    private String createdByName;
    private Long assignedToId;
    private String assignedToName;
    private String attachmentUrl;
    private List<CommentDto> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TicketDto() {}

    public TicketDto(Long id, String title, String description, TicketCategory category, TicketPriority priority, TicketStatus status, Long createdById, String createdByEmail, String createdByName, Long assignedToId, String assignedToName, String attachmentUrl, List<CommentDto> comments, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.createdById = createdById;
        this.createdByEmail = createdByEmail;
        this.createdByName = createdByName;
        this.assignedToId = assignedToId;
        this.assignedToName = assignedToName;
        this.attachmentUrl = attachmentUrl;
        this.comments = comments;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TicketDtoBuilder builder() { return new TicketDtoBuilder(); }

    public static class TicketDtoBuilder {
        private Long id;
        private String title;
        private String description;
        private TicketCategory category;
        private TicketPriority priority;
        private TicketStatus status;
        private Long createdById;
        private String createdByEmail;
        private String createdByName;
        private Long assignedToId;
        private String assignedToName;
        private String attachmentUrl;
        private List<CommentDto> comments;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public TicketDtoBuilder id(Long id) { this.id = id; return this; }
        public TicketDtoBuilder title(String title) { this.title = title; return this; }
        public TicketDtoBuilder description(String description) { this.description = description; return this; }
        public TicketDtoBuilder category(TicketCategory category) { this.category = category; return this; }
        public TicketDtoBuilder priority(TicketPriority priority) { this.priority = priority; return this; }
        public TicketDtoBuilder status(TicketStatus status) { this.status = status; return this; }
        public TicketDtoBuilder createdById(Long createdById) { this.createdById = createdById; return this; }
        public TicketDtoBuilder createdByEmail(String createdByEmail) { this.createdByEmail = createdByEmail; return this; }
        public TicketDtoBuilder createdByName(String createdByName) { this.createdByName = createdByName; return this; }
        public TicketDtoBuilder assignedToId(Long assignedToId) { this.assignedToId = assignedToId; return this; }
        public TicketDtoBuilder assignedToName(String assignedToName) { this.assignedToName = assignedToName; return this; }
        public TicketDtoBuilder attachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; return this; }
        public TicketDtoBuilder comments(List<CommentDto> comments) { this.comments = comments; return this; }
        public TicketDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TicketDtoBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public TicketDto build() {
            return new TicketDto(id, title, description, category, priority, status, createdById, createdByEmail, createdByName, assignedToId, assignedToName, attachmentUrl, comments, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TicketCategory getCategory() { return category; }
    public void setCategory(TicketCategory category) { this.category = category; }

    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public Long getCreatedById() { return createdById; }
    public void setCreatedById(Long createdById) { this.createdById = createdById; }

    public String getCreatedByEmail() { return createdByEmail; }
    public void setCreatedByEmail(String createdByEmail) { this.createdByEmail = createdByEmail; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }

    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public List<CommentDto> getComments() { return comments; }
    public void setComments(List<CommentDto> comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
