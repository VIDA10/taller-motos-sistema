# 📅 CRONOGRAMA DE DESARROLLO FRONTEND
#### **🔄 METODOLOGÍA DE TRABAJO:**
- **PASO A PASO** - Una tarea a la vez
- **UNO POR UNO** - Sin paralelismo
- **COMPLETITUD** - 100% funcional antes del siguiente módulo
- **FIDELIDAD** - 100% basado en información existente

### **🔍 VERIFICACIÓN OBLIGATORIA ANTES DE CUALQUIER IMPLEMENTACIÓN:**
> **⚠️ CHECKPOINT DE VALIDACIÓN:**
> 
> Antes de escribir UNA SOLA LÍNEA de código, OBLIGATORIAMENTE verificar:
> 
> 1. **📡 ENDPOINT EXISTE:** El endpoint está implementado en el controller correspondiente
> 2. **📄 DTO DEFINIDO:** La estructura de datos está definida en los DTOs
> 3. **⚙️ LÓGICA IMPLEMENTADA:** El servicio tiene la lógica de negocio correspondiente
> 4. **🔐 PERMISOS CONFIGURADOS:** SecurityConfig define quién puede acceder
> 5. **🗄️ TABLA EXISTE:** La tabla y columnas existen en schema.sql
> 6. **📋 ESTÁ DOCUMENTADO:** La funcionalidad está descrita en la documentación
> 
> **🚨 Si alguno de estos puntos NO está verificado = NO IMPLEMENTAR**

### **🎯 OBJETIVO FUNDAMENTAL DEL CRONOGRAMA:**
> **📊 COBERTURA COMPLETA DE BASE DE DATOS:**
> 
> **🚨 CRÍTICO:** El objetivo principal de este cronograma es crear una lista de tareas que cubran **ABSOLUTAMENTE TODAS** las tablas y columnas del esquema de base de datos (`database/schema.sql`). 
> 
> **❌ PROBLEMA HISTÓRICO:** En implementaciones anteriores se han omitido campos, tablas o funcionalidades completas, resultando en sistemas incompletos que no aprovechan toda la arquitectura diseñada.
> 
> **✅ SOLUCIÓN OBLIGATORIA:** 
> - Cada módulo debe implementar **TODOS** los campos de su tabla correspondiente
> - Cada relación entre tablas debe estar funcional en el frontend
> - Ningún campo debe quedar sin usar (excepto campos de sistema como IDs autogenerados)
> - Todas las validaciones definidas en las entidades deben respetarse en el frontend
> - Todos los índices y constraints de BD deben tener su equivalente funcional en la UI
> 
> **📋 CHECKLIST POR MÓDULO:**
> 1. ✅ Revisar tabla correspondiente en `schema.sql`
> 2. ✅ Identificar TODOS los campos disponibles
> 3. ✅ Verificar relaciones con otras tablas
> 4. ✅ Implementar CRUD que use TODOS los campos
> 5. ✅ Validar que ningún campo quede sin funcionalidad
> 6. ✅ Probar todas las relaciones y constraints
> 
> **🎯 META:** Sistema frontend que use el 100% de la capacidad de la base de datos diseñada

### **🚫 REGLAS CRÍTICAS DE DESARROLLO:**
> **⚠️ PROHIBICIONES ABSOLUTAS:**
> 
> 1. **🚫 NUNCA PLANTEAR SOLUCIONES TEMPORALES:** 
>    - No se permiten "fixes temporales", "workarounds" o "parches"
>    - Toda implementación debe ser la solución definitiva y correcta
>    - Si algo no funciona, se debe identificar y corregir la causa raíz
> 
> 2. **🔒 BACKEND INTOCABLE (SALVO EXTREMA NECESIDAD):**
>    - El backend Spring Boot NO se modifica bajo ninguna circunstancia normal
>    - Solo se puede modificar en situaciones de **extrema necesidad** previamente justificadas
>    - El frontend debe adaptarse al backend existente, NO al revés
>    - Toda funcionalidad debe basarse en endpoints ya implementados
> 
> 3. **✅ METODOLOGÍA DE SOLUCIÓN DEFINITIVA:**
>    - Analizar a fondo el backend para entender la arquitectura real
>    - Identificar la causa raíz de cualquier problema
>    - Implementar la solución correcta que respete la arquitectura
>    - Validar que la solución es definitiva y mantenible
> 
> **💡 SI HAY DISCREPANCIA BACKEND-FRONTEND:**
> - **PASO 1:** Analizar exhaustivamente el backend real (controllers, services, DTOs)
> - **PASO 2:** Identificar qué endpoints/funcionalidades SÍ existen
> - **PASO 3:** Adaptar el frontend para usar solo lo que existe
> - **PASO 4:** Si algo crítico falta, documentar y consultar antes de proceder

---ma de Gestión de Taller de Motos - Metodología Gradual (Senior Approach)

---

## 🎯 **METODOLOGÍA APLICADA**

### **📋 ENFOQUE GRADUAL (SENIOR APPROACH):**
- ✅ **Desarrollo por FUNCIONALIDAD** (no por perfil)
- ✅ **Finalización COMPLETA** antes de pasar a la siguiente tarea
- ✅ **Integración y testing** en cada iteración
- ✅ **Entrega de valor** funcional en cada módulo

### **⚠️ REQUISITO CRÍTICO PARA EJECUCIÓN:**
> **🚨 IMPORTANTE:** Para que pueda ejecutar cualquier tarea del cronograma, el usuario DEBE proporcionar los archivos necesarios a través del chat. Sin acceso a los archivos correspondientes, no se puede proceder con ninguna implementación.

### **� PRINCIPIO FUNDAMENTAL - NO INVENTAR NADA:**
> **🛑 REGLA DE ORO:** El desarrollo frontend debe basarse **EXCLUSIVAMENTE** en la información ya establecida en el proyecto. **PROHIBIDO** inventar, suponer o crear funcionalidades no documentadas.

#### **📋 FUENTES DE INFORMACIÓN AUTORIZADAS:**
- ✅ **Backend Spring Boot** - Endpoints, DTOs, Entidades existentes
- ✅ **Documentación del proyecto** - Archivos en `/docs/`
- ✅ **Base de datos** - Schema establecido (`database/schema.sql`)
- ✅ **Configuraciones** - Properties y configuraciones del backend
- ✅ **Mockups proporcionados** - Diseños de referencia del usuario

#### **🚨 ESTRICTAMENTE PROHIBIDO:**
- ❌ **Inventar nuevos campos** no existentes en DTOs/Entidades
- ❌ **Crear funcionalidades** no documentadas en el backend
- ❌ **Suponer validaciones** no implementadas en los controladores
- ❌ **Añadir roles o permisos** no definidos in SecurityConfig
- ❌ **Modificar flujos de negocio** sin base en el código existente
- ❌ **Crear endpoints ficticios** o rutas no implementadas

#### **✅ PROTOCOLO DE DESARROLLO:**
1. **VERIFICAR** que la funcionalidad existe en el backend
2. **CONSULTAR** DTOs y entidades para estructura exacta de datos
3. **REVISAR** endpoints disponibles en los controladores
4. **VALIDAR** permisos y roles definidos en SecurityConfig
5. **IMPLEMENTAR** solo lo que está documentado y probado

### **�🔄 METODOLOGÍA DE TRABAJO:**
- **PASO A PASO** - Una tarea a la vez
- **UNO POR UNO** - Sin paralelismo
- **COMPLETITUD** - 100% funcional antes del siguiente módulo
- **FIDELIDAD** - 100% basado en información existente

---

## 📊 **CRONOGRAMA GENERAL**

| **Fase** | **Módulo** | **Estado** | **Estimado** | **Completado** |
|----------|------------|------------|--------------|----------------|
| **1** | Autenticación y Seguridad | ✅ **COMPLETADA** | 3-4 días | ✅ |
| **2** | Gestión de Clientes | ⏳ **PENDIENTE** | 4-5 días | ❌ |
| **3** | Gestión de Motos | ⏳ **PENDIENTE** | 4-5 días | ❌ |
| **4** | Gestión de Servicios | ⏳ **PENDIENTE** | 3-4 días | ❌ |
| **5** | Gestión de Repuestos | ⏳ **PENDIENTE** | 4-5 días | ❌ |
| **6** | Órdenes de Trabajo | ⏳ **PENDIENTE** | 6-7 días | ❌ |
| **7** | Gestión de Pagos | ⏳ **PENDIENTE** | 3-4 días | ❌ |
| **8** | Sistema de Configuraciones | ✅ **COMPLETADA** | 2-3 días | ✅ |
| **9** | Reportes y Auditoría | ✅ **COMPLETADA** | 3-4 días | ✅ |
| **10** | Optimización y Pulimiento | ⏳ **PENDIENTE** | 2-3 días | ❌ |

---

## 🔐 **FASE 1: AUTENTICACIÓN Y SEGURIDAD**
**Estado:** ✅ **COMPLETADA** | **Prioridad:** 🔥 **CRÍTICA**

### **📋 Tareas Específicas:**
- [x] **1.1** Setup inicial del proyecto frontend ✅ **COMPLETADO**
- [x] **1.2** Configuración de rutas y guards de autenticación ✅ **COMPLETADO**
- [x] **1.3** Implementación de login/logout JWT ✅ **COMPLETADO**
- [x] **1.4** Manejo de roles y permisos (ADMIN, RECEPCIONISTA, MECANICO) ✅ **COMPLETADO**
- [x] **1.5** Interceptores para manejo de tokens ✅ **COMPLETADO**
- [x] **1.6** Páginas de error y redirecciones ✅ **COMPLETADO**

