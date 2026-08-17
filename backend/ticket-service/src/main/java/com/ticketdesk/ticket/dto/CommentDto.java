package com.ticketdesk.ticket.dto;

import java.time.LocalDateTime;

public class CommentDto {
    private Long id;
    private Long authorId;
    private String authorName;
    private String authorRole;
    private String content;
    private LocalDateTime createdAt;

    public CommentDto() {}

    public CommentDto(Long id, Long authorId, String authorName, String authorRole, String content, LocalDateTime createdAt) {
        this.id = id;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorRole = authorRole;
        this.content = content;
        this.createdAt = createdAt;
    }

    public static CommentDtoBuilder builder() { return new CommentDtoBuilder(); }

    public static class CommentDtoBuilder {
        private Long id;
        private Long authorId;
        private String authorName;
        private String authorRole;
        private String content;
        private LocalDateTime createdAt;

        public CommentDtoBuilder id(Long id) { this.id = id; return this; }
        public CommentDtoBuilder authorId(Long authorId) { this.authorId = authorId; return this; }
        public CommentDtoBuilder authorName(String authorName) { this.authorName = authorName; return this; }
        public CommentDtoBuilder authorRole(String authorRole) { this.authorRole = authorRole; return this; }
        public CommentDtoBuilder content(String content) { this.content = content; return this; }
        public CommentDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public CommentDto build() {
            return new CommentDto(id, authorId, authorName, authorRole, content, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
}

