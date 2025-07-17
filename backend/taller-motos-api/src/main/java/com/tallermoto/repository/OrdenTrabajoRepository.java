package com.tallermoto.repository;

import com.tallermoto.entity.Moto;
import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad OrdenTrabajo
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface OrdenTrabajoRepository extends JpaRepository<OrdenTrabajo, Long> {

    // Consultas por número de orden (campo único con índice)
    Optional<OrdenTrabajo> findByNumeroOrden(String numeroOrden);
    
    // Consultas por moto (relación con índice)
    List<OrdenTrabajo> findByMoto(Moto moto);
    
    List<OrdenTrabajo> findByMotoOrderByFechaIngresoDesc(Moto moto);
    
    // Consultas por usuario creador (relación con índice)
    List<OrdenTrabajo> findByUsuarioCreador(Usuario usuarioCreador);
    
    List<OrdenTrabajo> findByUsuarioCreadorOrderByFechaIngresoDesc(Usuario usuarioCreador);
    
    // Consultas por mecánico asignado (relación con índice)
    List<OrdenTrabajo> findByMecanicoAsignado(Usuario mecanicoAsignado);
    
    List<OrdenTrabajo> findByMecanicoAsignadoOrderByFechaIngresoDesc(Usuario mecanicoAsignado);
    
    List<OrdenTrabajo> findByMecanicoAsignadoIsNull();
    
    List<OrdenTrabajo> findByMecanicoAsignadoIsNotNull();
    
    // Consultas por fecha de ingreso (campo con índice)
    List<OrdenTrabajo> findByFechaIngresoAfter(LocalDateTime fechaDesde);
    
    List<OrdenTrabajo> findByFechaIngresoBefore(LocalDateTime fechaHasta);
    
    List<OrdenTrabajo> findByFechaIngresoBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<OrdenTrabajo> findByFechaIngresoAfterOrderByFechaIngresoDesc(LocalDateTime fechaDesde);
    
    // Consultas por fecha estimada de entrega
    List<OrdenTrabajo> findByFechaEstimadaEntrega(LocalDate fechaEstimadaEntrega);
    
    List<OrdenTrabajo> findByFechaEstimadaEntregaBefore(LocalDate fechaLimite);
    
    List<OrdenTrabajo> findByFechaEstimadaEntregaAfter(LocalDate fechaDesde);
    
    List<OrdenTrabajo> findByFechaEstimadaEntregaBetween(LocalDate fechaDesde, LocalDate fechaHasta);
    
    List<OrdenTrabajo> findByFechaEstimadaEntregaIsNull();
    
    List<OrdenTrabajo> findByFechaEstimadaEntregaIsNotNull();
    
    // Consultas por estado (campo con índice)
    List<OrdenTrabajo> findByEstado(String estado);
    
    List<OrdenTrabajo> findByEstadoOrderByFechaIngresoDesc(String estado);
    
    List<OrdenTrabajo> findByEstadoIn(List<String> estados);
    
    // Consultas por prioridad (campo con índice)
    List<OrdenTrabajo> findByPrioridad(String prioridad);
    
    List<OrdenTrabajo> findByPrioridadOrderByFechaIngresoDesc(String prioridad);
    
    List<OrdenTrabajo> findByPrioridadIn(List<String> prioridades);
    
    // Consultas por descripción del problema
    List<OrdenTrabajo> findByDescripcionProblemaContainingIgnoreCase(String descripcionProblema);
    
    // Consultas por diagnóstico
    List<OrdenTrabajo> findByDiagnosticoContainingIgnoreCase(String diagnostico);
    
    List<OrdenTrabajo> findByDiagnosticoIsNull();
    
    List<OrdenTrabajo> findByDiagnosticoIsNotNull();
    
    // Consultas por observaciones
    List<OrdenTrabajo> findByObservacionesContainingIgnoreCase(String observaciones);
    
    List<OrdenTrabajo> findByObservacionesIsNull();
    
    List<OrdenTrabajo> findByObservacionesIsNotNull();
    
    // Consultas por totales
    List<OrdenTrabajo> findByTotalServiciosGreaterThan(BigDecimal totalServicios);
    
    List<OrdenTrabajo> findByTotalRepuestosGreaterThan(BigDecimal totalRepuestos);
    
    List<OrdenTrabajo> findByTotalOrdenGreaterThan(BigDecimal totalOrden);
    
    List<OrdenTrabajo> findByTotalOrdenBetween(BigDecimal totalMin, BigDecimal totalMax);
    
    // Consultas por estado de pago (campo con índice)
    List<OrdenTrabajo> findByEstadoPago(String estadoPago);
    
    List<OrdenTrabajo> findByEstadoPagoOrderByFechaIngresoDesc(String estadoPago);
    
    List<OrdenTrabajo> findByEstadoPagoIn(List<String> estadosPago);
    
    // Consultas combinadas
    List<OrdenTrabajo> findByEstadoAndPrioridad(String estado, String prioridad);
    
    List<OrdenTrabajo> findByEstadoAndMecanicoAsignado(String estado, Usuario mecanicoAsignado);
    
    List<OrdenTrabajo> findByEstadoAndEstadoPago(String estado, String estadoPago);
    
    List<OrdenTrabajo> findByMotoAndEstado(Moto moto, String estado);
    
    List<OrdenTrabajo> findByUsuarioCreadorAndEstado(Usuario usuarioCreador, String estado);
    
    // Verificaciones de existencia
    boolean existsByNumeroOrden(String numeroOrden);
    
    boolean existsByNumeroOrdenAndIdOrdenNot(String numeroOrden, Long idOrden);
    
    // Contar registros
    long countByEstado(String estado);
    
    long countByPrioridad(String prioridad);
    
    long countByEstadoPago(String estadoPago);
    
    long countByMecanicoAsignado(Usuario mecanicoAsignado);
    
    long countByMoto(Moto moto);
    
    // Consultas por fechas de creación y actualización
    List<OrdenTrabajo> findByCreatedAtAfter(LocalDateTime fechaDesde);
    
    List<OrdenTrabajo> findByCreatedAtBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<OrdenTrabajo> findByUpdatedAtAfter(LocalDateTime fechaDesde);
    
    // Consultas nativas aprovechando índices del schema
    @Query(value = "SELECT * FROM ordenes_trabajo WHERE numero_orden = :numeroOrden", nativeQuery = true)
    Optional<OrdenTrabajo> findByNumeroOrdenNative(@Param("numeroOrden") String numeroOrden);
    
    @Query(value = "SELECT * FROM ordenes_trabajo WHERE estado = :estado ORDER BY fecha_ingreso DESC", nativeQuery = true)
    List<OrdenTrabajo> findByEstadoNative(@Param("estado") String estado);
    
    @Query(value = "SELECT * FROM ordenes_trabajo WHERE id_mecanico_asignado = :idMecanico ORDER BY fecha_ingreso DESC", nativeQuery = true)
    List<OrdenTrabajo> findByMecanicoAsignadoNative(@Param("idMecanico") Long idMecanico);
    
    @Query(value = "SELECT * FROM ordenes_trabajo WHERE fecha_ingreso >= :fechaDesde ORDER BY fecha_ingreso DESC", nativeQuery = true)
    List<OrdenTrabajo> findByFechaIngresoAfterNative(@Param("fechaDesde") LocalDateTime fechaDesde);
    
    @Query(value = "SELECT * FROM ordenes_trabajo WHERE prioridad = :prioridad ORDER BY fecha_ingreso DESC", nativeQuery = true)
    List<OrdenTrabajo> findByPrioridadNative(@Param("prioridad") String prioridad);
    
    @Query(value = "SELECT * FROM ordenes_trabajo WHERE estado_pago = :estadoPago ORDER BY fecha_ingreso DESC", nativeQuery = true)
    List<OrdenTrabajo> findByEstadoPagoNative(@Param("estadoPago") String estadoPago);
    
    // Consulta optimizada para búsqueda general
    @Query(value = "SELECT o.* FROM ordenes_trabajo o " +
           "JOIN motos m ON o.id_moto = m.id_moto " +
           "JOIN clientes c ON m.id_cliente = c.id_cliente " +
           "WHERE (o.numero_orden LIKE UPPER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(o.descripcion_problema) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(o.diagnostico) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(c.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "m.placa LIKE UPPER(CONCAT('%', :busqueda, '%'))) " +
           "ORDER BY o.fecha_ingreso DESC", nativeQuery = true)
    List<OrdenTrabajo> buscarOrdenes(@Param("busqueda") String busqueda);
    
    // Consultas específicas del dominio de órdenes de trabajo
    @Query(value = "SELECT DISTINCT estado FROM ordenes_trabajo ORDER BY estado", nativeQuery = true)
    List<String> findAllEstados();
    
    @Query(value = "SELECT DISTINCT prioridad FROM ordenes_trabajo ORDER BY prioridad", nativeQuery = true)
    List<String> findAllPrioridades();
    
    @Query(value = "SELECT DISTINCT estado_pago FROM ordenes_trabajo ORDER BY estado_pago", nativeQuery = true)
    List<String> findAllEstadosPago();

    // Consulta personalizada para obtener todas las órdenes con relaciones cargadas
    @Query("SELECT o FROM OrdenTrabajo o " +
           "LEFT JOIN FETCH o.moto m " +
           "LEFT JOIN FETCH m.cliente c " +
           "LEFT JOIN FETCH o.usuarioCreador uc " +
           "LEFT JOIN FETCH o.mecanicoAsignado ma " +
           "ORDER BY o.fechaIngreso DESC")
    List<OrdenTrabajo> findAllWithRelations();
}
