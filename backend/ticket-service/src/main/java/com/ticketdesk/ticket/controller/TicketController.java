package com.ticketdesk.ticket.controller;

import com.ticketdesk.ticket.dto.*;
import com.ticketdesk.ticket.model.TicketCategory;
import com.ticketdesk.ticket.model.TicketPriority;
import com.ticketdesk.ticket.model.TicketStatus;
import com.ticketdesk.ticket.service.S3PresignedUrlService;
import com.ticketdesk.ticket.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final S3PresignedUrlService s3PresignedUrlService;

    public TicketController(TicketService ticketService, S3PresignedUrlService s3PresignedUrlService) {
        this.ticketService = ticketService;
        this.s3PresignedUrlService = s3PresignedUrlService;
    }

    @PostMapping
    public ResponseEntity<TicketDto> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId,
            @RequestHeader(value = "X-User-Email", defaultValue = "user@example.com") String userEmail,
            @RequestHeader(value = "X-User-Name", defaultValue = "User") String userName) {
        TicketDto dto = ticketService.createTicket(request, userId, userEmail, userName);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TicketDto>> getTickets(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId,
            @RequestHeader(value = "X-User-Role", defaultValue = "ROLE_USER") String role,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) TicketCategory category) {
        return ResponseEntity.ok(ticketService.getTickets(userId, role, status, priority, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> getTicketById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId,
            @RequestHeader(value = "X-User-Role", defaultValue = "ROLE_USER") String role) {
        return ResponseEntity.ok(ticketService.getTicketById(id, userId, role));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long actorId,
            @RequestHeader(value = "X-User-Name", defaultValue = "Agent") String actorName,
            @RequestHeader(value = "X-User-Role", defaultValue = "ROLE_USER") String actorRole) {
        return ResponseEntity.ok(ticketService.updateStatus(id, request, actorId, actorName, actorRole));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<TicketDto> assignTicket(
            @PathVariable Long id,
            @RequestParam Long assignedToId,
            @RequestParam String assignedToName,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long actorId,
            @RequestHeader(value = "X-User-Name", defaultValue = "Admin") String actorName) {
        return ResponseEntity.ok(ticketService.assignTicket(id, assignedToId, assignedToName, actorId, actorName));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long id,
            @Valid @RequestBody AddCommentRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long authorId,
            @RequestHeader(value = "X-User-Name", defaultValue = "User") String authorName,
            @RequestHeader(value = "X-User-Role", defaultValue = "ROLE_USER") String authorRole) {
        CommentDto dto = ticketService.addComment(id, request, authorId, authorName, authorRole);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/presigned-url")
    public ResponseEntity<PresignedUrlResponse> getPresignedUploadUrl(
            @PathVariable Long id,
            @RequestParam String filename,
            @RequestParam(required = false, defaultValue = "application/octet-stream") String contentType) {
        return ResponseEntity.ok(s3PresignedUrlService.generatePresignedUploadUrl(filename, contentType));
    }

    private static final java.util.Map<String, byte[]> ATTACHMENT_STORAGE = new java.util.concurrent.ConcurrentHashMap<>();
    private static final java.util.Map<String, String> ATTACHMENT_CONTENT_TYPES = new java.util.concurrent.ConcurrentHashMap<>();

    @RequestMapping(value = "/simulated-upload/**", method = {RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<Void> handleSimulatedUpload(
            jakarta.servlet.http.HttpServletRequest request,
            @RequestBody byte[] fileData,
            @RequestHeader(value = "Content-Type", required = false) String contentType) {
        String fullPath = request.getRequestURI();
        String fileKey = fullPath.substring(fullPath.indexOf("/simulated-upload/") + "/simulated-upload/".length());
        ATTACHMENT_STORAGE.put(fileKey, fileData);
        if (contentType != null) {
            ATTACHMENT_CONTENT_TYPES.put(fileKey, contentType);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/attachments/**")
    public ResponseEntity<byte[]> downloadAttachment(jakarta.servlet.http.HttpServletRequest request) {
        String fullPath = request.getRequestURI();
        String fileKey = fullPath.substring(fullPath.indexOf("/attachments/") + "/attachments/".length());

        byte[] data = ATTACHMENT_STORAGE.get(fileKey);
        String filename = fileKey.contains("/") ? fileKey.substring(fileKey.lastIndexOf('/') + 1) : fileKey;
        // Strip UUID prefix if present
        if (filename.contains("-")) {
            int dashIdx = filename.indexOf('-');
            if (dashIdx > 0 && dashIdx < filename.length() - 1) {
                filename = filename.substring(dashIdx + 1);
            }
        }

        if (data == null) {
            // If file was uploaded before server restart or mock URL, generate placeholder content matching filename extension
            String text = "Ticket Attachment File\nFilename: " + filename + "\nDownloaded: " + java.time.LocalDateTime.now();
            data = text.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        }

        String contentType = ATTACHMENT_CONTENT_TYPES.getOrDefault(fileKey, determineContentType(filename));
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
        headers.setContentType(org.springframework.http.MediaType.parseMediaType(contentType));

        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }

    private String determineContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".pdf")) return "application/pdf";
        if (lower.endsWith(".txt")) return "text/plain";
        if (lower.endsWith(".csv")) return "text/csv";
        if (lower.endsWith(".json")) return "application/json";
        if (lower.endsWith(".zip")) return "application/zip";
        if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (lower.endsWith(".xlsx")) return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        return "application/octet-stream";
    }
}
