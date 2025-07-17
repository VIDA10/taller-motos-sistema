PERFIL ADMIN
Rol: Administrador del sistema
Acceso: TOTAL - Puede acceder a TODOS los endpoints del sistema

🔧 Funcionalidades Específicas del ADMIN:
1. Gestión de Usuarios (/api/usuarios/**)
✅ CRUD completo de usuarios
✅ Crear, actualizar, eliminar usuarios
✅ Gestionar roles (ADMIN, RECEPCIONISTA, MECANICO)
✅ Soft delete y eliminación permanente
✅ Búsquedas avanzadas por username, email, rol
✅ Consultas por estado (activos/inactivos)
✅ Reportes de usuarios por fecha de creación
2. Gestión de Servicios (/api/servicios/**)
✅ CRUD completo del catálogo de servicios
✅ Crear, actualizar, eliminar servicios
✅ Gestión de precios y disponibilidad
✅ Búsquedas por nombre, categoría, precio
✅ Reportes de servicios más solicitados
3. Gestión de Pagos (/api/pagos/**)
✅ Control total de pagos
✅ Ver, crear, actualizar pagos
✅ Reportes financieros completos
✅ Consultas por método de pago, fechas, montos
✅ Análisis de ingresos por período
4. Gestión Completa de Operaciones:
✅ Clientes: CRUD completo + reportes + auditoría de fechas
✅ Motos: CRUD completo + historial + gestión de VIN
✅ Órdenes de Trabajo: Control total del flujo + planificación + prioridades
✅ Repuestos: Gestión de inventario completa + alertas de stock
✅ Configuraciones del Sistema: Parámetros globales + configuración dinámica
5. Módulos Adicionales (Acceso Total):
✅ Detalles de Orden (/api/detalles-orden/**) + observaciones por servicio
✅ Historial de Órdenes (/api/orden-historial/**) + comentarios de cambios
✅ Movimientos de Repuestos (/api/repuesto-movimientos/**) + referencias de documentos
✅ Uso de Repuestos (/api/usos-repuesto/**) + auditoría completa

6. Funcionalidades de Monitoreo y Auditoría (EXCLUSIVAS ADMIN):
✅ Monitoreo de actividad de usuarios (último login)
✅ Reportes por fechas de creación y actualización
✅ Configuración de parámetros del sistema (stock mínimo, IVA, horarios)
✅ Alertas automáticas de stock bajo
✅ Sistema de planificación con fechas estimadas de entrega
✅ Gestión de prioridades en órdenes (BAJA, NORMAL, ALTA, URGENTE)
✅ Documentación completa de pagos (referencias y observaciones)
✅ Control de comentarios en cambios de estado de órdenes
👩‍💼 PERFIL RECEPCIONISTA
Rol: Personal de atención al cliente y gestión administrativa
Acceso: OPERATIVO - Maneja el flujo diario del taller

🔧 Funcionalidades del RECEPCIONISTA:
1. Gestión de Usuarios (/api/usuarios/**) ✅
✅ Crear y gestionar usuarios (excepto otros admins)
✅ Ver información de todos los usuarios
✅ Actualizar datos de usuarios
✅ Búsquedas de personal
2. Gestión de Servicios (/api/servicios/**) ✅
✅ CRUD completo del catálogo
✅ Crear nuevos servicios
✅ Actualizar precios y disponibilidad
✅ Consultar servicios para cotizaciones
3. Gestión de Pagos (/api/pagos/**) ✅
✅ Control total de facturación
✅ Registrar pagos de clientes
✅ Generar reportes de cobros
✅ Consultas por métodos de pago
4. Gestión Operativa Principal:
✅ Clientes (/api/clientes/**): CRUD completo + reportes por fechas
✅ Motos (/api/motos/**): Registro y gestión + información VIN
✅ Órdenes de Trabajo (/api/ordenes-trabajo/**): Crear, gestionar, seguimiento + planificación
✅ Repuestos (/api/repuestos/**): Consultar disponibilidad, solicitar + alertas de stock
5. Módulos de Seguimiento:
✅ Detalles de Orden: Gestión completa + observaciones por servicio
✅ Historial de Órdenes: Consultas y reportes + auditoría de fechas
✅ Movimientos de Repuestos: Seguimiento de inventario + referencias
✅ Uso de Repuestos: Control de consumo + auditoría

6. Funcionalidades de Planificación y Control:
✅ Gestión de fechas estimadas de entrega
✅ Sistema de prioridades en órdenes (visualización)
✅ Reportes de tiempo estimado vs tiempo real de servicios
✅ Documentación de pagos con referencias y observaciones
✅ Comentarios en cambios de estado de órdenes
❌ Restricciones del RECEPCIONISTA:
NO tiene acceso directo a configuraciones del sistema
NO puede ver datos de auditoría detallados (último login de usuarios)
Depende del ADMIN para cambios críticos en la plataforma
🔧 PERFIL MECANICO
Rol: Personal técnico especializado
Acceso: OPERATIVO TÉCNICO - Enfocado en ejecución de trabajos

🔧 Funcionalidades del MECANICO:
1. Gestión de Clientes (/api/clientes/**) ✅
✅ Consultar información de clientes
✅ Ver historial de servicios por cliente
✅ Actualizar observaciones técnicas
2. Gestión de Motos (/api/motos/**) ✅
✅ CRUD completo de motos + gestión de VIN
✅ Actualizar información técnica y kilometraje
✅ Registrar diagnósticos y reparaciones
✅ Historial de mantenimientos
3. Gestión de Órdenes de Trabajo (/api/ordenes-trabajo/**) ✅
✅ Control total del flujo de trabajo
✅ Ver órdenes asignadas
✅ Actualizar estados de progreso
✅ Registrar tiempo de trabajo
✅ Completar órdenes
4. Gestión de Repuestos (/api/repuestos/**) ✅
✅ Consultar disponibilidad
✅ Registrar uso de repuestos
✅ Solicitar repuestos específicos
✅ Actualizar inventario usado
5. Módulos Técnicos:
✅ Detalles de Orden: Gestión técnica completa + observaciones por servicio
✅ Historial de Órdenes: Consultar trabajos anteriores
✅ Movimientos de Repuestos: Seguimiento técnico + referencias
✅ Uso de Repuestos: Registro de consumo por trabajo

6. Funcionalidades de Trabajo en Campo:
✅ Consultar tiempos estimados de servicios para planificación
✅ Ver fechas estimadas de entrega para organizar trabajo
✅ Consultar prioridades de órdenes asignadas
✅ Agregar comentarios en cambios de estado de órdenes
✅ Documentar referencias en uso de repuestos
❌ Restricciones del MECANICO:
NO puede gestionar usuarios (/api/usuarios/**)
NO puede gestionar el catálogo de servicios (/api/servicios/**)
NO puede gestionar pagos (/api/pagos/**)
NO tiene acceso a configuraciones del sistema
NO puede ver precios de repuestos ni totales financieros
NO puede ver datos de auditoría (fechas de creación/actualización)
NO puede gestionar alertas de stock mínimo




 FLUJO DE TRABAJO TÍPICO POR PERFIL
👨‍💼 ADMIN - Flujo Administrativo:
Gestión de personal → Crear/actualizar usuarios
Configuración de servicios → Definir catálogo y precios
Supervisión general → Reportes y análisis
Control financiero → Gestión de pagos y facturación
👩‍💼 RECEPCIONISTA - Flujo de Atención:
Recepción de cliente → Registrar cliente y moto
Creación de orden → Generar orden de trabajo
Asignación de servicios → Definir trabajos a realizar
Gestión de pagos → Facturar y cobrar servicios
🔧 MECANICO - Flujo Técnico:
Recibir orden → Ver trabajos asignados + prioridades
Diagnóstico → Actualizar información técnica + VIN de motos
Ejecución → Registrar uso de repuestos + referencias + tiempo vs estimado
Finalización → Completar orden + comentarios + entregar

---

## 🗃️ **FUNCIONALIDADES ESPECÍFICAS PARA USO COMPLETO DE BD**

### **📊 TABLA CONFIGURACIONES** (Solo ADMIN)
- ✅ **Parámetros del Sistema:** Stock mínimo global, días garantía, IVA
- ✅ **Configuración Operativa:** Prefijo órdenes, horarios, moneda
- ✅ **Notificaciones:** Email automático, alertas
- ✅ **Gestión Dinámica:** Crear, modificar, eliminar configuraciones

### **🔍 CAMPOS DE AUDITORÍA** (ADMIN + RECEPCIONISTA)
- ✅ **Reportes por Fechas:** Usuarios creados por período
- ✅ **Análisis de Actividad:** Último login, usuarios activos/inactivos
- ✅ **Auditoría de Cambios:** Fechas de actualización de registros
- ✅ **Estadísticas Temporales:** Creación de clientes, motos, órdenes por período

### **📅 SISTEMA DE PLANIFICACIÓN** (ADMIN + RECEPCIONISTA + MECANICO)
- ✅ **Fechas Estimadas:** Calcular entrega basado en servicios
- ✅ **Tiempo Estimado:** Usar minutos de servicios para planificar
- ✅ **Calendario de Trabajo:** Organizar órdenes por fecha
- ✅ **Control de Tiempos:** Comparar estimado vs real

### **⚡ SISTEMA DE PRIORIDADES** (ADMIN + RECEPCIONISTA + MECANICO vista)
- ✅ **Asignación de Prioridad:** BAJA, NORMAL, ALTA, URGENTE
- ✅ **Cola de Trabajo:** Ordenar órdenes por prioridad
- ✅ **Alertas Visuales:** Colores según prioridad
- ✅ **Filtros:** Buscar por nivel de prioridad

### **🔧 GESTIÓN TÉCNICA AVANZADA** (Todos los perfiles)
- ✅ **VIN de Motos:** Registro obligatorio número de bastidor
- ✅ **Observaciones por Servicio:** Detalles específicos en detalle_orden
- ✅ **Referencias en Movimientos:** Documentar origen de entradas/salidas
- ✅ **Comentarios en Cambios:** Justificar cambios de estado

### **💰 DOCUMENTACIÓN FINANCIERA** (ADMIN + RECEPCIONISTA)
- ✅ **Referencias de Pago:** Número cheque, transferencia, etc.
- ✅ **Observaciones de Pago:** Detalles adicionales del cobro
- ✅ **Trazabilidad:** Relacionar pagos con documentos

### **📦 CONTROL DE INVENTARIO AVANZADO** (ADMIN + alertas RECEPCIONISTA)
- ✅ **Alertas de Stock:** Notificaciones automáticas stock mínimo
- ✅ **Referencias de Movimiento:** Factura, orden de compra, etc.
- ✅ **Stock Dinámico:** Configuración personalizada por repuesto
- ✅ **Reportes de Rotación:** Análisis de consumo por período

---

## 📋 **TABLA DE USO COMPLETO POR FUNCIONALIDAD**

| **Tabla/Campo** | **Funcionalidad Específica** | **Perfil Responsable** |
|-----------------|-------------------------------|------------------------|
| `configuraciones.*` | Panel de configuración del sistema | ADMIN |
| `*.created_at` | Reportes por fecha de creación | ADMIN, RECEPCIONISTA |
| `*.updated_at` | Auditoría de modificaciones | ADMIN, RECEPCIONISTA |
| `usuarios.ultimo_login` | Monitoreo de actividad | ADMIN |
| `motos.vin` | Registro obligatorio de bastidor | TODOS |
| `servicios.tiempo_estimado_minutos` | Planificación y calendario | ADMIN, RECEPCIONISTA |
| `ordenes_trabajo.fecha_estimada_entrega` | Sistema de planificación | TODOS |
| `ordenes_trabajo.prioridad` | Cola de trabajo por urgencia | TODOS |
| `detalle_orden.observaciones` | Notas específicas por servicio | TODOS |
| `pagos.referencia` | Documentación de transacciones | ADMIN, RECEPCIONISTA |
| `pagos.observaciones` | Detalles adicionales de cobro | ADMIN, RECEPCIONISTA |
| `orden_historial.comentario` | Justificación de cambios | TODOS |
| `repuesto_movimientos.referencia` | Documentación de movimientos | TODOS |
| `repuestos.stock_minimo` | Sistema de alertas automáticas | ADMIN, RECEPCIONISTA |

---

## ✅ **CONFIRMACIÓN DE USO COMPLETO**

**🎯 RESULTADO:** Todas las 12 tablas y 74 columnas del esquema PostgreSQL tienen ahora funcionalidades específicas asignadas a cada perfil de usuario, garantizando que el frontend aproveche completamente la infraestructura del backend.
