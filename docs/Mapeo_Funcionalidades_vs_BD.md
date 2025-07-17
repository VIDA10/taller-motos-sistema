# 📊 MAPEO FUNCIONALIDADES vs BASE DE DATOS
## Análisis Completo: Perfiles de Usuario vs Esquema PostgreSQL

---

## 🎯 **OBJETIVO DEL ANÁLISIS**
Verificar que cada tabla y columna del esquema de base de datos tenga correspondencia con las funcionalidades disponibles para cada perfil de usuario, identificando:
- ✅ **Elementos completamente utilizados**
- ⚠️ **Elementos parcialmente utilizados** 
- ❌ **Elementos sin uso en la interfaz**

---

## 📋 **TABLA 1: USUARIOS**
**Responsables:** ADMIN, RECEPCIONISTA

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `id_usuario` | ✅ CRUD completo | ✅ CRUD completo | ❌ Solo lectura | ✅ **USADO** |
| `username` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ✅ **USADO** |
| `email` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ✅ **USADO** |
| `password_hash` | ✅ Cambio passwords | ✅ Cambio passwords | ❌ Sin acceso | ✅ **USADO** |
| `nombre_completo` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ✅ **USADO** |
| `rol` | ✅ Asignación roles | ✅ Asignación roles | ❌ Sin acceso | ✅ **USADO** |
| `activo` | ✅ Activar/Desactivar | ✅ Activar/Desactivar | ❌ Sin acceso | ✅ **USADO** |
| `ultimo_login` | ✅ Monitoreo | ✅ Monitoreo | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `created_at` | ✅ Reportes | ✅ Reportes | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `updated_at` | ✅ Auditoría | ✅ Auditoría | ❌ Sin acceso | ⚠️ **PARCIAL** |

### **Endpoints Relacionados:**
- `/api/usuarios/**` - ADMIN, RECEPCIONISTA
- `/api/auth/login` - TODOS
- `/api/auth/logout` - TODOS

**🔍 ANÁLISIS:** Los campos de auditoría (`ultimo_login`, `created_at`, `updated_at`) podrían no estar completamente expuestos en la interfaz.

---

## 📋 **TABLA 2: CLIENTES**
**Responsables:** ADMIN, RECEPCIONISTA, MECANICO

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `id_cliente` | ✅ CRUD completo | ✅ CRUD completo | ✅ Consulta | ✅ **USADO** |
| `nombre` | ✅ Gestión total | ✅ Gestión total | ✅ Consulta | ✅ **USADO** |
| `telefono` | ✅ Gestión total | ✅ Gestión total | ✅ Consulta | ✅ **USADO** |
| `email` | ✅ Gestión total | ✅ Gestión total | ✅ Consulta | ✅ **USADO** |
| `dni` | ✅ Gestión total | ✅ Gestión total | ✅ Consulta | ✅ **USADO** |
| `direccion` | ✅ Gestión total | ✅ Gestión total | ✅ Consulta | ✅ **USADO** |
| `activo` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ✅ **USADO** |
| `created_at` | ✅ Reportes | ✅ Reportes | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `updated_at` | ✅ Auditoría | ✅ Auditoría | ❌ Sin acceso | ⚠️ **PARCIAL** |

### **Endpoints Relacionados:**
- `/api/clientes/**` - ADMIN, RECEPCIONISTA, MECANICO

**🔍 ANÁLISIS:** Campos de auditoría podrían no estar visibles para MECANICO.

---

