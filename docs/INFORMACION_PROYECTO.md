# Sistema de Gestión de Taller de Motos

## 🏗️ ARQUITECTURA DEL SISTEMA

### 📊 Diagrama de Arquitectura
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Panel         │    │   Panel         │    │   Panel         │
│   Recepción     │    │   Mecánico      │    │   Admin         │
│                 │    │                 │    │                 │
│ • Gestión de    │    │ • Asignación de │    │ • Reportes      │
│   clientes      │    │   servicios     │    │ • Usuarios      │
│ • Órdenes       │    │ • Repuestos     │    │ • Config.       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────┐
                    │    FRONTEND WEB     │
                    │      (React)        │
                    │                     │
                    │ • SPA Responsiva    │
                    │ • Componentes       │
                    │ • State Management  │
                    │ • Routing           │
                    └─────────────────────┘
                                 │
                                 │ HTTP/REST API
                                 │
                    ┌─────────────────────┐
                    │   API BACKEND       │
                    │   (Spring Boot)     │
                    │                     │
                    │ • REST Controllers  │
                    │ • Service Layer     │
                    │ • Security Config   │
                    │ • JPA Repositories  │
                    └─────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Base de Datos │    │ Archivos/Docs   │    │ Notificaciones  │
│  (PostgreSQL)   │    │                 │    │                 │
│                 │    │ • PDFs          │    │ • WhatsApp      │
│ • Clientes      │    │ • Notas         │    │ • Email         │
│ • Órdenes       │    │ • Historial     │    │ • SMS           │
│ • Mecánicos     │    │ • Imágenes      │    │                 │
│ • Repuestos     │    │                 │    │                 │
│ • Servicios     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🎯 STACK TECNOLÓGICO CONFIRMADO

#### **Backend (API REST)**
- **Framework**: Spring Boot 3.x
- **Lenguaje**: Java 17+ 
- **ORM**: Spring Data JPA + Hibernate
- **Security**: Spring Security + JWT
- **Documentation**: SpringDoc OpenAPI 3
- **Testing**: JUnit 5 + TestContainers

#### **Frontend (SPA Web)**
- **Framework**: React 18+
- **State Management**: Redux Toolkit / Zustand
- **UI Library**: Material-UI / Ant Design
- **HTTP Client**: Axios
- **Routing**: React Router
- **Testing**: Jest + React Testing Library

#### **Base de Datos**
- **RDBMS**: PostgreSQL 15+
- **Connection Pool**: HikariCP
- **Migrations**: Flyway
- **Monitoring**: pg_stat_statements

#### **DevOps & Infraestructura**
- **Build Tool**: Maven / Gradle
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions / Jenkins
- **Monitoring**: Micrometer + Prometheus

### 🔐 COMPONENTES DEL SISTEMA

#### **1. Panel de Recepción (Web)**
**Funcionalidades Core:**
- ✅ Registro y gestión de clientes
- ✅ Creación de órdenes de trabajo
- ✅ Asignación inicial de técnicos
- ✅ Seguimiento de estado de reparaciones
- ✅ Generación de presupuestos

#### **2. Panel de Mecánico (Web)**
**Funcionalidades Core:**
- ✅ Vista de órdenes asignadas
- ✅ Actualización de progreso de trabajos
- ✅ Solicitud y gestión de repuestos
- ✅ Registro de tiempo y actividades
- ✅ Upload de fotos de diagnóstico

#### **3. Panel de Administración (Web)**
**Funcionalidades Core:**
- ✅ Dashboard con métricas y KPIs
- ✅ Gestión de usuarios y permisos
- ✅ Reportes financieros y operacionales
- ✅ Configuración de servicios y precios
- ✅ Auditoría y logs del sistema

#### **4. App Cliente (FUTURA IMPLEMENTACIÓN)**
> **NOTA IMPORTANTE**: La aplicación móvil para clientes está planificada para una fase posterior del proyecto. El enfoque actual es **exclusivamente el sistema web** para uso interno del taller.

### 🔄 FLUJO DE DATOS

#### **Autenticación & Autorización**
```
1. Login → JWT Token → Role-based Access Control
2. Recepcionista → Acceso a clientes y órdenes
3. Mecánico → Acceso a órdenes asignadas
4. Admin → Acceso completo al sistema
```

#### **Operación Típica**
```
1. Cliente llega → Recepción crea orden
2. Admin asigna mecánico → Notificación automática
3. Mecánico actualiza progreso → Sistema registra
4. Finalización → Cliente notificado → Facturación
```

### 📊 INTEGRACIÓNES EXTERNAS

