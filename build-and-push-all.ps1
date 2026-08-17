# PowerShell Script to Build and Push all Frontend and Backend Docker Images to AWS ECR & Docker Hub

$AWS_REGION = "ap-southeast-2"
$AWS_ACCOUNT_ID = "036230293591"
$ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
$DOCKERHUB_PREFIX = "sandysingh010903"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 1. Authenticating to AWS ECR" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 2. Authenticating to Docker Hub (if needed)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
# docker login

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 3. Building & Pushing Frontend Image" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
docker build -t "${ECR_REGISTRY}/tkt-frontend:latest" -t "${DOCKERHUB_PREFIX}/ticketdesk-frontend:latest" ./frontend/ticket-desk-ui
docker push "${ECR_REGISTRY}/tkt-frontend:latest"
docker push "${DOCKERHUB_PREFIX}/ticketdesk-frontend:latest"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 4. Building & Pushing Auth Service Image" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
docker build -t "${ECR_REGISTRY}/tkt-auth:latest" -t "${DOCKERHUB_PREFIX}/ticketdesk-auth-service:latest" ./backend/auth-service
docker push "${ECR_REGISTRY}/tkt-auth:latest"
docker push "${DOCKERHUB_PREFIX}/ticketdesk-auth-service:latest"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 5. Building & Pushing API Gateway Image" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
docker build -t "${ECR_REGISTRY}/tkt-gateway:latest" -t "${DOCKERHUB_PREFIX}/ticketdesk-api-gateway:latest" ./backend/api-gateway
docker push "${ECR_REGISTRY}/tkt-gateway:latest"
docker push "${DOCKERHUB_PREFIX}/ticketdesk-api-gateway:latest"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 6. Building & Pushing Ticket Service Image" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
docker build -t "${ECR_REGISTRY}/tkt-ticket:latest" -t "${DOCKERHUB_PREFIX}/ticketdesk-ticket-service:latest" ./backend/ticket-service
docker push "${ECR_REGISTRY}/tkt-ticket:latest"
docker push "${DOCKERHUB_PREFIX}/ticketdesk-ticket-service:latest"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 7. Building & Pushing Notification Service Image" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
docker build -t "${ECR_REGISTRY}/tkt-notification:latest" -t "${DOCKERHUB_PREFIX}/ticketdesk-notification-service:latest" ./backend/notification-service
docker push "${ECR_REGISTRY}/tkt-notification:latest"
docker push "${DOCKERHUB_PREFIX}/ticketdesk-notification-service:latest"

Write-Host "==========================================" -ForegroundColor Green
Write-Host " Build & Push Completed Successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
