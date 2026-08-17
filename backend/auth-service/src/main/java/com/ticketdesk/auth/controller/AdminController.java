package com.ticketdesk.auth.controller;

import com.ticketdesk.auth.dto.CreateItSupportRequest;
import com.ticketdesk.auth.dto.UserDto;
import com.ticketdesk.auth.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users/pending")
    public ResponseEntity<List<UserDto>> getPendingUsers() {
        return ResponseEntity.ok(adminService.getPendingUsers());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/it-support")
    public ResponseEntity<List<UserDto>> getItSupportStaff() {
        return ResponseEntity.ok(adminService.getItSupportStaff());
    }

    @PutMapping("/users/{userId}/approve")
    public ResponseEntity<UserDto> approveUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.approveUser(userId));
    }

    @PutMapping("/users/{userId}/reject")
    public ResponseEntity<UserDto> rejectUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.rejectUser(userId));
    }

    @PostMapping("/it-support")
    public ResponseEntity<UserDto> createItSupport(@Valid @RequestBody CreateItSupportRequest request) {
        UserDto response = adminService.createItSupport(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long userId,
            @RequestBody com.ticketdesk.auth.dto.UpdateUserRequest request) {
        return ResponseEntity.ok(adminService.updateUser(userId, request));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
