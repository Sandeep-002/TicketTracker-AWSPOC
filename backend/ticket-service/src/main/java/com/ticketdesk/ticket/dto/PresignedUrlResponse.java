package com.ticketdesk.ticket.dto;

public class PresignedUrlResponse {
    private String presignedUrl;
    private String fileKey;
    private String publicUrl;
    private long expiresInSeconds;

    public PresignedUrlResponse() {}

    public PresignedUrlResponse(String presignedUrl, String fileKey, String publicUrl, long expiresInSeconds) {
        this.presignedUrl = presignedUrl;
        this.fileKey = fileKey;
        this.publicUrl = publicUrl;
        this.expiresInSeconds = expiresInSeconds;
    }

    public static PresignedUrlResponseBuilder builder() { return new PresignedUrlResponseBuilder(); }

    public static class PresignedUrlResponseBuilder {
        private String presignedUrl;
        private String fileKey;
        private String publicUrl;
        private long expiresInSeconds;

        public PresignedUrlResponseBuilder presignedUrl(String presignedUrl) { this.presignedUrl = presignedUrl; return this; }
        public PresignedUrlResponseBuilder fileKey(String fileKey) { this.fileKey = fileKey; return this; }
        public PresignedUrlResponseBuilder publicUrl(String publicUrl) { this.publicUrl = publicUrl; return this; }
        public PresignedUrlResponseBuilder expiresInSeconds(long expiresInSeconds) { this.expiresInSeconds = expiresInSeconds; return this; }

        public PresignedUrlResponse build() {
            return new PresignedUrlResponse(presignedUrl, fileKey, publicUrl, expiresInSeconds);
        }
    }

    public String getPresignedUrl() { return presignedUrl; }
    public void setPresignedUrl(String presignedUrl) { this.presignedUrl = presignedUrl; }

    public String getFileKey() { return fileKey; }
    public void setFileKey(String fileKey) { this.fileKey = fileKey; }

    public String getPublicUrl() { return publicUrl; }
    public void setPublicUrl(String publicUrl) { this.publicUrl = publicUrl; }

    public long getExpiresInSeconds() { return expiresInSeconds; }
    public void setExpiresInSeconds(long expiresInSeconds) { this.expiresInSeconds = expiresInSeconds; }
}

