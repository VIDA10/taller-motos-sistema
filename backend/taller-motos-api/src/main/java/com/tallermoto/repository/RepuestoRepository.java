package com.tallermoto.repository;

import com.tallermoto.entity.Repuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Repuesto
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface RepuestoRepository extends JpaRepository<Repuesto, Long> {

    // Consultas por código (campo único con índice)
    Optional<Repuesto> findByCodigo(String codigo);
    
    // Consultas por nombre
    List<Repuesto> findByNombreContainingIgnoreCase(String nombre);
    
    List<Repuesto> findByNombreContainingIgnoreCaseAndActivo(String nombre, Boolean activo);
    
    // Consultas por categoría (campo con índice)
    List<Repuesto> findByCategoria(String categoria);
    
    List<Repuesto> findByCategoriaAndActivo(String categoria, Boolean activo);
    
    List<Repuesto> findByCategoriaOrderByNombre(String categoria);
    
    List<Repuesto> findByCategoriaContainingIgnoreCase(String categoria);
    
    List<Repuesto> findByCategoriaIsNull();
    
    List<Repuesto> findByCategoriaIsNotNull();
    
    // Consultas por stock actual
    List<Repuesto> findByStockActualGreaterThan(Integer stockActual);
    
    List<Repuesto> findByStockActualLessThan(Integer stockActual);
    
    List<Repuesto> findByStockActualBetween(Integer stockMin, Integer stockMax);
    
    List<Repuesto> findByStockActualGreaterThanAndActivo(Integer stockActual, Boolean activo);
    
    List<Repuesto> findByStockActualEquals(Integer stockActual);
    
    // Consultas por stock mínimo
    List<Repuesto> findByStockMinimoGreaterThan(Integer stockMinimo);
    
    List<Repuesto> findByStockMinimoLessThan(Integer stockMinimo);
    
    List<Repuesto> findByStockMinimoBetween(Integer stockMin, Integer stockMax);
      // Consultas de stock bajo (stock actual <= stock mínimo)
    @Query("SELECT r FROM Repuesto r WHERE r.stockActual <= r.stockMinimo AND r.activo = :activo")
    List<Repuesto> findRepuestosConStockBajo(@Param("activo") Boolean activo);
    
    @Query("SELECT r FROM Repuesto r WHERE r.stockActual <= r.stockMinimo AND r.activo = true ORDER BY r.categoria, r.nombre")
    List<Repuesto> findRepuestosConStockBajoActivos();
    
    // Consultas por precio unitario
    List<Repuesto> findByPrecioUnitarioGreaterThan(BigDecimal precioUnitario);
    
    List<Repuesto> findByPrecioUnitarioLessThan(BigDecimal precioUnitario);
    
    List<Repuesto> findByPrecioUnitarioBetween(BigDecimal precioMin, BigDecimal precioMax);
    
    List<Repuesto> findByPrecioUnitarioGreaterThanEqualAndActivo(BigDecimal precioUnitario, Boolean activo);
    
    // Consultas por estado activo (campo con índice)
    List<Repuesto> findByActivo(Boolean activo);
    
    List<Repuesto> findByActivoOrderByCategoria(Boolean activo);
    
    List<Repuesto> findByActivoOrderByNombre(Boolean activo);
    
    List<Repuesto> findByActivoOrderByStockActual(Boolean activo);
    
    // Consultas por descripción
    List<Repuesto> findByDescripcionContainingIgnoreCase(String descripcion);
    
    List<Repuesto> findByDescripcionIsNull();
    
    List<Repuesto> findByDescripcionIsNotNull();
    
    // Consultas combinadas
    List<Repuesto> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String nombre, String descripcion);
    
    Optional<Repuesto> findByCodigoAndActivo(String codigo, Boolean activo);
    
    List<Repuesto> findByCategoriaAndPrecioUnitarioLessThanEqual(String categoria, BigDecimal precioMax);
    
    List<Repuesto> findByCategoriaAndStockActualGreaterThan(String categoria, Integer stockMinimo);
    
    // Verificaciones de existencia
    boolean existsByCodigo(String codigo);
    
    boolean existsByCodigoAndIdRepuestoNot(String codigo, Long idRepuesto);
    
    // Contar registros
    long countByActivo(Boolean activo);
    
    long countByCategoria(String categoria);
      long countByCategoriaAndActivo(String categoria, Boolean activo);
    
    @Query("SELECT COUNT(r) FROM Repuesto r WHERE r.stockActual <= r.stockMinimo AND r.activo = :activo")
    long countRepuestosConStockBajo(@Param("activo") Boolean activo);
    
    // Consultas por fechas de creación
    List<Repuesto> findByCreatedAtAfter(LocalDateTime fechaDesde);
    
    List<Repuesto> findByCreatedAtBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<Repuesto> findByUpdatedAtAfter(LocalDateTime fechaDesde);
    
    // Consultas nativas aprovechando índices del schema
    @Query(value = "SELECT * FROM repuestos WHERE codigo = :codigo", nativeQuery = true)
    Optional<Repuesto> findByCodigoNative(@Param("codigo") String codigo);
    
    @Query(value = "SELECT * FROM repuestos WHERE categoria = :categoria AND activo = :activo ORDER BY nombre", nativeQuery = true)
    List<Repuesto> findByCategoriaAndActivoNative(@Param("categoria") String categoria, @Param("activo") Boolean activo);
    
    @Query(value = "SELECT * FROM repuestos WHERE activo = :activo ORDER BY categoria, nombre", nativeQuery = true)
    List<Repuesto> findByActivoOrderByCategoriaAndNombreNative(@Param("activo") Boolean activo);
    
    // Consulta nativa para stock bajo (usando la vista del schema)
    @Query(value = "SELECT r.* FROM repuestos r WHERE r.stock_actual <= r.stock_minimo AND r.activo = :activo ORDER BY r.categoria, r.nombre", nativeQuery = true)
    List<Repuesto> findRepuestosStockBajoNative(@Param("activo") Boolean activo);
    
    // Consulta optimizada para búsqueda general
    @Query(value = "SELECT * FROM repuestos WHERE " +
           "(LOWER(nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "codigo LIKE UPPER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(categoria) LIKE LOWER(CONCAT('%', :busqueda, '%'))) " +
           "AND activo = :activo ORDER BY categoria, nombre", nativeQuery = true)
    List<Repuesto> buscarRepuestosActivos(@Param("busqueda") String busqueda, @Param("activo") Boolean activo);
    
    // Consultas específicas para control de inventario
    @Query(value = "SELECT DISTINCT categoria FROM repuestos WHERE activo = true AND categoria IS NOT NULL ORDER BY categoria", nativeQuery = true)
    List<String> findAllCategoriasActivas();
    
    @Query(value = "SELECT * FROM repuestos WHERE categoria = :categoria AND activo = true ORDER BY stock_actual ASC", nativeQuery = true)
    List<Repuesto> findRepuestosByCategoriaPorStock(@Param("categoria") String categoria);
    
    @Query(value = "SELECT * FROM repuestos WHERE stock_actual = 0 AND activo = true ORDER BY categoria, nombre", nativeQuery = true)
    List<Repuesto> findRepuestosSinStock();
    
    @Query(value = "SELECT * FROM repuestos WHERE stock_actual > 0 AND stock_actual <= :cantidad AND activo = true ORDER BY stock_actual ASC", nativeQuery = true)
    List<Repuesto> findRepuestosConStockLimitado(@Param("cantidad") Integer cantidad);
}