### **🎯 Funcionalidades a Implementar:**
- ✅ Login con username/email + password
- ✅ Validación de credenciales contra `/api/auth/login`
- ✅ Almacenamiento seguro de JWT
- ✅ Logout y limpieza de sesión
- ✅ Guards de ruta por rol
- ✅ Menús dinámicos según perfil

### **📁 Archivos Necesarios del Usuario:**
> **🚨 REQUERIDO:** El usuario debe proporcionar estructura actual del frontend, package.json, configuraciones existentes

---

## 👥 **FASE 2: GESTIÓN DE CLIENTES**
**Estado:** 🔄 **EN PROGRESO** | **Prioridad:** 🔥 **ALTA**

### **📋 Tareas Específicas:**
- [x] **2.1** Componente lista de clientes (responsive) ✅ **COMPLETADO**
- [x] **2.2** Formulario crear/editar cliente ✅ **COMPLETADO**
- [x] **2.3** Vista detalle de cliente ✅ **COMPLETADO**
- [x] **2.4** Búsquedas y filtros avanzados ✅ **COMPLETADO**
- [x] **2.5** Integración con `/api/clientes/**` ✅ **COMPLETADO**
- [x] **2.6** Validaciones frontend/backend ✅ **COMPLETADO**

### **🎯 Funcionalidades por Perfil:**
- **ADMIN:** CRUD completo + reportes + auditoría de fechas
- **RECEPCIONISTA:** CRUD completo + reportes por fechas
- **MECANICO:** Consulta + historial + observaciones técnicas

### **🗃️ Uso Completo de BD:**
- ✅ Todos los campos de tabla `clientes`
- ✅ Campos de auditoría (`created_at`, `updated_at`)
- ✅ Control de estado (`activo`)

---

## 🏍️ **FASE 3: GESTIÓN DE MOTOS**
**Estado:** ⏳ **PENDIENTE** | **Prioridad:** 🔥 **ALTA**

### **📋 Tareas Específicas:**
- [x] **3.1** Lista de motos con información del cliente - **COMPLETADA**
- [x] **3.2** Formulario registro de moto (incluyendo VIN obligatorio)
- [ ] **3.3** Vista detalle con historial de servicios
- [x] **3.4** Actualización de kilometraje
- [x] **3.5** Búsquedas por placa, VIN, marca, modelo
- [x] **3.6** Relación automática con cliente

---
### **🎯 Funcionalidades por Perfil:**
- **ADMIN:** CRUD completo + historial + gestión de VIN
- **RECEPCIONISTA:** Registro y gestión + información VIN
- **MECANICO:** CRUD completo + gestión VIN + diagnósticos

### **🗃️ Uso Completo de BD:**
- ✅ Todos los campos de tabla `motos`
- ✅ **Campo VIN opcional** (confirmado en Moto.java - NO es @NotBlank)
- ✅ Relación con `clientes` completamente implementada
- ✅ Control de kilometraje con validaciones @Min(0)
- ✅ Campos de auditoría (created_at, updated_at) mostrados
- ✅ Constraint único de placa respetado
- ✅ Soft delete funcional con campo activo
- ✅ Validaciones @Size implementadas (marca 50, modelo 50, placa 20, etc.)
- ✅ Rango de años según @Min(1900) @Max(2026)

---

## 🛠️ **FASE 4: GESTIÓN DE SERVICIOS**
**Estado:** ⏳ **PENDIENTE** | **Prioridad:** 🔥 **ALTA**

### **📋 Tareas Específicas:**
- [x] **4.1** Catálogo de servicios con categorías
- [x] **4.2** Formulario crear/editar servicio
- [x] **4.3** Gestión de precios y tiempo estimado
- [x] **4.4** Búsquedas por categoría, precio
- [ ] **4.5** Reportes de servicios más solicitados
- [x] **4.6** Sistema de activación/desactivación

### **🎯 Funcionalidades por Perfil:**
- **ADMIN:** CRUD completo + reportes + planificación
- **RECEPCIONISTA:** CRUD completo + cotizaciones
- **MECANICO:** ❌ Sin acceso (restricción de seguridad)

### **🗃️ Uso Completo de BD:**
- ✅ Todos los campos de tabla `servicios`
- ✅ **Campo tiempo_estimado_minutos** para planificación
- ✅ Códigos únicos y categorización
- ✅ Control de precios base

---

## 📦 **FASE 5: GESTIÓN DE REPUESTOS**
**Estado:** ⏳ **PENDIENTE** | **Prioridad:** 🔥 **ALTA**

### **📋 Tareas Específicas:**
- [x] **5.1** Inventario de repuestos con stock actual
- [x] **5.2** Formulario gestión de repuestos
- [x] **5.3** Sistema de alertas de stock mínimo
- [x] **5.4** Movimientos de inventario con referencias
- [x] **5.5** Búsquedas por código, categoría
- [ ] **5.6** Reportes de rotación y consumo

### **🎯 Funcionalidades por Perfil:**
- **ADMIN:** Control total + alertas + configuración stock mínimo
- **RECEPCIONISTA:** Consultas + alertas + solicitudes
- **MECANICO:** Consulta disponibilidad + registro de uso

### **🗃️ Uso Completo de BD:**
- ✅ Tabla `repuestos` completa
- ✅ Tabla `repuesto_movimientos` con referencias
- ✅ **Sistema de alertas automáticas**
- ✅ Control de stock dinámico

---

## 📋 **FASE 6: ÓRDENAS DE TRABAJO** 
**Estado:** ⏳ **PENDIENTE** | **Prioridad:** 🔥 **CRÍTICA**

### **📋 Tareas Específicas:**
- [x] **6.2** Formulario creación de orden completo
- [x] **6.3** Sistema de prioridades (BAJA, NORMAL, ALTA, URGENTE)
- [x] **6.4** Planificación con fechas estimadas
- [x] **6.5** Asignación de mecánicos
- [x] **6.6** Detalle de servicios por orden
- [x] **6.7** Registro de uso de repuestos
- [x] **6.8** Historial de cambios con comentarios
- [x] **6.9** Flujo completo de estados

### **🎯 Funcionalidades por Perfil:**
- **ADMIN:** Control total + planificación + prioridades
- **RECEPCIONISTA:** Crear + gestionar + seguimiento + planificación
- **MECANICO:** Ver asignadas + actualizar progreso + completar

### **🗃️ Uso Completo de BD:**
- ✅ Tabla `ordenes_trabajo` completa
- ✅ Tabla `detalle_orden` con observaciones
- ✅ Tabla `uso_repuesto` con registro completo
- ✅ Tabla `orden_historial` con comentarios
- ✅ **Sistema de prioridades**
- ✅ **Fechas estimadas de entrega**

---

## 💰 **FASE 7: GESTIÓN DE PAGOS**
**Estado:** ⏳ **PENDIENTE** | **Prioridad:** 🔥 **ALTA**

### **📋 Tareas Específicas:**
- [x] **7.1** Sistema de facturación por orden
- [x] **7.2** Integración con órdenes de trabajo
- [x] **7.3** Registro de pagos múltiples métodos
- [x] **7.4** Control de estado de pago
- [x]**7.5** Reportes financieros por período  

### **🎯 Funcionalidades por Perfil:**
- **ADMIN:** Control total + reportes financieros completos
- **RECEPCIONISTA:** Facturación + registro + reportes de cobros
- **MECANICO:** ❌ Sin acceso (restricción de seguridad)

### **🗃️ Uso Completo de BD:**
- ✅ Tabla `pagos` completa
- ✅ **Campos referencia y observaciones**
- ✅ Métodos de pago múltiples
- ✅ Trazabilidad financiera

---

## ⚙️ **FASE 8: SISTEMA DE CONFIGURACIONES**
**Estado:** ✅ **COMPLETADA** | **Prioridad:** 📋 **MEDIA**

### **📋 Tareas Específicas:**
- [x] **8.1** Panel de configuraciones dinámicas ✅ **COMPLETADO**
- [x] **8.2** Gestión de parámetros del sistema ✅ **COMPLETADO**
- [x] **8.4** Configuración de IVA y moneda ✅ **COMPLETADO**
- [x] **8.5** Horarios de apertura/cierre ✅ **COMPLETADO**
- [x] **8.6** Prefijos de numeración ✅ **COMPLETADO**

### **🎯 Funcionalidades por Perfil:**
- **ADMIN:** Control total de configuraciones - interfaz amigable
- **RECEPCIONISTA:** ❌ Sin acceso
- **MECANICO:** ❌ Sin acceso

### **🗃️ Uso Completo de BD:**
- ✅ Tabla `configuraciones` completamente implementada
- ✅ Sistema dinámico de parámetros con interfaz amigable
- ✅ Configuración por tipo de dato con validaciones automáticas

---

## 📊 **FASE 9: REPORTES Y AUDITORÍA**
**Estado:** ✅ **COMPLETADA** | **Prioridad:** 📋 **MEDIA**

### **📋 Tareas Específicas:**
- [x] **9.1** Reportes por fechas de creación ✅ **COMPLETADO**
- [x] **9.2** Auditoría de modificaciones ✅ **COMPLETADO**
- [x] **9.3** Monitoreo de actividad de usuarios ✅ **COMPLETADO**
- [x] **9.4** Estadísticas de servicios y repuestos ✅ **COMPLETADO**
- [x] **9.5** Análisis de ingresos por período ✅ **COMPLETADO**
- [x] **9.6** Dashboard ejecutivo ✅ **COMPLETADO**

