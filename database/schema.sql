-- =====================================================
-- SCRIPT POSTGRESQL CORREGIDO - SIN ERRORES
-- Sistema Enterprise - 12 Tablas Normalizadas
-- COMPATIBLE 100% CON POSTGRESQL 15+
-- Fecha: 18 de junio de 2025
-- =====================================================

-- Configuración inicial PostgreSQL
SET timezone = 'America/Lima';

-- Limpiar todo si existe
DROP TABLE IF EXISTS repuesto_movimientos CASCADE;
DROP TABLE IF EXISTS orden_historial CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS uso_repuesto CASCADE;
DROP TABLE IF EXISTS detalle_orden CASCADE;
DROP TABLE IF EXISTS ordenes_trabajo CASCADE;
DROP TABLE IF EXISTS configuraciones CASCADE;
DROP TABLE IF EXISTS repuestos CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;
DROP TABLE IF EXISTS motos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- =====================================================
-- TABLA 1: USUARIOS (Seguridad Enterprise)
-- =====================================================
CREATE TABLE usuarios (
    id_usuario BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMIN','RECEPCIONISTA','MECANICO')),
    activo BOOLEAN DEFAULT TRUE,
    ultimo_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- =====================================================
-- TABLA 2: CLIENTES (Datos Completos)
-- =====================================================
CREATE TABLE clientes (
    id_cliente BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    dni VARCHAR(20) UNIQUE,
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clientes_telefono ON clientes(telefono);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_dni ON clientes(dni);
CREATE INDEX idx_clientes_activo ON clientes(activo);

-- =====================================================
-- TABLA 3: MOTOS (Información Técnica)
-- =====================================================
CREATE TABLE motos (
    id_moto BIGSERIAL PRIMARY KEY,
    id_cliente BIGINT NOT NULL REFERENCES clientes(id_cliente),
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INTEGER CHECK (anio >= 1900 AND anio <= 2026),
    placa VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(50),
    color VARCHAR(30),
    kilometraje INTEGER DEFAULT 0 CHECK (kilometraje >= 0),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_motos_placa ON motos(placa);
CREATE INDEX idx_motos_cliente ON motos(id_cliente);
CREATE INDEX idx_motos_marca_modelo ON motos(marca, modelo);
CREATE INDEX idx_motos_activo ON motos(activo);

-- =====================================================
-- TABLA 4: SERVICIOS (Catálogo Enterprise)
-- =====================================================
CREATE TABLE servicios (
    id_servicio BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50) NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL CHECK (precio_base >= 0),
    tiempo_estimado_minutos INTEGER DEFAULT 60 CHECK (tiempo_estimado_minutos > 0),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_servicios_codigo ON servicios(codigo);
CREATE INDEX idx_servicios_categoria ON servicios(categoria);
CREATE INDEX idx_servicios_activo ON servicios(activo);
CREATE INDEX idx_servicios_precio ON servicios(precio_base);

-- =====================================================
-- TABLA 5: REPUESTOS (Control de Inventario)
-- =====================================================
CREATE TABLE repuestos (
    id_repuesto BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    stock_actual INTEGER DEFAULT 0 CHECK (stock_actual >= 0),
    stock_minimo INTEGER DEFAULT 5 CHECK (stock_minimo >= 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_repuestos_codigo ON repuestos(codigo);
CREATE INDEX idx_repuestos_categoria ON repuestos(categoria);
CREATE INDEX idx_repuestos_activo ON repuestos(activo);

-- =====================================================
-- TABLA 6: CONFIGURACIONES (Sistema Dinámico)
-- =====================================================
CREATE TABLE configuraciones (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT NOT NULL,
    descripcion TEXT,
    tipo_dato VARCHAR(20) DEFAULT 'STRING' CHECK (tipo_dato IN ('STRING','INTEGER','DECIMAL','BOOLEAN')),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA 7: ORDENES_TRABAJO (Workflow Completo)
-- =====================================================
CREATE TABLE ordenes_trabajo (
    id_orden BIGSERIAL PRIMARY KEY,
    numero_orden VARCHAR(20) UNIQUE NOT NULL,
    id_moto BIGINT NOT NULL REFERENCES motos(id_moto),
    id_usuario_creador BIGINT NOT NULL REFERENCES usuarios(id_usuario),
    id_mecanico_asignado BIGINT REFERENCES usuarios(id_usuario),
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_estimada_entrega DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'RECIBIDA' 
           CHECK (estado IN ('RECIBIDA','DIAGNOSTICADA','EN_PROCESO','COMPLETADA','ENTREGADA','CANCELADA')),
    prioridad VARCHAR(20) DEFAULT 'NORMAL' 
              CHECK (prioridad IN ('BAJA','NORMAL','ALTA','URGENTE')),
    descripcion_problema TEXT NOT NULL,
    diagnostico TEXT,
    observaciones TEXT,
    total_servicios DECIMAL(10,2) DEFAULT 0 CHECK (total_servicios >= 0),
    total_repuestos DECIMAL(10,2) DEFAULT 0 CHECK (total_repuestos >= 0),
    total_orden DECIMAL(10,2) DEFAULT 0 CHECK (total_orden >= 0),
    estado_pago VARCHAR(20) DEFAULT 'PENDIENTE' 
                CHECK (estado_pago IN ('PENDIENTE','PARCIAL','COMPLETO')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_ordenes_numero ON ordenes_trabajo(numero_orden);
CREATE INDEX idx_ordenes_estado ON ordenes_trabajo(estado);
CREATE INDEX idx_ordenes_mecanico ON ordenes_trabajo(id_mecanico_asignado);
CREATE INDEX idx_ordenes_fecha_ingreso ON ordenes_trabajo(fecha_ingreso);
CREATE INDEX idx_ordenes_prioridad ON ordenes_trabajo(prioridad);
CREATE INDEX idx_ordenes_moto ON ordenes_trabajo(id_moto);
CREATE INDEX idx_ordenes_estado_pago ON ordenes_trabajo(estado_pago);
CREATE INDEX idx_ordenes_creador ON ordenes_trabajo(id_usuario_creador);

-- =====================================================
-- TABLA 8: DETALLE_ORDEN (Relación Orden-Servicios)
-- =====================================================
CREATE TABLE detalle_orden (
    id_detalle BIGSERIAL PRIMARY KEY,
    id_orden BIGINT NOT NULL REFERENCES ordenes_trabajo(id_orden) ON DELETE CASCADE,
    id_servicio BIGINT NOT NULL REFERENCES servicios(id_servicio),
    precio_aplicado DECIMAL(10,2) NOT NULL CHECK (precio_aplicado >= 0),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_orden, id_servicio)
);

CREATE INDEX idx_detalle_orden ON detalle_orden(id_orden);
CREATE INDEX idx_detalle_servicio ON detalle_orden(id_servicio);

-- =====================================================
-- TABLA 9: USO_REPUESTO (Relación Orden-Repuestos)
-- =====================================================
CREATE TABLE uso_repuesto (
    id_uso BIGSERIAL PRIMARY KEY,
    id_orden BIGINT NOT NULL REFERENCES ordenes_trabajo(id_orden) ON DELETE CASCADE,
    id_repuesto BIGINT NOT NULL REFERENCES repuestos(id_repuesto),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_uso_orden ON uso_repuesto(id_orden);
CREATE INDEX idx_uso_repuesto ON uso_repuesto(id_repuesto);
CREATE INDEX idx_uso_subtotal ON uso_repuesto(subtotal);

-- =====================================================
-- TABLA 10: PAGOS (Métodos Múltiples)
-- =====================================================
CREATE TABLE pagos (
    id_pago BIGSERIAL PRIMARY KEY,
    id_orden BIGINT NOT NULL REFERENCES ordenes_trabajo(id_orden),
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo VARCHAR(20) NOT NULL CHECK (metodo IN ('EFECTIVO','TARJETA','TRANSFERENCIA','YAPE','PLIN')),
    referencia VARCHAR(100),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pagos_orden ON pagos(id_orden);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);
CREATE INDEX idx_pagos_metodo ON pagos(metodo);

-- =====================================================
-- TABLA 11: ORDEN_HISTORIAL (Auditoría Eficiente)
-- =====================================================
CREATE TABLE orden_historial (
    id_historial BIGSERIAL PRIMARY KEY,
    id_orden BIGINT NOT NULL REFERENCES ordenes_trabajo(id_orden) ON DELETE CASCADE,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    comentario TEXT,
    usuario_cambio BIGINT NOT NULL REFERENCES usuarios(id_usuario),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_historial_orden ON orden_historial(id_orden);
CREATE INDEX idx_historial_fecha ON orden_historial(fecha_cambio);
CREATE INDEX idx_historial_usuario ON orden_historial(usuario_cambio);

-- =====================================================
-- TABLA 12: REPUESTO_MOVIMIENTOS (Control de Inventario)
-- =====================================================
CREATE TABLE repuesto_movimientos (
    id_movimiento BIGSERIAL PRIMARY KEY,
    id_repuesto BIGINT NOT NULL REFERENCES repuestos(id_repuesto),
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('ENTRADA','SALIDA','AJUSTE')),
    cantidad INTEGER NOT NULL,
    stock_anterior INTEGER NOT NULL CHECK (stock_anterior >= 0),
    stock_nuevo INTEGER NOT NULL CHECK (stock_nuevo >= 0),
    referencia VARCHAR(100),
    usuario_movimiento BIGINT NOT NULL REFERENCES usuarios(id_usuario),
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_movimientos_repuesto ON repuesto_movimientos(id_repuesto);
CREATE INDEX idx_movimientos_fecha ON repuesto_movimientos(fecha_movimiento);
CREATE INDEX idx_movimientos_tipo ON repuesto_movimientos(tipo_movimiento);
CREATE INDEX idx_movimientos_usuario ON repuesto_movimientos(usuario_movimiento);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Configuraciones del sistema
INSERT INTO configuraciones (clave, valor, descripcion, tipo_dato) VALUES
('STOCK_MINIMO_GLOBAL', '5', 'Stock mínimo por defecto para repuestos', 'INTEGER'),
('DIAS_GARANTIA_SERVICIO', '30', 'Días de garantía en servicios', 'INTEGER'),
('PREFIJO_ORDEN', 'ORD-', 'Prefijo para número de orden', 'STRING'),
('EMAIL_NOTIFICACIONES', 'true', 'Habilitar notificaciones por email', 'BOOLEAN'),
('MONEDA_LOCAL', 'PEN', 'Moneda local del sistema', 'STRING'),
('IVA_PORCENTAJE', '18.0', 'Porcentaje de IGV/IVA', 'DECIMAL'),
('HORA_APERTURA', '08:00', 'Hora de apertura del taller', 'STRING'),
('HORA_CIERRE', '18:00', 'Hora de cierre del taller', 'STRING');

-- Usuario administrador inicial (password: admin123 - hash BCrypt)
INSERT INTO usuarios (username, email, password_hash, nombre_completo, rol) VALUES
('admin', 'admin@tallermoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/IFW4VO4e4x9DJrP8xvFu/hEzgLGJWm', 'Administrador Sistema', 'ADMIN'),
('recepcion1', 'recepcion@tallermoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/IFW4VO4e4x9DJrP8xvFu/hEzgLGJWm', 'María González', 'RECEPCIONISTA'),
('mecanico1', 'mecanico1@tallermoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/IFW4VO4e4x9DJrP8xvFu/hEzgLGJWm', 'Carlos Pérez', 'MECANICO');

-- Servicios iniciales
INSERT INTO servicios (codigo, nombre, descripcion, categoria, precio_base, tiempo_estimado_minutos) VALUES
('MAN001', 'Cambio de Aceite', 'Cambio de aceite de motor y filtro', 'MANTENIMIENTO', 45.00, 30),
('MAN002', 'Afinamiento Básico', 'Afinamiento básico de motor', 'MANTENIMIENTO', 120.00, 120),
('MAN003', 'Revisión General', 'Revisión completa de sistemas', 'MANTENIMIENTO', 80.00, 90),
('REP001', 'Reparación Frenos', 'Reparación sistema de frenos', 'REPARACION', 150.00, 180),
('REP002', 'Reparación Motor', 'Reparación general de motor', 'REPARACION', 500.00, 480),
('ELE001', 'Diagnóstico Eléctrico', 'Diagnóstico sistema eléctrico', 'ELECTRICO', 80.00, 90),
('ELE002', 'Reparación Alternador', 'Reparación o cambio de alternador', 'ELECTRICO', 200.00, 240);

-- Repuestos iniciales
INSERT INTO repuestos (codigo, nombre, descripcion, categoria, stock_actual, stock_minimo, precio_unitario) VALUES
('ACE001', 'Aceite Motor 20W-50', 'Aceite para motor 20W-50 1 litro', 'LUBRICANTES', 50, 10, 25.00),
('FIL001', 'Filtro de Aceite', 'Filtro de aceite universal', 'FILTROS', 30, 5, 15.00),
('BUJ001', 'Bujía NGK', 'Bujía NGK estándar', 'ELECTRICO', 25, 8, 12.00),
('FRE001', 'Pastilla Freno Delantera', 'Pastilla de freno delantera', 'FRENOS', 20, 4, 45.00),
('CAD001', 'Cadena Transmisión', 'Cadena de transmisión 428H', 'TRANSMISION', 15, 3, 85.00),
('BAT001', 'Batería 12V', 'Batería 12V para motocicleta', 'ELECTRICO', 8, 2, 120.00);

-- Clientes de ejemplo
INSERT INTO clientes (nombre, telefono, email, dni, direccion) VALUES
('Juan Carlos Rodríguez', '987654321', 'juan.rodriguez@email.com', '72345678', 'Av. Principal 123, Lima'),
('María Elena García', '976543210', 'maria.garcia@email.com', '71234567', 'Jr. Los Olivos 456, Lima'),
('Carlos Alberto Mendoza', '965432109', 'carlos.mendoza@email.com', '70123456', 'Calle Las Flores 789, Lima');

-- Motos de ejemplo
INSERT INTO motos (id_cliente, marca, modelo, anio, placa, vin, color, kilometraje) VALUES
(1, 'Honda', 'CB150', 2020, 'ABC-123', 'VIN123456789', 'Rojo', 15000),
(2, 'Yamaha', 'YBR125', 2019, 'DEF-456', 'VIN987654321', 'Azul', 22000),
(3, 'Bajaj', 'Pulsar 200', 2021, 'GHI-789', 'VIN456789123', 'Negro', 8500);

-- =====================================================
-- VISTAS PARA CONSULTAS FRECUENTES
-- =====================================================

-- Vista de órdenes con información completa
CREATE VIEW v_ordenes_completas AS
SELECT 
    o.id_orden,
    o.numero_orden,
    o.fecha_ingreso,
    o.fecha_estimada_entrega,
    o.estado,
    o.prioridad,
    o.descripcion_problema,
    o.diagnostico,
    o.total_orden,
    o.estado_pago,
    c.nombre AS cliente_nombre,
    c.telefono AS cliente_telefono,
    CONCAT(m.marca, ' ', m.modelo, ' (', m.placa, ')') AS moto_info,
    uc.nombre_completo AS creado_por,
    um.nombre_completo AS mecanico_asignado
FROM ordenes_trabajo o
JOIN motos m ON o.id_moto = m.id_moto
JOIN clientes c ON m.id_cliente = c.id_cliente
JOIN usuarios uc ON o.id_usuario_creador = uc.id_usuario
LEFT JOIN usuarios um ON o.id_mecanico_asignado = um.id_usuario;

-- Vista de repuestos con stock bajo
CREATE VIEW v_repuestos_stock_bajo AS
SELECT 
    r.id_repuesto,
    r.codigo,
    r.nombre,
    r.categoria,
    r.stock_actual,
    r.stock_minimo,
    r.precio_unitario,
    (r.stock_minimo - r.stock_actual) AS cantidad_necesaria
FROM repuestos r
WHERE r.stock_actual <= r.stock_minimo 
  AND r.activo = TRUE;

-- Vista de resumen financiero por orden
CREATE VIEW v_resumen_financiero_orden AS
SELECT 
    o.id_orden,
    o.numero_orden,
    o.total_servicios,
    o.total_repuestos,
    o.total_orden,
    COALESCE(SUM(p.monto), 0) AS total_pagado,
    (o.total_orden - COALESCE(SUM(p.monto), 0)) AS saldo_pendiente,
    CASE 
        WHEN COALESCE(SUM(p.monto), 0) = 0 THEN 'SIN_PAGOS'
        WHEN COALESCE(SUM(p.monto), 0) < o.total_orden THEN 'PARCIAL'
        WHEN COALESCE(SUM(p.monto), 0) >= o.total_orden THEN 'COMPLETO'
    END AS estado_financiero
FROM ordenes_trabajo o
LEFT JOIN pagos p ON o.id_orden = p.id_orden
GROUP BY o.id_orden, o.numero_orden, o.total_servicios, o.total_repuestos, o.total_orden;

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para generar número de orden automáticamente
CREATE OR REPLACE FUNCTION generar_numero_orden()
RETURNS TRIGGER AS $$
DECLARE
    next_number INTEGER;
BEGIN
    IF NEW.numero_orden IS NULL OR NEW.numero_orden = '' THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(numero_orden FROM 5) AS INTEGER)), 0) + 1 
        INTO next_number
        FROM ordenes_trabajo 
        WHERE numero_orden ~ '^ORD-[0-9]+$';
        
        NEW.numero_orden := 'ORD-' || LPAD(next_number::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER generar_numero_orden_trigger
    BEFORE INSERT ON ordenes_trabajo
    FOR EACH ROW
    EXECUTE FUNCTION generar_numero_orden();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_motos_updated_at BEFORE UPDATE ON motos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicios_updated_at BEFORE UPDATE ON servicios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_repuestos_updated_at BEFORE UPDATE ON repuestos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ordenes_trabajo_updated_at BEFORE UPDATE ON ordenes_trabajo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================
SELECT 'Base de datos PostgreSQL creada exitosamente' AS mensaje,
       COUNT(*) AS total_tablas
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

SELECT table_name AS "Tablas Creadas"
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

SELECT table_name AS "Vistas Creadas"
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;