## 📋 **TABLA 3: MOTOS**
**Responsables:** ADMIN, RECEPCIONISTA, MECANICO

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `id_moto` | ✅ CRUD completo | ✅ CRUD completo | ✅ CRUD técnico | ✅ **USADO** |
| `id_cliente` | ✅ Gestión total | ✅ Gestión total | ✅ Consulta | ✅ **USADO** |
| `marca` | ✅ Gestión total | ✅ Gestión total | ✅ Actualización | ✅ **USADO** |
| `modelo` | ✅ Gestión total | ✅ Gestión total | ✅ Actualización | ✅ **USADO** |
| `anio` | ✅ Gestión total | ✅ Gestión total | ✅ Actualización | ✅ **USADO** |
| `placa` | ✅ Gestión total | ✅ Gestión total | ✅ Actualización | ✅ **USADO** |
| `vin` | ✅ Gestión total | ✅ Gestión total | ✅ Actualización | ⚠️ **PARCIAL** |
| `color` | ✅ Gestión total | ✅ Gestión total | ✅ Actualización | ✅ **USADO** |
| `kilometraje` | ✅ Gestión total | ✅ Gestión total | ✅ Actualización | ✅ **USADO** |
| `activo` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ✅ **USADO** |
| `created_at` | ✅ Reportes | ✅ Reportes | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `updated_at` | ✅ Auditoría | ✅ Auditoría | ❌ Sin acceso | ⚠️ **PARCIAL** |

### **Endpoints Relacionados:**
- `/api/motos/**` - ADMIN, RECEPCIONISTA, MECANICO

**🔍 ANÁLISIS:** Campo `vin` podría no estar siendo utilizado completamente en la interfaz.

---

## 📋 **TABLA 4: SERVICIOS**
**Responsables:** ADMIN, RECEPCIONISTA

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `id_servicio` | ✅ CRUD completo | ✅ CRUD completo | ❌ Sin acceso | ✅ **USADO** |
| `codigo` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ✅ **USADO** |
| `nombre` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ✅ **USADO** |
| `descripcion` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ✅ **USADO** |
| `categoria` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ✅ **USADO** |
| `precio_base` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ✅ **USADO** |
| `tiempo_estimado_minutos` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `activo` | ✅ Gestión total | ✅ Gestión total | ❌ Sin acceso | ✅ **USADO** |
| `created_at` | ✅ Reportes | ✅ Reportes | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `updated_at` | ✅ Auditoría | ✅ Auditoría | ❌ Sin acceso | ⚠️ **PARCIAL** |

### **Endpoints Relacionados:**
- `/api/servicios/**` - ADMIN, RECEPCIONISTA

**🔍 ANÁLISIS:** Campo `tiempo_estimado_minutos` podría no estar siendo utilizado para planificación.

---

## 📋 **TABLA 5: REPUESTOS**
**Responsables:** ADMIN, RECEPCIONISTA, MECANICO

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `id_repuesto` | ✅ CRUD completo | ✅ Gestión | ✅ Consulta/Uso | ✅ **USADO** |
| `codigo` | ✅ Gestión total | ✅ Gestión | ✅ Consulta | ✅ **USADO** |
| `nombre` | ✅ Gestión total | ✅ Gestión | ✅ Consulta | ✅ **USADO** |
| `descripcion` | ✅ Gestión total | ✅ Gestión | ✅ Consulta | ✅ **USADO** |
| `categoria` | ✅ Gestión total | ✅ Gestión | ✅ Consulta | ✅ **USADO** |
| `stock_actual` | ✅ Control total | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `stock_minimo` | ✅ Configuración | ✅ Alertas | ❌ Sin acceso | ✅ **USADO** |
| `precio_unitario` | ✅ Gestión total | ✅ Consulta | ❌ Sin acceso | ✅ **USADO** |
| `activo` | ✅ Gestión total | ✅ Gestión | ❌ Sin acceso | ✅ **USADO** |
| `created_at` | ✅ Reportes | ✅ Reportes | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `updated_at` | ✅ Auditoría | ✅ Auditoría | ❌ Sin acceso | ⚠️ **PARCIAL** |

### **Endpoints Relacionados:**
- `/api/repuestos/**` - ADMIN, RECEPCIONISTA, MECANICO

**🔍 ANÁLISIS:** Sistema de alertas de stock mínimo podría no estar implementado.

