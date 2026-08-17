#!/bin/bash
# TicketDesk AWS ECR & Docker Hub Build and Push Script

AWS_REGION="ap-southeast-2"
AWS_ACCOUNT_ID="036230293591"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
DOCKERHUB_PREFIX="sandysingh010903"

echo "=========================================="
echo " 1. Authenticating to AWS ECR"
echo "=========================================="
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

echo "=========================================="
echo " 2. Building & Pushing Frontend Image"
echo "=========================================="
docker build -t ${ECR_REGISTRY}/tkt-frontend:latest -t ${DOCKERHUB_PREFIX}/ticketdesk-frontend:latest ./frontend/ticket-desk-ui
docker push ${ECR_REGISTRY}/tkt-frontend:latest
docker push ${DOCKERHUB_PREFIX}/ticketdesk-frontend:latest

echo "=========================================="
echo " 3. Building & Pushing Auth Service Image"
echo "=========================================="
docker build -t ${ECR_REGISTRY}/tkt-auth:latest -t ${DOCKERHUB_PREFIX}/ticketdesk-auth-service:latest ./backend/auth-service
docker push ${ECR_REGISTRY}/tkt-auth:latest
docker push ${DOCKERHUB_PREFIX}/ticketdesk-auth-service:latest

echo "=========================================="
echo " 4. Building & Pushing API Gateway Image"
echo "=========================================="
docker build -t ${ECR_REGISTRY}/tkt-gateway:latest -t ${DOCKERHUB_PREFIX}/ticketdesk-api-gateway:latest ./backend/api-gateway
docker push ${ECR_REGISTRY}/tkt-gateway:latest
docker push ${DOCKERHUB_PREFIX}/ticketdesk-api-gateway:latest

echo "=========================================="
echo " 5. Building & Pushing Ticket Service Image"
echo "=========================================="
docker build -t ${ECR_REGISTRY}/tkt-ticket:latest -t ${DOCKERHUB_PREFIX}/ticketdesk-ticket-service:latest ./backend/ticket-service
docker push ${ECR_REGISTRY}/tkt-ticket:latest
docker push ${DOCKERHUB_PREFIX}/ticketdesk-ticket-service:latest

echo "=========================================="
echo " 6. Building & Pushing Notification Service Image"
echo "=========================================="
docker build -t ${ECR_REGISTRY}/tkt-notification:latest -t ${DOCKERHUB_PREFIX}/ticketdesk-notification-service:latest ./backend/notification-service
docker push ${ECR_REGISTRY}/tkt-notification:latest
docker push ${DOCKERHUB_PREFIX}/ticketdesk-notification-service:latest

echo "=========================================="
echo " 7. Building & Pushing Eureka Server Image"
echo "=========================================="
docker build -t ${DOCKERHUB_PREFIX}/ticketdesk-eureka-server:latest ./backend/eureka-server
docker push ${DOCKERHUB_PREFIX}/ticketdesk-eureka-server:latest

echo "=========================================="
echo " Build & Push to AWS ECR and Docker Hub Complete!"
echo "=========================================="
