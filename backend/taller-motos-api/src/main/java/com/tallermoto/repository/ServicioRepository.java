package com.tallermoto.repository;

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
 * Repositorio para la entidad Servicio
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {

    // Consultas por código (campo único con índice)
    Optional<Servicio> findByCodigo(String codigo);
    
    // Consultas por nombre
    List<Servicio> findByNombreContainingIgnoreCase(String nombre);
    
    List<Servicio> findByNombreContainingIgnoreCaseAndActivo(String nombre, Boolean activo);
    
    // Consultas por categoría (campo con índice)
    List<Servicio> findByCategoria(String categoria);
    
    List<Servicio> findByCategoriaAndActivo(String categoria, Boolean activo);
    
    List<Servicio> findByCategoriaOrderByNombre(String categoria);
    
    List<Servicio> findByCategoriaContainingIgnoreCase(String categoria);
    
    // Consultas por precio base (campo con índice)
    List<Servicio> findByPrecioBaseGreaterThan(BigDecimal precioBase);
    
    List<Servicio> findByPrecioBaseLessThan(BigDecimal precioBase);
    
    List<Servicio> findByPrecioBaseBetween(BigDecimal precioMin, BigDecimal precioMax);
    
    List<Servicio> findByPrecioBaseGreaterThanEqualAndActivo(BigDecimal precioBase, Boolean activo);
    
    List<Servicio> findByPrecioBaseLessThanEqualAndActivo(BigDecimal precioBase, Boolean activo);
    
    // Consultas por tiempo estimado
    List<Servicio> findByTiempoEstimadoMinutosGreaterThan(Integer tiempoEstimado);
    
    List<Servicio> findByTiempoEstimadoMinutosLessThan(Integer tiempoEstimado);
    
    List<Servicio> findByTiempoEstimadoMinutosBetween(Integer tiempoMin, Integer tiempoMax);
    
    List<Servicio> findByTiempoEstimadoMinutosLessThanEqualAndActivo(Integer tiempoEstimado, Boolean activo);
    
    // Consultas por estado activo (campo con índice)
    List<Servicio> findByActivo(Boolean activo);
    
    List<Servicio> findByActivoOrderByCategoria(Boolean activo);
    
    List<Servicio> findByActivoOrderByPrecioBase(Boolean activo);
    
    List<Servicio> findByActivoOrderByNombre(Boolean activo);
    
    // Consultas por descripción
    List<Servicio> findByDescripcionContainingIgnoreCase(String descripcion);
    
    List<Servicio> findByDescripcionIsNull();
    
    List<Servicio> findByDescripcionIsNotNull();
    
    // Consultas combinadas
    List<Servicio> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String nombre, String descripcion);
    
    Optional<Servicio> findByCodigoAndActivo(String codigo, Boolean activo);
    
    List<Servicio> findByCategoriaAndPrecioBaseLessThanEqual(String categoria, BigDecimal precioMax);
    
    List<Servicio> findByCategoriaAndTiempoEstimadoMinutosLessThanEqual(String categoria, Integer tiempoMax);
    
    // Verificaciones de existencia
    boolean existsByCodigo(String codigo);
    
    boolean existsByCodigoAndIdServicioNot(String codigo, Long idServicio);
    
    // Contar registros
    long countByActivo(Boolean activo);
    
    long countByCategoria(String categoria);
    
    long countByCategoriaAndActivo(String categoria, Boolean activo);
    
    long countByPrecioBaseGreaterThan(BigDecimal precioBase);
    
    // Consultas por fechas de creación
    List<Servicio> findByCreatedAtAfter(LocalDateTime fechaDesde);
    
    List<Servicio> findByCreatedAtBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<Servicio> findByUpdatedAtAfter(LocalDateTime fechaDesde);
    
    // Consultas nativas aprovechando índices del schema
    @Query(value = "SELECT * FROM servicios WHERE codigo = :codigo", nativeQuery = true)
    Optional<Servicio> findByCodigoNative(@Param("codigo") String codigo);
    
    @Query(value = "SELECT * FROM servicios WHERE categoria = :categoria AND activo = :activo ORDER BY nombre", nativeQuery = true)
    List<Servicio> findByCategoriaAndActivoNative(@Param("categoria") String categoria, @Param("activo") Boolean activo);
    
    @Query(value = "SELECT * FROM servicios WHERE activo = :activo ORDER BY categoria, nombre", nativeQuery = true)
    List<Servicio> findByActivoOrderByCategoriaAndNombreNative(@Param("activo") Boolean activo);
    
    @Query(value = "SELECT * FROM servicios WHERE precio_base BETWEEN :precioMin AND :precioMax AND activo = :activo ORDER BY precio_base", nativeQuery = true)
    List<Servicio> findByPrecioRangeAndActivoNative(@Param("precioMin") BigDecimal precioMin, @Param("precioMax") BigDecimal precioMax, @Param("activo") Boolean activo);
    
    // Consulta optimizada para búsqueda general
    @Query(value = "SELECT * FROM servicios WHERE " +
           "(LOWER(nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "codigo LIKE UPPER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(categoria) LIKE LOWER(CONCAT('%', :busqueda, '%'))) " +
           "AND activo = :activo ORDER BY categoria, nombre", nativeQuery = true)
    List<Servicio> buscarServiciosActivos(@Param("busqueda") String busqueda, @Param("activo") Boolean activo);
    
    // Consultas específicas para rangos de precios comunes
    @Query(value = "SELECT DISTINCT categoria FROM servicios WHERE activo = true ORDER BY categoria", nativeQuery = true)
    List<String> findAllCategoriasActivas();
    
    @Query(value = "SELECT * FROM servicios WHERE categoria = :categoria AND activo = true ORDER BY precio_base ASC", nativeQuery = true)
    List<Servicio> findServiciosByCategoriaPorPrecio(@Param("categoria") String categoria);
}
