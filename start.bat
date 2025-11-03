@echo off
call .\gradlew war

timeout /t 3 /nobreak >nul


docker compose up --build -d
