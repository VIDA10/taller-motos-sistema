# 🏍️ Sistema de Gestión de Taller de Motos

Sistema enterprise completo para la gestión de talleres de reparación de motocicletas.

## 🎯 Características Principales

- ✅ Gestión completa de clientes y vehículos
- ✅ Control de órdenes de trabajo y estados
- ✅ Inventario de repuestos con alertas automáticas
- ✅ Múltiples métodos de pago
- ✅ Roles de usuario (Admin, Recepcionista, Mecánico)
- ✅ Auditoría completa del sistema
- ✅ Dashboards personalizados por rol
- ✅ Herramientas de diagnóstico y monitoreo
- ✅ Manejo robusto de errores y conectividad

## 🏗️ Stack Tecnológico

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **Spring Security + JWT**
- **PostgreSQL 15+**

### Frontend
- **React 18+**
- **TypeScript**
- **Material-UI**
- **Redux Toolkit**
- **Axios**

### Base de Datos
- **PostgreSQL 15+**
- **12 tablas normalizadas (3NF)**
- **Triggers automáticos**
- **Vistas optimizadas**

## 📁 Estructura del Proyecto

```
proyecto-taller-moto/
├── README.md                    # Este archivo
├── database/                    # Scripts de base de datos
│   ├── schema.sql              # Estructura completa de BD
│   └── validations.sql         # Queries de verificación
├── backend/                     # API REST Spring Boot
│   └── (Proyecto Spring Boot)
├── frontend/                    # Aplicación React
│   └── (Proyecto React)
└── docs/                       # Documentación técnica
    └── INFORMACION_PROYECTO.md # Especificaciones completas
```

## 🚀 Instalación y Configuración

### 1. Base de Datos
```bash
# Ejecutar script de base de datos
psql -U postgres -h localhost -d postgres -f database/schema.sql
```

### 2. Backend
```bash
cd backend/
mvn clean install
mvn spring-boot:run
```

### 3. Frontend
```bash
cd frontend/
npm install
npm start
```

## 🔧 Configuración

- **Puerto Backend**: 8080
- **Puerto Frontend**: 3000
- **Base de Datos**: PostgreSQL puerto 5432
- **Usuario BD por defecto**: postgres

## 👥 Usuarios por Defecto

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | ADMIN |
| recepcion1 | admin123 | RECEPCIONISTA |
| mecanico1 | admin123 | MECANICO |

## 📊 Módulos del Sistema

### 🔐 Gestión de Usuarios
- Autenticación JWT
- Control de roles y permisos
- Sesiones seguras

### 👥 Gestión de Clientes
- Registro completo de clientes
- Historial de servicios
- Múltiples vehículos por cliente

### 🏍️ Gestión de Motos
- Información técnica detallada
- Historial de mantenimientos
- Seguimiento de kilometraje

### 📋 Órdenes de Trabajo
- Workflow completo de estados
- Asignación de mecánicos
- Cálculo automático de totales

### 🔧 Catálogo de Servicios
- Servicios por categorías
- Precios configurables
- Tiempo estimado de trabajo

### 📦 Control de Inventario
- Stock actual y mínimo
- Alertas automáticas
- Movimientos auditados

### 💰 Sistema de Pagos
- Múltiples métodos de pago
- Pagos parciales
- Control de estados

### 📈 Reportes y Auditoría
- Historial completo de cambios
- Reportes financieros
- Métricas operacionales

## 🧾 Gestión de Facturación

### Estados de Órdenes y Facturación

El sistema maneja un flujo específico para la facturación de órdenes:

1. **RECIBIDA** → Orden recién creada
2. **DIAGNOSTICADA** → Orden evaluada
3. **EN_PROCESO** → Orden siendo trabajada
4. **COMPLETADA** → Orden terminada, lista para facturar
5. **ENTREGADA** → Orden facturada y entregada al cliente

### Proceso de Facturación

- Las órdenes **COMPLETADAS** aparecen como "Listas para Facturar" en el dashboard
- Una vez facturadas, aparecen en **Gestión de Pagos** 
- Las órdenes que tienen pago registrado se consideran automáticamente **ENTREGADAS**
- El dashboard muestra estadísticas de órdenes facturadas vs. pendientes de facturar

### Dashboard de Recepcionista

El dashboard incluye:
- **Estado de Facturación**: Muestra órdenes facturadas y listas para facturar
- **Alertas**: Notifica sobre órdenes completadas pendientes de facturación
- **Estadísticas**: Diferencia entre órdenes entregadas (facturadas) y completadas (sin facturar)

## 🛠️ Herramientas de Diagnóstico

### Scripts de Prueba

```powershell
# Probar conectividad del backend
.\test_backend.ps1
```

### Diagnóstico en Frontend

1. **Página de Diagnóstico** (Solo Admin)
   - Acceder a `/diagnostico`
   - Ejecutar pruebas completas de endpoints
   - Ver reporte detallado de permisos

2. **Diagnóstico Rápido** (Dashboard)
   - Botón de información en dashboard
   - Pruebas específicas por rol
   - Logs detallados en consola

### Solución de Problemas

- Ver [SOLUCION_PROBLEMAS.md](SOLUCION_PROBLEMAS.md) para guía completa
- Errores 403: Verificar permisos y sesión
- Conectividad: Probar backend con scripts
- Datos vacíos: Usar herramientas de diagnóstico

## 🛡️ Seguridad

- ✅ Autenticación JWT
- ✅ Autorización por roles
- ✅ Validación de entrada
- ✅ Auditoría completa
- ✅ Sesiones seguras

## 📖 Documentación

- [Información Técnica Completa](docs/INFORMACION_PROYECTO.md)
- [Especificaciones API REST](docs/INFORMACION_PROYECTO.md#api-rest-enterprise)
- [Modelo de Base de Datos](docs/INFORMACION_PROYECTO.md#diseño-de-base-de-datos)

## 🤝 Contribución

Este es un proyecto académico enterprise desarrollado siguiendo las mejores prácticas de la industria.

## 📄 Licencia

Proyecto académico - Universidad Nacional Toribio Rodríguez de Mendoza

---

**Desarrollado con estándares enterprise-grade** 🏆
