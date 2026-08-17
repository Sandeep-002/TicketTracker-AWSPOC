@echo off
echo ========================================================
echo   Starting TicketDesk Full Stack Microservices System   
echo ========================================================
echo Services: Eureka (8761), Gateway (8080), Auth (8081), Ticket (8082), Notification (8083), React UI (3000)
echo.
cd /d "%~dp0"
docker compose up --build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Trying legacy docker-compose syntax...
    docker-compose up --build
)
pause
