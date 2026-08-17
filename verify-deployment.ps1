# PowerShell Script to Verify AWS Deployment Health

$AWS_REGION = "ap-southeast-2"
$S3_BUCKET = "tkt-hs-frontend-036230293591"
$ECS_CLUSTER = "tkt-hs-cluster"
$ECS_SERVICE = "tkt-hs-service"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 1. Checking ECS Service Status" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION --query "services[0].{Status:status, Running:runningCount, Desired:desiredCount, TaskDef:taskDefinition}" | Out-String | Write-Host -ForegroundColor Yellow

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 2. Getting Application Load Balancer (ALB) URL" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
$ALB_DNS = aws elbv2 describe-load-balancers --names tkt-hs-alb --region $AWS_REGION --query 'LoadBalancers[0].DNSName' --output text

if ($ALB_DNS) {
    Write-Host "ALB DNS: http://$ALB_DNS" -ForegroundColor Green
    Write-Host "Testing backend health endpoint (http://$ALB_DNS/actuator/health)..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "http://$ALB_DNS/actuator/health" -Method Get
        Write-Host "Health Check Success! Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Green
    } catch {
        Write-Host "Note: Backend health check failed or container is still booting up." -ForegroundColor Red
    }
} else {
    Write-Host "Could not retrieve ALB DNS." -ForegroundColor Red
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 3. CloudFront Secure HTTPS Endpoint" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
$CF_DOMAIN = aws cloudfront list-distributions --region $AWS_REGION --query "DistributionList.Items[0].DomainName" --output text 2>$null

if ($CF_DOMAIN -and $CF_DOMAIN -ne "None") {
    Write-Host "CloudFront Secure HTTPS URL: https://$CF_DOMAIN" -ForegroundColor Green
} else {
    Write-Host "CloudFront distribution not found or still deploying." -ForegroundColor Yellow
}
Write-Host "Frontend Bucket URL: http://${S3_BUCKET}.s3-website-ap-southeast-2.amazonaws.com" -ForegroundColor Gray