- **🔔 Notificaciones**: WhatsApp Business API, SMTP Email
- **📄 Documentos**: PDF generation, File storage
- **💳 Pagos**: Futura integración con pasarelas de pago
- **📱 Comunicación**: SMS provider integration

---

--

## 🔌 API REST ENTERPRISE - DISEÑO COMPLETO

### 📋 BASE URL & VERSIONADO
```
Base URL: https://api.tallermoto.com/v1
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

---

## 🏗️ ENDPOINTS PRINCIPALES

### 👥 **CLIENTES**
```bash
# CRUD Completo
GET    /api/v1/clientes                    # Listar con paginación y filtros
POST   /api/v1/clientes                    # Crear cliente
GET    /api/v1/clientes/{id}               # Obtener cliente específico
PUT    /api/v1/clientes/{id}               # Actualizar cliente completo
PATCH  /api/v1/clientes/{id}               # Actualización parcial
DELETE /api/v1/clientes/{id}               # Eliminar cliente (soft delete)

# Relaciones
GET    /api/v1/clientes/{id}/motos         # Motos del cliente
GET    /api/v1/clientes/{id}/ordenes       # Órdenes del cliente
GET    /api/v1/clientes/{id}/historial     # Historial completo

# Parámetros de consulta
?page=0&size=20&sort=nombre,asc
&search=juan&telefono=555-1234
&activo=true&fechaRegistro=2025-01-01
```

### 🏍️ **MOTOS**
```bash
# CRUD Completo
GET    /api/v1/motos                       # Listar motos
POST   /api/v1/motos                       # Registrar moto
GET    /api/v1/motos/{id}                  # Obtener moto específica
PUT    /api/v1/motos/{id}                  # Actualizar moto
PATCH  /api/v1/motos/{id}                  # Actualización parcial
DELETE /api/v1/motos/{id}                  # Eliminar moto

# Relaciones
GET    /api/v1/motos/{id}/ordenes          # Órdenes de la moto
GET    /api/v1/motos/{id}/mantenimientos   # Historial de mantenimientos

# Filtros avanzados
?clienteId=123&marca=Honda&modelo=CBR600
&año=2023&placa=ABC123&estado=ACTIVA
```

### 📋 **ÓRDENES DE TRABAJO**
```bash
# CRUD Principal
GET    /api/v1/ordenes                     # Listar órdenes
POST   /api/v1/ordenes                     # Crear orden
GET    /api/v1/ordenes/{id}                # Obtener orden específica
PUT    /api/v1/ordenes/{id}                # Actualizar orden
PATCH  /api/v1/ordenes/{id}/estado         # Cambiar estado específico
DELETE /api/v1/ordenes/{id}                # Cancelar orden

# Sub-recursos (Jerarquía RESTful)
GET    /api/v1/ordenes/{id}/detalles       # Servicios de la orden
POST   /api/v1/ordenes/{id}/detalles       # Agregar servicio
PUT    /api/v1/ordenes/{id}/detalles/{detId} # Actualizar detalle
DELETE /api/v1/ordenes/{id}/detalles/{detId} # Remover servicio

GET    /api/v1/ordenes/{id}/repuestos      # Repuestos usados
POST   /api/v1/ordenes/{id}/repuestos      # Asignar repuesto
PUT    /api/v1/ordenes/{id}/repuestos/{repId} # Actualizar cantidad
DELETE /api/v1/ordenes/{id}/repuestos/{repId} # Remover repuesto

GET    /api/v1/ordenes/{id}/pagos          # Pagos de la orden
POST   /api/v1/ordenes/{id}/pagos          # Registrar pago
GET    /api/v1/ordenes/{id}/pagos/{pagoId} # Detalle de pago

GET    /api/v1/ordenes/{id}/timeline       # Historial de cambios
GET    /api/v1/ordenes/{id}/documentos     # PDFs, fotos, etc.
POST   /api/v1/ordenes/{id}/documentos     # Subir archivo

# Filtros empresariales
?estado=PENDIENTE,EN_PROCESO&mecanicoId=456
&fechaDesde=2025-01-01&fechaHasta=2025-12-31
&prioridad=ALTA&clienteId=123
```

### 🔧 **SERVICIOS**
```bash
# CRUD Completo
GET    /api/v1/servicios                   # Listar servicios
POST   /api/v1/servicios                   # Crear servicio
GET    /api/v1/servicios/{id}              # Obtener servicio
PUT    /api/v1/servicios/{id}              # Actualizar servicio
PATCH  /api/v1/servicios/{id}              # Actualización parcial
DELETE /api/v1/servicios/{id}              # Desactivar servicio