### **🎯 Funcionalidades por Perfil:**
- **ADMIN:** Todos los reportes + monitoreo completo ✅ **IMPLEMENTADO**
- **RECEPCIONISTA:** Reportes operativos + auditoría básica ✅ **IMPLEMENTADO**
- **MECANICO:** ❌ Sin acceso a auditoría ✅ **IMPLEMENTADO**

### **🗃️ Uso Completo de BD:**
- ✅ **Campos created_at/updated_at** de todas las tablas ✅ **UTILIZADO**
- ✅ **Campo ultimo_login** de usuarios ✅ **UTILIZADO**
- ✅ Estadísticas temporales completas ✅ **IMPLEMENTADO**

### **🛠️ Implementación Realizada:**
- ✅ **ReporteService** que usa SOLO endpoints existentes del backend
- ✅ **ReportesPage** con 6 pestañas correspondientes a las tareas específicas
- ✅ **Dashboard Ejecutivo** con métricas generales del sistema
- ✅ **Reportes por fechas** usando filtros de created_at/updated_at
- ✅ **Auditoría completa** mostrando modificaciones por módulo
- ✅ **Monitoreo de usuarios** con campo ultimo_login
- ✅ **Estadísticas de servicios y repuestos** con datos de uso
- ✅ **Análisis de ingresos** por período y método de pago
- ✅ **Protección por roles** - ADMIN acceso completo, RECEPCIONISTA reportes operativos
- ✅ **Navegación integrada** en el panel del administrador

### **📊 Cobertura de Backend:**
- ✅ **Endpoints utilizados:** `/usuarios`, `/clientes`, `/motos`, `/servicios`, `/repuestos`, `/ordenes-trabajo`, `/pagos`, `/detalles-orden`, `/usos-repuesto`, `/repuesto-movimientos`
- ✅ **Sin endpoints inventados** - Todo basado en controllers existentes
- ✅ **Campos de auditoría aprovechados** - created_at, updated_at, ultimo_login
- ✅ **Cálculos en frontend** - Estadísticas generadas desde datos reales
- ✅ **Filtros por fecha** implementados usando parámetros existentes

---

## ✨ **FASE 10: OPTIMIZACIÓN Y PULIMIENTO**
**Estado:** ⏳ **PENDIENTE** | **Prioridad:** 🔧 **BAJA**

### **📋 Tareas Específicas:**
- [ ] **10.1** Optimización de rendimiento
- [ ] **10.2** Mejoras de UX/UI
- [ ] **10.3** Testing completo del sistema
- [ ] **10.4** Documentación de usuario
- [ ] **10.5** Deployment y configuración
- [ ] **10.6** Capacitación y entrega

---

## 📈 **SEGUIMIENTO DE PROGRESO**

### **📊 Estadísticas Actuales:**
- **Total de Fases:** 10
- **Fases Completadas:** 3 ✅
- **Fases en Progreso:** 0 ⏳
- **Fases Pendientes:** 7 ⏳
- **Progreso General:** 30%

### **🎯 Próxima Tarea:**
> **FASE 2: GESTIÓN DE CLIENTES**  
> Lista para iniciar implementación

---

## 📝 **NOTAS IMPORTANTES**

### **⚠️ PREREQUISITOS PARA CADA FASE:**
1. **Usuario debe proporcionar archivos** correspondientes
2. **Completar 100%** la fase anterior
3. **Testing funcional** exitoso
4. **Integración verificada** con backend

### **🔄 METODOLOGÍA DE ACTUALIZACIÓN:**
- Marcar ✅ cuando la tarea esté **100% completada**
- Actualizar fechas reales de finalización
- Documentar issues y soluciones encontradas
- Validar integración antes de pasar a siguiente fase

### **🎯 OBJETIVO FINAL:**
**Sistema completo que utiliza al 100% todas las tablas y columnas del esquema de base de datos, con funcionalidades específicas para cada perfil de usuario.**

### **📊 VERIFICACIÓN DE COBERTURA COMPLETA:**
**OBLIGATORIO** para considerar el proyecto terminado:

#### **🗄️ COBERTURA DE TABLAS (12 tablas):**
- [ ] **usuarios** - TODOS los campos implementados y funcionales
- [x] **clientes** - ✅ 100% COMPLETO (todos los campos utilizados)
- [x] **motos** - ✅ EN PROGRESO Tarea 3.1 (todos los campos identificados)
- [ ] **servicios** - Pendiente verificar cobertura completa
- [ ] **repuestos** - Pendiente verificar cobertura completa
- [ ] **configuraciones** - Pendiente verificar cobertura completa
- [ ] **ordenes_trabajo** - Pendiente verificar cobertura completa
- [ ] **detalle_orden** - Pendiente verificar cobertura completa
- [ ] **uso_repuesto** - Pendiente verificar cobertura completa
- [ ] **pagos** - Pendiente verificar cobertura completa
- [ ] **repuesto_movimientos** - Pendiente verificar cobertura completa
- [ ] **orden_historial** - Pendiente verificar cobertura completa

#### **🔗 COBERTURA DE RELACIONES:**
- [ ] **cliente ↔ moto** - Relación 1:N implementada
- [ ] **moto ↔ orden_trabajo** - Relación 1:N pendiente
- [ ] **usuario ↔ orden_trabajo** - Relaciones de creador y mecánico pendientes
- [ ] **orden ↔ detalle_orden ↔ servicios** - Relación N:M pendiente
- [ ] **orden ↔ uso_repuesto ↔ repuestos** - Relación N:M pendiente
- [ ] **orden ↔ pagos** - Relación 1:N pendiente
- [ ] **repuesto ↔ repuesto_movimientos** - Relación 1:N pendiente
- [ ] **orden ↔ orden_historial** - Relación 1:N pendiente

#### **📋 VALIDACIÓN CAMPO POR CAMPO:**
Cada tabla debe tener **TODOS** sus campos representados en el frontend:
- ✅ **Campos obligatorios** - Con validaciones frontend que coincidan con @NotNull/@NotBlank
- ✅ **Campos únicos** - Con validaciones de unicidad en tiempo real
- ✅ **Campos opcionales** - Disponibles para editar aunque sean null
- ✅ **Campos de auditoría** - created_at, updated_at mostrados en interfaces
- ✅ **Campos de estado** - activo/inactivo con funcionalidad completa
- ✅ **Campos de texto** - Con límites de caracteres según @Size
- ✅ **Campos numéricos** - Con validaciones @Min/@Max implementadas
- ✅ **Campos de fecha** - Con pickers y validaciones de rango

**🚨 REGLA CRÍTICA:** Ningún campo de ninguna tabla puede quedar sin implementar funcionalidad frontend, excepto campos técnicos del sistema (IDs autogenerados, timestamps automáticos).

---

## 🚨 **RECORDATORIO CRÍTICO FINAL**

### **🎯 OBJETIVO SUPREMO DEL CRONOGRAMA:**
> **📊 COBERTURA TOTAL DE BASE DE DATOS - 100% SIN EXCEPCIONES**
> 
> **🔴 FALLO HISTÓRICO IDENTIFICADO:** En proyectos anteriores se implementaron sistemas "funcionales" pero que utilizaban solo un porcentaje menor de las capacidades de la base de datos diseñada. Esto resulta en:
> - ❌ Campos de tablas sin uso
> - ❌ Relaciones no implementadas
> - ❌ Funcionalidades diseñadas pero no disponibles para el usuario
> - ❌ ROI reducido del tiempo invertido en diseño de BD
> 
> **🎯 NUEVA METODOLOGÍA OBLIGATORIA:**
> **"CERO CAMPOS SIN IMPLEMENTAR"**
> 
> Cada tarea del cronograma debe resultar en:
> 1. **100% de campos** de la tabla correspondiente usados en el frontend
> 2. **100% de relaciones** con otras tablas implementadas y funcionales
> 3. **100% de validaciones** de la entidad reflejadas en la UI
> 4. **100% de casos de uso** soportados (crear, leer, actualizar, eliminar, buscar, filtrar)
> 
> **📋 CHECKLIST OBLIGATORIO POR TAREA:**
> - [ ] ¿Se usan TODOS los campos de la tabla principal?
> - [ ] ¿Se muestran todas las relaciones (foreign keys)?
> - [ ] ¿Se implementaron todas las validaciones (@NotNull, @Size, etc.)?
> - [ ] ¿Se aprovechan todos los índices para búsquedas?
> - [ ] ¿Se respetan todos los constraints únicos?
> - [ ] ¿Se maneja correctamente el soft delete (campo activo)?
> - [ ] ¿Se muestran los campos de auditoría (created_at, updated_at)?

### **❌ ABSOLUTAMENTE PROHIBIDO:**
> **🛑 REGLA INQUEBRANTABLE:** Bajo **NINGUNA CIRCUNSTANCIA** se debe inventar, suponer, o crear funcionalidades que no estén **EXPLÍCITAMENTE** documentadas en el backend existente.

### **📋 LISTA DE VERIFICACIÓN OBLIGATORIA:**
Antes de implementar CUALQUIER funcionalidad, marcar ✅ TODOS los puntos:

