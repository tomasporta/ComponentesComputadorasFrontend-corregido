@echo off
chcp 65001 >nul
title Componentes Computadoras - Quasar
cd /d "%~dp0"

echo ==============================================
echo   Componentes Computadoras - Frontend Quasar
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontro Node.js. Instala la version LTS desde https://nodejs.org/
  pause
  exit /b 1
)

for /f "tokens=1 delims=." %%v in ('node -p "process.versions.node"') do set NODE_MAYOR=%%v
echo Node.js version:
node --version
if %NODE_MAYOR% LSS 22 (
  echo [ERROR] Quasar necesita Node.js 22 o superior. Instala la version LTS desde https://nodejs.org/
  pause
  exit /b 1
)

echo %CD% | find /i "OneDrive" >nul
if not errorlevel 1 (
  echo.
  echo [AVISO] El proyecto esta dentro de OneDrive. OneDrive suele bloquear archivos de
  echo         node_modules y "npm install" falla con EPERM / EBUSY.
  echo         Si falla, copia la carpeta a C:\Desarrollo y volve a ejecutar este archivo.
  echo.
)

if exist "..\node_modules" (
  echo.
  echo [AVISO] Hay una carpeta node_modules en la carpeta de arriba:
  echo         %~dp0..\node_modules
  echo         Puede hacer que Quasar use paquetes equivocados ^(error "#q-app/wrappers"^).
  echo         Borrala o move este proyecto a otra carpeta, por ejemplo C:\Desarrollo
  echo.
)

REM Instala si falta node_modules o si quedo incompleto (sin @quasar/app-vite)
if not exist "node_modules\@quasar\app-vite\package.json" (
  echo Instalando dependencias ^(solo la primera vez, puede tardar unos minutos^)...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] Fallo "npm install". Borra la carpeta node_modules y el archivo
    echo         package-lock.json si existen, y volve a intentar.
    pause
    exit /b 1
  )
)

echo.
REM --- Busca la API: respeta API_URL si ya esta definida; si no, prueba los puertos del perfil https (7136) y http (5106)
if not defined API_URL (
  powershell -NoProfile -Command "try { (New-Object Net.Sockets.TcpClient).Connect('localhost',7136); exit 0 } catch { exit 1 }" >nul 2>nul
  if not errorlevel 1 set "API_URL=https://localhost:7136"
)
if not defined API_URL (
  powershell -NoProfile -Command "try { (New-Object Net.Sockets.TcpClient).Connect('localhost',5106); exit 0 } catch { exit 1 }" >nul 2>nul
  if not errorlevel 1 set "API_URL=http://localhost:5106"
)
if not defined API_URL (
  echo.
  echo [AVISO] No se encontro la API corriendo en localhost:7136 ni en localhost:5106.
  echo         Levanta ComponentesComputadoras.WebApi desde Visual Studio ^(perfil https^) y volve a ejecutar este archivo.
  echo         Si la API usa otro puerto, ejecuta antes:  set API_URL=https://localhost:PUERTO
  echo.
  set "API_URL=https://localhost:7136"
)
echo API: %API_URL%
echo Iniciando servidor de desarrollo en http://localhost:9000 ...
echo.
call npm run dev
pause