# Operaciones especiales
GET    /api/v1/servicios/activos           # Solo servicios activos
GET    /api/v1/servicios/populares         # Más solicitados
GET    /api/v1/servicios/{id}/precios      # Historial de precios

# Filtros
?categoria=MANTENIMIENTO,REPARACION
&precioMin=50&precioMax=500&activo=true
&duracionMax=120&especialidad=MOTOR
```

### 🔩 **REPUESTOS**
```bash
# CRUD Completo
GET    /api/v1/repuestos                   # Listar repuestos
POST   /api/v1/repuestos                   # Registrar repuesto
GET    /api/v1/repuestos/{id}              # Obtener repuesto
PUT    /api/v1/repuestos/{id}              # Actualizar repuesto
PATCH  /api/v1/repuestos/{id}              # Actualización parcial
DELETE /api/v1/repuestos/{id}              # Eliminar repuesto

# Gestión de inventario
GET    /api/v1/repuestos/stock-bajo        # Stock crítico
GET    /api/v1/repuestos/{id}/movimientos  # Historial de stock
POST   /api/v1/repuestos/{id}/ajuste-stock # Ajustar inventario
GET    /api/v1/repuestos/valoracion        # Valor total inventario

# Filtros avanzados
?codigo=ABC123&categoria=FILTROS,ACEITES
&marca=Honda&stockMin=10&activo=true
&proveedor=Proveedor1&ubicacion=A1-B2
```

### 💰 **PAGOS**
```bash
# Operaciones principales
GET    /api/v1/pagos                       # Listar todos los pagos
POST   /api/v1/pagos                       # Registrar pago directo
GET    /api/v1/pagos/{id}                  # Detalle de pago
PUT    /api/v1/pagos/{id}                  # Actualizar pago
DELETE /api/v1/pagos/{id}                  # Anular pago

# Reportes financieros
GET    /api/v1/pagos/resumen-diario        # Ventas del día
GET    /api/v1/pagos/resumen-mensual       # Ventas del mes
GET    /api/v1/pagos/por-metodo            # Efectivo vs Tarjeta
GET    /api/v1/pagos/pendientes            # Pagos pendientes

# Filtros
?fechaDesde=2025-01-01&fechaHasta=2025-01-31
&metodoPago=EFECTIVO,TARJETA&estado=COMPLETADO
&montoMin=100&montoMax=1000
```

---

## 🔐 AUTENTICACIÓN & AUTORIZACIÓN

### **Endpoints de Seguridad**
```bash
POST   /api/v1/auth/login                  # Autenticación
POST   /api/v1/auth/refresh                # Renovar token
POST   /api/v1/auth/logout                 # Cerrar sesión
GET    /api/v1/auth/me                     # Perfil del usuario
PATCH  /api/v1/auth/password               # Cambiar contraseña
POST   /api/v1/auth/forgot-password        # Recuperar contraseña
```

### **Gestión de Usuarios**
```bash
GET    /api/v1/usuarios                    # Listar usuarios
POST   /api/v1/usuarios                    # Crear usuario
GET    /api/v1/usuarios/{id}               # Obtener usuario
PUT    /api/v1/usuarios/{id}               # Actualizar usuario
PATCH  /api/v1/usuarios/{id}/estado        # Activar/Desactivar
DELETE /api/v1/usuarios/{id}               # Eliminar usuario

# Gestión de roles
GET    /api/v1/usuarios/{id}/permisos      # Permisos del usuario
PUT    /api/v1/usuarios/{id}/roles         # Asignar roles
GET    /api/v1/roles                       # Listar roles disponibles
```

### **Roles y Permisos**
```yaml
ADMIN:
  - Acceso completo al sistema
  - Gestión de usuarios y configuración
  - Reportes financieros y operacionales

RECEPCIONISTA:
  - Gestión de clientes y motos
  - Crear y consultar órdenes
  - Registrar pagos

MECANICO:
  - Ver órdenes asignadas
  - Actualizar progreso de trabajos
  - Solicitar repuestos
  - Subir documentos técnicos



---

## 📊 ESTRUCTURA DE RESPUESTAS ENTERPRISE

