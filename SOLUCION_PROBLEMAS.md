# Solución de Problemas de Conectividad - Taller de Motos

## 📋 Descripción del Problema

Se han identificado errores 403 (Forbidden) persistentes en algunos endpoints del backend, especialmente para usuarios con rol `RECEPCIONISTA`. Los errores están relacionados con:

1. **Endpoints mal configurados**: Uso de `/ordenes` en lugar de `/ordenes-trabajo`
2. **Permisos de seguridad**: Configuración JWT que bloquea acceso a ciertos endpoints
3. **Sesiones expiradas**: Tokens JWT inválidos o expirados

## 🔧 Soluciones Implementadas

### 1. Corrección de Endpoints

**Problema**: El frontend llamaba a `/ordenes` pero el backend usa `/ordenes-trabajo`

**Solución**: 
- ✅ Corregido en `dashboardRecepcionistaService.js`
- ✅ Corregido en `apiDiagnostico.js`
- ✅ Verificado en otros servicios

### 2. Mejoras en Manejo de Errores

**Implementado**:
- 🔄 Reintentos automáticos para errores 403
- 📊 Logging detallado de errores
- 🎯 Degradación graciosa con datos de fallback
- 🔍 Diagnóstico automático de problemas

### 3. Herramientas de Diagnóstico

**Creadas**:
- 🛠️ `DiagnosticoPage.jsx` - Página de diagnóstico en el frontend
- 🔍 `diagnosticoBackend.js` - Utilidad para probar endpoints
- 📊 `test_backend.ps1` - Script PowerShell para probar backend
- 🧪 Función de diagnóstico rápido en dashboard

## 🚀 Instrucciones de Uso

### 1. Verificar Estado del Backend

```powershell
# Ejecutar desde PowerShell
.\test_backend.ps1
```

### 2. Usar Diagnóstico en Frontend

1. Acceder como usuario ADMIN
2. Ir a "Diagnóstico" en el menú lateral
3. Hacer clic en "Ejecutar Diagnóstico Completo"
4. Revisar resultados y recomendaciones

### 3. Diagnóstico Rápido en Dashboard

1. Acceder como RECEPCIONISTA
2. En el dashboard, hacer clic en el icono de información (ℹ️)
3. Revisar console.log para detalles

## 🔐 Configuración de Permisos

### Permisos Actuales por Rol:

**RECEPCIONISTA:**
- ✅ `/clientes/**` (GET/POST/PUT)
- ✅ `/motos/**` (GET/POST/PUT)
- ✅ `/ordenes-trabajo/**` (GET/POST/PUT)
- ✅ `/pagos/**` (GET/POST/PUT)
- ✅ `/servicios/**` (GET)
- ✅ `/repuestos/**` (GET)
- ✅ `/usuarios/**` (GET/POST/PUT)

**MECÁNICO:**
- ✅ `/clientes/**` (GET)
- ✅ `/motos/**` (GET)
- ✅ `/ordenes-trabajo/**` (GET/POST/PUT)
- ✅ `/servicios/**` (GET)
- ✅ `/repuestos/**` (GET)
- ✅ `/detalles-orden/**` (Todos)
- ✅ `/usos-repuesto/**` (Todos)
- ✅ `/orden-historial/**` (Todos)

**ADMIN:**
- ✅ `/**` (Acceso completo)

## 🛠️ Resolución de Problemas

### Error 403 Persistente

**Causas posibles**:
1. Token JWT expirado
2. Usuario sin permisos para el endpoint
3. Configuración de seguridad restrictiva
4. Sesión no válida

**Soluciones**:
1. Cerrar sesión y volver a iniciar
2. Verificar rol del usuario
3. Usar herramientas de diagnóstico
4. Revisar logs del backend

### Backend No Responde

**Verificar**:
1. ¿El backend está ejecutándose en http://localhost:3000?
2. ¿La base de datos está conectada?
3. ¿Los puertos están libres?

### Datos Vacíos en Dashboard

**Causas**:
1. Permisos insuficientes
2. Datos no existentes en BD
3. Errores en consultas

**Soluciones**:
1. Usar diagnóstico para identificar endpoints problemáticos
2. Verificar datos en base de datos
3. Revisar logs de backend

## 📊 Monitoreo

### Logs a Revisar

**Frontend (Console)**:
```javascript
// Buscar estos mensajes
🔄 Intentando obtener datos de: /ordenes-trabajo
✅ Éxito obteniendo órdenes
❌ Error 403 persistente
```

**Backend**:
- Logs de Spring Boot
- Errores de autenticación
- Consultas SQL

### Métricas de Salud

- **Endpoints exitosos**: > 80%
- **Tiempo de respuesta**: < 2 segundos
- **Errores 403**: < 10%

## 🎯 Próximos Pasos

1. **Verificar permisos en backend** para endpoint `/ordenes-trabajo`
2. **Optimizar consultas** de dashboard
3. **Implementar cache** para reducir llamadas API
4. **Mejorar UX** durante errores de conectividad

## 📞 Soporte

Si los problemas persisten:
1. Ejecutar diagnóstico completo
2. Revisar logs del backend
3. Verificar configuración de seguridad
4. Contactar al administrador del sistema
