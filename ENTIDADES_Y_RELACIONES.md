# ENTIDADES Y RELACIONES DEL SISTEMA DE TALLER DE MOTOS

## 📋 RESUMEN DE ENTIDADES

| **ENTIDAD** | **DESCRIPCIÓN** | **TIPO** | **CAMPOS PRINCIPALES** |
|-------------|-----------------|----------|------------------------|
| **usuarios** | Gestión de usuarios del sistema con roles | Principal | id_usuario, username, email, rol, activo |
| **clientes** | Información de clientes del taller | Principal | id_cliente, nombre, telefono, email, dni |
| **motos** | Motocicletas de los clientes | Principal | id_moto, marca, modelo, placa, vin, id_cliente |
| **servicios** | Catálogo de servicios del taller | Catálogo | id_servicio, codigo, nombre, precio_base, categoria |
| **repuestos** | Inventario de repuestos y partes | Catálogo | id_repuesto, codigo, nombre, stock_actual, precio_unitario |
| **configuraciones** | Parámetros del sistema | Configuración | clave, valor, descripcion, tipo_dato |
| **ordenes_trabajo** | Órdenes de servicio principales | Transaccional | id_orden, numero_orden, estado, total_orden, id_moto |
| **detalle_orden** | Servicios aplicados a cada orden | Detalle | id_detalle, id_orden, id_servicio, precio_aplicado |
| **uso_repuesto** | Repuestos utilizados en órdenes | Detalle | id_uso, id_orden, id_repuesto, cantidad, precio_unitario |
| **pagos** | Transacciones de pago | Transaccional | id_pago, id_orden, monto, metodo, fecha_pago |
| **orden_historial** | Auditoría de cambios en órdenes | Auditoría | id_historial, id_orden, estado_anterior, estado_nuevo |
| **repuesto_movimientos** | Control de movimientos de inventario | Auditoría | id_movimiento, id_repuesto, tipo_movimiento, cantidad |

---

## 🔗 MATRIZ DE RELACIONES

| **TABLA ORIGEN** | **TABLA DESTINO** | **TIPO RELACIÓN** | **CARDINALIDAD** | **DESCRIPCIÓN** |
|------------------|-------------------|-------------------|------------------|-----------------|
| **clientes** | **motos** | Uno a Muchos | 1:N | Un cliente puede tener múltiples motocicletas |
| **motos** | **ordenes_trabajo** | Uno a Muchos | 1:N | Una moto puede tener múltiples órdenes de trabajo |
| **usuarios** | **ordenes_trabajo** (creador) | Uno a Muchos | 1:N | Un usuario puede crear múltiples órdenes |
| **usuarios** | **ordenes_trabajo** (mecánico) | Uno a Muchos | 1:N | Un mecánico puede tener múltiples órdenes asignadas |
| **ordenes_trabajo** | **detalle_orden** | Uno a Muchos | 1:N | Una orden puede tener múltiples servicios |
| **servicios** | **detalle_orden** | Uno a Muchos | 1:N | Un servicio puede estar en múltiples órdenes |
| **ordenes_trabajo** | **uso_repuesto** | Uno a Muchos | 1:N | Una orden puede usar múltiples repuestos |
| **repuestos** | **uso_repuesto** | Uno a Muchos | 1:N | Un repuesto puede ser usado en múltiples órdenes |
| **ordenes_trabajo** | **pagos** | Uno a Muchos | 1:N | Una orden puede tener múltiples pagos |
| **ordenes_trabajo** | **orden_historial** | Uno a Muchos | 1:N | Una orden puede tener múltiples cambios de estado |
| **usuarios** | **orden_historial** | Uno a Muchos | 1:N | Un usuario puede registrar múltiples cambios |
| **repuestos** | **repuesto_movimientos** | Uno a Muchos | 1:N | Un repuesto puede tener múltiples movimientos |
| **usuarios** | **repuesto_movimientos** | Uno a Muchos | 1:N | Un usuario puede registrar múltiples movimientos |

---

## 📊 DETALLE DE ENTIDADES PRINCIPALES

