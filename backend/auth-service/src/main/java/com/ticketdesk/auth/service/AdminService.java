package com.ticketdesk.auth.service;

import com.ticketdesk.auth.dto.CreateItSupportRequest;
import com.ticketdesk.auth.dto.UserDto;
import com.ticketdesk.auth.dto.UserEvent;
import com.ticketdesk.auth.kafka.UserEventProducer;
import com.ticketdesk.auth.service.model.Role;
import com.ticketdesk.auth.service.model.User;
import com.ticketdesk.auth.service.model.UserStatus;
import com.ticketdesk.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserEventProducer userEventProducer;

    public AdminService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserEventProducer userEventProducer) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userEventProducer = userEventProducer;
    }

    public List<UserDto> getPendingUsers() {
        return userRepository.findByStatus(UserStatus.PENDING_APPROVAL).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getItSupportStaff() {
        return userRepository.findByRole(Role.ROLE_IT_SUPPORT).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public UserDto approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        user.setStatus(UserStatus.APPROVED);
        User updated = userRepository.save(user);

        userEventProducer.sendUserEvent(UserEvent.builder()
                .eventType("USER_APPROVED")
                .userId(updated.getId())
                .userEmail(updated.getEmail())
                .fullName(updated.getFullName())
                .role(updated.getRole().name())
                .status(updated.getStatus().name())
                .timestamp(LocalDateTime.now())
                .build());

        return mapToDto(updated);
    }

    public UserDto rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        user.setStatus(UserStatus.REJECTED);
        User updated = userRepository.save(user);

        userEventProducer.sendUserEvent(UserEvent.builder()
                .eventType("USER_REJECTED")
                .userId(updated.getId())
                .userEmail(updated.getEmail())
                .fullName(updated.getFullName())
                .role(updated.getRole().name())
                .status(updated.getStatus().name())
                .timestamp(LocalDateTime.now())
                .build());

        return mapToDto(updated);
    }

    public UserDto createItSupport(CreateItSupportRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email " + request.getEmail() + " already exists!");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_IT_SUPPORT)
                .status(UserStatus.APPROVED)
                .build();

        User saved = userRepository.save(user);

        userEventProducer.sendUserEvent(UserEvent.builder()
                .eventType("IT_SUPPORT_CREATED")
                .userId(saved.getId())
                .userEmail(saved.getEmail())
                .fullName(saved.getFullName())
                .role(saved.getRole().name())
                .status(saved.getStatus().name())
                .timestamp(LocalDateTime.now())
                .build());

        return mapToDto(saved);
    }

    public UserDto updateUser(Long userId, com.ticketdesk.auth.dto.UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }
        if (request.getRole() != null) {
            if (request.getRole() == Role.ROLE_ADMIN && user.getRole() != Role.ROLE_ADMIN) {
                throw new IllegalArgumentException("User role cannot be changed to Admin.");
            }
            user.setRole(request.getRole());
        }
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
