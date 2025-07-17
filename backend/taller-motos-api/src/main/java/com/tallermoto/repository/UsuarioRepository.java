package com.tallermoto.repository;

import com.tallermoto.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Usuario
 * Proporciona operaciones CRUD y consultas personalizadas
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Consultas por campos únicos
    Optional<Usuario> findByUsername(String username);
    
    Optional<Usuario> findByEmail(String email);
    
    // Consultas por estado activo
    List<Usuario> findByActivo(Boolean activo);
    
    List<Usuario> findByActivoOrderByNombreCompleto(Boolean activo);
    
    // Consultas por rol
    List<Usuario> findByRol(String rol);
    
    List<Usuario> findByRolAndActivo(String rol, Boolean activo);
    
    List<Usuario> findByRolOrderByNombreCompleto(String rol);
    
    // Consultas por nombre completo
    List<Usuario> findByNombreCompletoContainingIgnoreCase(String nombreCompleto);
    
    List<Usuario> findByNombreCompletoContainingIgnoreCaseAndActivo(String nombreCompleto, Boolean activo);
    
    // Consultas por último login
    List<Usuario> findByUltimoLoginAfter(LocalDateTime fechaDesde);
    
    List<Usuario> findByUltimoLoginBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    List<Usuario> findByUltimoLoginIsNull();
    
    // Consultas combinadas
    List<Usuario> findByRolAndActivoOrderByUltimoLoginDesc(String rol, Boolean activo);
    
    Optional<Usuario> findByUsernameAndActivo(String username, Boolean activo);
    
    Optional<Usuario> findByEmailAndActivo(String email, Boolean activo);
    
    // Verificaciones de existencia
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsernameAndIdUsuarioNot(String username, Long idUsuario);
    
    boolean existsByEmailAndIdUsuarioNot(String email, Long idUsuario);
    
    // Contar registros
    long countByActivo(Boolean activo);
    
    long countByRol(String rol);
    
    long countByRolAndActivo(String rol, Boolean activo);
    
    // Consultas por fechas de creación
    List<Usuario> findByCreatedAtAfter(LocalDateTime fechaDesde);
    
    List<Usuario> findByCreatedAtBetween(LocalDateTime fechaDesde, LocalDateTime fechaHasta);
    
    // Consulta nativa para usuarios con índices
    @Query(value = "SELECT * FROM usuarios WHERE username = :username", nativeQuery = true)
    Optional<Usuario> findByUsernameNative(@Param("username") String username);
    
    @Query(value = "SELECT * FROM usuarios WHERE email = :email", nativeQuery = true)
    Optional<Usuario> findByEmailNative(@Param("email") String email);
    
    @Query(value = "SELECT * FROM usuarios WHERE rol = :rol AND activo = :activo ORDER BY nombre_completo", nativeQuery = true)
    List<Usuario> findByRolAndActivoNative(@Param("rol") String rol, @Param("activo") Boolean activo);
}
