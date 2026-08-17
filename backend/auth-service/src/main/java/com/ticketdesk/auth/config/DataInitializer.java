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
        seedAdmin("admin@ticketdesk.com", "System Administrator");

        // Clean up legacy admin@123 if present
        try {
            Optional<User> legacyAdmin = userRepository.findByEmail("admin@ticketdesk.com");
            if (legacyAdmin.isPresent()) {
                Optional<User> currentAdmin = userRepository.findByEmail("admin@ticketdesk.com");
                if (currentAdmin.isPresent() && !currentAdmin.get().getId().equals(legacyAdmin.get().getId())) {
                    userRepository.delete(legacyAdmin.get());
                    log.info("Deleted legacy admin@123 user account.");
                } else {
                    User u = legacyAdmin.get();
                    u.setEmail("admin@ticketdesk.com");
                    u.setPassword(passwordEncoder.encode("Password@123"));
                    u.setRole(Role.ROLE_ADMIN);
                    u.setStatus(UserStatus.APPROVED);
                    userRepository.save(u);
                    log.info("Migrated legacy admin@123 to admin@ticketdesk.com");
                }
            }
        } catch (Exception e) {
            log.warn("Notice during legacy admin cleanup: {}", e.getMessage());
        }
    }

    private void seedAdmin(String email, String name) {
        try {
            User admin = userRepository.findByEmail(email)
                    .orElseGet(() -> User.builder().email(email).build());

            admin.setFullName(name);
            admin.setPassword(passwordEncoder.encode("Password@123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setStatus(UserStatus.APPROVED);

            userRepository.save(admin);
            log.info("Default Admin account seeded/reset with email: {}", email);
        } catch (Exception e) {
            log.error("Failed to seed admin user {}: {}", email, e.getMessage());
        }
    }
}
