@echo off
rem Script para probar endpoints del backend del taller de motos
rem Ejecutar desde la terminal: test_backend.bat

echo 🔍 Probando endpoints del backend del taller de motos...
echo ==============================================

rem URL base del backend
set BASE_URL=http://localhost:3000/api

echo.
echo 📍 Endpoints Principales:
echo Probando ordenes-trabajo...
curl -s -w "Status: %%{http_code}" -o nul "%BASE_URL%/ordenes-trabajo"
echo.

echo Probando clientes...
curl -s -w "Status: %%{http_code}" -o nul "%BASE_URL%/clientes"
echo.

echo Probando motos...
curl -s -w "Status: %%{http_code}" -o nul "%BASE_URL%/motos"
echo.

echo Probando pagos...
curl -s -w "Status: %%{http_code}" -o nul "%BASE_URL%/pagos"
echo.

echo Probando servicios...
curl -s -w "Status: %%{http_code}" -o nul "%BASE_URL%/servicios"
echo.

echo Probando repuestos...
curl -s -w "Status: %%{http_code}" -o nul "%BASE_URL%/repuestos"
echo.

echo Probando usuarios...
curl -s -w "Status: %%{http_code}" -o nul "%BASE_URL%/usuarios"
echo.

echo.
echo 📍 Endpoints Específicos:
echo Probando detalles-orden...
curl -s -w "Status: %%{http_code}" -o nul "%BASE_URL%/detalles-orden"
echo.

echo Probando usos-repuesto...
curl -s -w "Status: %%{http_code}" -o nul "%BASE_URL%/usos-repuesto"
echo.

echo Probando orden-historial...
curl -s -w "Status: %%{http_code}" -o nul "%BASE_URL%/orden-historial"
echo.

echo.
echo ==============================================
echo ✅ Prueba completada
echo.
echo 💡 Notas:
echo - Status 200: Endpoint funcionando correctamente
echo - Status 403: Sin permisos (requiere autenticación)
echo - Status 404: Endpoint no encontrado
echo - Status 500: Error del servidor
echo.
pause
