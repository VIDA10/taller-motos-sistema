package com.tallermoto.repository;

import com.tallermoto.entity.Configuracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Configuracion
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface ConfiguracionRepository extends JpaRepository<Configuracion, String> {

    // Consultas por tipo de dato
    List<Configuracion> findByTipoDato(String tipoDato);
    
    List<Configuracion> findByTipoDatoOrderByClave(String tipoDato);
    
    // Consultas por clave (buscar claves similares)
    List<Configuracion> findByClaveContainingIgnoreCase(String clave);
    
    List<Configuracion> findByClaveStartingWith(String prefijo);
    
    List<Configuracion> findByClaveEndingWith(String sufijo);
    
    // Consultas por valor
    List<Configuracion> findByValor(String valor);
    
    List<Configuracion> findByValorContainingIgnoreCase(String valor);
    
    // Consultas por descripción
    List<Configuracion> findByDescripcionContainingIgnoreCase(String descripcion);
    
    List<Configuracion> findByDescripcionIsNull();
    
    List<Configuracion> findByDescripcionIsNotNull();
    
    // Consultas combinadas
    List<Configuracion> findByClaveContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String clave, String descripcion);
    
    List<Configuracion> findByTipoDatoAndValorContainingIgnoreCase(String tipoDato, String valor);
    
    // Verificaciones de existencia
    boolean existsByClave(String clave);
    
    // Contar registros
    long countByTipoDato(String tipoDato);
    
    long countByDescripcionIsNotNull();
    
    // Consultas por fechas de actualización
    List<Configuracion> findByUpdatedAtAfter(LocalDateTime fechaDesde);
    
    List<Configuracion> findByUpdatedAtBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<Configuracion> findByUpdatedAtAfterOrderByUpdatedAtDesc(LocalDateTime fechaDesde);
    
    // Consultas nativas basadas en el schema
    @Query(value = "SELECT * FROM configuraciones WHERE clave = :clave", nativeQuery = true)
    Optional<Configuracion> findByClaveNative(@Param("clave") String clave);
    
    @Query(value = "SELECT * FROM configuraciones WHERE tipo_dato = :tipoDato ORDER BY clave", nativeQuery = true)
    List<Configuracion> findByTipoDatoNative(@Param("tipoDato") String tipoDato);
    
    @Query(value = "SELECT * FROM configuraciones ORDER BY clave", nativeQuery = true)
    List<Configuracion> findAllOrderByClaveNative();
    
    // Consultas específicas del dominio de configuraciones
    @Query(value = "SELECT DISTINCT tipo_dato FROM configuraciones ORDER BY tipo_dato", nativeQuery = true)
    List<String> findAllTiposDato();
    
    @Query(value = "SELECT * FROM configuraciones WHERE " +
           "(LOWER(clave) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(valor) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%'))) " +
           "ORDER BY clave", nativeQuery = true)
    List<Configuracion> buscarConfiguraciones(@Param("busqueda") String busqueda);
    
    // Consultas específicas para tipos de datos comunes del schema
    @Query(value = "SELECT * FROM configuraciones WHERE tipo_dato = 'STRING' ORDER BY clave", nativeQuery = true)
    List<Configuracion> findConfiguracionesString();
    
    @Query(value = "SELECT * FROM configuraciones WHERE tipo_dato = 'INTEGER' ORDER BY clave", nativeQuery = true)
    List<Configuracion> findConfiguracionesInteger();
    
    @Query(value = "SELECT * FROM configuraciones WHERE tipo_dato = 'DECIMAL' ORDER BY clave", nativeQuery = true)
    List<Configuracion> findConfiguracionesDecimal();
    
    @Query(value = "SELECT * FROM configuraciones WHERE tipo_dato = 'BOOLEAN' ORDER BY clave", nativeQuery = true)
    List<Configuracion> findConfiguracionesBoolean();
}
