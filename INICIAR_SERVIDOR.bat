@echo off
title Servidor CRM/ERP WhatsApp - Synex Cloud CRM
echo ==============================================================
echo        INICIANDO SERVIDOR CRM/ERP - SYNEX TECH
echo ==============================================================
echo.
cd /d "%~dp0"
echo [+] Directorio del Proyecto: %cd%
echo [+] Verificando e instalando dependencias (por favor espere)...
call npm install
echo.
echo [+] Abriendo aplicacion en el navegador...
start http://localhost:3000
echo.
echo [+] Ejecutando servidor local en el puerto 3000...
echo.
npm run dev
pause