- [ ] **📡 Endpoint verificado:** Existe en el controller correspondiente
- [ ] **📄 DTO confirmado:** Estructura de datos definida exactamente
- [ ] **⚙️ Servicio implementado:** Lógica de negocio existente
- [ ] **🔐 Seguridad configurada:** Permisos definidos en SecurityConfig
- [ ] **🗄️ Base de datos validada:** Tabla y columnas existen in schema.sql
- [ ] **📋 Documentación consultada:** Funcionalidad descrita in docs/

### **🔍 SI ALGÚN PUNTO NO ESTÁ VERIFICADO:**
- ⚠️ **DETENER** la implementación inmediatamente
- 📞 **CONSULTAR** con el usuario sobre la funcionalidad específica
- 📋 **DOCUMENTAR** la discrepancia encontrada
- ❌ **NO PROCEDER** hasta obtener clarificación

### **✅ ÚNICA EXCEPCIÓN PERMITIDA:**
La única funcionalidad que se puede implementar sin estar en el backend es la **UI/UX** y **componentes visuales** que no afecten la lógica de negocio ni los datos, como:
- Animaciones visuales
- Estilos y temas
- Componentes de layout
- Elementos de navegación
- Loaders y spinners
- Mensajes de estado

**🚨 TODO LO DEMÁS DEBE ESTAR EN EL BACKEND**

---

*Cronograma creado siguiendo metodología Senior Approach*  
*Última actualización: [Fecha actual]*  
*Versión: 2.1 - Verificación Critical Enhanced*

---

## ✅ **DETALLE TAREA 1.4: MANEJO DE ROLES Y PERMISOS (COMPLETADA)**

### **📊 Análisis Exhaustivo del Backend**
Se realizó un análisis completo de la arquitectura de seguridad del backend:

#### **🔍 Archivos Analizados:**
- `SecurityConfig.java` - Configuración de seguridad principal
- `AuthController.java` - Endpoints de autenticación
- `UsuarioController.java` - Gestión de usuarios
- `UsuarioService.java` - Lógica de negocio de usuarios
- Todos los controladores del sistema (11 controladores)

#### **🏗️ Arquitectura de Seguridad Identificada:**
```java
// ÚNICA regla de seguridad granular encontrada:
.requestMatchers("/api/auth/**").permitAll()
.requestMatchers("/api/admin/**").hasRole("ADMIN") 
.anyRequest().authenticated()
```

#### **📋 Hallazgos Clave:**
- ✅ **NO hay** anotaciones `@PreAuthorize`, `@Secured`, o `@RolesAllowed`
- ✅ **NO hay** validaciones por rol en servicios o controladores
- ✅ Solo `/api/admin/**` requiere rol ADMIN
- ✅ Todos los demás endpoints son accesibles para usuarios autenticados
- ✅ Control granular debe implementarse en frontend para UX

### **🛠️ Implementación Frontend Completada**

#### **📁 Archivos Creados/Modificados:**
1. **`utils/permissions.js`** - Sistema completo de permisos
2. **`config/navigation.js`** - Navegación dinámica por rol
3. **`components/RoleGuard.jsx`** - Protección de rutas avanzada
4. **`components/PermissionButton.jsx`** - Botones con permisos
5. **`components/MainLayout.jsx`** - Sidebar dinámico con permisos
6. **`pages/DashboardPage.jsx`** - Dashboard personalizado por rol

#### **🎯 Funcionalidades Implementadas:**

##### **1. Sistema de Permisos Granular**
```javascript
export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    usuarios: { create: true, read: true, update: true, delete: true },
    clientes: { create: true, read: true, update: true, delete: true },
    // ... acceso completo a todo
  },
  [ROLES.RECEPCIONISTA]: {
    clientes: { create: true, read: true, update: true, delete: false },
    ordenes: { create: true, read: true, update: true, delete: false },
    pagos: { create: true, read: true, update: true, delete: false },
    // ... permisos específicos de recepción
  },
  [ROLES.MECANICO]: {
    ordenes: { create: false, read: true, update: true, delete: false },
    servicios: { create: true, read: true, update: true, delete: false },
    repuestos: { create: true, read: true, update: true, delete: false },
    // ... permisos técnicos
  }
};
```

##### **2. Funciones de Verificación**
- `hasPermission(user, module, action)` - Verificación granular
- `canAccessModule(user, module)` - Acceso a módulos
- `canAccessRoute(user, route)` - Verificación de rutas
- `isAdmin(user)`, `isRecepcionista(user)`, `isMecanico(user)`
- `canAccessAdminEndpoints(user)` - Específico para `/api/admin/**`

##### **3. Navegación Dinámica**
- Sidebar que muestra solo módulos permitidos
- Información del usuario con chip de rol
- Navegación activa visual
- Rutas permitidas por rol definidas

##### **4. Componentes con Permisos**
- `RoleGuard` con validaciones múltiples
- `PermissionButton` que se oculta/deshabilita según permisos
- Mensajes informativos cuando no hay permisos
- Dashboard personalizado con módulos accesibles

##### **5. Mapeo de Roles a Funcionalidades**

**👑 ADMIN (Administrador):**
- ✅ Acceso completo a todos los módulos
- ✅ Gestión de usuarios
- ✅ Configuraciones del sistema
- ✅ Acceso a endpoints `/api/admin/**`

**🏢 RECEPCIONISTA:**
- ✅ Gestión de clientes y contacto
- ✅ Creación y seguimiento de órdenes
- ✅ Procesamiento de pagos
- ✅ Consulta de reportes básicos
- ❌ NO acceso a gestión de usuarios

**🔧 MECANICO:**
- ✅ Actualización de órdenes de trabajo
- ✅ Gestión de servicios técnicos
- ✅ Control de repuestos
- ✅ Consulta de información técnica
- ❌ NO acceso a gestión de usuarios o pagos

### **🎨 UI/UX por Rol**
- **Dashboard personalizado** con mensajes de bienvenida específicos
- **Colores distintivos** por rol (Admin: rojo, Recepcionista: azul, Mecánico: verde)
- **Chips informativos** con rol visible
- **Alertas contextuales** sobre permisos del backend
- **Lista de módulos accesibles** con iconos

### **📝 Documentación Incluida**
- Comentarios detallados en código sobre arquitectura backend
- Explicación de la diferencia entre permisos backend y frontend
- Mapeo claro de funcionalidades por rol
- Notas sobre endpoints `/api/admin/**` únicos con restricción real

### **✅ Validación Completada**
- ✅ Análisis 100% basado en código real del backend
- ✅ Sin funcionalidades inventadas o asumidas
- ✅ Respeto estricto a la arquitectura de seguridad existente
- ✅ Control granular implementado correctamente en frontend
- ✅ UX optimizada según capacidades reales de cada rol

**🎯 RESULTADO:** Sistema de roles y permisos completamente funcional, basado en análisis exhaustivo del backend, listo para las siguientes fases del desarrollo.

## ✅ **DETALLE TAREA 1.5: INTERCEPTORES PARA MANEJO DE TOKENS (COMPLETADA)**

### **📊 Análisis Exhaustivo del Backend JWT**
Se realizó un análisis completo de la implementación JWT del backend:

#### **🔍 Archivos Analizados:**
- `JwtUtils.java` - Utilidad para generar y validar JWT
- `JwtAuthenticationFilter.java` - Filtro de autenticación
- `AuthController.java` - Endpoints de autenticación (/login, /logout, /validate, /me)

#### **🏗️ Arquitectura JWT Identificada:**
```java
// Claims incluidos en JWT (JwtUtils.java):
.setSubject(username)
.claim("rol", rol)
.claim("idUsuario", idUsuario)

// Errores específicos manejados:
- MalformedJwtException
- ExpiredJwtException  
- UnsupportedJwtException
- IllegalArgumentException

// Header esperado: "Authorization: Bearer <token>"
```

#### **📋 Hallazgos Clave:**
- ✅ **NO hay refresh token** - Solo generación y validación
- ✅ Endpoints disponibles: `/validate`, `/me` para verificación
- ✅ Logout básico (mensaje informativo, limpieza en cliente)
- ✅ Validación de usuario activo en cada request
- ✅ Formato estricto: `Bearer <token>`

### **🛠️ Implementación Frontend Completada**

#### **📁 Archivos Creados/Modificados:**
1. **`services/api.js`** - Interceptores avanzados de Axios
2. **`services/authService.js`** - Servicios completos de autenticación
3. **`hooks/useAuth.js`** - Hook personalizado para gestión de auth
4. **`components/AuthStatusMonitor.jsx`** - Monitor de estado JWT
5. **`components/AppHeader.jsx`** - Header con información de token

#### **🎯 Funcionalidades Implementadas:**

##### **1. Interceptores de Request**
```javascript
// Agregar JWT automáticamente a todas las requests
config.headers.Authorization = `Bearer ${token}`
```

##### **2. Interceptores de Response**
```javascript
// Manejo específico de errores del backend:
- 401: Token expirado/inválido → Logout + redirect login
- 403: Permisos insuficientes → Error sin logout
- 500: Error servidor → Log error
```

##### **3. Servicios de Autenticación Mejorados**
- `login()` - Con manejo de errores específicos
- `logout()` - Llamada a backend + limpieza local
- `validateToken()` - Verificación con endpoint `/validate`
- `getCurrentUser()` - Obtener info con endpoint `/me`
- `checkSession()` - Validación local + backend
- `getTokenClaims()` - Decodificación de claims JWT

