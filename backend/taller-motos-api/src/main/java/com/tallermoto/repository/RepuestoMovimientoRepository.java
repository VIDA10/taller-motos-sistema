package com.tallermoto.repository;

import com.tallermoto.entity.Repuesto;
import com.tallermoto.entity.RepuestoMovimiento;
import com.tallermoto.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para la entidad RepuestoMovimiento
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface RepuestoMovimientoRepository extends JpaRepository<RepuestoMovimiento, Long> {

    // Consultas por repuesto (relación con índice)
    List<RepuestoMovimiento> findByRepuesto(Repuesto repuesto);
    
    List<RepuestoMovimiento> findByRepuestoOrderByFechaMovimientoDesc(Repuesto repuesto);
    
    List<RepuestoMovimiento> findByRepuestoOrderByFechaMovimientoAsc(Repuesto repuesto);
    
    // Consultas por tipo de movimiento (campo con índice)
    List<RepuestoMovimiento> findByTipoMovimiento(String tipoMovimiento);
    
    List<RepuestoMovimiento> findByTipoMovimientoOrderByFechaMovimientoDesc(String tipoMovimiento);
    
    List<RepuestoMovimiento> findByTipoMovimientoIn(List<String> tiposMovimiento);
    
    // Consultas por cantidad
    List<RepuestoMovimiento> findByCantidadGreaterThan(Integer cantidad);
    
    List<RepuestoMovimiento> findByCantidadLessThan(Integer cantidad);
    
    List<RepuestoMovimiento> findByCantidadBetween(Integer cantidadMin, Integer cantidadMax);
    
    List<RepuestoMovimiento> findByCantidadGreaterThanEqualOrderByCantidadDesc(Integer cantidad);
    
    // Consultas por stock anterior
    List<RepuestoMovimiento> findByStockAnteriorGreaterThan(Integer stockAnterior);
    
    List<RepuestoMovimiento> findByStockAnteriorLessThan(Integer stockAnterior);
    
    List<RepuestoMovimiento> findByStockAnteriorBetween(Integer stockMin, Integer stockMax);
    
    // Consultas por stock nuevo
    List<RepuestoMovimiento> findByStockNuevoGreaterThan(Integer stockNuevo);
    
    List<RepuestoMovimiento> findByStockNuevoLessThan(Integer stockNuevo);
    
    List<RepuestoMovimiento> findByStockNuevoBetween(Integer stockMin, Integer stockMax);
    
    // Consultas por referencia
    List<RepuestoMovimiento> findByReferencia(String referencia);
    
    List<RepuestoMovimiento> findByReferenciaContainingIgnoreCase(String referencia);
    
    List<RepuestoMovimiento> findByReferenciaIsNull();
    
    List<RepuestoMovimiento> findByReferenciaIsNotNull();
    
    // Consultas por usuario de movimiento (relación con índice)
    List<RepuestoMovimiento> findByUsuarioMovimiento(Usuario usuarioMovimiento);
    
    List<RepuestoMovimiento> findByUsuarioMovimientoOrderByFechaMovimientoDesc(Usuario usuarioMovimiento);
    
    // Consultas por fecha de movimiento (campo con índice)
    List<RepuestoMovimiento> findByFechaMovimientoAfter(LocalDateTime fechaDesde);
    
    List<RepuestoMovimiento> findByFechaMovimientoBefore(LocalDateTime fechaHasta);
    
    List<RepuestoMovimiento> findByFechaMovimientoBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<RepuestoMovimiento> findByFechaMovimientoAfterOrderByFechaMovimientoDesc(LocalDateTime fechaDesde);
    
    // Consultas combinadas
    List<RepuestoMovimiento> findByRepuestoAndTipoMovimiento(Repuesto repuesto, String tipoMovimiento);
    
    List<RepuestoMovimiento> findByRepuestoAndUsuarioMovimiento(Repuesto repuesto, Usuario usuarioMovimiento);
    
    List<RepuestoMovimiento> findByTipoMovimientoAndFechaMovimientoBetween(String tipoMovimiento, LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<RepuestoMovimiento> findByUsuarioMovimientoAndFechaMovimientoBetween(Usuario usuarioMovimiento, LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<RepuestoMovimiento> findByRepuestoAndFechaMovimientoBetween(Repuesto repuesto, LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    // Contar registros
    long countByRepuesto(Repuesto repuesto);
    
    long countByTipoMovimiento(String tipoMovimiento);
    
    long countByUsuarioMovimiento(Usuario usuarioMovimiento);
    
    long countByFechaMovimientoBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    // Consultas nativas aprovechando índices del schema
    @Query(value = "SELECT * FROM repuesto_movimientos WHERE id_repuesto = :idRepuesto ORDER BY fecha_movimiento DESC", nativeQuery = true)
    List<RepuestoMovimiento> findByRepuestoNative(@Param("idRepuesto") Long idRepuesto);
    
    @Query(value = "SELECT * FROM repuesto_movimientos WHERE fecha_movimiento >= :fechaDesde ORDER BY fecha_movimiento DESC", nativeQuery = true)
    List<RepuestoMovimiento> findByFechaMovimientoAfterNative(@Param("fechaDesde") LocalDateTime fechaDesde);
    
    @Query(value = "SELECT * FROM repuesto_movimientos WHERE tipo_movimiento = :tipoMovimiento ORDER BY fecha_movimiento DESC", nativeQuery = true)
    List<RepuestoMovimiento> findByTipoMovimientoNative(@Param("tipoMovimiento") String tipoMovimiento);
    
    @Query(value = "SELECT * FROM repuesto_movimientos WHERE usuario_movimiento = :idUsuario ORDER BY fecha_movimiento DESC", nativeQuery = true)
    List<RepuestoMovimiento> findByUsuarioMovimientoNative(@Param("idUsuario") Long idUsuario);
    
    // Consultas específicas del dominio de inventario
    @Query(value = "SELECT rm.*, r.nombre as repuesto_nombre, r.codigo as repuesto_codigo, u.nombre_completo " +
           "FROM repuesto_movimientos rm " +
           "JOIN repuestos r ON rm.id_repuesto = r.id_repuesto " +
           "JOIN usuarios u ON rm.usuario_movimiento = u.id_usuario " +
           "WHERE rm.id_repuesto = :idRepuesto " +
           "ORDER BY rm.fecha_movimiento DESC", nativeQuery = true)
    List<Object[]> findMovimientosCompletosByRepuesto(@Param("idRepuesto") Long idRepuesto);
    
    @Query(value = "SELECT COUNT(*) FROM repuesto_movimientos WHERE id_repuesto = :idRepuesto", nativeQuery = true)
    long contarMovimientosPorRepuesto(@Param("idRepuesto") Long idRepuesto);
    
    @Query(value = "SELECT rm.* FROM repuesto_movimientos rm " +
           "WHERE rm.id_repuesto = :idRepuesto " +
           "AND rm.fecha_movimiento = (SELECT MAX(fecha_movimiento) FROM repuesto_movimientos WHERE id_repuesto = :idRepuesto)", nativeQuery = true)
    RepuestoMovimiento findUltimoMovimientoPorRepuesto(@Param("idRepuesto") Long idRepuesto);
    
    @Query(value = "SELECT tipo_movimiento, COUNT(*) as cantidad, SUM(cantidad) as total_cantidad " +
           "FROM repuesto_movimientos " +
           "WHERE fecha_movimiento BETWEEN :fechaDesde AND :fechaHasta " +
           "GROUP BY tipo_movimiento " +
           "ORDER BY cantidad DESC", nativeQuery = true)
    List<Object[]> obtenerResumenPorTipoMovimiento(@Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
    
    @Query(value = "SELECT u.nombre_completo, COUNT(*) as total_movimientos, SUM(rm.cantidad) as total_cantidad " +
           "FROM repuesto_movimientos rm " +
           "JOIN usuarios u ON rm.usuario_movimiento = u.id_usuario " +
           "WHERE rm.fecha_movimiento BETWEEN :fechaDesde AND :fechaHasta " +
           "GROUP BY u.id_usuario, u.nombre_completo " +
           "ORDER BY total_movimientos DESC", nativeQuery = true)
    List<Object[]> obtenerResumenPorUsuario(@Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
    
    @Query(value = "SELECT DISTINCT tipo_movimiento FROM repuesto_movimientos ORDER BY tipo_movimiento", nativeQuery = true)
    List<String> findAllTiposMovimiento();
    
    @Query(value = "SELECT DATE(rm.fecha_movimiento) as fecha, COUNT(*) as cantidad_movimientos, SUM(ABS(rm.cantidad)) as total_cantidad " +
           "FROM repuesto_movimientos rm " +
           "WHERE rm.fecha_movimiento BETWEEN :fechaDesde AND :fechaHasta " +
           "GROUP BY DATE(rm.fecha_movimiento) " +
           "ORDER BY fecha DESC", nativeQuery = true)
    List<Object[]> obtenerResumenDiarioMovimientos(@Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
    
    @Query(value = "SELECT rm.* FROM repuesto_movimientos rm " +
           "JOIN repuestos r ON rm.id_repuesto = r.id_repuesto " +
           "WHERE r.categoria = :categoria " +
           "AND rm.fecha_movimiento BETWEEN :fechaDesde AND :fechaHasta " +
           "ORDER BY rm.fecha_movimiento DESC", nativeQuery = true)
    List<RepuestoMovimiento> findMovimientosPorCategoriaEntreFechas(@Param("categoria") String categoria, @Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
    
    @Query(value = "SELECT rm.* FROM repuesto_movimientos rm " +
           "WHERE rm.referencia IS NOT NULL " +
           "AND rm.fecha_movimiento BETWEEN :fechaDesde AND :fechaHasta " +
           "ORDER BY rm.fecha_movimiento DESC", nativeQuery = true)
    List<RepuestoMovimiento> findMovimientosConReferenciaEntreFechas(@Param("fechaDesde") LocalDateTime fechaDesde, @Param("fechaHasta") LocalDateTime fechaHasta);
}
