package com.ticketdesk.ticket.dto;

import java.util.Map;

public class DashboardStatsDto {
    private long totalTickets;
    private Map<String, Long> statusCounts;
    private Map<String, Long> priorityCounts;
    private Map<String, Long> categoryCounts;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalTickets, Map<String, Long> statusCounts, Map<String, Long> priorityCounts, Map<String, Long> categoryCounts) {
        this.totalTickets = totalTickets;
        this.statusCounts = statusCounts;
        this.priorityCounts = priorityCounts;
        this.categoryCounts = categoryCounts;
    }

    public static DashboardStatsDtoBuilder builder() { return new DashboardStatsDtoBuilder(); }

    public static class DashboardStatsDtoBuilder {
        private long totalTickets;
        private Map<String, Long> statusCounts;
        private Map<String, Long> priorityCounts;
        private Map<String, Long> categoryCounts;

        public DashboardStatsDtoBuilder totalTickets(long totalTickets) { this.totalTickets = totalTickets; return this; }
        public DashboardStatsDtoBuilder statusCounts(Map<String, Long> statusCounts) { this.statusCounts = statusCounts; return this; }
        public DashboardStatsDtoBuilder priorityCounts(Map<String, Long> priorityCounts) { this.priorityCounts = priorityCounts; return this; }
        public DashboardStatsDtoBuilder categoryCounts(Map<String, Long> categoryCounts) { this.categoryCounts = categoryCounts; return this; }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(totalTickets, statusCounts, priorityCounts, categoryCounts);
        }
    }

    public long getTotalTickets() { return totalTickets; }
    public void setTotalTickets(long totalTickets) { this.totalTickets = totalTickets; }

    public Map<String, Long> getStatusCounts() { return statusCounts; }
    public void setStatusCounts(Map<String, Long> statusCounts) { this.statusCounts = statusCounts; }

    public Map<String, Long> getTicketsByStatus() { return statusCounts; }
    public void setTicketsByStatus(Map<String, Long> ticketsByStatus) { this.statusCounts = ticketsByStatus; }

    public Map<String, Long> getPriorityCounts() { return priorityCounts; }
    public void setPriorityCounts(Map<String, Long> priorityCounts) { this.priorityCounts = priorityCounts; }

    public Map<String, Long> getCategoryCounts() { return categoryCounts; }
    public void setCategoryCounts(Map<String, Long> categoryCounts) { this.categoryCounts = categoryCounts; }
}