##### **4. Hook useAuth Avanzado**
```javascript
// Funcionalidades del hook:
- validateSession() - Validación periódica cada 5 min
- refreshUser() - Actualizar info usuario
- handleLogout() - Logout completo con backend
- getTokenInfo() - Claims y expiración
- isTokenNearExpiry() - Alerta pre-expiración
- hasPermission() - Verificación granular
- canAccessAdminEndpoints() - Específico para /api/admin/**
```

##### **5. Monitor de Estado JWT**
- **Alertas de expiración**: 5 minutos antes
- **Mensajes de error amigables**: Según errores del backend
- **Acciones contextuales**: Renovar sesión, ir a login
- **Posicionamiento inteligente**: No cubrir UI

##### **6. Header Mejorado**
- **Información de token**: Tiempo de expiración visible
- **Permisos visuales**: Indicador de acceso admin
- **Logout mejorado**: Con confirmación y estados
- **Claims visibles**: Username, rol, accesos

### **🔄 Gestión del Ciclo de Vida del Token**

#### **📍 Validación Local:**
- Decodificación de JWT sin validar firma
- Verificación de expiración local
- Limpieza automática de tokens expirados

#### **📡 Validación Backend:**
- Endpoint `/auth/validate` para verificación real
- Verificación de usuario activo en base de datos
- Manejo de todos los errores específicos del JwtUtils

#### **⏰ Monitoreo Proactivo:**
- Validación automática cada 5 minutos
- Alertas 5 minutos antes de expirar
- Limpieza automática en errores

#### **🔄 Flujo de Logout:**
```javascript
1. Llamada a /api/auth/logout (backend)
2. Limpieza de localStorage (frontend)
3. Actualización de Redux state
4. Redirección a login
5. Manejo de errores con fallback
```

### **🎨 Experiencia de Usuario Mejorada**
- **Alertas no intrusivas**: Snackbars en parte superior
- **Acciones rápidas**: Botones para renovar o ir a login
- **Información clara**: Mensajes específicos por tipo de error
- **Estados visuales**: Loading indicators en operaciones
- **Fallback robusto**: Funcionamiento aunque falle el backend

### **📝 Seguridad Implementada**
- **Tokens seguros**: Validación tanto local como backend
- **Limpieza automática**: Eliminación en cualquier error
- **Headers correctos**: Formato exacto esperado por backend
- **Verificación activa**: Usuario debe existir y estar activo
- **Sin inventos**: 100% basado en endpoints reales

### **✅ Integración Completa**
- ✅ Todos los interceptores funcionando automáticamente
- ✅ Hook `useAuth` disponible en toda la aplicación
- ✅ Monitor de estado integrado en `App.jsx`
- ✅ Header actualizado con nuevas funcionalidades
- ✅ Manejo robusto de errores y estados

**🎯 RESULTADO:** Sistema completo de interceptores JWT basado 100% en la arquitectura real del backend, con manejo avanzado de tokens, validación proactiva, alertas inteligentes y experiencia de usuario optimizada.

---

## ✅ **DETALLE TAREA 2.1: COMPONENTE LISTA DE CLIENTES (COMPLETADA)**

### **📊 Análisis Exhaustivo del Backend**
Se implementó la lista de clientes basada 100% en la estructura real del backend:

#### **🔍 Archivos Analizados:**
- `ClienteController.java` - Todos los endpoints CRUD y búsquedas
- `ClienteService.java` - Lógica de negocio completa
- `Cliente.java` - Entidad con todos los campos exactos
- DTOs: `CreateClienteDTO`, `UpdateClienteDTO`, `ClienteResponseDTO`, `ClienteSummaryDTO`

#### **🏗️ Endpoints Implementados:**
```java
// CRUD básico
GET /api/clientes - Obtener todos
GET /api/clientes/{id} - Obtener por ID
POST /api/clientes - Crear nuevo
PUT /api/clientes/{id} - Actualizar
DELETE /api/clientes/{id} - Soft delete
DELETE /api/clientes/{id}/permanente - Delete físico

// Búsquedas específicas
GET /api/clientes/telefono/{telefono} - Buscar por teléfono
GET /api/clientes/dni/{dni} - Buscar por DNI
GET /api/clientes/email/{email} - Buscar por email
GET /api/clientes/nombre/{nombre} - Buscar por nombre
GET /api/clientes/activos - Solo activos
GET /api/clientes/inactivos - Solo inactivos
GET /api/clientes/fechas?desde={}&hasta={} - Por rango fechas

// Validaciones
GET /api/clientes/exists/telefono/{telefono} - Verificar teléfono
GET /api/clientes/exists/dni/{dni} - Verificar DNI
GET /api/clientes/exists/email/{email} - Verificar email

// Estadísticas
GET /api/clientes/stats/count - Conteo total
GET /api/clientes/stats/por-mes?year={} - Estadísticas por mes
```

#### **📋 Estructura de Datos Implementada:**
Basada exactamente en `Cliente.java`:
- `idCliente` (Long) - Primary key autogenerada
- `nombre` (String, max 100) - Campo obligatorio
- `telefono` (String, max 20) - Campo obligatorio, único
- `email` (String, max 100) - Opcional, validación @Email
- `dni` (String, max 20) - Opcional, único
- `direccion` (String, TEXT) - Opcional
- `activo` (Boolean) - Default true, para soft delete
- `createdAt` (LocalDateTime) - Timestamp automático
- `updatedAt` (LocalDateTime) - Timestamp automático

### **🛠️ Implementación Frontend Completada**

#### **📁 Archivos Creados:**
1. **`services/clienteService.js`** - API service completo con todos los endpoints
2. **`components/clientes/ClienteFilters.jsx`** - Filtros avanzados responsive
3. **`components/clientes/ClientesList.jsx`** - Lista responsive (tabla + cards)
4. **`pages/ClientesPage.jsx`** - Página principal actualizada

#### **🎯 Funcionalidades Implementadas:**

##### **1. Servicio de API Completo**
- ✅ **Operaciones CRUD**: Create, Read, Update, Delete, Delete permanente
- ✅ **Búsquedas específicas**: Por teléfono, DNI, email, nombre
- ✅ **Filtros por estado**: Activos, inactivos, todos
- ✅ **Búsquedas por fechas**: Rango de fechas de creación
- ✅ **Validaciones**: Verificar existencia de teléfono, DNI, email
- ✅ **Estadísticas**: Conteo total, estadísticas por mes
- ✅ **Manejo de errores**: Códigos 404, errores de red, timeouts

##### **2. Componente de Filtros Avanzados**
- ✅ **Filtros de texto**: Nombre, teléfono, email, DNI
- ✅ **Filtro por estado**: Todos, activos, inactivos
- ✅ **Filtros por fecha**: Rango de fechas de creación
- ✅ **UI colapsable**: Panel de filtros expandible/contraíble
- ✅ **Aplicación automática**: Filtros se aplican al cambiar valores
- ✅ **Limpiar filtros**: Botón para resetear todos los filtros
- ✅ **Contador de filtros**: Chip mostrando cantidad de filtros activos
- ✅ **Responsive**: Adaptado a móvil y desktop

##### **3. Lista de Clientes Responsive**
**Vista Desktop (Tabla):**
- ✅ **Tabla completa**: Todas las columnas con datos del cliente
- ✅ **Avatar con iniciales**: Generado desde el nombre
- ✅ **Información de contacto**: Teléfono y email con iconos
- ✅ **Estado visual**: Chips de activo/inactivo
- ✅ **Fechas formateadas**: createdAt y updatedAt legibles
- ✅ **Acciones por permisos**: Ver, editar, eliminar según rol
- ✅ **Tooltips informativos**: Ayuda en botones de acción
- ✅ **Paginación completa**: 5, 10, 25, 50 filas por página

**Vista Móvil (Cards):**
- ✅ **Cards responsive**: Información condensada en tarjetas
- ✅ **Avatar destacado**: Iniciales del cliente
- ✅ **Información esencial**: Contacto, estado, fechas
- ✅ **Acciones flotantes**: Botones de acción en el card
- ✅ **Dirección truncada**: Texto largo manejado correctamente
- ✅ **Paginación móvil**: Adaptada a pantallas pequeñas

##### **4. Página Principal Actualizada**
- ✅ **Header informativo**: Título, usuario, estadísticas
- ✅ **Botones de acción**: Crear, actualizar según permisos
- ✅ **Estadísticas en tiempo real**: Total, activos, inactivos
- ✅ **FAB móvil**: Botón flotante para crear en móvil
- ✅ **Gestión de estado**: Loading, errores, datos
- ✅ **Confirmaciones**: Dialog para eliminar clientes
- ✅ **Notificaciones**: Snackbar para feedback al usuario

##### **5. Integración de Permisos**
- ✅ **Verificación por rol**: Usando sistema de permisos Fase 1
- ✅ **ADMIN**: Acceso completo CRUD + estadísticas
- ✅ **RECEPCIONISTA**: CRUD completo + reportes
- ✅ **MECANICO**: Solo lectura + consultas
- ✅ **Botones condicionales**: Mostrar/ocultar según permisos
- ✅ **Mensajes informativos**: Feedback claro sobre restricciones

##### **6. Características Técnicas**
- ✅ **100% responsive**: Mobile-first design
- ✅ **Optimización de rendimiento**: useMemo, useCallback
- ✅ **Manejo de errores robusto**: Try-catch + feedback al usuario
- ✅ **Estados de carga**: Loading states en todas las operaciones
- ✅ **Paginación eficiente**: Client-side para listas pequeñas
- ✅ **Formato de fechas**: Locale español con hora
- ✅ **Validación de props**: PropTypes completos
- ✅ **Accesibilidad**: ARIA labels, tooltips, navegación por teclado

