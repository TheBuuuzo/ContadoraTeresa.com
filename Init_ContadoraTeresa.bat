@echo off
cd /d "%~dp0"

echo Iniciando ContadoraTeresa (contadorateresa.com.br)...
echo.

if not defined CONTADORATERESA_HOST set "CONTADORATERESA_HOST=192.168.15.101"
if not defined CONTADORATERESA_PORT set "CONTADORATERESA_PORT=5020"
if not defined MARRONE_API_URL set "MARRONE_API_URL=http://192.168.15.101:5000"

REM Remove espacos acidentais no fim (causam ENOTFOUND no Node)
for /f "tokens=* delims= " %%A in ("%CONTADORATERESA_HOST%") do set "CONTADORATERESA_HOST=%%A"
for /f "tokens=* delims= " %%A in ("%CONTADORATERESA_PORT%") do set "CONTADORATERESA_PORT=%%A"
for /f "tokens=* delims= " %%A in ("%MARRONE_API_URL%") do set "MARRONE_API_URL=%%A"

REM Reaproveita a chave do Marrone se ContadoraTeresa nao tiver .env proprio
if not exist ".env" if exist "..\Marrone\.env" (
    echo Copiando chaves relevantes de ..\Marrone\.env para .env local...
    > ".env" (
        echo MARRONE_API_URL=%MARRONE_API_URL%
        echo CONTADORATERESA_HOST=%CONTADORATERESA_HOST%
        echo CONTADORATERESA_PORT=%CONTADORATERESA_PORT%
    )
    for /f "usebackq tokens=1* delims==" %%A in (`findstr /B /I "CONECTA_INTEGRATION_KEY MARRONE_INTEGRATION_KEY TERESA_INTEGRATION_KEY TERESA_PROPOSTA_USUARIO_ID" "..\Marrone\.env"`) do (
        >> ".env" echo %%A=%%B
    )
)

if not exist "dist\index.html" (
    echo Build ausente. Rodando npm run build...
    call npm run build
    if errorlevel 1 (
        echo ERRO: falha no build.
        pause
        exit /b 1
    )
)

echo Verificando porta %CONTADORATERESA_PORT%...
netstat -ano | findstr /R /C:":%CONTADORATERESA_PORT% .*LISTENING" >nul
if not errorlevel 1 (
    echo ERRO: Porta %CONTADORATERESA_PORT% ja esta em uso.
    echo Dica: altere CONTADORATERESA_PORT ou encerre o processo que usa a porta.
    pause
    exit /b 1
)

echo Host: %CONTADORATERESA_HOST%  Porta: %CONTADORATERESA_PORT%
echo Marrone API: %MARRONE_API_URL%
echo Dominio: https://contadorateresa.com.br
echo Cloudflare Tunnel deve apontar este host:porta para contadorateresa.com.br
echo.

node server.mjs
if errorlevel 1 (
    echo.
    echo ERRO: Nao foi possivel iniciar o servidor.
    pause
    exit /b 1
)
pause