### **Response Estándar Exitoso**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "nombre": "Juan Pérez",
    "email": "juan@email.com"
  },
  "metadata": {
    "timestamp": "2025-06-17T10:30:00Z",
    "requestId": "req_abc123",
    "version": "v1",
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

### **Response de Error**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos de entrada inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email debe tener formato válido"
      },
      {
        "field": "telefono",
        "message": "Teléfono es obligatorio"
      }
    ]
  },
  "metadata": {
    "timestamp": "2025-06-17T10:30:00Z",
    "requestId": "req_xyz789",
    "version": "v1"
  }
}
```

### **HTTP Status Codes Enterprise**
```bash
# Éxito
200 OK              - Operación exitosa
201 Created         - Recurso creado exitosamente
204 No Content      - Eliminación exitosa
206 Partial Content - Respuesta parcial (archivos grandes)

# Errores del Cliente
400 Bad Request     - Datos inválidos
401 Unauthorized    - No autenticado
403 Forbidden       - Sin permisos para la acción
404 Not Found       - Recurso no encontrado
409 Conflict        - Conflicto de estado/duplicado
422 Unprocessable   - Error de validación de negocio
429 Too Many Req    - Rate limit excedido

# Errores del Servidor
500 Internal Error  - Error interno del servidor
502 Bad Gateway     - Error en servicio externo
503 Service Unavail - Servicio temporalmente no disponible
```

---

## 🔍 PARÁMETROS DE CONSULTA ESTANDARIZADOS

### **Paginación**
```bash
?page=0                 # Página (base 0)
&size=20                # Elementos por página (max 100)
&sort=nombre,asc        # Ordenamiento (campo,dirección)
&sort=fechaCreacion,desc&sort=id,asc  # Múltiples ordenamientos
```

### **Filtros Globales**
```bash
?search=texto           # Búsqueda texto libre
&activo=true           # Solo registros activos
&fechaDesde=2025-01-01 # Filtro fecha desde
&fechaHasta=2025-12-31 # Filtro fecha hasta
&includes=detalles,pagos # Incluir relaciones
```

### **Performance y Cache**
```bash
?nocache=true          # Bypass cache
&timeout=30            # Timeout personalizado (segundos)
&fields=id,nombre,email # Campos específicos (projection)
```

---

## 🛡️ SEGURIDAD IMPLEMENTADA

### **Headers de Seguridad**
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-API-Key: optional_api_key_for_external_integrations
X-Request-ID: unique_request_identifier
X-Client-Version: web_v1.2.0
```