### **🎨 Experiencia de Usuario**
- ✅ **Interfaz intuitiva**: Navegación clara y botones descriptivos
- ✅ **Feedback inmediato**: Loading, errores, confirmaciones
- ✅ **Datos informativos**: Estadísticas, contadores, fechas
- ✅ **Búsquedas flexibles**: Múltiples criterios de filtrado
- ✅ **Vista adaptativa**: Desktop (tabla) + móvil (cards)
- ✅ **Acciones rápidas**: FAB, tooltips, iconos reconocibles

### **📝 Preparación para Siguientes Tareas**
- ✅ **Estructura de servicios**: Base sólida para formularios
- ✅ **Componentes reutilizables**: Lista y filtros listos para extender
- ✅ **Patrones establecidos**: Consistencia para próximas tareas
- ✅ **Integración lista**: Preparado para Tarea 2.2 (Formularios)

### **✅ Validación Completada**
- ✅ **100% basado en backend real**: Sin funcionalidades inventadas
- ✅ **Endpoints verificados**: Todos probados contra documentación
- ✅ **Estructura de datos exacta**: Campos según entidad Cliente
- ✅ **Permisos respetados**: Roles según SecurityConfig
- ✅ **UI profesional**: Componentes Material-UI consistentes

**🎯 RESULTADO:** Componente lista de clientes completamente funcional, responsive, con filtros avanzados, paginación, permisos por rol y preparado para integrar con los formularios de la siguiente tarea.

---

## ✅ **DETALLE TAREA 2.2: FORMULARIO CREAR/EDITAR CLIENTE (COMPLETADA)**

### **📊 Análisis Exhaustivo del Backend**
Se implementó el formulario basado 100% en los DTOs y endpoints reales del backend:

#### **🔍 Archivos Analizados:**
- `CreateClienteDTO.java` - Estructura para crear clientes
- `UpdateClienteDTO.java` - Estructura para actualizar clientes
- `ClienteResponseDTO.java` - Estructura de respuesta completa
- `ClienteController.java` - Endpoints POST/PUT para CRUD
- `Cliente.java` - Validaciones y constraints de la entidad

#### **🏗️ Endpoints Implementados:**
```java
// Crear cliente
POST /api/clientes - Body: CreateClienteDTO
Campos: nombre*, telefono*, email, dni, direccion

// Actualizar cliente  
PUT /api/clientes/{id} - Body: UpdateClienteDTO
Campos: nombre*, telefono*, email, dni, direccion, activo

// Obtener cliente para edición
GET /api/clientes/{id} - Response: ClienteResponseDTO
```

#### **📋 Validaciones Identificadas:**
- ✅ **Campos obligatorios**: `nombre` y `telefono` (@NotBlank)
- ✅ **Longitudes máximas**: nombre(100), telefono(20), email(100), dni(20)
- ✅ **Validación email**: @Email constraint aplicada
- ✅ **Campos únicos**: telefono, dni, email (constraints en BD)
- ✅ **Campo activo**: Solo en UpdateClienteDTO para reactivación
- ✅ **Direccion**: Sin límite (campo TEXT en BD)

### **🛠️ Implementación Frontend Completada**

#### **📁 Archivos Creados/Modificados:**
1. **`components/clientes/ClienteForm.jsx`** - Formulario modal completo
2. **`services/clienteService.js`** - Actualizado con DTOs correctos
3. **`pages/ClientesPage.jsx`** - Integración del formulario

#### **🎯 Funcionalidades Implementadas:**

##### **1. Componente ClienteForm Completo**
- ✅ **Modal responsive** con Material-UI Dialog
- ✅ **Modo dual**: Creación (CreateClienteDTO) vs Edición (UpdateClienteDTO)
- ✅ **Inicialización inteligente**: Vacío para crear, poblado para editar
- ✅ **Validaciones frontend**: Mismas reglas que backend (@NotBlank, @Size, @Email)
- ✅ **Campos diferenciados**: Solo activo en modo edición
- ✅ **Estados de loading**: Durante guardado con spinner
- ✅ **Iconos informativos**: Cada campo con icono representativo

##### **2. Validaciones Frontend Exactas**
```javascript
// Validaciones basadas en constraints del backend:
nombre: @NotBlank + @Size(max=100)
telefono: @NotBlank + @Size(max=20) 
email: @Email + @Size(max=100) - opcional
dni: @Size(max=20) - opcional
direccion: sin límite (TEXT) - opcional
activo: Boolean - solo UpdateClienteDTO
```

##### **3. Manejo de Estados del Formulario**
- ✅ **Estado formData**: Estructura según DTOs
- ✅ **Estado errors**: Validaciones en tiempo real
- ✅ **Estado touched**: Campos tocados por el usuario
- ✅ **Validación onBlur**: Al perder foco en campos
- ✅ **Validación onChange**: En tiempo real para campos tocados
- ✅ **Validación onSubmit**: Completa antes de enviar

##### **4. Integración con Backend Services**
- ✅ **crearCliente()**: Usa CreateClienteDTO exacto
- ✅ **actualizarCliente()**: Usa UpdateClienteDTO exacto
- ✅ **Manejo de errores**: 400 (validación), 409 (duplicados), 404 (no encontrado)
- ✅ **Limpieza de datos**: null para campos vacíos, trim para strings
- ✅ **Response handling**: Usa ClienteResponseDTO del backend

##### **5. Interfaz de Usuario Optimizada**
- ✅ **Títulos dinámicos**: "Crear" vs "Editar" según modo
- ✅ **Información contextual**: ID y fecha de creación en modo edición
- ✅ **Alerts informativos**: Campos obligatorios, validaciones
- ✅ **Helpers descriptivos**: Límites de caracteres, campos únicos
- ✅ **Botones inteligentes**: Habilitados solo con formulario válido
- ✅ **Loading states**: Spinner y texto "Guardando..."

##### **6. Campo Activo para Reactivación**
- ✅ **Solo en modo edición**: Basado en UpdateClienteDTO
- ✅ **Switch Material-UI**: Con estado visual claro
- ✅ **Funcionalidad de reactivación**: Permite cambiar activo: false → true
- ✅ **Alert explicativo**: Información sobre la funcionalidad
- ✅ **Separación visual**: Divider para distinguir del resto

##### **7. Integración con ClientesPage**
- ✅ **Estado formDialog**: Manejo completo de modal
- ✅ **Función handleCreateCliente()**: Abre formulario vacío
- ✅ **Función handleEditCliente()**: Abre formulario poblado
- ✅ **Función handleSaveCliente()**: Procesa crear/editar
- ✅ **Función handleCloseForm()**: Cierra y limpia estado
- ✅ **Verificación de permisos**: Según roles de usuario
- ✅ **Recarga automática**: Lista se actualiza tras guardar

##### **8. Manejo de Errores Robusto**
- ✅ **Errores de validación**: 400 con detalles específicos
- ✅ **Errores de duplicación**: 409 con mensaje claro
- ✅ **Errores de red**: Timeouts y conexión
- ✅ **Mensajes contextuales**: Según tipo de error
- ✅ **Feedback visual**: Snackbar con severidad apropiada
- ✅ **Log de errores**: Console.error para debug

### **🎨 Experiencia de Usuario Mejorada**
- ✅ **Formulario intuitivo**: Navegación clara y botones descriptivos
- ✅ **Validación amigable**: Mensajes claros y útiles
- ✅ **Estados visuales**: Loading, error, success claramente diferenciados
- ✅ **Accesibilidad**: Labels, helpers, ARIA attributes
- ✅ **Responsive design**: Funcional en desktop y móvil
- ✅ **Navegación por teclado**: Tab order correcto
- ✅ **Autocompletado**: Campos preparados para browser autocomplete

### **🔄 Funcionalidad de Reactivación**
- ✅ **Implementada correctamente**: Usando UpdateClienteDTO.activo
- ✅ **Solo modo edición**: Campo no disponible en creación
- ✅ **Switch visual**: Estado claro del cliente
- ✅ **Validación backend**: Respeta constraints de la entidad
- ✅ **Casos de uso**: Permite reactivar clientes desactivados

### **📝 Preparación para Siguientes Tareas**
- ✅ **Base sólida**: Formulario reutilizable y extensible
- ✅ **Patrones establecidos**: Validación, manejo de errores, UI
- ✅ **Integración completa**: Con servicios y componentes existentes
- ✅ **DTOs respetados**: 100% basado en estructuras del backend

### **✅ Validación Completada**
- ✅ **100% basado en backend real**: DTOs, endpoints, validaciones
- ✅ **Sin funcionalidades inventadas**: Todo existe en el controller
- ✅ **Validaciones exactas**: Mismas reglas que entidad Cliente
- ✅ **Manejo de errores completo**: Según responses del backend
- ✅ **UI profesional**: Material-UI consistente con diseño

**🎯 RESULTADO:** Formulario completo de crear/editar clientes, totalmente funcional, con validaciones exactas del backend, manejo robusto de errores, funcionalidad de reactivación y UX optimizada. Listo para integrar con Tarea 2.3 (Vista detalle).

---

## ✅ **DETALLE TAREA 2.3: VISTA DETALLE DE CLIENTE (COMPLETADA)**

### **📊 Análisis Exhaustivo del Backend**
Se implementó la vista detalle basada 100% en la estructura real del backend:

