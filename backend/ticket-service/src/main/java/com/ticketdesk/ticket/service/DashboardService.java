package com.ticketdesk.ticket.service;

import com.ticketdesk.ticket.dto.DashboardStatsDto;
import com.ticketdesk.ticket.model.TicketCategory;
import com.ticketdesk.ticket.model.TicketPriority;
import com.ticketdesk.ticket.model.TicketStatus;
import com.ticketdesk.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final TicketRepository ticketRepository;

    public DashboardService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        long total = ticketRepository.count();

        Map<String, Long> statusCounts = new HashMap<>();
        for (TicketStatus status : TicketStatus.values()) {
            statusCounts.put(status.name(), ticketRepository.countByStatus(status));
        }

        Map<String, Long> priorityCounts = new HashMap<>();
        for (TicketPriority priority : TicketPriority.values()) {
            priorityCounts.put(priority.name(), ticketRepository.countByPriority(priority));
        }

        Map<String, Long> categoryCounts = new HashMap<>();
        for (TicketCategory category : TicketCategory.values()) {
            categoryCounts.put(category.name(), ticketRepository.countByCategory(category));
        }

        return DashboardStatsDto.builder()
                .totalTickets(total)
                .statusCounts(statusCounts)
                .priorityCounts(priorityCounts)
                .categoryCounts(categoryCounts)
                .build();
    }
}
