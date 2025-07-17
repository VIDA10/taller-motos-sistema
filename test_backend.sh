#!/bin/bash

# Script para probar endpoints del backend del taller de motos
# Ejecutar desde la terminal: ./test_backend.sh

echo "🔍 Probando endpoints del backend del taller de motos..."
echo "=============================================="

# URL base del backend
BASE_URL="http://localhost:3000/api"

# Función para probar un endpoint
test_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    local description=$3
    
    echo -n "Probando $endpoint ($description)... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -o /dev/null -X $method "$BASE_URL$endpoint")
    fi
    
    if [ "$response" = "200" ]; then
        echo "✅ OK (200)"
    elif [ "$response" = "403" ]; then
        echo "🚫 Forbidden (403) - Sin permisos"
    elif [ "$response" = "404" ]; then
        echo "❌ Not Found (404)"
    elif [ "$response" = "500" ]; then
        echo "💥 Server Error (500)"
    else
        echo "❓ Status: $response"
    fi
}

# Endpoints principales
echo ""
echo "📍 Endpoints Principales:"
test_endpoint "/ordenes-trabajo" "GET" "Órdenes de trabajo"
test_endpoint "/clientes" "GET" "Clientes"
test_endpoint "/motos" "GET" "Motos"
test_endpoint "/pagos" "GET" "Pagos"
test_endpoint "/servicios" "GET" "Servicios"
test_endpoint "/repuestos" "GET" "Repuestos"
test_endpoint "/usuarios" "GET" "Usuarios"

echo ""
echo "📍 Endpoints Específicos:"
test_endpoint "/detalles-orden" "GET" "Detalles de orden"
test_endpoint "/usos-repuesto" "GET" "Usos de repuesto"
test_endpoint "/orden-historial" "GET" "Historial de órdenes"
test_endpoint "/repuesto-movimientos" "GET" "Movimientos de repuestos"
test_endpoint "/configuraciones" "GET" "Configuraciones"

echo ""
echo "📍 Endpoints de Autenticación:"
test_endpoint "/auth/login" "POST" "Login"

echo ""
echo "=============================================="
echo "✅ Prueba completada"
echo ""
echo "💡 Notas:"
echo "- Status 200: Endpoint funcionando correctamente"
echo "- Status 403: Sin permisos (requiere autenticación)"
echo "- Status 404: Endpoint no encontrado"
echo "- Status 500: Error del servidor"
