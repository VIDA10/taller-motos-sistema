package com.tallermoto.repository;

import com.tallermoto.entity.Cliente;
import com.tallermoto.entity.Moto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Moto
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface MotoRepository extends JpaRepository<Moto, Long> {

    // Consultas por placa (campo único con índice)
    Optional<Moto> findByPlaca(String placa);
    
    // Consultas por cliente (relación con índice)
    List<Moto> findByCliente(Cliente cliente);
    
    List<Moto> findByClienteAndActivo(Cliente cliente, Boolean activo);
    
    List<Moto> findByClienteOrderByCreatedAtDesc(Cliente cliente);
    
    // Consultas por marca (campo con índice combinado)
    List<Moto> findByMarca(String marca);
    
    List<Moto> findByMarcaAndActivo(String marca, Boolean activo);
    
    List<Moto> findByMarcaContainingIgnoreCase(String marca);
    
    // Consultas por modelo (campo con índice combinado)
    List<Moto> findByModelo(String modelo);
    
    List<Moto> findByModeloAndActivo(String modelo, Boolean activo);
    
    List<Moto> findByModeloContainingIgnoreCase(String modelo);
    
    // Consultas por marca y modelo (índice combinado)
    List<Moto> findByMarcaAndModelo(String marca, String modelo);
    
    List<Moto> findByMarcaAndModeloAndActivo(String marca, String modelo, Boolean activo);
    
    // Consultas por año
    List<Moto> findByAnio(Integer anio);
    
    List<Moto> findByAnioAndActivo(Integer anio, Boolean activo);
    
    List<Moto> findByAnioBetween(Integer anioDesde, Integer anioHasta);
    
    List<Moto> findByAnioGreaterThanEqual(Integer anio);
    
    List<Moto> findByAnioLessThanEqual(Integer anio);
    
    // Consultas por VIN
    Optional<Moto> findByVin(String vin);
    
    List<Moto> findByVinContaining(String vin);
    
    // Consultas por color
    List<Moto> findByColor(String color);
    
    List<Moto> findByColorContainingIgnoreCase(String color);
    
    List<Moto> findByColorIsNull();
    
    List<Moto> findByColorIsNotNull();
    
    // Consultas por kilometraje
    List<Moto> findByKilometrajeGreaterThan(Integer kilometraje);
    
    List<Moto> findByKilometrajeLessThan(Integer kilometraje);
    
    List<Moto> findByKilometrajeBetween(Integer kilometrajeMin, Integer kilometrajeMax);
    
    // Consultas por estado activo (campo con índice)
    List<Moto> findByActivo(Boolean activo);
    
    List<Moto> findByActivoOrderByMarcaAscModeloAsc(Boolean activo);
    
    // Consultas combinadas
    List<Moto> findByMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(String marca, String modelo);
    
    Optional<Moto> findByPlacaAndActivo(String placa, Boolean activo);
    
    Optional<Moto> findByVinAndActivo(String vin, Boolean activo);
    
    // Verificaciones de existencia
    boolean existsByPlaca(String placa);
    
    boolean existsByVin(String vin);
    
    boolean existsByPlacaAndIdMotoNot(String placa, Long idMoto);
    
    boolean existsByVinAndIdMotoNot(String vin, Long idMoto);
    
    // Contar registros
    long countByActivo(Boolean activo);
    
    long countByCliente(Cliente cliente);
    
    long countByClienteAndActivo(Cliente cliente, Boolean activo);
    
    long countByMarca(String marca);
    
    long countByMarcaAndModelo(String marca, String modelo);
    
    // Consultas por fechas de creación
    List<Moto> findByCreatedAtAfter(LocalDateTime fechaDesde);
    
    List<Moto> findByCreatedAtBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<Moto> findByUpdatedAtAfter(LocalDateTime fechaDesde);
    
    // Consultas nativas aprovechando índices del schema
    @Query(value = "SELECT * FROM motos WHERE placa = :placa", nativeQuery = true)
    Optional<Moto> findByPlacaNative(@Param("placa") String placa);
    
    @Query(value = "SELECT * FROM motos WHERE id_cliente = :idCliente AND activo = :activo ORDER BY created_at DESC", nativeQuery = true)
    List<Moto> findByClienteAndActivoNative(@Param("idCliente") Long idCliente, @Param("activo") Boolean activo);
    
    @Query(value = "SELECT * FROM motos WHERE marca = :marca AND modelo = :modelo AND activo = :activo", nativeQuery = true)
    List<Moto> findByMarcaAndModeloAndActivoNative(@Param("marca") String marca, @Param("modelo") String modelo, @Param("activo") Boolean activo);
    
    @Query(value = "SELECT * FROM motos WHERE activo = :activo ORDER BY marca, modelo", nativeQuery = true)
    List<Moto> findByActivoOrderByMarcaModeloNative(@Param("activo") Boolean activo);
    
    // Consulta optimizada para búsqueda general
    @Query(value = "SELECT m.* FROM motos m " +
           "JOIN clientes c ON m.id_cliente = c.id_cliente " +
           "WHERE (LOWER(m.marca) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(m.modelo) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "m.placa LIKE UPPER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(c.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%'))) " +
           "AND m.activo = :activo ORDER BY m.marca, m.modelo", nativeQuery = true)
    List<Moto> buscarMotosActivas(@Param("busqueda") String busqueda, @Param("activo") Boolean activo);
}
