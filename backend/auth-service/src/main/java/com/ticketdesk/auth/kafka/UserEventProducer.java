package com.ticketdesk.auth.kafka;

import com.ticketdesk.auth.dto.UserEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class UserEventProducer {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(UserEventProducer.class);
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "user-events";

    public UserEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendUserEvent(UserEvent event) {
        log.info("Publishing user event [{}] for user: {}", event.getEventType(), event.getUserEmail());
        Thread thread = new Thread(() -> {
            boolean kafkaSent = false;
            try {
                kafkaTemplate.send(TOPIC, String.valueOf(event.getUserId()), event).get();
                kafkaSent = true;
            } catch (Throwable e) {
                log.warn("Kafka user event publish attempt failed, executing HTTP fallback: {}", e.getMessage());
            }

            if (!kafkaSent) {
                try {
                    org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
                    java.util.Map<String, Object> payload = new java.util.HashMap<>();
                    payload.put("category", "USER_EVENT");
                    payload.put("eventType", event.getEventType());
                    payload.put("message", String.format("User Account Event [%s] for %s - Account status: %s", event.getEventType(), event.getUserEmail(), event.getStatus()));
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