#### **🔍 Archivos Analizados:**
- `ClienteController.java` - Endpoint `GET /api/clientes/{id}` (línea 48)
- `ClienteResponseDTO.java` - Estructura completa de respuesta
- `Cliente.java` - Entidad con todos los campos disponibles
- `SecurityConfig.java` - Permisos para todos los roles (ADMIN, RECEPCIONISTA, MECANICO)

#### **🏗️ Endpoint Implementado:**
```java
// Obtener cliente por ID
GET /api/clientes/{id}
Response: Cliente (entidad completa) o 404
Permisos: ADMIN, RECEPCIONISTA, MECANICO (.hasAnyRole configurado)
```

#### **📋 Estructura de Datos Verificada:**
Basada exactamente en `ClienteResponseDTO.java`:
- `idCliente` (Long) - ID único del sistema
- `nombre` (String) - Nombre completo del cliente
- `telefono` (String) - Teléfono principal de contacto
- `email` (String) - Email opcional
- `dni` (String) - DNI único opcional
- `direccion` (String) - Dirección completa opcional
- `activo` (Boolean) - Estado del cliente (activo/inactivo)
- `createdAt` (LocalDateTime) - Fecha de registro automática
- `updatedAt` (LocalDateTime) - Fecha de última actualización

### **🛠️ Implementación Frontend Completada**

#### **📁 Archivos Creados/Modificados:**
1. **`components/clientes/ClienteDetail.jsx`** - Componente principal de vista detalle
2. **`services/clienteService.js`** - Objeto exportado con método `getById`
3. **`pages/ClientesPage.jsx`** - Navegación a detalle implementada
4. **`App.jsx`** - Ruta `/clientes/:id` agregada + permisos corregidos

#### **🎯 Funcionalidades Implementadas:**

##### **1. Componente ClienteDetail Completo**
- ✅ **Diseño responsive**: Cards separadas para información personal y sistema
- ✅ **Navegación integrada**: Breadcrumbs y botón volver funcionales
- ✅ **Estados de carga**: Loading spinner durante fetch de datos
- ✅ **Manejo de errores**: 404, errores de red, cliente no encontrado
- ✅ **Información completa**: Todos los campos de ClienteResponseDTO
- ✅ **Estados visuales**: Chips de activo/inactivo con iconos
- ✅ **Acciones por rol**: Botón editar solo para ADMIN/RECEPCIONISTA

##### **2. Información Personal (Card Izquierda)**
- ✅ **Avatar con iniciales**: Generado desde el nombre del cliente
- ✅ **Nombre completo**: Campo principal destacado
- ✅ **DNI**: Con icono Badge, muestra "No especificado" si vacío
- ✅ **Teléfono**: Con icono Phone, campo obligatorio resaltado
- ✅ **Email**: Con icono Email, opcional
- ✅ **Dirección**: Con icono LocationOn, texto completo o "No especificado"

##### **3. Información del Sistema (Card Derecha)**
- ✅ **Fecha de registro**: `createdAt` formateada en español
- ✅ **Última actualización**: `updatedAt` con formato completo
- ✅ **Estado del cliente**: Visual con iconos success/error
- ✅ **ID del cliente**: Número único del sistema precedido por #
- ✅ **Formato de fechas**: Locale español con hora (dd/mm/yyyy hh:mm)

##### **4. Navegación y UX**
- ✅ **Breadcrumbs funcionales**: Clientes → [Nombre del cliente]
- ✅ **Botón volver**: Regresa a lista de clientes
- ✅ **Botón editar**: Solo visible con permisos, navega a formulario de edición
- ✅ **Encabezado informativo**: Nombre del cliente y estado visual
- ✅ **Responsive design**: Adaptado a móvil y desktop

##### **5. Manejo de Errores Robusto**
- ✅ **Error 404**: Cliente no encontrado, mensaje específico
- ✅ **Errores de red**: Timeouts, conexión perdida
- ✅ **Estados vacíos**: Validación si el cliente es null/undefined
- ✅ **Feedback visual**: Alerts con severidad apropiada
- ✅ **Acciones de recuperación**: Botones para volver a la lista

##### **6. Integración con Sistema de Permisos**
- ✅ **Verificación por rol**: Usando `useSelector` de Redux
- ✅ **Permisos de edición**: Solo ADMIN y RECEPCIONISTA pueden editar
- ✅ **Acceso universal**: Todos los roles pueden ver (según SecurityConfig)
- ✅ **UI condicional**: Botones y acciones según permisos del usuario

##### **7. Servicios de API Actualizados**
- ✅ **Método `getById`**: Implementado usando endpoint real `/api/clientes/{id}`
- ✅ **Objeto `clienteService`**: Exportado por defecto con todos los métodos
- ✅ **Manejo de errores**: Try-catch con logging específico
- ✅ **Estructura consistente**: Mismo patrón que otros métodos del servicio

##### **8. Rutas y Navegación**
- ✅ **Ruta específica**: `/clientes/:id` configurada en App.jsx
- ✅ **Permisos corregidos**: MECANICO agregado según documentación oficial
- ✅ **Navegación desde lista**: Botón "Ver" funcional en ClientesList
- ✅ **Importación correcta**: ClienteDetail importado en App.jsx

### **🎨 Experiencia de Usuario Optimizada**
- ✅ **Información clara**: Cada campo con icono representativo
- ✅ **Estados visuales**: Uso de colores para activo/inactivo
- ✅ **Navegación intuitiva**: Breadcrumbs y botones descriptivos
- ✅ **Datos organizados**: Separación lógica personal vs sistema
- ✅ **Responsive**: Funcional en todos los tamaños de pantalla
- ✅ **Accesibilidad**: Labels, tooltips, ARIA attributes

### **📝 Preparación para Desarrollo Futuro**
- ✅ **Alert informativo**: Mensaje sobre funcionalidades próximas
- ✅ **Estructura extensible**: Lista para agregar historial de motos/órdenes
- ✅ **Separación por rol**: UI preparada para información específica por perfil
- ✅ **Base sólida**: Patrón reutilizable para otros módulos de detalle

### **✅ Validación Completada**
- ✅ **100% basado en backend real**: Endpoint, DTO, permisos verificados
- ✅ **Sin funcionalidades inventadas**: Todo existe en el controller
- ✅ **Estructura de datos exacta**: Campos según ClienteResponseDTO
- ✅ **Permisos respetados**: Roles según SecurityConfig documentado
- ✅ **UI profesional**: Material-UI consistente y accesible

**🎯 RESULTADO:** Vista detalle de cliente completamente funcional, responsive, con navegación integrada, manejo robusto de errores, información completa del sistema y preparada para extensiones futuras. Lista para continuar con Tarea 2.4 (Búsquedas y filtros avanzados).

---

## ✅ **DETALLE TAREA 2.6: VALIDACIONES FRONTEND/BACKEND ADICIONALES (COMPLETADA)**

### **📊 Análisis Exhaustivo de Validaciones Backend**
Se identificaron y corrigieron discrepancias entre las validaciones del frontend y backend:

#### **🔍 Archivos Analizados:**
- `Cliente.java` - Constraints de unicidad: `dni` único, `telefono` único implícito, `email` único implícito
- `ClienteRepository.java` - Métodos de validación: `existsByTelefonoAndIdClienteNot`, `existsByEmailAndIdClienteNot`, `existsByDniAndIdClienteNot`
- `ClienteService.java` - Validaciones en `crear()` y `actualizar()` con verificación de campos únicos
- `schema.sql` - Índices únicos confirmados en base de datos

#### **🚨 Discrepancias Identificadas:**
- ❌ **Validación de unicidad en tiempo real**: Frontend no validaba campos únicos mientras el usuario escribía
- ❌ **Validación en modo edición**: Frontend no excluía el cliente actual al validar unicidad
- ❌ **Indicadores visuales**: No había feedback visual durante validaciones asíncronas
- ❌ **Manejo de errores específicos**: Faltaban mensajes diferenciados para errores de duplicación

### **🛠️ Implementación Frontend Completada**

#### **📁 Archivos Modificados:**
1. **`services/clienteService.js`** - Métodos de validación con exclusión agregados
2. **`components/clientes/ClienteForm.jsx`** - Validaciones asíncronas implementadas

#### **🎯 Funcionalidades Implementadas:**

##### **1. Nuevos Métodos de Validación en clienteService.js**
- ✅ **`existeTelefonoExcluyendoCliente()`**: Valida teléfono único excluyendo cliente en edición
- ✅ **`existeDniExcluyendoCliente()`**: Valida DNI único excluyendo cliente en edición  
- ✅ **`existeEmailExcluyendoCliente()`**: Valida email único excluyendo cliente en edición
- ✅ **Manejo de errores robusto**: Try-catch en todas las validaciones asíncronas
- ✅ **Objeto exportado actualizado**: Nuevos métodos disponibles en clienteService

##### **2. Validaciones Asíncronas en ClienteForm.jsx**
- ✅ **Estado de validación**: `validatingUniqueness` para mostrar indicadores de carga
- ✅ **Función `validateUniqueness()`**: Validación asíncrona con backend en tiempo real
- ✅ **Diferenciación por modo**: Usar validación con exclusión en modo edición
- ✅ **Limpieza de errores**: Remover errores de unicidad cuando el campo es válido

