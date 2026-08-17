package com.ticketdesk.auth.repository;

import com.ticketdesk.auth.service.model.Role;
import com.ticketdesk.auth.service.model.User;
import com.ticketdesk.auth.service.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findAllByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByStatus(UserStatus status);
    List<User> findByRole(Role role);
}
