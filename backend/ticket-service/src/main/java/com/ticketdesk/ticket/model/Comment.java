package com.ticketdesk.ticket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    @JsonIgnore
    private Ticket ticket;

    private Long authorId;
    private String authorName;
    private String authorRole;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private LocalDateTime createdAt;

    public Comment() {}

    public Comment(Long id, Ticket ticket, Long authorId, String authorName, String authorRole, String content, LocalDateTime createdAt) {
        this.id = id;
        this.ticket = ticket;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorRole = authorRole;
        this.content = content;
        this.createdAt = createdAt;
    }

    public static CommentBuilder builder() { return new CommentBuilder(); }

    public static class CommentBuilder {
        private Long id;
        private Ticket ticket;
        private Long authorId;
        private String authorName;
        private String authorRole;
        private String content;
        private LocalDateTime createdAt;

        public CommentBuilder id(Long id) { this.id = id; return this; }
        public CommentBuilder ticket(Ticket ticket) { this.ticket = ticket; return this; }
        public CommentBuilder authorId(Long authorId) { this.authorId = authorId; return this; }
        public CommentBuilder authorName(String authorName) { this.authorName = authorName; return this; }
        public CommentBuilder authorRole(String authorRole) { this.authorRole = authorRole; return this; }
        public CommentBuilder content(String content) { this.content = content; return this; }
        public CommentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Comment build() {
            return new Comment(id, ticket, authorId, authorName, authorRole, content, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
