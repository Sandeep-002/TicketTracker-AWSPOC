package com.ticketdesk.ticket.dto;

import com.ticketdesk.ticket.model.TicketCategory;
import com.ticketdesk.ticket.model.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    private String attachmentUrl;

    public CreateTicketRequest() {}

    public CreateTicketRequest(String title, String description, TicketCategory category, TicketPriority priority, String attachmentUrl) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.attachmentUrl = attachmentUrl;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TicketCategory getCategory() { return category; }
    public void setCategory(TicketCategory category) { this.category = category; }

    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
}
