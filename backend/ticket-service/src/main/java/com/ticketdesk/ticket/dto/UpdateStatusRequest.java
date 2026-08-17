package com.ticketdesk.ticket.dto;

import com.ticketdesk.ticket.model.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    @NotNull(message = "Status is required")
    private TicketStatus status;

    private Long assignedToId;
    private String assignedToName;

    public UpdateStatusRequest() {}

    public UpdateStatusRequest(TicketStatus status, Long assignedToId, String assignedToName) {
        this.status = status;
        this.assignedToId = assignedToId;
        this.assignedToName = assignedToName;
    }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }

    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }
}
