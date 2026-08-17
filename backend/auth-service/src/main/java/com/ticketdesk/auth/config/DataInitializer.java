package com.ticketdesk.auth.config;

import com.ticketdesk.auth.service.model.Role;
import com.ticketdesk.auth.service.model.User;
import com.ticketdesk.auth.service.model.UserStatus;
import com.ticketdesk.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataInitializer.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Clean up legacy admin@123 accounts if present
        try {
            var legacyAdmins = userRepository.findAllByEmail("admin@123");
            for (User legacy : legacyAdmins) {
                userRepository.delete(legacy);
                log.info("Deleted legacy admin@123 account (id={}).", legacy.getId());
            }
        } catch (Exception e) {
            log.warn("Notice during legacy admin cleanup: {}", e.getMessage());
        }

        seedAdmin("admin@ticketdesk.com", "System Administrator");
    }

    private void seedAdmin(String email, String name) {
        try {
            var existingAdmins = userRepository.findAllByEmail(email);
            User admin;
            if (existingAdmins.isEmpty()) {
                admin = User.builder()
                        .email(email)
                        .fullName(name)
                        .password(passwordEncoder.encode("Password@123"))
                        .role(Role.ROLE_ADMIN)
                        .status(UserStatus.APPROVED)
                        .build();
                userRepository.save(admin);
                log.info("Default Admin account created with email: {}", email);
            } else {
                admin = existingAdmins.get(0);
                admin.setFullName(name);
                admin.setPassword(passwordEncoder.encode("Password@123"));
                admin.setRole(Role.ROLE_ADMIN);
                admin.setStatus(UserStatus.APPROVED);
                userRepository.save(admin);

                // Clean up any extra duplicate entries if present
                for (int i = 1; i < existingAdmins.size(); i++) {
                    userRepository.delete(existingAdmins.get(i));
                    log.info("Cleaned up duplicate admin user with id={}", existingAdmins.get(i).getId());
                }
                log.info("Default Admin account updated with email: {}", email);
            }
        } catch (Exception e) {
            log.error("Failed to seed admin user {}: {}", email, e.getMessage());
        }
    }
}
