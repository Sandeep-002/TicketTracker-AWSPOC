package com.ticketdesk.auth.dto;

import com.ticketdesk.auth.service.model.Role;
import com.ticketdesk.auth.service.model.UserStatus;

import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private UserStatus status;
    private LocalDateTime createdAt;

    public UserDto() {}

    public UserDto(Long id, String fullName, String email, Role role, UserStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static UserDtoBuilder builder() {
        return new UserDtoBuilder();
    }

    public static class UserDtoBuilder {
        private Long id;
        private String fullName;
        private String email;
        private Role role;
        private UserStatus status;
        private LocalDateTime createdAt;

        public UserDtoBuilder id(Long id) { this.id = id; return this; }
        public UserDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserDtoBuilder email(String email) { this.email = email; return this; }
        public UserDtoBuilder role(Role role) { this.role = role; return this; }
        public UserDtoBuilder status(UserStatus status) { this.status = status; return this; }
        public UserDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public UserDto build() {
            return new UserDto(id, fullName, email, role, status, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
