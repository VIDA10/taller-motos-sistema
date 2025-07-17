package com.tallermoto.service;

import com.tallermoto.dto.CreateUsuarioDTO;
import com.tallermoto.dto.UpdateUsuarioDTO;
import com.tallermoto.dto.UsuarioResponseDTO;
import com.tallermoto.entity.Usuario;
import com.tallermoto.mapper.UsuarioMapper;
import com.tallermoto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de usuarios del sistema
 * Proporciona operaciones CRUD y lógica de negocio para usuarios
 */
@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioMapper usuarioMapper;

    // =====================================================
    // OPERACIONES CRUD BÁSICAS
    // =====================================================

    /**
     * Obtener todos los usuarios
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    /**
     * Obtener todos los usuarios como DTO (sin password)
     */
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> obtenerTodosComoDTO() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarioMapper.toResponseDtoList(usuarios);
    }

    /**
     * Obtener usuario por ID
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    /**
     * Obtener usuario por ID como DTO (sin password)
     */
    @Transactional(readOnly = true)
    public UsuarioResponseDTO obtenerPorIdComoDTO(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(usuarioMapper::toResponseDto).orElse(null);
    }

    /**
     * Crear nuevo usuario
     */
    public Usuario crear(Usuario usuario) {
        // Validar que username y email no existan
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new IllegalArgumentException("El username ya existe: " + usuario.getUsername());
        }
        
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("El email ya existe: " + usuario.getEmail());
        }

        // Encriptar password
        if (usuario.getPasswordHash() != null && !usuario.getPasswordHash().isEmpty()) {
            usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
        }

        return usuarioRepository.save(usuario);
    }

    /**
     * Crear nuevo usuario desde DTO
     */
    public UsuarioResponseDTO crearDesdeDTO(CreateUsuarioDTO createDTO) {
        // Validar que username y email no existan
        if (usuarioRepository.existsByUsername(createDTO.getUsername())) {
            throw new IllegalArgumentException("El username ya existe: " + createDTO.getUsername());
        }
        
        if (usuarioRepository.existsByEmail(createDTO.getEmail())) {
            throw new IllegalArgumentException("El email ya existe: " + createDTO.getEmail());
        }

        // Convertir DTO a entidad usando mapper
        Usuario usuario = usuarioMapper.toEntity(createDTO);
        
        // Encriptar password
        if (createDTO.getPassword() != null && !createDTO.getPassword().isEmpty()) {
            usuario.setPasswordHash(passwordEncoder.encode(createDTO.getPassword()));
        }

        // Guardar y convertir a DTO de respuesta
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseDto(usuarioGuardado);
    }

    /**
     * Actualizar usuario existente
     */
    public Usuario actualizar(Long id, Usuario usuarioActualizado) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));

        // Validar username único (excluyendo el usuario actual)
        if (!usuarioExistente.getUsername().equals(usuarioActualizado.getUsername()) &&
            usuarioRepository.existsByUsernameAndIdUsuarioNot(usuarioActualizado.getUsername(), id)) {
            throw new IllegalArgumentException("El username ya existe: " + usuarioActualizado.getUsername());
        }

        // Validar email único (excluyendo el usuario actual)
        if (!usuarioExistente.getEmail().equals(usuarioActualizado.getEmail()) &&
            usuarioRepository.existsByEmailAndIdUsuarioNot(usuarioActualizado.getEmail(), id)) {
            throw new IllegalArgumentException("El email ya existe: " + usuarioActualizado.getEmail());
        }

        // Actualizar campos
        usuarioExistente.setUsername(usuarioActualizado.getUsername());
        usuarioExistente.setEmail(usuarioActualizado.getEmail());
        usuarioExistente.setNombreCompleto(usuarioActualizado.getNombreCompleto());
        usuarioExistente.setRol(usuarioActualizado.getRol());
        usuarioExistente.setActivo(usuarioActualizado.getActivo());

        // Solo actualizar password si se proporciona uno nuevo
        if (usuarioActualizado.getPasswordHash() != null && !usuarioActualizado.getPasswordHash().isEmpty()) {
            usuarioExistente.setPasswordHash(passwordEncoder.encode(usuarioActualizado.getPasswordHash()));
        }

        return usuarioRepository.save(usuarioExistente);
    }

    /**
     * Actualizar usuario desde DTO
     */
    public UsuarioResponseDTO actualizarDesdeDTO(Long id, UpdateUsuarioDTO updateUsuarioDTO) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElse(null);
        
        if (usuarioExistente == null) {
            return null;
        }

        // Validar username único si se está cambiando
        if (updateUsuarioDTO.getUsername() != null && 
            !usuarioExistente.getUsername().equals(updateUsuarioDTO.getUsername()) &&
            usuarioRepository.existsByUsernameAndIdUsuarioNot(updateUsuarioDTO.getUsername(), id)) {
            throw new IllegalArgumentException("El username ya existe: " + updateUsuarioDTO.getUsername());
        }

        // Validar email único si se está cambiando
        if (updateUsuarioDTO.getEmail() != null && 
            !usuarioExistente.getEmail().equals(updateUsuarioDTO.getEmail()) &&
            usuarioRepository.existsByEmailAndIdUsuarioNot(updateUsuarioDTO.getEmail(), id)) {
            throw new IllegalArgumentException("El email ya existe: " + updateUsuarioDTO.getEmail());
        }

        // Aplicar cambios usando el mapper
        usuarioMapper.updateEntity(updateUsuarioDTO, usuarioExistente);

        // Si hay nueva contraseña, encriptarla
        if (updateUsuarioDTO.getPassword() != null && !updateUsuarioDTO.getPassword().isEmpty()) {
            usuarioExistente.setPasswordHash(passwordEncoder.encode(updateUsuarioDTO.getPassword()));
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuarioExistente);
        return usuarioMapper.toResponseDto(usuarioActualizado);
    }

    /**
     * Eliminar usuario (soft delete - cambiar activo a false)
     */
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
        
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    /**
     * Eliminar usuario permanentemente
     */
    public void eliminarPermanente(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // =====================================================
    // CONSULTAS POR CAMPOS ÚNICOS
    // =====================================================

    /**
     * Buscar usuario por username
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    /**
     * Buscar usuario por email
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    /**
     * Buscar usuario activo por username
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarActivoPorUsername(String username) {
        return usuarioRepository.findByUsernameAndActivo(username, true);
    }

    /**
     * Buscar usuario activo por email
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarActivoPorEmail(String email) {
        return usuarioRepository.findByEmailAndActivo(email, true);
    }

    // =====================================================
    // CONSULTAS POR ESTADO ACTIVO
    // =====================================================

    /**
     * Obtener usuarios por estado activo
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerPorEstadoActivo(Boolean activo) {
        return usuarioRepository.findByActivo(activo);
    }

    /**
     * Obtener usuarios activos ordenados por nombre
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerActivosOrdenadosPorNombre() {
        return usuarioRepository.findByActivoOrderByNombreCompleto(true);
    }

    // =====================================================
    // CONSULTAS POR ROL
    // =====================================================

    /**
     * Obtener usuarios por rol
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerPorRol(String rol) {
        return usuarioRepository.findByRol(rol);
    }

    /**
     * Obtener usuarios activos por rol
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerActivosPorRol(String rol) {
        return usuarioRepository.findByRolAndActivo(rol, true);
    }

    /**
     * Obtener usuarios por rol ordenados por nombre
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerPorRolOrdenadosPorNombre(String rol) {
        return usuarioRepository.findByRolOrderByNombreCompleto(rol);
    }

    /**
     * Obtener usuarios activos por rol ordenados por último login
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerActivosPorRolOrdenadosPorUltimoLogin(String rol) {
        return usuarioRepository.findByRolAndActivoOrderByUltimoLoginDesc(rol, true);
    }

    // =====================================================
    // BÚSQUEDAS POR NOMBRE
    // =====================================================

    /**
     * Buscar usuarios por nombre completo (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Usuario> buscarPorNombreCompleto(String nombreCompleto) {
        return usuarioRepository.findByNombreCompletoContainingIgnoreCase(nombreCompleto);
    }

    /**
     * Buscar usuarios activos por nombre completo (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Usuario> buscarActivosPorNombreCompleto(String nombreCompleto) {
        return usuarioRepository.findByNombreCompletoContainingIgnoreCaseAndActivo(nombreCompleto, true);
    }

    // =====================================================
    // CONSULTAS POR ÚLTIMO LOGIN
    // =====================================================

    /**
     * Obtener usuarios con login después de una fecha
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerConLoginDespuesDe(LocalDateTime fechaDesde) {
        return usuarioRepository.findByUltimoLoginAfter(fechaDesde);
    }

    /**
     * Obtener usuarios con login en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerConLoginEnRango(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return usuarioRepository.findByUltimoLoginBetween(fechaDesde, fechaHasta);
    }

    /**
     * Obtener usuarios que nunca se han logueado
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerSinLogin() {
        return usuarioRepository.findByUltimoLoginIsNull();
    }

    // =====================================================
    // CONTADORES Y ESTADÍSTICAS
    // =====================================================

    /**
     * Contar usuarios por estado activo
     */
    @Transactional(readOnly = true)
    public long contarPorEstadoActivo(Boolean activo) {
        return usuarioRepository.countByActivo(activo);
    }

    /**
     * Contar usuarios por rol
     */
    @Transactional(readOnly = true)
    public long contarPorRol(String rol) {
        return usuarioRepository.countByRol(rol);
    }

    /**
     * Contar usuarios activos por rol
     */
    @Transactional(readOnly = true)
    public long contarActivosPorRol(String rol) {
        return usuarioRepository.countByRolAndActivo(rol, true);
    }

    // =====================================================
    // CONSULTAS POR FECHAS DE CREACIÓN
    // =====================================================

    /**
     * Obtener usuarios creados después de una fecha
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerCreadosDespuesDe(LocalDateTime fechaDesde) {
        return usuarioRepository.findByCreatedAtAfter(fechaDesde);
    }

    /**
     * Obtener usuarios creados en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerCreadosEnRango(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return usuarioRepository.findByCreatedAtBetween(fechaDesde, fechaHasta);
    }

    // =====================================================
    // VALIDACIONES
    // =====================================================

    /**
     * Verificar si existe username
     */
    @Transactional(readOnly = true)
    public boolean existeUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    /**
     * Verificar si existe email
     */
    @Transactional(readOnly = true)
    public boolean existeEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    // =====================================================
    // OPERACIONES ESPECIALES
    // =====================================================

    /**
     * Actualizar último login de usuario
     */
    public void actualizarUltimoLogin(String username) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setUltimoLogin(LocalDateTime.now());
            usuarioRepository.save(usuario);
        }
    }

    /**
     * Cambiar estado activo de usuario
     */
    public void cambiarEstadoActivo(Long id, Boolean nuevoEstado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
        
        usuario.setActivo(nuevoEstado);
        usuarioRepository.save(usuario);
    }

    /**
     * Cambiar password de usuario
     */
    public void cambiarPassword(Long id, String nuevoPassword) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
        
        usuario.setPasswordHash(passwordEncoder.encode(nuevoPassword));
        usuarioRepository.save(usuario);
    }

    /**
     * Cambiar password por username
     */
    public void cambiarPasswordPorUsername(String username, String nuevoPassword) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con username: " + username));
        
        usuario.setPasswordHash(passwordEncoder.encode(nuevoPassword));
        usuarioRepository.save(usuario);
    }

    // =====================================================
    // MÉTODOS DE AUTENTICACIÓN
    // =====================================================

    /**
     * Validar credenciales de usuario
     */
    @Transactional(readOnly = true)
    public boolean validarCredenciales(String username, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsernameAndActivo(username, true);
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            return passwordEncoder.matches(password, usuario.getPasswordHash());
        }
        
        return false;
    }

    /**
     * Obtener usuario para autenticación
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerParaAutenticacion(String username) {
        return usuarioRepository.findByUsernameAndActivo(username, true);
    }
}