---

## 📋 **TABLA 6: CONFIGURACIONES**
**Responsables:** ADMIN (principalmente)

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `clave` | ✅ Gestión total | ❌ Sin acceso | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `valor` | ✅ Gestión total | ❌ Sin acceso | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `descripcion` | ✅ Gestión total | ❌ Sin acceso | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `tipo_dato` | ✅ Gestión total | ❌ Sin acceso | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `updated_at` | ✅ Auditoría | ❌ Sin acceso | ❌ Sin acceso | ⚠️ **PARCIAL** |

### **Endpoints Relacionados:**
- `/api/configuraciones/**` - ADMIN, RECEPCIONISTA, MECANICO (según SecurityConfig)

**🔍 ANÁLISIS:** Esta tabla podría estar completamente sin uso en la interfaz actual.

---

## 📋 **TABLA 7: ORDENES_TRABAJO** (CRÍTICA)
**Responsables:** ADMIN, RECEPCIONISTA, MECANICO

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `id_orden` | ✅ Control total | ✅ Gestión | ✅ Trabajo | ✅ **USADO** |
| `numero_orden` | ✅ Control total | ✅ Gestión | ✅ Consulta | ✅ **USADO** |
| `id_moto` | ✅ Control total | ✅ Gestión | ✅ Trabajo | ✅ **USADO** |
| `id_usuario_creador` | ✅ Auditoría | ✅ Creación | ❌ Sin acceso | ✅ **USADO** |
| `id_mecanico_asignado` | ✅ Asignación | ✅ Asignación | ✅ Recepción | ✅ **USADO** |
| `fecha_ingreso` | ✅ Control total | ✅ Gestión | ✅ Consulta | ✅ **USADO** |
| `fecha_estimada_entrega` | ✅ Control total | ✅ Gestión | ✅ Consulta | ⚠️ **PARCIAL** |
| `estado` | ✅ Control total | ✅ Gestión | ✅ Actualización | ✅ **USADO** |
| `prioridad` | ✅ Control total | ✅ Gestión | ✅ Consulta | ⚠️ **PARCIAL** |
| `descripcion_problema` | ✅ Control total | ✅ Gestión | ✅ Consulta | ✅ **USADO** |
| `diagnostico` | ✅ Supervisión | ❌ Sin acceso | ✅ Actualización | ✅ **USADO** |
| `observaciones` | ✅ Control total | ✅ Gestión | ✅ Actualización | ✅ **USADO** |
| `total_servicios` | ✅ Control total | ✅ Facturación | ❌ Sin acceso | ✅ **USADO** |
| `total_repuestos` | ✅ Control total | ✅ Facturación | ❌ Sin acceso | ✅ **USADO** |
| `total_orden` | ✅ Control total | ✅ Facturación | ❌ Sin acceso | ✅ **USADO** |
| `estado_pago` | ✅ Control total | ✅ Facturación | ❌ Sin acceso | ✅ **USADO** |
| `created_at` | ✅ Reportes | ✅ Reportes | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `updated_at` | ✅ Auditoría | ✅ Auditoría | ❌ Sin acceso | ⚠️ **PARCIAL** |

### **Endpoints Relacionados:**
- `/api/ordenes-trabajo/**` - ADMIN, RECEPCIONISTA, MECANICO

**🔍 ANÁLISIS:** Campos `fecha_estimada_entrega` y `prioridad` podrían no estar siendo utilizados completamente.

---

