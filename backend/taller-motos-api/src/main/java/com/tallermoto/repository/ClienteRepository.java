package com.tallermoto.repository;

import com.tallermoto.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Cliente
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Consultas por teléfono (campo obligatorio con índice)
    Optional<Cliente> findByTelefono(String telefono);
    
    List<Cliente> findByTelefonoContaining(String telefono);
    
    // Consultas por email (campo opcional con índice)
    Optional<Cliente> findByEmail(String email);
    
    List<Cliente> findByEmailContainingIgnoreCase(String email);
    
    // Consultas por DNI (campo único con índice)
    Optional<Cliente> findByDni(String dni);
    
    // Consultas por estado activo
    List<Cliente> findByActivo(Boolean activo);
    
    List<Cliente> findByActivoOrderByNombre(Boolean activo);
    
    // Consultas por nombre
    List<Cliente> findByNombreContainingIgnoreCase(String nombre);
    
    List<Cliente> findByNombreContainingIgnoreCaseAndActivo(String nombre, Boolean activo);
    
    List<Cliente> findByNombreStartingWithIgnoreCase(String nombre);
    
    // Consultas por dirección
    List<Cliente> findByDireccionContainingIgnoreCase(String direccion);
    
    List<Cliente> findByDireccionIsNull();
    
    List<Cliente> findByDireccionIsNotNull();
    
    // Consultas combinadas
    List<Cliente> findByNombreContainingIgnoreCaseOrTelefonoContaining(String nombre, String telefono);
    
    Optional<Cliente> findByTelefonoAndActivo(String telefono, Boolean activo);
    
    Optional<Cliente> findByEmailAndActivo(String email, Boolean activo);
    
    Optional<Cliente> findByDniAndActivo(String dni, Boolean activo);
    
    // Verificaciones de existencia
    boolean existsByTelefono(String telefono);
    
    boolean existsByEmail(String email);
    
    boolean existsByDni(String dni);
    
    boolean existsByTelefonoAndIdClienteNot(String telefono, Long idCliente);
    
    boolean existsByEmailAndIdClienteNot(String email, Long idCliente);
    
    boolean existsByDniAndIdClienteNot(String dni, Long idCliente);
    
    // Contar registros
    long countByActivo(Boolean activo);
    
    long countByEmailIsNotNull();
    
    long countByDniIsNotNull();
    
    // Consultas por fechas de creación
    List<Cliente> findByCreatedAtAfter(LocalDateTime fechaDesde);
    
    List<Cliente> findByCreatedAtBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<Cliente> findByUpdatedAtAfter(LocalDateTime fechaDesde);
    
    // Consultas nativas aprovechando índices del schema
    @Query(value = "SELECT * FROM clientes WHERE telefono = :telefono", nativeQuery = true)
    Optional<Cliente> findByTelefonoNative(@Param("telefono") String telefono);
    
    @Query(value = "SELECT * FROM clientes WHERE email = :email", nativeQuery = true)
    Optional<Cliente> findByEmailNative(@Param("email") String email);
    
    @Query(value = "SELECT * FROM clientes WHERE dni = :dni", nativeQuery = true)
    Optional<Cliente> findByDniNative(@Param("dni") String dni);
    
    @Query(value = "SELECT * FROM clientes WHERE activo = :activo ORDER BY nombre", nativeQuery = true)
    List<Cliente> findByActivoNative(@Param("activo") Boolean activo);
    
    // Consulta optimizada para búsqueda general
    @Query(value = "SELECT * FROM clientes WHERE " +
           "(LOWER(nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "telefono LIKE CONCAT('%', :busqueda, '%') OR " +
           "email LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "dni LIKE CONCAT('%', :busqueda, '%')) " +
           "AND activo = :activo ORDER BY nombre", nativeQuery = true)
    List<Cliente> buscarClientesActivos(@Param("busqueda") String busqueda, @Param("activo") Boolean activo);
}
