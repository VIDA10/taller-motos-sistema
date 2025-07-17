package com.tallermoto.controller;

import com.tallermoto.config.JwtUtils;
import com.tallermoto.dto.LoginRequestDTO;
import com.tallermoto.dto.LoginResponseDTO;
import com.tallermoto.dto.UsuarioResponseDTO;
import com.tallermoto.entity.Usuario;
import com.tallermoto.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Controlador REST para autenticación JWT
 * Proporciona endpoints para login y logout
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Autenticación", description = "API para autenticación JWT del sistema")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Login de usuario con JWT
     */
    @PostMapping("/login")
    @Operation(summary = "Login de usuario", description = "Autentica un usuario y retorna un token JWT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login exitoso, token JWT generado"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            String usernameOrEmail = loginRequest.getUsernameOrEmail();
            String password = loginRequest.getPassword();

            // Determinar si es username o email
            Usuario usuario = null;
            
            // Intentar buscar por username primero
            Optional<Usuario> usuarioOpt = usuarioService.buscarActivoPorUsername(usernameOrEmail);
            
            if (usuarioOpt.isEmpty()) {
                // Si no se encuentra por username, buscar por email
                usuarioOpt = usuarioService.buscarActivoPorEmail(usernameOrEmail);
            }
            
            if (usuarioOpt.isPresent()) {
                usuario = usuarioOpt.get();
                
                // Validar credenciales usando el username del usuario encontrado
                boolean credencialesValidas = usuarioService.validarCredenciales(usuario.getUsername(), password);
                
                if (credencialesValidas) {
                    // Actualizar último login
                    usuarioService.actualizarUltimoLogin(usuario.getUsername());
                    
                    // Generar token JWT
                    String token = jwtUtils.generateJwtToken(
                        usuario.getUsername(), 
                        usuario.getRol(), 
                        usuario.getIdUsuario()
                    );
                    
                    // Crear respuesta
                    UsuarioResponseDTO usuarioResponse = new UsuarioResponseDTO(usuario);
                    LoginResponseDTO response = new LoginResponseDTO(token, usuarioResponse);
                    
                    return ResponseEntity.ok(response);
                }
            }
            
            // Credenciales inválidas
            return ResponseEntity.status(401).build();
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Logout de usuario (invalidar token)
     */
    @PostMapping("/logout")
    @Operation(summary = "Logout de usuario", description = "Cierra la sesión del usuario (lado cliente debe eliminar el token)")
    @ApiResponse(responseCode = "200", description = "Logout exitoso")
    public ResponseEntity<String> logout() {
        // En una implementación JWT básica, el logout se maneja en el cliente
        // El cliente debe eliminar el token del almacenamiento local
        return ResponseEntity.ok("Logout exitoso. El token debe ser eliminado del cliente.");
    }

    /**
     * Verificar si el token JWT es válido
     */
    @GetMapping("/validate")
    @Operation(summary = "Validar token JWT", description = "Verifica si el token JWT proporcionado es válido")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token válido"),
        @ApiResponse(responseCode = "401", description = "Token inválido o expirado")
    })
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                if (jwtUtils.validateJwtToken(token)) {
                    String username = jwtUtils.getUsernameFromJwtToken(token);
                    
                    // Verificar que el usuario aún existe y está activo
                    Optional<Usuario> usuarioOpt = usuarioService.buscarActivoPorUsername(username);
                    
                    if (usuarioOpt.isPresent()) {
                        return ResponseEntity.ok("Token válido para usuario: " + username);
                    }
                }
            }
            
            return ResponseEntity.status(401).body("Token inválido");
            
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error al validar token");
        }
    }

    /**
     * Obtener información del usuario actual desde el token
     */
    @GetMapping("/me")
    @Operation(summary = "Obtener información del usuario actual", description = "Retorna la información del usuario basada en el token JWT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Información del usuario obtenida"),
        @ApiResponse(responseCode = "401", description = "Token inválido o usuario no encontrado")
    })
    public ResponseEntity<UsuarioResponseDTO> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                if (jwtUtils.validateJwtToken(token)) {
                    String username = jwtUtils.getUsernameFromJwtToken(token);
                    
                    Optional<Usuario> usuarioOpt = usuarioService.buscarActivoPorUsername(username);
                    
                    if (usuarioOpt.isPresent()) {
                        UsuarioResponseDTO usuarioResponse = new UsuarioResponseDTO(usuarioOpt.get());
                        return ResponseEntity.ok(usuarioResponse);
                    }
                }
            }
            
            return ResponseEntity.status(401).build();
            
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}