### **Rate Limiting**
```bash
# Por Usuario Autenticado
- 1000 requests/hora para operaciones normales
- 100 requests/hora para operaciones pesadas (reportes)
- 10 requests/minuto para autenticación

# Headers de Rate Limit
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### **Validaciones de Entrada**
```bash
- Sanitización de todos los inputs
- Validación de tipos de datos
- Límites de tamaño para uploads
- Whitelist de caracteres permitidos
- Validación de business rules
```

---
## 🎯 MVP - MÓDULOS PRIORITARIOS

### 📋 Alcance del Producto Mínimo Viable
Este MVP cubre las funciones esenciales para operar un taller de reparación de motos: ingreso, diagnóstico, orden de trabajo y cobro.

---

## 🏆 MÓDULOS PRIORITARIOS

### 1️⃣ **Gestión de Clientes y Motos**
**Funcionalidades Core:**
- ✅ Registro de cliente y sus motos
- ✅ Historial de servicios realizados

**Detalles de Implementación:**
- Datos básicos del cliente (nombre, teléfono, email, dirección)
- Registro de múltiples motos por cliente
- Información técnica de cada moto (marca, modelo, año, placa, VIN)
- Historial completo de servicios realizados por moto
- Búsqueda rápida por cliente o moto

### 2️⃣ **Orden de Trabajo**
**Funcionalidades Core:**
- ✅ Crear orden por cliente y moto
- ✅ Diagnóstico, estado y observaciones

**Estados de Orden:**
```
RECIBIDA → DIAGNOSTICADA → EN_PROCESO → COMPLETADA → ENTREGADA
```

**Detalles de Implementación:**
- Creación de orden vinculada a cliente específico y moto
- Campo de descripción del problema inicial
- Sección de diagnóstico técnico detallado
- Observaciones y notas por parte del mecánico
- Seguimiento de cambios de estado con timestamps
- Mecánico asignado y fecha estimada de entrega

### 3️⃣ **Servicios Técnicos**
**Funcionalidades Core:**
- ✅ Lista de servicios aplicados a cada orden
- ✅ Precio base editable

**Detalles de Implementación:**
- Catálogo de servicios disponibles (mantenimiento, reparación, etc.)
- Asignación múltiple de servicios por orden
- Precios base configurables por servicio
- Capacidad de ajustar precios por orden específica
- Categorización de servicios (motor, frenos, eléctrico, etc.)
- Tiempo estimado por servicio

### 4️⃣ **Repuestos**
**Funcionalidades Core:**
- ✅ Inventario de repuestos disponibles
- ✅ Asignación y consumo por orden
- ✅ **NECESARIO**: Alertas de stock mínimo, proveedores

**Detalles de Implementación:**
- Catálogo de repuestos con código, descripción y precio
- Control de stock actual y stock mínimo
- Asignación de repuestos específicos a órdenes
- Descuento automático de stock al confirmar uso
- Alertas automáticas cuando stock llega al mínimo
- Gestión básica de proveedores
- Historial de movimientos de inventario

### 5️⃣ **Pagos y Caja**
**Funcionalidades Core:**
- ✅ Registro de pagos
- ✅ Métodos de pago: efectivo, tarjeta, transferencia

**Detalles de Implementación:**
- Cálculo automático del total de la orden (servicios + repuestos)
- Registro de pagos parciales y completos
- Múltiples métodos de pago por transacción
- Control de caja diaria
- Generación de recibos/facturas básicas
- Estado de pago de cada orden (pendiente, parcial, completo)

### 6️⃣ **FUNCIONES DE CADA USUARIO**
**Funcionalidades Core:**
- ✅ Roles: administrador, recepcionista, mecánico
- ✅ Accesos controlados

**Detalles de Implementación:**
#### **Rol ADMINISTRADOR:**
✅ Autenticarse
✅ Gestionar Usuarios
✅ Configurar Servicios del Catálogo
✅ Gestionar Inventario de Repuestos
✅ Ver Reportes Financieros
✅ Ver Reportes Operacionales
✅ Configurar Alertas de Stock
✅ Asignar Mecánicos a Órdenes

#### **Rol RECEPCIONISTA:**
✅ Autenticarse
✅ Registrar Cliente
✅ Registrar Moto
✅ Crear Orden de Trabajo
✅ Registrar Pago
✅ Consultar Estado de Orden
✅ Generar Factura
#### **Rol MECÁNICO:**
✅ Autenticarse
✅ Ver Órdenes Asignadas
✅ Diagnosticar Moto
✅ Actualizar Estado de Orden
✅ Solicitar Repuestos
✅ Registrar Tiempo de Trabajo
✅ Agregar Observaciones Técnicas

SISTEMA (Actor Externo)
✅ Enviar Notificaciones
✅ Generar Alertas de Stock
✅ Procesar Pagos
✅ Generar Respaldos

**Controles de Acceso:**
- Autenticación obligatoria para todas las funciones
- Restricción de endpoints por rol
- Logging de acciones críticas
- Timeout automático de sesión


## 📐 Estándares de Desarrollo y Optimización

### 🏗️ Principios Arquitectónicos OBLIGATORIOS
- **Clean Architecture**: Separación estricta de capas (Domain, Application, Infrastructure, Presentation)
- **SOLID Principles**: Aplicación rigurosa en cada clase y módulo
- **DRY (Don't Repeat Yourself)**: Zero tolerancia a código duplicado
- **KISS (Keep It Simple, Stupid)**: Soluciones elegantes y mantenibles
- **YAGNI (You Aren't Gonna Need It)**: No sobre-ingeniería

### 🔒 Seguridad CRÍTICA
- **Authentication & Authorization**: JWT con refresh tokens, RBAC implementado correctamente
- **Input Validation**: Validación exhaustiva en todos los endpoints
- **SQL Injection Prevention**: ORMs con queries parametrizadas únicamente
- **XSS Protection**: Sanitización de inputs, CSP headers
- **HTTPS Enforcement**: SSL/TLS obligatorio en todos los ambientes
- **Rate Limiting**: Protección contra ataques DDoS
- **Audit Logs**: Trazabilidad completa de acciones críticas

### ⚡ Performance y Optimización
- **Database Optimization**: 
  - Índices apropiados en todas las foreign keys
  - Query optimization con EXPLAIN ANALYZE
  - Connection pooling configurado
  - Pagination obligatoria en listados
- **Caching Strategy**:
  - Redis para session storage
  - Cache de queries frecuentes
  - CDN para assets estáticos
- **API Performance**:
  - Response time < 200ms para operaciones CRUD
  - Async processing para operaciones pesadas
  - Compression (gzip) habilitada

### 🧪 Testing MANDATORIO
- **Unit Tests**: 90%+ coverage mínimo
- **Integration Tests**: Todos los endpoints
- **E2E Tests**: Flujos críticos de negocio
- **Load Testing**: Capacidad mínima 1000 usuarios concurrentes
- **Security Testing**: OWASP Top 10 validation

### 📝 Documentación EXIGIDA
- **API Documentation**: OpenAPI/Swagger completa
- **Code Comments**: Solo para lógica compleja de negocio
- **README**: Setup instructions detalladas
- **Architecture Decision Records (ADRs)**: Decisiones técnicas documentadas
- **Database Schema**: Diagramas ER actualizados

### 🔄 DevOps y CI/CD
- **Version Control**: Git flow con feature branches
- **Code Review**: Pull Request obligatorio, 2 approvals mínimo
- **Automated Testing**: Pipeline que corre todos los tests
- **Static Code Analysis**: SonarQube o equivalente
- **Deployment**: Blue-green deployment strategy
- **Monitoring**: APM tools (New Relic, Datadog)
- **Logging**: ELK Stack o equivalent structured logging

### 🎯 Métricas de Calidad NO NEGOCIABLES
- **Code Quality**: SonarQube Quality Gate PASS
- **Performance**: 
  - API response time < 200ms (95th percentile)
  - Database query time < 50ms (average)
  - Frontend load time < 2s
- **Reliability**: 99.9% uptime mínimo
- **Security**: Zero vulnerabilities críticas o altas
- **Maintainability**: Cyclomatic complexity < 10

### ❌ ANTI-PATTERNS PROHIBIDOS
- God Objects (clases > 500 líneas)
- Magic Numbers sin constantes
- Hardcoded values
- Catch-all exception handlers
- N+1 Query problems
- Synchronous operations que bloqueen
- Missing error handling
- Inconsistent naming conventions

### 🚫 CÓDIGO QUE SERÁ RECHAZADO INMEDIATAMENTE
- Código sin tests
- Console.log en producción
- Passwords en código
- APIs sin versionado
- Endpoints sin autenticación
- Queries sin paginación
- Código comentado (dead code)
- Dependencias obsoletas o vulnerables

---

## 👨‍💻 METODOLOGÍA DE REVISIÓN TÉCNICA

### 🎯 PERFIL DEL REVISOR TÉCNICO
**Senior Software Architect - 20 años de experiencia**
- **Experiencia**: Sistemas críticos, alta concurrencia, arquitecturas distribuidas
- **Criterio**: Zero tolerancia a shortcuts, anti-patterns, o código "que funciona"
- **Estándar**: Code review como si fuera para producción bancaria o healthcare

### 🔍 PROCESO DE REVISIÓN OBLIGATORIO
**CADA línea de código será evaluada bajo criterio senior:**

#### ✅ **APROBACIÓN REQUERIRÁ:**
- Justificación técnica sólida para cada decisión arquitectónica
- Demostración de conocimiento de trade-offs y alternativas consideradas
- Evidencia de que se evaluaron patrones enterprise apropiados
- Pruebas de performance y security implementadas
- Documentación técnica que demuestre pensamiento estratégico

#### ❌ **RECHAZO INMEDIATO POR:**
- **"Funciona en mi máquina"** - Inaceptable sin evidencia en múltiples ambientes
- **"Lo optimizamos después"** - Se hace bien desde el primer commit
- **"Es temporal"** - Nada es temporal en producción
- **"Solo es un prototipo"** - Prototipos se convierten en legado
- **"No tengo tiempo"** - Tiempo mal usado es deuda técnica cara

### 🎓 **NIVEL DE EXIGENCIA ACADÉMICA**
- **Pregrado**: Se espera código funcional básico
- **🔥 ESTE PROYECTO**: Se exige **CALIDAD ENTERPRISE**
  - Pensamiento arquitectónico estratégico
  - Consideración de escalabilidad desde día 1
  - Manejo experto de patrones de diseño
  - Optimización preventiva, no reactiva
  - Security-first mindset

### 💼 **CRITERIO PROFESIONAL APLICADO**
**Como si trabajaras en:**
- **Google**: Cada línea revisada por 2+ seniors
- **Amazon**: Performance crítico, 99.99% uptime
- **Microsoft**: Backward compatibility, enterprise standards
- **Netflix**: Escalabilidad masiva, fault tolerance
- **Stripe**: Security-first, zero downtime deployments

### 🚨 **ADVERTENCIA FINAL**
**Este no es un proyecto académico tradicional.**

Es una **simulación real** de desarrollo enterprise donde:
- **Los errores tienen consecuencias**
- **La calidad no es negociable**
- **Las decisiones se justifican técnicamente**
- **El código se escribe para el próximo desarrollador**
- **La optimización es preventiva, no reactiva**

**Si no estás preparado para este nivel de exigencia, mejor elige un framework de prototyping rápido. Si quieres aprender a desarrollar como un senior de verdad, continuamos con estos estándares.**

---

**NOTA CRÍTICA**: Este proyecto se desarrolla bajo estándares enterprise. Cualquier desviación de estos principios será considerada deuda técnica crítica y debe ser corregida antes de merge.

---



---

## 🗄️ DISEÑO DE BASE DE DATOS

### 📊 MODELO DE DATOS ENTERPRISE
**Arquitectura**: PostgreSQL 15+ con 12 tablas normalizadas (3NF)
**Justificación**: Partimos de las 9 tablas docentes y agregamos solo las mínimas necesarias para cumplir toda la funcionalidad enterprise sin redundancia ni deuda técnica.

### 🎯 TABLAS DEL SISTEMA (12 TABLAS)

#### **GRUPO 1: SEGURIDAD Y USUARIOS**
```sql
1. usuarios          -- Autenticación, roles, seguridad
```

#### **GRUPO 2: ENTIDADES DE NEGOCIO PRINCIPALES**
```sql
2. clientes          -- Información completa de clientes
3. motos             -- Vehículos registrados por cliente
4. categorias        -- Clasificación de servicios
5. servicios         -- Catálogo de servicios disponibles
```

#### **GRUPO 3: OPERACIONES CORE**
```sql
6. ordenes_trabajo   -- Órdenes principales del taller
7. orden_servicios   -- Servicios aplicados a cada orden
8. diagnosticos      -- Evaluaciones técnicas por mecánico
```

#### **GRUPO 4: INVENTARIO Y GESTIÓN**
```sql
9. repuestos         -- Inventario de partes y componentes
10. orden_repuestos  -- Repuestos utilizados por orden
11. pagos            -- Transacciones financieras
12. auditoria        -- Trazabilidad completa del sistema
```

### 🔥 DECISIONES TÉCNICAS CRÍTICAS

#### **✅ POR QUÉ 12 TABLAS (NO MÁS, NO MENOS)**

**TABLA AGREGADA 1: `categorias`**
- **Justificación**: Normalización 3NF. Sin esta tabla, `servicios.categoria` sería texto repetitivo
- **Beneficio**: Consistencia, integridad referencial, facilita reportes agrupados
- **Sin ella**: Datos inconsistentes ("Motor", "motor", "MOTOR")

**TABLA AGREGADA 2: `diagnosticos`**  
- **Justificación**: Los mecánicos necesitan documentar evaluaciones técnicas detalladas
- **Beneficio**: Trazabilidad, responsabilidad profesional, historial técnico
- **Sin ella**: Imposible justificar costos, pérdida de conocimiento técnico

**TABLA AGREGADA 3: `auditoria`**
- **Justificación**: Compliance enterprise. Toda transacción debe ser auditable
- **Beneficio**: Trazabilidad completa, debugging, compliance, forense
- **Sin ella**: Sistema no apto para producción, imposible debugging

#### **❌ TABLAS CONSIDERADAS Y RECHAZADAS**

**`proveedores`** - RECHAZADA
- Razón: MVP no requiere gestión compleja de proveedores
- Solución: Campo `proveedor` en tabla `repuestos` es suficiente para MVP

**`facturas`** - RECHAZADA  
- Razón: Funcionalidad cubierta por `pagos` + `ordenes_trabajo`
- Solución: Vista `v_facturas` genera documentos desde datos existentes

**`citas/agenda`** - RECHAZADA
- Razón: Fuera del scope del MVP actual
- Solución: Implementación futura como módulo independiente

### 🎨 RELACIONES Y CARDINALIDADES

```
CLIENTES (1) ←→ (N) MOTOS
MOTOS (1) ←→ (N) ORDENES_TRABAJO  
ORDENES_TRABAJO (1) ←→ (N) ORDEN_SERVICIOS
ORDENES_TRABAJO (1) ←→ (N) ORDEN_REPUESTOS
ORDENES_TRABAJO (1) ←→ (N) DIAGNOSTICOS
ORDENES_TRABAJO (1) ←→ (N) PAGOS

