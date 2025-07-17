# Script PowerShell para probar endpoints del backend del taller de motos
# Ejecutar desde PowerShell: .\test_backend.ps1

Write-Host "🔍 Probando endpoints del backend del taller de motos..." -ForegroundColor Cyan
Write-Host "=============================================="

# URL base del backend
$BASE_URL = "http://localhost:3000/api"

# Función para probar un endpoint
function Test-Endpoint {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [string]$Description
    )
    
    Write-Host "Probando $Endpoint ($Description)... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri "$BASE_URL$Endpoint" -Method $Method -UseBasicParsing -ErrorAction Stop
        $statusCode = $response.StatusCode
        
        switch ($statusCode) {
            200 { Write-Host "✅ OK (200)" -ForegroundColor Green }
            201 { Write-Host "✅ Created (201)" -ForegroundColor Green }
            default { Write-Host "❓ Status: $statusCode" -ForegroundColor Yellow }
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        switch ($statusCode) {
            403 { Write-Host "🚫 Forbidden (403) - Sin permisos" -ForegroundColor Red }
            404 { Write-Host "❌ Not Found (404)" -ForegroundColor Red }
            500 { Write-Host "💥 Server Error (500)" -ForegroundColor Red }
            default { 
                if ($statusCode) {
                    Write-Host "❓ Status: $statusCode" -ForegroundColor Yellow 
                } else {
                    Write-Host "💥 Connection Error" -ForegroundColor Red 
                }
            }
        }
    }
}

# Endpoints principales
Write-Host ""
Write-Host "📍 Endpoints Principales:" -ForegroundColor Blue
Test-Endpoint "/ordenes-trabajo" "GET" "Órdenes de trabajo"
Test-Endpoint "/clientes" "GET" "Clientes"
Test-Endpoint "/motos" "GET" "Motos"
Test-Endpoint "/pagos" "GET" "Pagos"
Test-Endpoint "/servicios" "GET" "Servicios"
Test-Endpoint "/repuestos" "GET" "Repuestos"
Test-Endpoint "/usuarios" "GET" "Usuarios"

Write-Host ""
Write-Host "📍 Endpoints Específicos:" -ForegroundColor Blue
Test-Endpoint "/detalles-orden" "GET" "Detalles de orden"
Test-Endpoint "/usos-repuesto" "GET" "Usos de repuesto"
Test-Endpoint "/orden-historial" "GET" "Historial de órdenes"
Test-Endpoint "/repuesto-movimientos" "GET" "Movimientos de repuestos"
Test-Endpoint "/configuraciones" "GET" "Configuraciones"

Write-Host ""
Write-Host "📍 Endpoints de Autenticación:" -ForegroundColor Blue
Test-Endpoint "/auth/login" "POST" "Login"

Write-Host ""
Write-Host "=============================================="
Write-Host "✅ Prueba completada" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Notas:" -ForegroundColor Cyan
Write-Host "- Status 200: Endpoint funcionando correctamente"
Write-Host "- Status 403: Sin permisos (requiere autenticación)"
Write-Host "- Status 404: Endpoint no encontrado"
Write-Host "- Status 500: Error del servidor"
Write-Host "- Connection Error: Backend no está ejecutándose"
