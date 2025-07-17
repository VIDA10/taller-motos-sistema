package com.tallermoto.controller;

import com.tallermoto.dto.CreateUsuarioDTO;
import com.tallermoto.dto.UpdateUsuarioDTO;
import com.tallermoto.dto.UsuarioResponseDTO;
import com.tallermoto.entity.Usuario;
import com.tallermoto.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para la gestión de usuarios
 * Proporciona endpoints para operaciones CRUD y consultas específicas
 */
@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "API para gestión de usuarios del sistema")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // ========== OPERACIONES CRUD ==========

    /**
     * Obtener todos los usuarios
     */
    @GetMapping
    @Operation(summary = "Obtener todos los usuarios", description = "Retorna la lista completa de usuarios del sistema")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerTodos() {
        List<UsuarioResponseDTO> usuarios = usuarioService.obtenerTodosComoDTO();
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Obtener usuario por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Retorna un usuario específico por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<UsuarioResponseDTO> obtenerPorId(
            @Parameter(description = "ID del usuario", required = true) 
            @PathVariable Long id) {
        UsuarioResponseDTO usuario = usuarioService.obtenerPorIdComoDTO(id);
        return usuario != null ? ResponseEntity.ok(usuario) : ResponseEntity.notFound().build();
    }

    /**
     * Crear nuevo usuario
     */
    @PostMapping
    @Operation(summary = "Crear nuevo usuario", description = "Crea un nuevo usuario en el sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    public ResponseEntity<UsuarioResponseDTO> crear(@Valid @RequestBody CreateUsuarioDTO createUsuarioDTO) {
        try {
            UsuarioResponseDTO usuarioCreado = usuarioService.crearDesdeDTO(createUsuarioDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCreado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar usuario existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<UsuarioResponseDTO> actualizar(
            @Parameter(description = "ID del usuario", required = true) 
            @PathVariable Long id,
            @Valid @RequestBody UpdateUsuarioDTO updateUsuarioDTO) {
        try {
            UsuarioResponseDTO usuarioActualizado = usuarioService.actualizarDesdeDTO(id, updateUsuarioDTO);
            return usuarioActualizado != null ? ResponseEntity.ok(usuarioActualizado) : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Eliminar usuario (soft delete)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario (soft delete - marca como inactivo)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Usuario eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Void> eliminar(
            @Parameter(description = "ID del usuario", required = true) 
            @PathVariable Long id) {
        try {
            usuarioService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Eliminar usuario permanentemente
     */
    @DeleteMapping("/{id}/permanente")
    @Operation(summary = "Eliminar usuario permanentemente", description = "Elimina un usuario de forma permanente de la base de datos")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Usuario eliminado permanentemente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Void> eliminarPermanente(
            @Parameter(description = "ID del usuario", required = true) 
            @PathVariable Long id) {
        try {
            usuarioService.eliminarPermanente(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ========== CONSULTAS POR CAMPOS ÚNICOS ==========

    /**
     * Buscar usuario por username
     */
    @GetMapping("/username/{username}")
    @Operation(summary = "Buscar usuario por username", description = "Retorna un usuario por su nombre de usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Usuario> buscarPorUsername(
            @Parameter(description = "Nombre de usuario", required = true) 
            @PathVariable String username) {
        Optional<Usuario> usuario = usuarioService.buscarPorUsername(username);
        return usuario.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar usuario por email
     */
    @GetMapping("/email/{email}")
    @Operation(summary = "Buscar usuario por email", description = "Retorna un usuario por su email")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Usuario> buscarPorEmail(
            @Parameter(description = "Email del usuario", required = true) 
            @PathVariable String email) {
        Optional<Usuario> usuario = usuarioService.buscarPorEmail(email);
        return usuario.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar usuario activo por username
     */
    @GetMapping("/activo/username/{username}")
    @Operation(summary = "Buscar usuario activo por username", description = "Retorna un usuario activo por su nombre de usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario activo encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario activo no encontrado")
    })
    public ResponseEntity<Usuario> buscarActivoPorUsername(
            @Parameter(description = "Nombre de usuario", required = true) 
            @PathVariable String username) {
        Optional<Usuario> usuario = usuarioService.buscarActivoPorUsername(username);
        return usuario.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar usuario activo por email
     */
    @GetMapping("/activo/email/{email}")
    @Operation(summary = "Buscar usuario activo por email", description = "Retorna un usuario activo por su email")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario activo encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario activo no encontrado")
    })
    public ResponseEntity<Usuario> buscarActivoPorEmail(
            @Parameter(description = "Email del usuario", required = true) 
            @PathVariable String email) {
        Optional<Usuario> usuario = usuarioService.buscarActivoPorEmail(email);
        return usuario.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // ========== CONSULTAS POR ESTADO ACTIVO ==========

    /**
     * Obtener usuarios por estado activo
     */
    @GetMapping("/estado/{activo}")
    @Operation(summary = "Obtener usuarios por estado activo", description = "Retorna usuarios filtrados por estado activo/inactivo")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<List<Usuario>> obtenerPorEstadoActivo(
            @Parameter(description = "Estado activo (true/false)", required = true) 
            @PathVariable Boolean activo) {
        List<Usuario> usuarios = usuarioService.obtenerPorEstadoActivo(activo);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Obtener usuarios activos ordenados por nombre
     */
    @GetMapping("/activos/ordenados")
    @Operation(summary = "Obtener usuarios activos ordenados por nombre", description = "Retorna usuarios activos ordenados alfabéticamente por nombre completo")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios activos obtenida exitosamente")
    public ResponseEntity<List<Usuario>> obtenerActivosOrdenadosPorNombre() {
        List<Usuario> usuarios = usuarioService.obtenerActivosOrdenadosPorNombre();
        return ResponseEntity.ok(usuarios);
    }

    // ========== CONSULTAS POR ROL ==========

    /**
     * Obtener usuarios por rol
     */
    @GetMapping("/rol/{rol}")
    @Operation(summary = "Obtener usuarios por rol", description = "Retorna usuarios filtrados por rol específico")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<List<Usuario>> obtenerPorRol(
            @Parameter(description = "Rol del usuario (ADMIN, RECEPCIONISTA, MECANICO)", required = true) 
            @PathVariable String rol) {
        List<Usuario> usuarios = usuarioService.obtenerPorRol(rol);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Obtener usuarios activos por rol
     */
    @GetMapping("/activos/rol/{rol}")
    @Operation(summary = "Obtener usuarios activos por rol", description = "Retorna usuarios activos filtrados por rol específico")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios activos obtenida exitosamente")
    public ResponseEntity<List<Usuario>> obtenerActivosPorRol(
            @Parameter(description = "Rol del usuario (ADMIN, RECEPCIONISTA, MECANICO)", required = true) 
            @PathVariable String rol) {
        List<Usuario> usuarios = usuarioService.obtenerActivosPorRol(rol);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Obtener usuarios por rol ordenados por nombre
     */
    @GetMapping("/rol/{rol}/ordenados")
    @Operation(summary = "Obtener usuarios por rol ordenados por nombre", description = "Retorna usuarios por rol ordenados alfabéticamente por nombre completo")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<List<Usuario>> obtenerPorRolOrdenadosPorNombre(
            @Parameter(description = "Rol del usuario (ADMIN, RECEPCIONISTA, MECANICO)", required = true) 
            @PathVariable String rol) {
        List<Usuario> usuarios = usuarioService.obtenerPorRolOrdenadosPorNombre(rol);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Obtener usuarios activos por rol ordenados por último login
     */
    @GetMapping("/activos/rol/{rol}/ultimo-login")
    @Operation(summary = "Obtener usuarios activos por rol ordenados por último login", description = "Retorna usuarios activos por rol ordenados por último login descendente")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<List<Usuario>> obtenerActivosPorRolOrdenadosPorUltimoLogin(
            @Parameter(description = "Rol del usuario (ADMIN, RECEPCIONISTA, MECANICO)", required = true) 
            @PathVariable String rol) {
        List<Usuario> usuarios = usuarioService.obtenerActivosPorRolOrdenadosPorUltimoLogin(rol);
        return ResponseEntity.ok(usuarios);
    }

    // ========== BÚSQUEDAS POR NOMBRE ==========

    /**
     * Buscar usuarios por nombre completo
     */
    @GetMapping("/buscar")
    @Operation(summary = "Buscar usuarios por nombre completo", description = "Busca usuarios que contengan el texto especificado en su nombre completo")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios encontrados")
    public ResponseEntity<List<Usuario>> buscarPorNombreCompleto(
            @Parameter(description = "Texto a buscar en el nombre completo", required = true) 
            @RequestParam String nombre) {
        List<Usuario> usuarios = usuarioService.buscarPorNombreCompleto(nombre);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Buscar usuarios activos por nombre completo
     */
    @GetMapping("/buscar/activos")
    @Operation(summary = "Buscar usuarios activos por nombre completo", description = "Busca usuarios activos que contengan el texto especificado en su nombre completo")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios activos encontrados")
    public ResponseEntity<List<Usuario>> buscarActivosPorNombreCompleto(
            @Parameter(description = "Texto a buscar en el nombre completo", required = true) 
            @RequestParam String nombre) {
        List<Usuario> usuarios = usuarioService.buscarActivosPorNombreCompleto(nombre);
        return ResponseEntity.ok(usuarios);
    }

    // ========== CONSULTAS POR ÚLTIMO LOGIN ==========

    /**
     * Obtener usuarios con login después de una fecha
     */
    @GetMapping("/login/despues-de")
    @Operation(summary = "Obtener usuarios con login después de una fecha", description = "Retorna usuarios que se loguearon después de la fecha especificada")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<List<Usuario>> obtenerConLoginDespuesDe(
            @Parameter(description = "Fecha desde (formato: yyyy-MM-dd'T'HH:mm:ss)", required = true) 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde) {
        List<Usuario> usuarios = usuarioService.obtenerConLoginDespuesDe(fechaDesde);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Obtener usuarios con login en rango de fechas
     */
    @GetMapping("/login/rango")
    @Operation(summary = "Obtener usuarios con login en rango de fechas", description = "Retorna usuarios que se loguearon en el rango de fechas especificado")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<List<Usuario>> obtenerConLoginEnRango(
            @Parameter(description = "Fecha desde (formato: yyyy-MM-dd'T'HH:mm:ss)", required = true) 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,
            @Parameter(description = "Fecha hasta (formato: yyyy-MM-dd'T'HH:mm:ss)", required = true) 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHasta) {
        List<Usuario> usuarios = usuarioService.obtenerConLoginEnRango(fechaDesde, fechaHasta);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Obtener usuarios que nunca se han logueado
     */
    @GetMapping("/sin-login")
    @Operation(summary = "Obtener usuarios sin login", description = "Retorna usuarios que nunca se han logueado al sistema")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios sin login obtenida exitosamente")
    public ResponseEntity<List<Usuario>> obtenerSinLogin() {
        List<Usuario> usuarios = usuarioService.obtenerSinLogin();
        return ResponseEntity.ok(usuarios);
    }

    // ========== CONTADORES Y ESTADÍSTICAS ==========

    /**
     * Contar usuarios por estado activo
     */
    @GetMapping("/contar/estado/{activo}")
    @Operation(summary = "Contar usuarios por estado activo", description = "Retorna el número de usuarios activos o inactivos")
    @ApiResponse(responseCode = "200", description = "Cantidad de usuarios obtenida exitosamente")
    public ResponseEntity<Long> contarPorEstadoActivo(
            @Parameter(description = "Estado activo (true/false)", required = true) 
            @PathVariable Boolean activo) {
        long cantidad = usuarioService.contarPorEstadoActivo(activo);
        return ResponseEntity.ok(cantidad);
    }

    /**
     * Contar usuarios por rol
     */
    @GetMapping("/contar/rol/{rol}")
    @Operation(summary = "Contar usuarios por rol", description = "Retorna el número de usuarios por rol específico")
    @ApiResponse(responseCode = "200", description = "Cantidad de usuarios obtenida exitosamente")
    public ResponseEntity<Long> contarPorRol(
            @Parameter(description = "Rol del usuario (ADMIN, RECEPCIONISTA, MECANICO)", required = true) 
            @PathVariable String rol) {
        long cantidad = usuarioService.contarPorRol(rol);
        return ResponseEntity.ok(cantidad);
    }

    /**
     * Contar usuarios activos por rol
     */
    @GetMapping("/contar/activos/rol/{rol}")
    @Operation(summary = "Contar usuarios activos por rol", description = "Retorna el número de usuarios activos por rol específico")
    @ApiResponse(responseCode = "200", description = "Cantidad de usuarios activos obtenida exitosamente")
    public ResponseEntity<Long> contarActivosPorRol(
            @Parameter(description = "Rol del usuario (ADMIN, RECEPCIONISTA, MECANICO)", required = true) 
            @PathVariable String rol) {
        long cantidad = usuarioService.contarActivosPorRol(rol);
        return ResponseEntity.ok(cantidad);
    }

    // ========== CONSULTAS POR FECHAS DE CREACIÓN ==========

    /**
     * Obtener usuarios creados después de una fecha
     */
    @GetMapping("/creados/despues-de")
    @Operation(summary = "Obtener usuarios creados después de una fecha", description = "Retorna usuarios creados después de la fecha especificada")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<List<Usuario>> obtenerCreadosDespuesDe(
            @Parameter(description = "Fecha desde (formato: yyyy-MM-dd'T'HH:mm:ss)", required = true) 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde) {
        List<Usuario> usuarios = usuarioService.obtenerCreadosDespuesDe(fechaDesde);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Obtener usuarios creados en rango de fechas
     */
    @GetMapping("/creados/rango")
    @Operation(summary = "Obtener usuarios creados en rango de fechas", description = "Retorna usuarios creados en el rango de fechas especificado")
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente")
    public ResponseEntity<List<Usuario>> obtenerCreadosEnRango(
            @Parameter(description = "Fecha desde (formato: yyyy-MM-dd'T'HH:mm:ss)", required = true) 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,
            @Parameter(description = "Fecha hasta (formato: yyyy-MM-dd'T'HH:mm:ss)", required = true) 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHasta) {
        List<Usuario> usuarios = usuarioService.obtenerCreadosEnRango(fechaDesde, fechaHasta);
        return ResponseEntity.ok(usuarios);
    }

    // ========== VALIDACIONES ==========

    /**
     * Verificar si existe username
     */
    @GetMapping("/validar/username/{username}")
    @Operation(summary = "Verificar si existe username", description = "Verifica si un nombre de usuario ya existe en el sistema")
    @ApiResponse(responseCode = "200", description = "Resultado de la validación obtenido exitosamente")
    public ResponseEntity<Boolean> existeUsername(
            @Parameter(description = "Nombre de usuario a verificar", required = true) 
            @PathVariable String username) {
        boolean existe = usuarioService.existeUsername(username);
        return ResponseEntity.ok(existe);
    }

    /**
     * Verificar si existe email
     */
    @GetMapping("/validar/email/{email}")
    @Operation(summary = "Verificar si existe email", description = "Verifica si un email ya existe en el sistema")
    @ApiResponse(responseCode = "200", description = "Resultado de la validación obtenido exitosamente")
    public ResponseEntity<Boolean> existeEmail(
            @Parameter(description = "Email a verificar", required = true) 
            @PathVariable String email) {
        boolean existe = usuarioService.existeEmail(email);
        return ResponseEntity.ok(existe);
    }

    // ========== OPERACIONES ESPECIALES ==========

    /**
     * Actualizar último login de usuario
     */
    @PatchMapping("/ultimo-login/{username}")
    @Operation(summary = "Actualizar último login", description = "Actualiza la fecha de último login de un usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Último login actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Void> actualizarUltimoLogin(
            @Parameter(description = "Nombre de usuario", required = true) 
            @PathVariable String username) {
        usuarioService.actualizarUltimoLogin(username);
        return ResponseEntity.ok().build();
    }

    /**
     * Cambiar estado activo de usuario
     */
    @PatchMapping("/{id}/estado/{nuevoEstado}")
    @Operation(summary = "Cambiar estado activo", description = "Cambia el estado activo/inactivo de un usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estado actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Void> cambiarEstadoActivo(
            @Parameter(description = "ID del usuario", required = true) 
            @PathVariable Long id,
            @Parameter(description = "Nuevo estado (true/false)", required = true) 
            @PathVariable Boolean nuevoEstado) {
        try {
            usuarioService.cambiarEstadoActivo(id, nuevoEstado);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cambiar password de usuario
     */
    @PatchMapping("/{id}/password")
    @Operation(summary = "Cambiar password de usuario", description = "Cambia la contraseña de un usuario por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Password actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Void> cambiarPassword(
            @Parameter(description = "ID del usuario", required = true) 
            @PathVariable Long id,
            @Parameter(description = "Nueva contraseña", required = true) 
            @RequestBody String nuevoPassword) {
        try {
            usuarioService.cambiarPassword(id, nuevoPassword);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cambiar password por username
     */
    @PatchMapping("/password/{username}")
    @Operation(summary = "Cambiar password por username", description = "Cambia la contraseña de un usuario por nombre de usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Password actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Void> cambiarPasswordPorUsername(
            @Parameter(description = "Nombre de usuario", required = true) 
            @PathVariable String username,
            @Parameter(description = "Nueva contraseña", required = true) 
            @RequestBody String nuevoPassword) {
        try {
            usuarioService.cambiarPasswordPorUsername(username, nuevoPassword);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ========== MÉTODOS DE AUTENTICACIÓN ==========

    /**
     * Validar credenciales de usuario
     */
    @PostMapping("/validar-credenciales")
    @Operation(summary = "Validar credenciales", description = "Valida las credenciales de un usuario")
    @ApiResponse(responseCode = "200", description = "Resultado de la validación obtenido exitosamente")
    public ResponseEntity<Boolean> validarCredenciales(
            @Parameter(description = "Nombre de usuario", required = true) 
            @RequestParam String username,
            @Parameter(description = "Contraseña", required = true) 
            @RequestParam String password) {
        boolean valido = usuarioService.validarCredenciales(username, password);
        return ResponseEntity.ok(valido);
    }

    /**
     * Obtener usuario para autenticación
     */
    @GetMapping("/autenticacion/{username}")
    @Operation(summary = "Obtener usuario para autenticación", description = "Obtiene un usuario activo para procesos de autenticación")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario para autenticación encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado o inactivo")
    })
    public ResponseEntity<Usuario> obtenerParaAutenticacion(
            @Parameter(description = "Nombre de usuario", required = true) 
            @PathVariable String username) {
        Optional<Usuario> usuario = usuarioService.obtenerParaAutenticacion(username);
        return usuario.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
}
