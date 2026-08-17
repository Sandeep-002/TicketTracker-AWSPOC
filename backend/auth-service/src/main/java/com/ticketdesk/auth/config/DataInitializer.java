package com.ticketdesk.auth.config;

import com.ticketdesk.auth.service.model.Role;
import com.ticketdesk.auth.service.model.User;
import com.ticketdesk.auth.service.model.UserStatus;
import com.ticketdesk.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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
        String adminEmail = "admin@123";
        User admin = userRepository.findByEmail(adminEmail)
                .orElseGet(() -> User.builder().email(adminEmail).build());

        admin.setFullName("System Administrator");
        admin.setPassword(passwordEncoder.encode("Password@123"));
        admin.setRole(Role.ROLE_ADMIN);
        admin.setStatus(UserStatus.APPROVED);

        userRepository.save(admin);
        log.info("Default System Admin account seeded/reset with email: {}", adminEmail);
    }
}
