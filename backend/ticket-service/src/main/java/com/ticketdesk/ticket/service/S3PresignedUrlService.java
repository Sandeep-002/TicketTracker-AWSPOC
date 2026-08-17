package com.ticketdesk.ticket.service;

import com.ticketdesk.ticket.dto.PresignedUrlResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.time.Duration;
import java.util.UUID;

@Service
public class S3PresignedUrlService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(S3PresignedUrlService.class);

    @Value("${aws.s3.bucket-name:ticketdesk-attachments}")
    private String bucketName;

    @Value("${aws.region:us-east-1}")
    private String region;

    public PresignedUrlResponse generatePresignedUploadUrl(String originalFilename, String contentType) {
        String fileKey = "attachments/" + UUID.randomUUID() + "-" + originalFilename;
        long expiresInSeconds = 900; // 15 minutes

        try {
            S3Presigner presigner = S3Presigner.builder()
                    .region(Region.of(region))
                    .credentialsProvider(DefaultCredentialsProvider.create())
                    .build();

            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .contentType(contentType != null ? contentType : "application/octet-stream")
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofSeconds(expiresInSeconds))
                    .putObjectRequest(objectRequest)
                    .build();

            String presignedUrl = presigner.presignPutObject(presignRequest).url().toString();
            String publicUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + fileKey;

            return PresignedUrlResponse.builder()
                    .presignedUrl(presignedUrl)
                    .fileKey(fileKey)
                    .publicUrl(publicUrl)
                    .expiresInSeconds(expiresInSeconds)
                    .build();
        } catch (Exception e) {
            log.warn("AWS S3 SDK credentials not available, falling back to simulated Presigned URL: {}", e.getMessage());
            // Fallback for local testing
            String simulatedUrl = "http://localhost:8082/api/v1/tickets/simulated-upload/" + fileKey;
            String publicUrl = "http://localhost:8082/api/v1/tickets/attachments/" + fileKey;
            return PresignedUrlResponse.builder()
                    .presignedUrl(simulatedUrl)
                    .fileKey(fileKey)
                    .publicUrl(publicUrl)
                    .expiresInSeconds(expiresInSeconds)
                    .build();
        }
    }
}
