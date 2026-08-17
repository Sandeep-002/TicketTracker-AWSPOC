package com.ticketdesk.ticket.repository;

import com.ticketdesk.ticket.model.Ticket;
import com.ticketdesk.ticket.model.TicketCategory;
import com.ticketdesk.ticket.model.TicketPriority;
import com.ticketdesk.ticket.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {
    List<Ticket> findByCreatedById(Long createdById);
    List<Ticket> findByAssignedToId(Long assignedToId);
    
    long countByStatus(TicketStatus status);
    long countByPriority(TicketPriority priority);
    long countByCategory(TicketCategory category);
}
