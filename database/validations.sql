# 🔍 SCRIPT DE VALIDACIÓN DE BASE DE DATOS

## Ejecutar estas consultas después de crear la base de datos para validar la implementación

-- =====================================================
-- VALIDACIÓN 1: VERIFICAR CREACIÓN DE TABLAS
-- =====================================================

-- Listar todas las tablas creadas
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Debería mostrar exactamente 12 tablas:
-- auditoria, categorias, clientes, diagnosticos, motos, 
-- orden_repuestos, orden_servicios, ordenes_trabajo, 
-- pagos, repuestos, servicios, usuarios

-- =====================================================
-- VALIDACIÓN 2: VERIFICAR ESTRUCTURA DE TABLAS
-- =====================================================

-- Verificar columnas de tabla crítica
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'ordenes_trabajo' 
ORDER BY ordinal_position;

-- =====================================================
-- VALIDACIÓN 3: VERIFICAR FOREIGN KEYS
-- =====================================================

SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- =====================================================
-- VALIDACIÓN 4: VERIFICAR ÍNDICES
-- =====================================================

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
    AND indexname NOT LIKE '%_pkey'
ORDER BY tablename, indexname;

-- =====================================================
-- VALIDACIÓN 5: VERIFICAR TRIGGERS
-- =====================================================

SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- VALIDACIÓN 6: VERIFICAR VISTAS
-- =====================================================

SELECT table_name, view_definition
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;

-- =====================================================
-- VALIDACIÓN 7: VERIFICAR FUNCIONES
-- =====================================================

SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
    AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- =====================================================
-- VALIDACIÓN 8: VERIFICAR DATOS INICIALES
-- =====================================================

-- Verificar usuario administrador
SELECT username, rol, activo FROM usuarios WHERE rol = 'ADMIN';

-- Verificar categorías iniciales
SELECT nombre, descripcion FROM categorias ORDER BY nombre;

-- Verificar servicios básicos
SELECT c.nombre as categoria, s.nombre as servicio, s.precio_base 
FROM servicios s
JOIN categorias c ON s.id_categoria = c.id_categoria
ORDER BY c.nombre, s.nombre;

-- =====================================================
-- VALIDACIÓN 9: PROBAR TRIGGERS DE AUDITORÍA
-- =====================================================

-- Insertar un cliente de prueba
INSERT INTO clientes (nombre, apellidos, numero_documento, telefono, email)
VALUES ('Test', 'Usuario', '12345678', '987654321', 'test@test.com');

-- Verificar que se registró en auditoría
SELECT * FROM auditoria WHERE tabla_afectada = 'clientes' ORDER BY fecha_operacion DESC LIMIT 5;

-- Eliminar el cliente de prueba
DELETE FROM clientes WHERE numero_documento = '12345678';

-- =====================================================
-- VALIDACIÓN 10: PROBAR VIEWS PRINCIPALES
-- =====================================================

-- Vista de órdenes pendientes (debería estar vacía inicialmente)
SELECT * FROM v_ordenes_pendientes LIMIT 5;

-- Vista de stock crítico (debería estar vacía inicialmente)
SELECT * FROM v_stock_critico LIMIT 5;

-- =====================================================
-- VALIDACIÓN 11: VERIFICAR SECUENCIAS
-- =====================================================

SELECT sequence_name, last_value, increment_by
FROM information_schema.sequences 
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- =====================================================
-- VALIDACIÓN 12: VERIFICAR CONSTRAINTS
-- =====================================================

SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
    AND tc.constraint_type IN ('CHECK', 'UNIQUE')
ORDER BY tc.table_name, tc.constraint_type;

-- =====================================================
-- RESULTADOS ESPERADOS
-- =====================================================

/*
TABLAS: 12 tablas creadas correctamente
FOREIGN KEYS: 11 relaciones de integridad referencial
ÍNDICES: 25+ índices optimizados
TRIGGERS: 5+ triggers automáticos
VISTAS: 6 vistas utilitarias
FUNCIONES: 4+ funciones de soporte
CONSTRAINTS: 15+ constraints de validación
DATOS INICIALES: Usuario admin, categorías, servicios básicos
AUDITORÍA: Funcionando automáticamente
SECUENCIAS: Auto-incrementales configuradas
*/

-- =====================================================
-- COMANDOS ÚTILES PARA ADMINISTRACIÓN
-- =====================================================

-- Ver tamaño de la base de datos
SELECT pg_size_pretty(pg_database_size('taller_motos_db'));

-- Ver tamaño de cada tabla
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Ver estadísticas de uso de índices
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public'
ORDER BY tablename, attname;

-- Analizar todas las tablas para optimizar el query planner
ANALYZE;

-- =====================================================
-- BACKUP Y RESTORE COMMANDS
-- =====================================================

/*
CREAR BACKUP:
pg_dump -h localhost -U postgres -d taller_motos_db -f backup_taller_motos.sql

CREAR BACKUP COMPRIMIDO:
pg_dump -h localhost -U postgres -d taller_motos_db -F c -f backup_taller_motos.backup

RESTAURAR DESDE SQL:
psql -h localhost -U postgres -d taller_motos_db -f backup_taller_motos.sql

RESTAURAR DESDE BACKUP:
pg_restore -h localhost -U postgres -d taller_motos_db backup_taller_motos.backup
*/

-- =====================================================
-- MONITOREO BÁSICO
-- =====================================================

-- Conexiones activas
SELECT count(*) as conexiones_activas FROM pg_stat_activity WHERE state = 'active';

-- Queries más lentas (requiere configurar log_min_duration_statement)
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Tablas más accedidas
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch
FROM pg_stat_user_tables 
ORDER BY seq_tup_read + idx_tup_fetch DESC;

-- =====================================================
-- FIN DEL SCRIPT DE VALIDACIÓN
-- =====================================================
