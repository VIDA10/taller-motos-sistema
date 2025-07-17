package com.tallermoto.repository;

import com.tallermoto.entity.OrdenHistorial;
import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para la entidad OrdenHistorial
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface OrdenHistorialRepository extends JpaRepository<OrdenHistorial, Long> {

    // Consultas por orden de trabajo (relación con índice)
    List<OrdenHistorial> findByOrdenTrabajo(OrdenTrabajo ordenTrabajo);
    
    List<OrdenHistorial> findByOrdenTrabajoOrderByFechaCambioDesc(OrdenTrabajo ordenTrabajo);
    
    List<OrdenHistorial> findByOrdenTrabajoOrderByFechaCambioAsc(OrdenTrabajo ordenTrabajo);
    
    // Consultas por estado anterior
    List<OrdenHistorial> findByEstadoAnterior(String estadoAnterior);
    
    List<OrdenHistorial> findByEstadoAnteriorOrderByFechaCambioDesc(String estadoAnterior);
    
    List<OrdenHistorial> findByEstadoAnteriorIsNull();
    
    List<OrdenHistorial> findByEstadoAnteriorIsNotNull();
    
    // Consultas por estado nuevo
    List<OrdenHistorial> findByEstadoNuevo(String estadoNuevo);
    
    List<OrdenHistorial> findByEstadoNuevoOrderByFechaCambioDesc(String estadoNuevo);
    
    List<OrdenHistorial> findByEstadoNuevoIn(List<String> estadosNuevos);
    
    // Consultas por comentario
    List<OrdenHistorial> findByComentarioContainingIgnoreCase(String comentario);
    
    List<OrdenHistorial> findByComentarioIsNull();
    
    List<OrdenHistorial> findByComentarioIsNotNull();
    
    // Consultas por usuario de cambio (relación con índice)
    List<OrdenHistorial> findByUsuarioCambio(Usuario usuarioCambio);
    
    List<OrdenHistorial> findByUsuarioCambioOrderByFechaCambioDesc(Usuario usuarioCambio);
    
    // Consultas por fecha de cambio (campo con índice)
    List<OrdenHistorial> findByFechaCambioAfter(LocalDateTime fechaDesde);
    
    List<OrdenHistorial> findByFechaCambioBefore(LocalDateTime fechaHasta);
    
    List<OrdenHistorial> findByFechaCambioBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<OrdenHistorial> findByFechaCambioAfterOrderByFechaCambioDesc(LocalDateTime fechaDesde);
    
    // Consultas combinadas
    List<OrdenHistorial> findByOrdenTrabajoAndEstadoNuevo(OrdenTrabajo ordenTrabajo, String estadoNuevo);
    
    List<OrdenHistorial> findByOrdenTrabajoAndUsuarioCambio(OrdenTrabajo ordenTrabajo, Usuario usuarioCambio);
    
    List<OrdenHistorial> findByEstadoAnteriorAndEstadoNuevo(String estadoAnterior, String estadoNuevo);
    
    List<OrdenHistorial> findByUsuarioCambioAndFechaCambioBetween(Usuario usuarioCambio, LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<OrdenHistorial> findByOrdenTrabajoAndFechaCambioBetween(OrdenTrabajo ordenTrabajo, LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    // Contar registros
    long countByOrdenTrabajo(OrdenTrabajo ordenTrabajo);
    
    long countByUsuarioCambio(Usuario usuarioCambio);
    
    long countByEstadoNuevo(String estadoNuevo);
    
    long countByFechaCambioBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    // Consultas nativas aprovechando índices del schema
    @Query(value = "SELECT * FROM orden_historial WHERE id_orden = :idOrden ORDER BY fecha_cambio DESC", nativeQuery = true)
    List<OrdenHistorial> findByOrdenNative(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT * FROM orden_historial WHERE fecha_cambio >= :fechaDesde ORDER BY fecha_cambio DESC", nativeQuery = true)
    List<OrdenHistorial> findByFechaCambioAfterNative(@Param("fechaDesde") LocalDateTime fechaDesde);
    
    @Query(value = "SELECT * FROM orden_historial WHERE usuario_cambio = :idUsuario ORDER BY fecha_cambio DESC", nativeQuery = true)
    List<OrdenHistorial> findByUsuarioCambioNative(@Param("idUsuario") Long idUsuario);
    
    // Consultas específicas del dominio de auditoría
    @Query(value = "SELECT h.*, o.numero_orden, u.nombre_completo " +
           "FROM orden_historial h " +
           "JOIN ordenes_trabajo o ON h.id_orden = o.id_orden " +
           "JOIN usuarios u ON h.usuario_cambio = u.id_usuario " +
           "WHERE h.id_orden = :idOrden " +
           "ORDER BY h.fecha_cambio DESC", nativeQuery = true)
    List<Object[]> findHistorialCompletoByOrden(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT COUNT(*) FROM orden_historial WHERE id_orden = :idOrden", nativeQuery = true)
    long contarCambiosPorOrden(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT h.* FROM orden_historial h " +
           "WHERE h.estado_nuevo = :estadoNuevo " +
           "AND h.fecha_cambio BETWEEN :fechaDesde AND :fechaHasta " +
           "ORDER BY h.fecha_cambio DESC", nativeQuery = true)
    List<OrdenHistorial> findCambiosAEstadoEntreFechas(@Param("estadoNuevo") String estadoNuevo, @Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
    
    @Query(value = "SELECT DISTINCT estado_nuevo FROM orden_historial ORDER BY estado_nuevo", nativeQuery = true)
    List<String> findAllEstadosNuevos();
    
    @Query(value = "SELECT DISTINCT estado_anterior FROM orden_historial WHERE estado_anterior IS NOT NULL ORDER BY estado_anterior", nativeQuery = true)
    List<String> findAllEstadosAnteriores();
    
    @Query(value = "SELECT h.* FROM orden_historial h " +
           "WHERE h.id_orden = :idOrden " +
           "AND h.fecha_cambio = (SELECT MAX(fecha_cambio) FROM orden_historial WHERE id_orden = :idOrden)", nativeQuery = true)
    OrdenHistorial findUltimoCambioPorOrden(@Param("idOrden") Long idOrden);
    
    @Query(value = "SELECT estado_nuevo, COUNT(*) as cantidad " +
           "FROM orden_historial " +
           "WHERE fecha_cambio BETWEEN :fechaDesde AND :fechaHasta " +
           "GROUP BY estado_nuevo " +
           "ORDER BY cantidad DESC", nativeQuery = true)
    List<Object[]> obtenerResumenCambiosEstado(@Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
    
    @Query(value = "SELECT u.nombre_completo, COUNT(*) as total_cambios " +
           "FROM orden_historial h " +
           "JOIN usuarios u ON h.usuario_cambio = u.id_usuario " +
           "WHERE h.fecha_cambio BETWEEN :fechaDesde AND :fechaHasta " +
           "GROUP BY u.id_usuario, u.nombre_completo " +
           "ORDER BY total_cambios DESC", nativeQuery = true)
    List<Object[]> obtenerResumenCambiosPorUsuario(@Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
    
    @Query(value = "SELECT h.* FROM orden_historial h " +
           "WHERE h.comentario IS NOT NULL " +
           "AND h.fecha_cambio BETWEEN :fechaDesde AND :fechaHasta " +
           "ORDER BY h.fecha_cambio DESC", nativeQuery = true)
    List<OrdenHistorial> findCambiosConComentarioEntreFechas(@Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
}
