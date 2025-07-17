package com.tallermoto.repository;

import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Repuesto;
import com.tallermoto.entity.UsoRepuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para la entidad UsoRepuesto
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface UsoRepuestoRepository extends JpaRepository<UsoRepuesto, Long> {

    // Consultas por orden de trabajo (relación con índice)
    List<UsoRepuesto> findByOrdenTrabajo(OrdenTrabajo ordenTrabajo);
    
    List<UsoRepuesto> findByOrdenTrabajoOrderByCreatedAt(OrdenTrabajo ordenTrabajo);
    
    // Consultas por repuesto (relación con índice)
    List<UsoRepuesto> findByRepuesto(Repuesto repuesto);
    
    List<UsoRepuesto> findByRepuestoOrderByCreatedAt(Repuesto repuesto);
    
    // Consultas por cantidad
    List<UsoRepuesto> findByCantidadGreaterThan(Integer cantidad);
    
    List<UsoRepuesto> findByCantidadLessThan(Integer cantidad);
    
    List<UsoRepuesto> findByCantidadBetween(Integer cantidadMin, Integer cantidadMax);
    
    List<UsoRepuesto> findByCantidadGreaterThanEqualOrderByCantidadDesc(Integer cantidad);
    
    // Consultas por precio unitario
    List<UsoRepuesto> findByPrecioUnitarioGreaterThan(BigDecimal precioUnitario);
    
    List<UsoRepuesto> findByPrecioUnitarioLessThan(BigDecimal precioUnitario);
    
    List<UsoRepuesto> findByPrecioUnitarioBetween(BigDecimal precioMin, BigDecimal precioMax);
    
    List<UsoRepuesto> findByPrecioUnitarioGreaterThanEqualOrderByPrecioUnitarioDesc(BigDecimal precioUnitario);
    
    // Consultas por subtotal (campo con índice)
    List<UsoRepuesto> findBySubtotalGreaterThan(BigDecimal subtotal);
    
    List<UsoRepuesto> findBySubtotalLessThan(BigDecimal subtotal);
    
    List<UsoRepuesto> findBySubtotalBetween(BigDecimal subtotalMin, BigDecimal subtotalMax);
    
    List<UsoRepuesto> findBySubtotalGreaterThanEqualOrderBySubtotalDesc(BigDecimal subtotal);
    
    // Consultas combinadas
    List<UsoRepuesto> findByOrdenTrabajoAndCantidadGreaterThan(OrdenTrabajo ordenTrabajo, Integer cantidad);
    
    List<UsoRepuesto> findByRepuestoAndCantidadGreaterThan(Repuesto repuesto, Integer cantidad);
    
    List<UsoRepuesto> findByOrdenTrabajoAndSubtotalBetween(OrdenTrabajo ordenTrabajo, BigDecimal subtotalMin, BigDecimal subtotalMax);
    
    List<UsoRepuesto> findByRepuestoAndPrecioUnitarioBetween(Repuesto repuesto, BigDecimal precioMin, BigDecimal precioMax);
    
    // Contar registros
    long countByOrdenTrabajo(OrdenTrabajo ordenTrabajo);
    
    long countByRepuesto(Repuesto repuesto);
    
    long countByCantidadGreaterThan(Integer cantidad);
    
    long countBySubtotalGreaterThan(BigDecimal subtotal);
    
    // Consultas por fechas de creación
    List<UsoRepuesto> findByCreatedAtAfter(LocalDateTime fechaDesde);
    
    List<UsoRepuesto> findByCreatedAtBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<UsoRepuesto> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime fechaDesde);
    
    // Consultas nativas aprovechando índices del schema
    @Query(value = "SELECT * FROM uso_repuesto WHERE id_orden = :idOrden ORDER BY created_at", nativeQuery = true)
    List<UsoRepuesto> findByOrdenNative(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT * FROM uso_repuesto WHERE id_repuesto = :idRepuesto ORDER BY created_at", nativeQuery = true)
    List<UsoRepuesto> findByRepuestoNative(@Param("idRepuesto") Long idRepuesto);
    
    @Query(value = "SELECT * FROM uso_repuesto WHERE subtotal >= :subtotalMinimo ORDER BY subtotal DESC", nativeQuery = true)
    List<UsoRepuesto> findBySubtotalMinimoNative(@Param("subtotalMinimo") BigDecimal subtotalMinimo);
    
    // Consultas específicas del dominio de uso de repuestos
    @Query(value = "SELECT u.* FROM uso_repuesto u " +
           "JOIN repuestos r ON u.id_repuesto = r.id_repuesto " +
           "WHERE u.id_orden = :idOrden AND r.activo = true " +
           "ORDER BY u.created_at", nativeQuery = true)
    List<UsoRepuesto> findByOrdenConRepuestosActivos(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT SUM(u.subtotal) FROM uso_repuesto u WHERE u.id_orden = :idOrden", nativeQuery = true)
    BigDecimal calcularTotalRepuestosPorOrden(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT SUM(u.cantidad) FROM uso_repuesto u WHERE u.id_repuesto = :idRepuesto", nativeQuery = true)
    Integer calcularCantidadTotalUsadaPorRepuesto(@Param("idRepuesto") Long idRepuesto);
    
    @Query(value = "SELECT u.*, r.nombre as repuesto_nombre, r.categoria as repuesto_categoria " +
           "FROM uso_repuesto u " +
           "JOIN repuestos r ON u.id_repuesto = r.id_repuesto " +
           "WHERE u.id_orden = :idOrden " +
           "ORDER BY r.categoria, r.nombre", nativeQuery = true)
    List<Object[]> findUsosConRepuestosPorOrden(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT COUNT(*) FROM uso_repuesto WHERE id_orden = :idOrden", nativeQuery = true)
    long contarRepuestosPorOrden(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT u.* FROM uso_repuesto u " +
           "WHERE u.cantidad BETWEEN :cantidadMin AND :cantidadMax " +
           "ORDER BY u.cantidad DESC", nativeQuery = true)
    List<UsoRepuesto> findByRangoCantidad(@Param("cantidadMin") Integer cantidadMin, @Param("cantidadMax") Integer cantidadMax);
    
    @Query(value = "SELECT u.* FROM uso_repuesto u " +
           "JOIN repuestos r ON u.id_repuesto = r.id_repuesto " +
           "WHERE r.categoria = :categoria " +
           "ORDER BY u.subtotal DESC", nativeQuery = true)
    List<UsoRepuesto> findByRepuestoCategoria(@Param("categoria") String categoria);
    
    @Query(value = "SELECT u.* FROM uso_repuesto u " +
           "WHERE u.created_at >= :fechaDesde " +
           "ORDER BY u.subtotal DESC", nativeQuery = true)
    List<UsoRepuesto> findUsosMayorSubtotalDesde(@Param("fechaDesde") LocalDateTime fechaDesde);
}
