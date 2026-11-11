@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js wurde nicht gefunden. Bitte Node.js installieren oder RTA 0.2 portable vorbereiten.
 pause
 exit /b 1
)
start "" "http://127.0.0.1:8765"
node server.js
pause
