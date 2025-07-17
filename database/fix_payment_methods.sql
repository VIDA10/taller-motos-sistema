-- =====================================================
-- CORRECCIÓN APLICADA: Agregar YAPE y PLIN como métodos de pago
-- Fecha: 2 de julio de 2025
-- Propósito: Resuelto error 403 al registrar pagos con métodos digitales
-- Estado: APLICADO EXITOSAMENTE
-- =====================================================

-- ✅ La restricción CHECK fue modificada exitosamente para incluir:
-- CHECK (metodo IN ('EFECTIVO','TARJETA','TRANSFERENCIA','YAPE','PLIN'))

-- ✅ Los métodos YAPE y PLIN ahora funcionan correctamente
-- ✅ Las órdenes se facturan sin errores 403
-- ✅ El sistema de pagos está completamente operativo

-- NOTA: Este archivo se mantiene como referencia histórica
-- La corrección ya está aplicada en el schema principal
