package com.ticketdesk.auth.dto;

import com.ticketdesk.auth.service.model.Role;
import com.ticketdesk.auth.service.model.UserStatus;

public class UpdateUserRequest {
    private String fullName;
    private String email;
    private Role role;
    private UserStatus status;

    public UpdateUserRequest() {}

    public UpdateUserRequest(String fullName, String email, Role role, UserStatus status) {
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
}