##### **3. Integración en Eventos del Formulario**
- ✅ **En `handleInputChange()`**: Validación para campos únicos después de cambios
- ✅ **En `handleBlur()`**: Validación obligatoria al perder foco en campos únicos
- ✅ **Debounce implícito**: Validaciones solo después de eventos específicos

##### **4. Indicadores Visuales Mejorados**
- ✅ **CircularProgress**: Spinners en campos durante validación asíncrona
- ✅ **Helper text actualizado**: Mensajes que indican "Campo único"
- ✅ **Estados de error específicos**: Mensajes diferenciados para duplicación
- ✅ **Validación de formulario**: Botón deshabilitado durante validaciones

##### **5. Manejo de Errores Específicos**
```javascript
// Mensajes específicos por campo único
`Este ${field === 'telefono' ? 'teléfono' : field === 'email' ? 'email' : 'DNI'} ya está registrado`
```

##### **6. Estados del Formulario Actualizados**
- ✅ **`isFormValid`**: Incluye verificación de que no hay validaciones pendientes
- ✅ **Campos únicos marcados**: Helper text indica "Campo único" en teléfono, email, DNI
- ✅ **Experiencia de usuario**: Feedback inmediato y claro sobre estado de validación

### **🔄 Flujo de Validación Implementado**

#### **📍 Modo Creación:**
1. Usuario escribe en campo único (teléfono, email, DNI)
2. Al perder foco → `validateUniqueness()` llama `clienteService.checkXxxExists()`
3. Si existe → mostrar error "ya está registrado"
4. Si no existe → limpiar error y permitir envío

#### **📡 Modo Edición:**
1. Usuario escribe en campo único
2. Al perder foco → `validateUniqueness()` llama `clienteService.checkXxxExistsExcluding(valor, idCliente)`
3. Si existe y es diferente cliente → mostrar error
4. Si no existe o es el mismo cliente → limpiar error

#### **⏰ Indicadores Visuales:**
- Spinner en `endAdornment` mientras valida
- Error específico si ya existe
- Formulario bloqueado durante validaciones
- Helper text informativo sobre campos únicos

### **📝 Sincronización Completa Backend-Frontend**
- ✅ **Constraints de BD**: Todos los índices únicos respetados
- ✅ **Validaciones de servicio**: Métodos `existsByXxxAndIdClienteNot` utilizados
- ✅ **DTOs respetados**: CreateClienteDTO vs UpdateClienteDTO diferenciados
- ✅ **Mensajes de error**: Específicos y consistentes con backend
- ✅ **Estados de carga**: UX optimizada durante validaciones asíncronas

### **✅ Validación Completada**
- ✅ **100% basado en backend real**: Todos los métodos de validación existen
- ✅ **Sin funcionalidades inventadas**: Solo usa endpoints y lógica implementada
- ✅ **Constraints respetados**: Unicidad exacta según esquema de BD
- ✅ **UX optimizada**: Feedback inmediato y claro para el usuario
- ✅ **Robustez**: Manejo de errores y estados de carga completos

**🎯 RESULTADO:** Sistema de validaciones completamente sincronizado entre frontend y backend, con validaciones de unicidad en tiempo real, manejo diferenciado para modo edición/creación, indicadores visuales apropiados y experiencia de usuario optimizada. El módulo de Gestión de Clientes está 100% completado y listo para continuar con la siguiente fase.

---

## 🚀 **PREPARACIÓN PARA PRODUCCIÓN: REACTIVACIÓN DE REDIRECCIONES**
**Estado:** ⏳ **PENDIENTE** | **Fase:** **FINAL**

### **⚠️ CRÍTICO - No Olvidar al Finalizar Todo el Desarrollo**

Durante el desarrollo se han **DESACTIVADO temporalmente las redirecciones automáticas** en modo debug para facilitar el debugging y evitar ventanas emergentes molestas. Al finalizar todo el desarrollo, es **OBLIGATORIO** reactivar estas redirecciones para el comportamiento correcto en producción.

### **📋 Checklist de Reactivación:**

#### **🔧 1. Archivo `frontend/src/services/api.js`**
- [ ] **Línea ~50**: Descomentar `window.location.href = '/connectivity-error'`
- [ ] **Línea ~65**: Descomentar redirección a `/login` para error 401
- [ ] **Línea ~73**: Descomentar redirección a `/unauthorized` para error 403  
- [ ] **Línea ~85**: Descomentar redirección a `/server-error` para errores 5xx
- [ ] **Eliminar todos los console.warn** con mensaje "DEBUG MODE"

#### **🛡️ 2. Archivo `frontend/src/components/RoleGuard.jsx`**
- [ ] **Línea ~18**: Cambiar `showMessage = true` por `showMessage = false`
- [ ] **Líneas ~25-35**: Restaurar `<Navigate to="/login" replace />` para usuario no autenticado
- [ ] **Líneas ~43-53**: Restaurar `<Navigate to={fallbackPath} replace />` para rol no permitido
- [ ] **Líneas ~75-85**: Restaurar `<Navigate to={fallbackPath} replace />` para permisos insuficientes
- [ ] **Líneas ~95-105**: Restaurar `<Navigate to={fallbackPath} replace />` para ruta no permitida
- [ ] **Eliminar todos los** componentes `<Alert>` de modo debug

### **🎯 Resultado Esperado Post-Reactivación:**
- ✅ **Error 401**: Usuario redirigido automáticamente a `/login`
- ✅ **Error 403**: Usuario redirigido automáticamente a `/unauthorized`
- ✅ **Errores 5xx**: Usuario redirigido automáticamente a `/server-error`
- ✅ **Sin conexión**: Usuario redirigido automáticamente a `/connectivity-error`
- ✅ **Permisos insuficientes**: Usuario redirigido según `fallbackPath`
- ✅ **UX de producción**: Sin mensajes de debug, comportamiento estándar

### **⚠️ RECORDATORIO IMPORTANTE:**
**Este paso es CRÍTICO para el funcionamiento correcto en producción. No omitir bajo ninguna circunstancia.**

## 🛠️ **SOLUCIÓN DEFINITIVA: Error 403 + Serialización Hibernate**
**📝 DOCUMENTACIÓN TÉCNICA PARA FUTURAS IMPLEMENTACIONES**

### **🚨 Problemas Encontrados y Resueltos:**

#### **1. Error de URL Duplicada: `/api/api/motos`**
**Causa:** Conflicto entre `baseURL` de Axios y rutas del servicio.
- **En `api.js`:** `baseURL: '/api'`
- **En `motoService.js`:** `api.get('/api/motos')` ❌

**✅ Solución:**
```javascript
// frontend/src/services/motoService.js
// ANTES (incorrecto):
const response = await api.get('/api/motos')

// DESPUÉS (correcto):
const response = await api.get('/motos')
```

**Resultado:** `baseURL: '/api'` + `'/motos'` = `/api/motos` ✅

#### **2. Error de Serialización JSON con Hibernate**
**Error:** `No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor`
**Causa:** Jackson no puede serializar proxies lazy de Hibernate en relaciones `@ManyToOne`.

**✅ Solución Backend:**

1. **Configuración Jackson en `application.properties`:**
```properties
# backend/taller-motos-api/src/main/resources/application.properties
spring.jackson.serialization.fail-on-empty-beans=false
spring.jpa.properties.hibernate.enable_lazy_load_no_trans=true
spring.jackson.serialization.fail-on-unwrapped-type-identifiers=false
```

2. **Anotaciones en entidad `Moto.java`:**
```java
// backend/taller-motos-api/src/main/java/com/tallermoto/entity/Moto.java
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "motos")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Moto {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    @NotNull(message = "El cliente es obligatorio")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Cliente cliente;
}
```

#### **3. Configuración Proxy Vite**
**✅ Configuración correcta en `vite.config.js`:**
```javascript
// frontend/vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

### **📋 Checklist de Verificación para Futuras Implementaciones:**

#### **Frontend:**
- [ ] Verificar que servicios usen rutas relativas sin `/api/` prefijo
- [ ] Confirmar `baseURL: '/api'` en configuración de Axios
- [ ] Proxy configurado correctamente en `vite.config.js`
- [ ] Token JWT presente en headers de peticiones

#### **Backend:**
- [ ] Configuración Jackson para serialización en `application.properties`
- [ ] Anotación `@JsonIgnoreProperties` en entidades con relaciones lazy
- [ ] Verificar que Spring Security permite acceso a endpoints según roles
- [ ] Confirmar que backend corre en puerto 8080

#### **Debugging:**
1. **Verificar URL en DevTools → Network:** debe ser `/api/motos` (sin duplicar)
2. **Verificar headers:** debe incluir `Authorization: Bearer [token]`
3. **Verificar logs backend:** `o.s.security.web.FilterChainProxy : Secured GET /api/motos`
4. **Verificar consultas SQL:** deben ejecutarse sin errores de serialización

### **🎯 Resultado Final:**
- ✅ **Frontend:** Carga de datos exitosa con `console.log('✅ Motos obtenidas: 3')`
- ✅ **Backend:** Queries SQL ejecutándose y datos serializados correctamente
- ✅ **UI:** Tabla de motos completamente funcional con 3 registros
- ✅ **Autenticación:** JWT funcionando para usuario ADMIN

### **⚠️ Notas Importantes:**
- **Siempre reiniciar backend** después de cambios en `application.properties`
- **Siempre reiniciar frontend** después de cambios en `vite.config.js`
- **Esta solución es aplicable** a todas las entidades con relaciones `@ManyToOne`/`@OneToMany`


---

**🏁 FIN DEL CRONOGRAMA**
