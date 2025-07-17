package com.tallermoto.repository;

import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para la entidad Pago
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {

    // Consultas por orden de trabajo (relación con índice)
    List<Pago> findByOrdenTrabajo(OrdenTrabajo ordenTrabajo);
    
    List<Pago> findByOrdenTrabajoOrderByFechaPagoDesc(OrdenTrabajo ordenTrabajo);
    
    // Consultas por monto
    List<Pago> findByMontoGreaterThan(BigDecimal monto);
    
    List<Pago> findByMontoLessThan(BigDecimal monto);
    
    List<Pago> findByMontoBetween(BigDecimal montoMin, BigDecimal montoMax);
    
    List<Pago> findByMontoGreaterThanEqualOrderByMontoDesc(BigDecimal monto);
    
    // Consultas por fecha de pago (campo con índice)
    List<Pago> findByFechaPagoAfter(LocalDateTime fechaDesde);
    
    List<Pago> findByFechaPagoBefore(LocalDateTime fechaHasta);
    
    List<Pago> findByFechaPagoBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<Pago> findByFechaPagoAfterOrderByFechaPagoDesc(LocalDateTime fechaDesde);
    
    // Consultas por método de pago (campo con índice)
    List<Pago> findByMetodo(String metodo);
    
    List<Pago> findByMetodoOrderByFechaPagoDesc(String metodo);
    
    List<Pago> findByMetodoIn(List<String> metodos);
    
    List<Pago> findByMetodoContainingIgnoreCase(String metodo);
    
    // Consultas por referencia
    List<Pago> findByReferencia(String referencia);
    
    List<Pago> findByReferenciaContainingIgnoreCase(String referencia);
    
    List<Pago> findByReferenciaIsNull();
    
    List<Pago> findByReferenciaIsNotNull();
    
    // Consultas por observaciones
    List<Pago> findByObservacionesContainingIgnoreCase(String observaciones);
    
    List<Pago> findByObservacionesIsNull();
    
    List<Pago> findByObservacionesIsNotNull();
    
    // Consultas combinadas
    List<Pago> findByOrdenTrabajoAndMetodo(OrdenTrabajo ordenTrabajo, String metodo);
    
    List<Pago> findByOrdenTrabajoAndFechaPagoBetween(OrdenTrabajo ordenTrabajo, LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<Pago> findByMetodoAndFechaPagoBetween(String metodo, LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<Pago> findByMontoGreaterThanAndMetodo(BigDecimal monto, String metodo);
    
    // Contar registros
    long countByOrdenTrabajo(OrdenTrabajo ordenTrabajo);
    
    long countByMetodo(String metodo);
    
    long countByFechaPagoBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    long countByMontoGreaterThan(BigDecimal monto);
    
    // Consultas por fechas de creación
    List<Pago> findByCreatedAtAfter(LocalDateTime fechaDesde);
    
    List<Pago> findByCreatedAtBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<Pago> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime fechaDesde);
    
    // Consultas nativas aprovechando índices del schema
    @Query(value = "SELECT * FROM pagos WHERE id_orden = :idOrden ORDER BY fecha_pago DESC", nativeQuery = true)
    List<Pago> findByOrdenNative(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT * FROM pagos WHERE fecha_pago >= :fechaDesde ORDER BY fecha_pago DESC", nativeQuery = true)
    List<Pago> findByFechaPagoAfterNative(@Param("fechaDesde") LocalDateTime fechaDesde);
    
    @Query(value = "SELECT * FROM pagos WHERE metodo = :metodo ORDER BY fecha_pago DESC", nativeQuery = true)
    List<Pago> findByMetodoNative(@Param("metodo") String metodo);
    
    // Consultas específicas del dominio de pagos
    @Query(value = "SELECT SUM(p.monto) FROM pagos p WHERE p.id_orden = :idOrden", nativeQuery = true)
    BigDecimal calcularTotalPagadoPorOrden(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT COUNT(*) FROM pagos WHERE id_orden = :idOrden", nativeQuery = true)
    long contarPagosPorOrden(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT p.*, o.numero_orden, o.total_orden " +
           "FROM pagos p " +
           "JOIN ordenes_trabajo o ON p.id_orden = o.id_orden " +
           "WHERE p.fecha_pago BETWEEN :fechaDesde AND :fechaHasta " +
           "ORDER BY p.fecha_pago DESC", nativeQuery = true)
    List<Object[]> findPagosConOrdenEntreFechas(@Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
    
    @Query(value = "SELECT metodo, COUNT(*) as cantidad, SUM(monto) as total " +
           "FROM pagos " +
           "WHERE fecha_pago BETWEEN :fechaDesde AND :fechaHasta " +
           "GROUP BY metodo " +
           "ORDER BY total DESC", nativeQuery = true)
    List<Object[]> obtenerResumenPorMetodoPago(@Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
    
    @Query(value = "SELECT DATE(p.fecha_pago) as fecha, COUNT(*) as cantidad_pagos, SUM(p.monto) as total_diario " +
           "FROM pagos p " +
           "WHERE p.fecha_pago BETWEEN :fechaDesde AND :fechaHasta " +
           "GROUP BY DATE(p.fecha_pago) " +
           "ORDER BY fecha DESC", nativeQuery = true)
    List<Object[]> obtenerResumenDiarioPagos(@Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
    
    @Query(value = "SELECT * FROM pagos WHERE monto BETWEEN :montoMin AND :montoMax ORDER BY monto DESC", nativeQuery = true)
    List<Pago> findByRangoMonto(@Param("montoMin") BigDecimal montoMin, @Param("montoMax") BigDecimal montoMax);
    
    @Query(value = "SELECT DISTINCT metodo FROM pagos ORDER BY metodo", nativeQuery = true)
    List<String> findAllMetodosPago();
    
    @Query(value = "SELECT p.* FROM pagos p " +
           "WHERE p.fecha_pago >= :fechaDesde " +
           "ORDER BY p.monto DESC " +
           "LIMIT :limite", nativeQuery = true)
    List<Pago> findPagosMayorMontoDesde(@Param("fechaDesde") LocalDateTime fechaDesde, @Param("limite") Integer limite);
}
