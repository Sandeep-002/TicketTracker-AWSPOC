# PowerShell Script to Deploy Updated Frontend and Backend to AWS

$AWS_REGION = "ap-southeast-2"
$S3_BUCKET = "ticketdesk-frontend-036230293591"
$ECS_CLUSTER = "tkt-hs-cluster"
$ECS_SERVICE = "tkt-hs-service"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 1. Syncing Frontend UI build to AWS S3 ($S3_BUCKET)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
if (Test-Path "./frontend/ticket-desk-ui/dist") {
    aws s3 sync ./frontend/ticket-desk-ui/dist s3://$S3_BUCKET --delete --region $AWS_REGION
    Write-Host "Frontend successfully uploaded to S3 bucket ($S3_BUCKET)!" -ForegroundColor Green
} else {
    Write-Host "Error: ./frontend/ticket-desk-ui/dist not found. Please build frontend first." -ForegroundColor Red
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 2. Force New Deployment on AWS ECS Fargate" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment --region $AWS_REGION

Write-Host "==========================================" -ForegroundColor Green
Write-Host " Deployment Triggered Successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
