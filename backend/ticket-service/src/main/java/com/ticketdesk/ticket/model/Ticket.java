package com.ticketdesk.ticket.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    private Long createdById;
    private String createdByEmail;
    private String createdByName;

    private Long assignedToId;
    private String assignedToName;

    @Column(columnDefinition = "LONGTEXT")
    private String attachmentUrl;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Ticket() {}

    public Ticket(Long id, String title, String description, TicketCategory category, TicketPriority priority, TicketStatus status, Long createdById, String createdByEmail, String createdByName, Long assignedToId, String assignedToName, String attachmentUrl, List<Comment> comments, LocalDateTime createdAt, LocalDateTime updatedAt) {
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
        this.comments = comments != null ? comments : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TicketBuilder builder() { return new TicketBuilder(); }

    public static class TicketBuilder {
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
        private List<Comment> comments = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public TicketBuilder id(Long id) { this.id = id; return this; }
        public TicketBuilder title(String title) { this.title = title; return this; }
        public TicketBuilder description(String description) { this.description = description; return this; }
        public TicketBuilder category(TicketCategory category) { this.category = category; return this; }
        public TicketBuilder priority(TicketPriority priority) { this.priority = priority; return this; }
        public TicketBuilder status(TicketStatus status) { this.status = status; return this; }
        public TicketBuilder createdById(Long createdById) { this.createdById = createdById; return this; }
        public TicketBuilder createdByEmail(String createdByEmail) { this.createdByEmail = createdByEmail; return this; }
        public TicketBuilder createdByName(String createdByName) { this.createdByName = createdByName; return this; }
        public TicketBuilder assignedToId(Long assignedToId) { this.assignedToId = assignedToId; return this; }
        public TicketBuilder assignedToName(String assignedToName) { this.assignedToName = assignedToName; return this; }
        public TicketBuilder attachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; return this; }
        public TicketBuilder comments(List<Comment> comments) { this.comments = comments; return this; }
        public TicketBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TicketBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Ticket build() {
            return new Ticket(id, title, description, category, priority, status, createdById, createdByEmail, createdByName, assignedToId, assignedToName, attachmentUrl, comments, createdAt, updatedAt);
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

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = TicketStatus.OPEN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
