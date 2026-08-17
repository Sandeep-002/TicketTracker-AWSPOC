Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting TicketDesk Full Stack Microservices System   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Services: Eureka (8761), Gateway (8080), Auth (8081), Ticket (8082), Notification (8083), React UI (3000)" -ForegroundColor Yellow
Write-Host ""

try {
    docker compose up --build
} catch {
    docker-compose up --build
}
