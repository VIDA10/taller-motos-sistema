# Script de prueba para verificar datos del backend
# Ejecutar desde la carpeta del proyecto

Write-Host "=== PRUEBA DE DATOS DEL BACKEND ===" -ForegroundColor Yellow
Write-Host ""

# Verificar si el backend está ejecutándose
Write-Host "1. Verificando si el backend está ejecutándose..." -ForegroundColor Cyan
$backendStatus = $null
try {
    $backendStatus = Invoke-RestMethod -Uri "http://localhost:3000/api/ordenes-trabajo" -Method Get -Headers @{ "Authorization" = "Bearer tu-token" } -ErrorAction SilentlyContinue
    Write-Host "✅ Backend respondiendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no responde en localhost:3000" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar endpoints principales
$endpoints = @(
    "ordenes-trabajo",
    "clientes", 
    "motos",
    "pagos",
    "servicios",
    "repuestos"
)

Write-Host ""
Write-Host "2. Verificando endpoints principales..." -ForegroundColor Cyan

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/$endpoint" -Method Get -Headers @{ "Authorization" = "Bearer tu-token" } -ErrorAction SilentlyContinue
        $count = if ($response -is [array]) { $response.Count } else { 1 }
        Write-Host "✅ /$endpoint - $count registros" -ForegroundColor Green
        
        # Mostrar detalles de órdenes si existen
        if ($endpoint -eq "ordenes-trabajo" -and $count -gt 0) {
            Write-Host "   Detalles de órdenes:" -ForegroundColor Yellow
            $response | Select-Object -First 3 | ForEach-Object {
                $fecha = if ($_.fechaCreacion) { $_.fechaCreacion } elseif ($_.fechaIngreso) { $_.fechaIngreso } else { "Sin fecha" }
                Write-Host "   - $($_.numeroOrden) | Estado: $($_.estado) | Fecha: $fecha" -ForegroundColor Gray
            }
        }
    } catch {
        Write-Host "❌ /$endpoint - Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "3. Verificando estructura de datos..." -ForegroundColor Cyan

# Verificar estructura de una orden específica
try {
    $ordenes = Invoke-RestMethod -Uri "http://localhost:3000/api/ordenes-trabajo" -Method Get -Headers @{ "Authorization" = "Bearer tu-token" } -ErrorAction SilentlyContinue
    if ($ordenes -and $ordenes.Count -gt 0) {
        Write-Host "✅ Estructura de primera orden:" -ForegroundColor Green
        $primeraOrden = $ordenes[0]
        Write-Host "   ID: $($primeraOrden.id)" -ForegroundColor Gray
        Write-Host "   Número: $($primeraOrden.numeroOrden)" -ForegroundColor Gray
        Write-Host "   Estado: $($primeraOrden.estado)" -ForegroundColor Gray
        Write-Host "   Fecha Creación: $($primeraOrden.fechaCreacion)" -ForegroundColor Gray
        Write-Host "   Fecha Ingreso: $($primeraOrden.fechaIngreso)" -ForegroundColor Gray
        Write-Host "   Cliente ID: $($primeraOrden.clienteId)" -ForegroundColor Gray
        Write-Host "   Moto ID: $($primeraOrden.motoId)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ No se pudo verificar estructura de órdenes" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Análisis de fechas para dashboard..." -ForegroundColor Cyan
try {
    $ordenes = Invoke-RestMethod -Uri "http://localhost:3000/api/ordenes-trabajo" -Method Get -Headers @{ "Authorization" = "Bearer tu-token" } -ErrorAction SilentlyContinue
    if ($ordenes -and $ordenes.Count -gt 0) {
        $hoy = Get-Date -Format "yyyy-MM-dd"
        $ordenesHoy = $ordenes | Where-Object { 
            ($_.fechaCreacion -like "$hoy*") -or ($_.fechaIngreso -like "$hoy*")
        }
        
        Write-Host "✅ Análisis de fechas:" -ForegroundColor Green
        Write-Host "   Total órdenes: $($ordenes.Count)" -ForegroundColor Gray
        Write-Host "   Órdenes de hoy: $($ordenesHoy.Count)" -ForegroundColor Gray
        Write-Host "   Fecha actual: $hoy" -ForegroundColor Gray
        
        # Mostrar estados
        $estadosCount = $ordenes | Group-Object estado | ForEach-Object { "$($_.Name): $($_.Count)" }
        Write-Host "   Estados: $($estadosCount -join ', ')" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ No se pudo analizar fechas" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== FIN DE PRUEBA ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "INSTRUCCIONES:" -ForegroundColor Cyan
Write-Host "1. Reemplaza 'tu-token' con el token real del usuario" -ForegroundColor Gray
Write-Host "2. Verifica que el backend esté ejecutándose en localhost:3000" -ForegroundColor Gray
Write-Host "3. Revisa los logs del navegador para más detalles" -ForegroundColor Gray
