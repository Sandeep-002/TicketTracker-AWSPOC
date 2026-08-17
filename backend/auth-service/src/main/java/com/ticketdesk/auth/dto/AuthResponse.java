package com.ticketdesk.auth.dto;

import com.ticketdesk.auth.service.model.Role;
import com.ticketdesk.auth.service.model.UserStatus;

public class AuthResponse {
    private String token;
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private UserStatus status;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String fullName, String email, Role role, UserStatus status, String message) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
        this.message = message;
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private Long id;
        private String fullName;
        private String email;
        private Role role;
        private UserStatus status;
        private String message;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder id(Long id) { this.id = id; return this; }
        public AuthResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder role(Role role) { this.role = role; return this; }
        public AuthResponseBuilder status(UserStatus status) { this.status = status; return this; }
        public AuthResponseBuilder message(String message) { this.message = message; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, id, fullName, email, role, status, message);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

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

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
