package com.ticketdesk.ticket.service;

import com.ticketdesk.ticket.dto.*;
import com.ticketdesk.ticket.kafka.TicketEventProducer;
import com.ticketdesk.ticket.model.*;
import com.ticketdesk.ticket.repository.CommentRepository;
import com.ticketdesk.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final TicketEventProducer ticketEventProducer;

    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public TicketService(TicketRepository ticketRepository, CommentRepository commentRepository, TicketEventProducer ticketEventProducer, org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        this.ticketRepository = ticketRepository;
        this.commentRepository = commentRepository;
        this.ticketEventProducer = ticketEventProducer;
        this.jdbcTemplate = jdbcTemplate;
    }

    @jakarta.annotation.PostConstruct
    public void initDbSchema() {
        try {
            jdbcTemplate.execute("ALTER TABLE tickets MODIFY COLUMN attachment_url LONGTEXT");
        } catch (Throwable ignored) {}
    }

    @Transactional
    public TicketDto createTicket(CreateTicketRequest request, Long userId, String userEmail, String userName) {
        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(TicketStatus.OPEN)
                .createdById(userId)
                .createdByEmail(userEmail)
                .createdByName(userName)
                .attachmentUrl(request.getAttachmentUrl())
                .build();

        Ticket saved = ticketRepository.save(ticket);

        ticketEventProducer.sendTicketEvent(TicketEvent.builder()
                .eventType("TICKET_CREATED")
                .ticketId(saved.getId())
                .ticketTitle(saved.getTitle())
                .status(saved.getStatus().name())
                .priority(saved.getPriority().name())
                .actorId(userId)
                .actorName(userName)
                .createdById(saved.getCreatedById())
                .createdByEmail(saved.getCreatedByEmail())
                .assignedToId(saved.getAssignedToId())
                .assignedToName(saved.getAssignedToName())
                .timestamp(LocalDateTime.now())
                .build());

        return mapToDto(saved);
    }

    public List<TicketDto> getTickets(Long userId, String role, TicketStatus status, TicketPriority priority, TicketCategory category) {
        List<Ticket> tickets;

        if ("ROLE_USER".equals(role)) {
            tickets = ticketRepository.findByCreatedById(userId);
        } else if ("ROLE_IT_SUPPORT".equals(role)) {
            tickets = ticketRepository.findAll();
        } else {
            tickets = ticketRepository.findAll();
        }

        return tickets.stream()
                .filter(t -> status == null || t.getStatus() == status)
                .filter(t -> priority == null || t.getPriority() == priority)
                .filter(t -> category == null || t.getCategory() == category)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public TicketDto getTicketById(Long id, Long userId, String role) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + id));

        if ("ROLE_USER".equals(role) && !ticket.getCreatedById().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access to ticket #" + id);
        }

        return mapToDto(ticket);
    }

    @Transactional
    public TicketDto updateStatus(Long id, UpdateStatusRequest request, Long actorId, String actorName, String actorRole) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + id));

        if (request.getStatus() == TicketStatus.CLOSED && "ROLE_IT_SUPPORT".equalsIgnoreCase(actorRole)) {
            throw new IllegalArgumentException("IT Support staff cannot close tickets. Only an Admin or the User can close tickets.");
        }

        validateStatusTransition(ticket.getStatus(), request.getStatus());

        ticket.setStatus(request.getStatus());
        if (request.getAssignedToId() != null) {
            ticket.setAssignedToId(request.getAssignedToId());
            ticket.setAssignedToName(request.getAssignedToName());
        }

        Ticket updated = ticketRepository.save(ticket);

        ticketEventProducer.sendTicketEvent(TicketEvent.builder()
                .eventType("TICKET_STATUS_UPDATED")
                .ticketId(updated.getId())
                .ticketTitle(updated.getTitle())
                .status(updated.getStatus().name())
                .priority(updated.getPriority().name())
                .actorId(actorId)
                .actorName(actorName)
                .createdById(updated.getCreatedById())
                .createdByEmail(updated.getCreatedByEmail())
                .assignedToId(updated.getAssignedToId())
                .assignedToName(updated.getAssignedToName())
                .timestamp(LocalDateTime.now())
                .build());

        return mapToDto(updated);
    }

    @Transactional
    public TicketDto assignTicket(Long id, Long assignedToId, String assignedToName, Long actorId, String actorName) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + id));

        ticket.setAssignedToId(assignedToId);
        ticket.setAssignedToName(assignedToName);
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        Ticket updated = ticketRepository.save(ticket);

        ticketEventProducer.sendTicketEvent(TicketEvent.builder()
                .eventType("TICKET_ASSIGNED")
                .ticketId(updated.getId())
                .ticketTitle(updated.getTitle())
                .status(updated.getStatus().name())
                .priority(updated.getPriority().name())
                .actorId(actorId)
                .actorName(actorName)
                .createdById(updated.getCreatedById())
                .createdByEmail(updated.getCreatedByEmail())
                .assignedToId(updated.getAssignedToId())
                .assignedToName(updated.getAssignedToName())
                .timestamp(LocalDateTime.now())
                .build());

        return mapToDto(updated);
    }

    @Transactional
    public CommentDto addComment(Long ticketId, AddCommentRequest request, Long authorId, String authorName, String authorRole) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + ticketId));

        Comment comment = Comment.builder()
                .ticket(ticket)
                .authorId(authorId)
                .authorName(authorName)
                .authorRole(authorRole)
                .content(request.getContent())
                .build();

        Comment saved = commentRepository.save(comment);

        ticketEventProducer.sendTicketEvent(TicketEvent.builder()
                .eventType("COMMENT_ADDED")
                .ticketId(ticket.getId())
                .ticketTitle(ticket.getTitle())
                .status(ticket.getStatus().name())
                .priority(ticket.getPriority().name())
                .actorId(authorId)
                .actorName(authorName)
                .createdById(ticket.getCreatedById())
                .createdByEmail(ticket.getCreatedByEmail())
                .assignedToId(ticket.getAssignedToId())
                .assignedToName(ticket.getAssignedToName())
                .timestamp(LocalDateTime.now())
                .build());

        return mapToCommentDto(saved);
    }

    private void validateStatusTransition(TicketStatus current, TicketStatus target) {
        if (current == target) return;

        if (current == TicketStatus.OPEN && target != TicketStatus.IN_PROGRESS && target != TicketStatus.RESOLVED && target != TicketStatus.CLOSED) {
            throw new IllegalArgumentException("Invalid transition from OPEN to " + target + ". Must be IN_PROGRESS, RESOLVED, or CLOSED.");
        }
        if (current == TicketStatus.IN_PROGRESS && target != TicketStatus.RESOLVED && target != TicketStatus.OPEN && target != TicketStatus.CLOSED) {
            throw new IllegalArgumentException("Invalid transition from IN_PROGRESS to " + target + ". Must be RESOLVED, OPEN, or CLOSED.");
        }
        if (current == TicketStatus.RESOLVED && target != TicketStatus.CLOSED && target != TicketStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Invalid transition from RESOLVED to " + target + ". Must be CLOSED or IN_PROGRESS.");
        }
        if (current == TicketStatus.CLOSED) {
            throw new IllegalArgumentException("Cannot modify status of a CLOSED ticket.");
        }
    }

    private TicketDto mapToDto(Ticket ticket) {
        List<CommentDto> comments = commentRepository.findByTicketIdOrderByCreatedAtAsc(ticket.getId()).stream()
                .map(this::mapToCommentDto)
                .collect(Collectors.toList());

        return TicketDto.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .createdById(ticket.getCreatedById())
                .createdByEmail(ticket.getCreatedByEmail())
                .createdByName(ticket.getCreatedByName())
                .assignedToId(ticket.getAssignedToId())
                .assignedToName(ticket.getAssignedToName())
                .attachmentUrl(ticket.getAttachmentUrl())
                .comments(comments)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    private CommentDto mapToCommentDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .authorId(comment.getAuthorId())
                .authorName(comment.getAuthorName())
                .authorRole(comment.getAuthorRole())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
