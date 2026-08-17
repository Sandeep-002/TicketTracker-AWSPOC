@echo off
echo ========================================================
echo         Starting TicketDesk React UI Frontend           
echo ========================================================
cd /d "%~dp0frontend\ticket-desk-ui"
call npm run dev
pause
