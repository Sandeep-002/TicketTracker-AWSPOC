package com.ticketdesk.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddCommentRequest {
    @NotBlank(message = "Comment content cannot be empty")
    private String content;

    public AddCommentRequest() {}

    public AddCommentRequest(String content) {
        this.content = content;
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