CATEGORIAS (1) ←→ (N) SERVICIOS
SERVICIOS (1) ←→ (N) ORDEN_SERVICIOS
REPUESTOS (1) ←→ (N) ORDEN_REPUESTOS
USUARIOS (1) ←→ (N) ORDENES_TRABAJO (mecánico_asignado)
USUARIOS (1) ←→ (N) DIAGNOSTICOS (mecánico_responsable)
```

### ⚡ OPTIMIZACIONES IMPLEMENTADAS

#### **ÍNDICES ESTRATÉGICOS**
```sql
-- Búsquedas frecuentes por cliente
CREATE INDEX idx_clientes_documento ON clientes(numero_documento);
CREATE INDEX idx_clientes_telefono ON clientes(telefono);

-- Gestión de órdenes
CREATE INDEX idx_ordenes_fecha ON ordenes_trabajo(fecha_creacion);
CREATE INDEX idx_ordenes_estado ON ordenes_trabajo(estado);
CREATE INDEX idx_ordenes_cliente ON ordenes_trabajo(id_cliente);

-- Control de inventario
CREATE INDEX idx_repuestos_codigo ON repuestos(codigo);
CREATE INDEX idx_repuestos_stock_bajo ON repuestos(stock_actual, stock_minimo);

-- Auditoría eficiente
CREATE INDEX idx_auditoria_fecha ON auditoria(fecha_operacion);
CREATE INDEX idx_auditoria_tabla ON auditoria(tabla_afectada);
```

#### **TRIGGERS AUTOMÁTICOS**
```sql
-- Control de stock automático
TRIGGER after_insert_orden_repuestos → Descuenta stock automáticamente
TRIGGER after_update_repuestos → Alerta cuando stock < mínimo

