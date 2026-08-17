@echo off
echo ========================================================
echo          Starting Local Apache Kafka (Port 9092)       
echo ========================================================
cd /d "%~dp0kafka\kafka_2.13-4.1.1"
call bin\windows\kafka-server-start.bat config\server.properties
pause