### 🔐 **USUARIOS**
| **CAMPO** | **TIPO** | **RESTRICCIONES** | **DESCRIPCIÓN** |
|-----------|----------|-------------------|-----------------|
| id_usuario | BIGSERIAL | PK, NOT NULL | Identificador único del usuario |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Nombre de usuario para login |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Correo electrónico del usuario |
| password_hash | VARCHAR(255) | NOT NULL | Contraseña encriptada |
| nombre_completo | VARCHAR(100) | NOT NULL | Nombre completo del usuario |
| rol | VARCHAR(20) | CHECK (ADMIN, RECEPCIONISTA, MECANICO) | Rol del usuario en el sistema |
| activo | BOOLEAN | DEFAULT TRUE | Estado del usuario |
| ultimo_login | TIMESTAMP | NULL | Última fecha de acceso |

### 👥 **CLIENTES**
| **CAMPO** | **TIPO** | **RESTRICCIONES** | **DESCRIPCIÓN** |
|-----------|----------|-------------------|-----------------|
| id_cliente | BIGSERIAL | PK, NOT NULL | Identificador único del cliente |
| nombre | VARCHAR(100) | NOT NULL | Nombre completo del cliente |
| telefono | VARCHAR(20) | NOT NULL | Teléfono de contacto |
| email | VARCHAR(100) | NULL | Correo electrónico del cliente |
| dni | VARCHAR(20) | UNIQUE | Documento de identidad |
| direccion | TEXT | NULL | Dirección del cliente |
| activo | BOOLEAN | DEFAULT TRUE | Estado del cliente |

### 🏍️ **MOTOS**
| **CAMPO** | **TIPO** | **RESTRICCIONES** | **DESCRIPCIÓN** |
|-----------|----------|-------------------|-----------------|
| id_moto | BIGSERIAL | PK, NOT NULL | Identificador único de la moto |
| id_cliente | BIGINT | FK, NOT NULL | Referencia al propietario |
| marca | VARCHAR(50) | NOT NULL | Marca de la motocicleta |
| modelo | VARCHAR(50) | NOT NULL | Modelo de la motocicleta |
| anio | INTEGER | CHECK (1900-2026) | Año de fabricación |
| placa | VARCHAR(20) | UNIQUE, NOT NULL | Placa de la motocicleta |
| vin | VARCHAR(50) | NULL | Número de chasis |
| color | VARCHAR(30) | NULL | Color de la motocicleta |
| kilometraje | INTEGER | CHECK (>=0) | Kilometraje actual |

### 🔧 **SERVICIOS**
| **CAMPO** | **TIPO** | **RESTRICCIONES** | **DESCRIPCIÓN** |
|-----------|----------|-------------------|-----------------|
| id_servicio | BIGSERIAL | PK, NOT NULL | Identificador único del servicio |
| codigo | VARCHAR(20) | UNIQUE, NOT NULL | Código del servicio |
| nombre | VARCHAR(100) | NOT NULL | Nombre del servicio |
| descripcion | TEXT | NULL | Descripción detallada |
| categoria | VARCHAR(50) | NOT NULL | Categoría del servicio |
| precio_base | DECIMAL(10,2) | CHECK (>=0) | Precio base del servicio |
| tiempo_estimado_minutos | INTEGER | CHECK (>0) | Tiempo estimado en minutos |

### 🔩 **REPUESTOS**
| **CAMPO** | **TIPO** | **RESTRICCIONES** | **DESCRIPCIÓN** |
|-----------|----------|-------------------|-----------------|
| id_repuesto | BIGSERIAL | PK, NOT NULL | Identificador único del repuesto |
| codigo | VARCHAR(30) | UNIQUE, NOT NULL | Código del repuesto |
| nombre | VARCHAR(100) | NOT NULL | Nombre del repuesto |
| descripcion | TEXT | NULL | Descripción del repuesto |
| categoria | VARCHAR(50) | NULL | Categoría del repuesto |
| stock_actual | INTEGER | CHECK (>=0) | Cantidad actual en inventario |
| stock_minimo | INTEGER | CHECK (>=0) | Cantidad mínima requerida |
| precio_unitario | DECIMAL(10,2) | CHECK (>=0) | Precio por unidad |