-- Auditoría completa
TRIGGER audit_trigger → Registra TODOS los cambios en tiempo real

-- Numeración secuencial
TRIGGER before_insert_ordenes → Genera números únicos correlativo
```

#### **VISTAS OPTIMIZADAS**
```sql
-- Dashboard operacional
v_ordenes_pendientes → Órdenes que requieren atención inmediata
v_stock_critico → Repuestos por debajo del mínimo
v_facturas → Documentos listos para imprimir

-- Reportes gerenciales  
v_ventas_periodo → Ingresos agrupados por fecha/servicio
v_productividad_mecanicos → Performance por técnico
v_clientes_frecuentes → Top clientes por volumen/valor
```

### 🔒 SEGURIDAD Y COMPLIANCE

#### **INTEGRIDAD REFERENCIAL**
```sql
-- Todas las FK con ON DELETE RESTRICT para evitar eliminaciones accidentales
-- ON UPDATE CASCADE para mantener consistencia en cambios de IDs
-- CHECK constraints para valores válidos (estados, roles, etc.)
```

#### **AUDITORÍA COMPLETA**
```sql
-- Tabla auditoria registra:
- ¿Quién? (usuario_responsable)
- ¿Qué? (operacion: INSERT/UPDATE/DELETE)  
- ¿Cuándo? (fecha_operacion con timezone)
- ¿Dónde? (tabla_afectada, id_registro)
- ¿Cómo era antes? (valores_anteriores JSON)
- ¿Cómo quedó? (valores_nuevos JSON)
```

#### **CONTROL DE ACCESO**
```sql
-- Roles definidos a nivel aplicación y BD:
- ADMIN: Acceso total, gestión de usuarios
- RECEPCIONISTA: CRUD clientes, órdenes, pagos  
- MECANICO: Solo sus órdenes asignadas, diagnósticos

