#!/bin/bash
# TicketDesk AWS ECR Image Build and Push Script

AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="123456789012" # Replace with your AWS Account ID
REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "=== 1. Authenticating to AWS ECR ==="
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${REGISTRY}

echo "=== 2. Building & Tagging Microservice Docker Images ==="

# Eureka Server
docker build -t ${REGISTRY}/ticketdesk-eureka:latest ../backend/eureka-server
docker push ${REGISTRY}/ticketdesk-eureka:latest

# API Gateway
docker build -t ${REGISTRY}/ticketdesk-gateway:latest ../backend/api-gateway
docker push ${REGISTRY}/ticketdesk-gateway:latest

# Auth Service
docker build -t ${REGISTRY}/ticketdesk-auth:latest ../backend/auth-service
docker push ${REGISTRY}/ticketdesk-auth:latest

# Ticket Service
docker build -t ${REGISTRY}/ticketdesk-ticket:latest ../backend/ticket-service
docker push ${REGISTRY}/ticketdesk-ticket:latest

# Notification Service
docker build -t ${REGISTRY}/ticketdesk-notification:latest ../backend/notification-service
docker push ${REGISTRY}/ticketdesk-notification:latest

# React Frontend
docker build -t ${REGISTRY}/ticketdesk-frontend:latest ../frontend/ticket-desk-ui
docker push ${REGISTRY}/ticketdesk-frontend:latest

echo "=== Build and Push to AWS ECR Completed Successfully! ==="