### 📋 **ORDENES_TRABAJO**
| **CAMPO** | **TIPO** | **RESTRICCIONES** | **DESCRIPCIÓN** |
|-----------|----------|-------------------|-----------------|
| id_orden | BIGSERIAL | PK, NOT NULL | Identificador único de la orden |
| numero_orden | VARCHAR(20) | UNIQUE, NOT NULL | Número de orden (ORD-XXXXXX) |
| id_moto | BIGINT | FK, NOT NULL | Motocicleta a reparar |
| id_usuario_creador | BIGINT | FK, NOT NULL | Usuario que creó la orden |
| id_mecanico_asignado | BIGINT | FK, NULL | Mecánico asignado |
| fecha_ingreso | TIMESTAMP | DEFAULT NOW() | Fecha de ingreso |
| fecha_estimada_entrega | DATE | NULL | Fecha estimada de entrega |
| estado | VARCHAR(20) | CHECK (estados válidos) | Estado actual de la orden |
| prioridad | VARCHAR(20) | CHECK (BAJA, NORMAL, ALTA, URGENTE) | Prioridad de la orden |
| descripcion_problema | TEXT | NOT NULL | Descripción del problema |
| diagnostico | TEXT | NULL | Diagnóstico técnico |
| total_servicios | DECIMAL(10,2) | DEFAULT 0 | Total por servicios |
| total_repuestos | DECIMAL(10,2) | DEFAULT 0 | Total por repuestos |
| total_orden | DECIMAL(10,2) | DEFAULT 0 | Total general de la orden |
| estado_pago | VARCHAR(20) | CHECK (PENDIENTE, PARCIAL, COMPLETO) | Estado del pago |

---

## 🔄 FLUJO DE RELACIONES PRINCIPALES

### **Flujo de Orden de Trabajo:**
```
Cliente → Moto → Orden_Trabajo → Detalle_Orden (Servicios)
                              → Uso_Repuesto (Repuestos)
                              → Pagos
                              → Orden_Historial
```

### **Flujo de Inventario:**
```
Repuestos → Uso_Repuesto (Consumo)
         → Repuesto_Movimientos (Control)
```

### **Flujo de Auditoría:**
```
Usuarios → Orden_Historial (Cambios de estado)
        → Repuesto_Movimientos (Movimientos de inventario)
```

---

## 📈 ÍNDICES Y OPTIMIZACIÓN

### **Índices Principales:**
| **TABLA** | **ÍNDICES** | **PROPÓSITO** |
|-----------|-------------|---------------|
| usuarios | username, email, rol | Búsqueda y autenticación |
| clientes | telefono, dni, email | Búsqueda de clientes |
| motos | placa, cliente, marca_modelo | Identificación y búsqueda |
| ordenes_trabajo | numero_orden, estado, mecanico, fecha | Consultas operativas |
| repuestos | codigo, categoria | Búsqueda de inventario |
| pagos | orden, fecha, metodo | Consultas financieras |

### **Vistas Creadas:**
- **v_ordenes_completas**: Órdenes con información completa de cliente, moto y mecánico
- **v_repuestos_stock_bajo**: Repuestos que necesitan reabastecimiento
- **v_resumen_financiero_orden**: Estado financiero de cada orden

### **Triggers Implementados:**
- **generar_numero_orden**: Genera automáticamente el número de orden
- **update_updated_at**: Actualiza automáticamente el timestamp de modificación

---

## 🔒 REGLAS DE NEGOCIO IMPLEMENTADAS

1. **Usuarios**: Deben tener un rol válido y estar activos
2. **Clientes**: DNI único si se proporciona
3. **Motos**: Placa única obligatoria
4. **Órdenes**: Número automático, estados controlados
5. **Repuestos**: Stock no puede ser negativo
6. **Pagos**: Monto debe ser positivo
7. **Auditoría**: Cambios de estado registrados automáticamente

Esta estructura garantiza la integridad referencial, trazabilidad completa y optimización para consultas frecuentes del sistema de taller de motocicletas.