-- Prepared statements obligatorios (anti SQL injection)
-- Validación a nivel constraint + aplicación
```

### 📈 ESCALABILIDAD CONSIDERADA

#### **PARTICIONAMENTO FUTURO**
```sql
-- ordenes_trabajo: Partición por año (fecha_creacion)
-- auditoria: Partición por mes (fecha_operacion)  
-- pagos: Partición por año fiscal
```

#### **ARCHIVADO AUTOMÁTICO**
```sql
-- Función programada: Mover órdenes > 2 años a tabla histórica
-- Compresión automática de auditoría > 6 meses
-- Backup incremental diario, completo semanal
```

#### **PERFORMANCE MONITORING**
```sql
-- pg_stat_user_tables: Monitoreo uso de índices
-- pg_stat_user_indexes: Detectar índices no utilizados
-- slow query log: Identificar consultas problemáticas
```

### 🛠️ SCRIPT DE IMPLEMENTACIÓN

**Archivo**: `database_schema.sql` (714 líneas)
**Incluye**:
- ✅ Creación de 12 tablas con constraints
- ✅ 25+ índices optimizados
- ✅ 8 triggers automáticos  
- ✅ 6 vistas utilitarias
- ✅ 4 funciones de soporte
- ✅ Datos iniciales mínimos
- ✅ Configuración de timezone y encoding
- ✅ Extensiones PostgreSQL necesarias

**Validación**: Script probado en PostgreSQL 15+, listo para producción.

---