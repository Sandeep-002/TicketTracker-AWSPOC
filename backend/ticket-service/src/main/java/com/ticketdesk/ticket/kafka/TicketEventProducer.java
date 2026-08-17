package com.ticketdesk.ticket.kafka;

import com.ticketdesk.ticket.dto.TicketEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class TicketEventProducer {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(TicketEventProducer.class);
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "ticket-events";

    public TicketEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendTicketEvent(TicketEvent event) {
        log.info("Publishing ticket event [{}] for ticket ID: {}", event.getEventType(), event.getTicketId());
        Thread thread = new Thread(() -> {
            boolean kafkaSent = false;
            try {
                kafkaTemplate.send(TOPIC, String.valueOf(event.getTicketId()), event).get();
                kafkaSent = true;
            } catch (Throwable e) {
                log.warn("Kafka ticket event publish attempt failed, executing HTTP fallback: {}", e.getMessage());
            }

            if (!kafkaSent) {
                try {
                    org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
                    java.util.Map<String, Object> payload = new java.util.HashMap<>();
                    payload.put("category", "TICKET_EVENT");
                    payload.put("eventType", event.getEventType());
                    payload.put("ticketId", event.getTicketId());
                    payload.put("createdById", event.getCreatedById());
                    payload.put("createdByEmail", event.getCreatedByEmail());
                    payload.put("assignedToId", event.getAssignedToId());
                    payload.put("assignedToName", event.getAssignedToName());
                    payload.put("message", String.format("Ticket Event [%s] on Ticket #%s '%s' - Current Status: %s", event.getEventType(), event.getTicketId(), event.getTicketTitle(), event.getStatus()));
                    restTemplate.postForObject("http://localhost:8083/api/v1/notifications", payload, Void.class);
                } catch (Throwable ignored) {
                    // Fallback attempt ignore
                }
            }
        });
        thread.setDaemon(true);
        thread.start();
    }
}