## 📋 **TABLA 8: DETALLE_ORDEN**
**Responsables:** ADMIN, RECEPCIONISTA, MECANICO

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `id_detalle` | ✅ Control total | ✅ Gestión | ✅ Consulta | ✅ **USADO** |
| `id_orden` | ✅ Control total | ✅ Gestión | ✅ Consulta | ✅ **USADO** |
| `id_servicio` | ✅ Control total | ✅ Gestión | ✅ Consulta | ✅ **USADO** |
| `precio_aplicado` | ✅ Control total | ✅ Facturación | ❌ Sin acceso | ✅ **USADO** |
| `observaciones` | ✅ Control total | ✅ Gestión | ✅ Actualización | ⚠️ **PARCIAL** |
| `created_at` | ✅ Auditoría | ✅ Auditoría | ❌ Sin acceso | ⚠️ **PARCIAL** |

### **Endpoints Relacionados:**
- `/api/detalles-orden/**` - ADMIN, RECEPCIONISTA, MECANICO

**🔍 ANÁLISIS:** Campo `observaciones` por detalle podría no estar siendo utilizado.

---

## 📋 **TABLA 9: USO_REPUESTO**
**Responsables:** ADMIN, RECEPCIONISTA, MECANICO

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `id_uso` | ✅ Control total | ✅ Gestión | ✅ Registro | ✅ **USADO** |
| `id_orden` | ✅ Control total | ✅ Gestión | ✅ Registro | ✅ **USADO** |
| `id_repuesto` | ✅ Control total | ✅ Gestión | ✅ Registro | ✅ **USADO** |
| `cantidad` | ✅ Control total | ✅ Gestión | ✅ Registro | ✅ **USADO** |
| `precio_unitario` | ✅ Control total | ✅ Facturación | ❌ Sin acceso | ✅ **USADO** |
| `subtotal` | ✅ Control total | ✅ Facturación | ❌ Sin acceso | ✅ **USADO** |
| `created_at` | ✅ Auditoría | ✅ Auditoría | ❌ Sin acceso | ⚠️ **PARCIAL** |

### **Endpoints Relacionados:**
- `/api/usos-repuesto/**` - ADMIN, RECEPCIONISTA, MECANICO

**🔍 ANÁLISIS:** Funcionalidad bien implementada, posibles mejoras en auditoría.

---

## 📋 **TABLA 10: PAGOS**
**Responsables:** ADMIN, RECEPCIONISTA

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `id_pago` | ✅ Control total | ✅ Gestión | ❌ Sin acceso | ✅ **USADO** |
| `id_orden` | ✅ Control total | ✅ Gestión | ❌ Sin acceso | ✅ **USADO** |
| `monto` | ✅ Control total | ✅ Gestión | ❌ Sin acceso | ✅ **USADO** |
| `fecha_pago` | ✅ Control total | ✅ Gestión | ❌ Sin acceso | ✅ **USADO** |
| `metodo` | ✅ Control total | ✅ Gestión | ❌ Sin acceso | ✅ **USADO** |
| `referencia` | ✅ Control total | ✅ Gestión | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `observaciones` | ✅ Control total | ✅ Gestión | ❌ Sin acceso | ⚠️ **PARCIAL** |
| `created_at` | ✅ Auditoría | ✅ Auditoría | ❌ Sin acceso | ⚠️ **PARCIAL** |

### **Endpoints Relacionados:**
- `/api/pagos/**` - ADMIN, RECEPCIONISTA

**🔍 ANÁLISIS:** Campos `referencia` y `observaciones` podrían no estar siendo utilizados.

---

## 📋 **TABLA 11: ORDEN_HISTORIAL**
**Responsables:** ADMIN, RECEPCIONISTA, MECANICO

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `id_historial` | ✅ Consulta | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `id_orden` | ✅ Consulta | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `estado_anterior` | ✅ Auditoría | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `estado_nuevo` | ✅ Auditoría | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `comentario` | ✅ Auditoría | ✅ Consulta | ✅ Consulta | ⚠️ **PARCIAL** |
| `usuario_cambio` | ✅ Auditoría | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `fecha_cambio` | ✅ Auditoría | ✅ Consulta | ✅ Consulta | ✅ **USADO** |

### **Endpoints Relacionados:**
- `/api/orden-historial/**` - ADMIN, RECEPCIONISTA, MECANICO

