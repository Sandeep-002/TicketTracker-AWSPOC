package com.ticketdesk.ticket.repository;

import com.ticketdesk.ticket.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}
