package com.ticketdesk.auth.service;

import com.ticketdesk.auth.dto.*;
import com.ticketdesk.auth.kafka.UserEventProducer;
import com.ticketdesk.auth.service.model.Role;
import com.ticketdesk.auth.service.model.User;
import com.ticketdesk.auth.service.model.UserStatus;
import com.ticketdesk.auth.repository.UserRepository;
import com.ticketdesk.auth.security.JwtProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final UserEventProducer userEventProducer;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider, UserEventProducer userEventProducer) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.userEventProducer = userEventProducer;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User with email " + email + " already exists!");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .status(UserStatus.PENDING_APPROVAL)
                .build();

        User savedUser = userRepository.save(user);

        // Publish Kafka Event
        userEventProducer.sendUserEvent(UserEvent.builder()
                .eventType("USER_REGISTERED")
                .userId(savedUser.getId())
                .userEmail(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole().name())
                .status(savedUser.getStatus().name())
                .timestamp(LocalDateTime.now())
                .build());

        return AuthResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .status(savedUser.getStatus())
                .message("Registration successful. Account is pending Admin approval.")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        if (user.getStatus() == UserStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Your account registration is currently pending Admin approval. Please contact system administrator.");
        }

        if (user.getStatus() == UserStatus.REJECTED) {
            throw new IllegalStateException("Your account registration request has been rejected by Admin.");
        }

        String token = jwtProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .message("Login successful.")
                .build();
    }
}