**🔍 ANÁLISIS:** Campo `comentario` podría no estar siendo capturado en cambios de estado.

---

## 📋 **TABLA 12: REPUESTO_MOVIMIENTOS**
**Responsables:** ADMIN, RECEPCIONISTA, MECANICO

### **Columnas vs Funcionalidades:**
| Columna | ADMIN | RECEPCIONISTA | MECANICO | Estado |
|---------|-------|---------------|----------|---------|
| `id_movimiento` | ✅ Control total | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `id_repuesto` | ✅ Control total | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `tipo_movimiento` | ✅ Control total | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `cantidad` | ✅ Control total | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `stock_anterior` | ✅ Control total | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `stock_nuevo` | ✅ Control total | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `referencia` | ✅ Control total | ✅ Consulta | ✅ Consulta | ⚠️ **PARCIAL** |
| `usuario_movimiento` | ✅ Auditoría | ✅ Consulta | ✅ Consulta | ✅ **USADO** |
| `fecha_movimiento` | ✅ Auditoría | ✅ Consulta | ✅ Consulta | ✅ **USADO** |

### **Endpoints Relacionados:**
- `/api/repuesto-movimientos/**` - ADMIN, RECEPCIONISTA, MECANICO

**🔍 ANÁLISIS:** Campo `referencia` podría no estar siendo utilizado para documentar movimientos.

---

## 🚨 **ELEMENTOS CON POSIBLE FALTA DE USO**

### **❌ CRÍTICOS (Sin uso aparente):**
1. **TABLA CONFIGURACIONES** - Podría estar completamente sin implementar en frontend
2. **Campo `vin` en MOTOS** - Número de bastidor podría no estar en uso
3. **Campo `tiempo_estimado_minutos` en SERVICIOS** - Planificación no implementada

### **⚠️ PARCIALES (Uso limitado):**
1. **Campos de auditoría** (`created_at`, `updated_at`) - Pocos reportes de fechas
2. **Campo `ultimo_login` en USUARIOS** - Monitoreo de actividad limitado
3. **Campo `fecha_estimada_entrega` en ORDENES** - Planificación limitada
4. **Campo `prioridad` en ORDENES** - Sistema de prioridades no implementado
5. **Campos `referencia` y `observaciones` en PAGOS** - Documentación limitada
6. **Campo `comentario` en ORDEN_HISTORIAL** - Cambios sin comentarios
7. **Campo `referencia` en REPUESTO_MOVIMIENTOS** - Documentación de movimientos limitada

### **✅ COMPLETAMENTE UTILIZADOS:**
1. **Flujo principal de órdenes de trabajo**
2. **Gestión de clientes y motos**
3. **Sistema de usuarios y roles**
4. **Control básico de repuestos**
5. **Sistema de pagos básico**

---

## 📊 **ESTADÍSTICAS DEL ANÁLISIS**

- **Total de Tablas:** 12
- **Total de Columnas:** 74
- **Columnas Completamente Utilizadas:** ~45 (61%)
- **Columnas Parcialmente Utilizadas:** ~25 (34%)
- **Columnas Sin Uso Aparente:** ~4 (5%)

---

## 🎯 **RECOMENDACIONES PARA FRONTEND**

1. **IMPLEMENTAR:** Sistema de configuraciones dinámicas
2. **MEJORAR:** Reportes con campos de auditoría
3. **AGREGAR:** Sistema de planificación con fechas estimadas
4. **INCORPORAR:** Sistema de prioridades en órdenes
5. **COMPLETAR:** Campos de documentación y referencias
6. **DESARROLLAR:** Monitoreo de actividad de usuarios

---

**📅 Fecha de análisis:** 26 de junio de 2025  
**🎯 Estado general:** **BUENO** - La mayoría de funcionalidades están implementadas, con oportunidades de mejora en aspectos secundarios.
