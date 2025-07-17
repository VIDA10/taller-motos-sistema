package com.tallermoto.repository;

import com.tallermoto.entity.DetalleOrden;
import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad DetalleOrden
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Long> {

    // Consultas por orden de trabajo (relación con índice)
    List<DetalleOrden> findByOrdenTrabajo(OrdenTrabajo ordenTrabajo);
    
    List<DetalleOrden> findByOrdenTrabajoOrderByCreatedAt(OrdenTrabajo ordenTrabajo);
    
    // Consultas por servicio (relación con índice)
    List<DetalleOrden> findByServicio(Servicio servicio);
    
    List<DetalleOrden> findByServicioOrderByCreatedAt(Servicio servicio);
    
    // Consulta única por orden y servicio (constraint UNIQUE)
    Optional<DetalleOrden> findByOrdenTrabajoAndServicio(OrdenTrabajo ordenTrabajo, Servicio servicio);
    
    // Consultas por precio aplicado
    List<DetalleOrden> findByPrecioAplicadoGreaterThan(BigDecimal precioAplicado);
    
    List<DetalleOrden> findByPrecioAplicadoLessThan(BigDecimal precioAplicado);
    
    List<DetalleOrden> findByPrecioAplicadoBetween(BigDecimal precioMin, BigDecimal precioMax);
    
    List<DetalleOrden> findByPrecioAplicadoGreaterThanEqualOrderByPrecioAplicadoDesc(BigDecimal precioAplicado);
    
    // Consultas por observaciones
    List<DetalleOrden> findByObservacionesContainingIgnoreCase(String observaciones);
    
    List<DetalleOrden> findByObservacionesIsNull();
    
    List<DetalleOrden> findByObservacionesIsNotNull();
    
    // Consultas combinadas
    List<DetalleOrden> findByOrdenTrabajoAndPrecioAplicadoGreaterThan(OrdenTrabajo ordenTrabajo, BigDecimal precioMinimo);
    
    List<DetalleOrden> findByServicioAndPrecioAplicadoBetween(Servicio servicio, BigDecimal precioMin, BigDecimal precioMax);
    
    // Verificaciones de existencia
    boolean existsByOrdenTrabajoAndServicio(OrdenTrabajo ordenTrabajo, Servicio servicio);
    
    // Contar registros
    long countByOrdenTrabajo(OrdenTrabajo ordenTrabajo);
    
    long countByServicio(Servicio servicio);
    
    long countByPrecioAplicadoGreaterThan(BigDecimal precioAplicado);
    
    // Consultas por fechas de creación
    List<DetalleOrden> findByCreatedAtAfter(LocalDateTime fechaDesde);
    
    List<DetalleOrden> findByCreatedAtBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<DetalleOrden> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime fechaDesde);
    
    // Consultas nativas aprovechando índices del schema
    @Query(value = "SELECT * FROM detalle_orden WHERE id_orden = :idOrden ORDER BY created_at", nativeQuery = true)
    List<DetalleOrden> findByOrdenNative(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT * FROM detalle_orden WHERE id_servicio = :idServicio ORDER BY created_at", nativeQuery = true)
    List<DetalleOrden> findByServicioNative(@Param("idServicio") Long idServicio);
    
    @Query(value = "SELECT * FROM detalle_orden WHERE id_orden = :idOrden AND id_servicio = :idServicio", nativeQuery = true)
    Optional<DetalleOrden> findByOrdenAndServicioNative(@Param("idOrden") Long idOrden, @Param("idServicio") Long idServicio);
    
    // Consultas específicas del dominio
    @Query(value = "SELECT d.* FROM detalle_orden d " +
           "JOIN servicios s ON d.id_servicio = s.id_servicio " +
           "WHERE d.id_orden = :idOrden AND s.activo = true " +
           "ORDER BY d.created_at", nativeQuery = true)
    List<DetalleOrden> findByOrdenConServiciosActivos(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT SUM(d.precio_aplicado) FROM detalle_orden d WHERE d.id_orden = :idOrden", nativeQuery = true)
    BigDecimal calcularTotalServiciosPorOrden(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT d.*, s.nombre as servicio_nombre, s.categoria as servicio_categoria " +
           "FROM detalle_orden d " +
           "JOIN servicios s ON d.id_servicio = s.id_servicio " +
           "WHERE d.id_orden = :idOrden " +
           "ORDER BY s.categoria, s.nombre", nativeQuery = true)
    List<Object[]> findDetallesConServiciosPorOrden(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT COUNT(*) FROM detalle_orden WHERE id_orden = :idOrden", nativeQuery = true)
    long contarServiciosPorOrden(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT d.* FROM detalle_orden d " +
           "WHERE d.precio_aplicado BETWEEN :precioMin AND :precioMax " +
           "ORDER BY d.precio_aplicado DESC", nativeQuery = true)
    List<DetalleOrden> findByRangoPrecio(@Param("precioMin") BigDecimal precioMin, @Param("precioMax") BigDecimal precioMax);
}
