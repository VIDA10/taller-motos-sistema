package com.tallermoto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuración de seguridad para desarrollo del Taller de Motos
 * 
 * 🔧 DESARROLLO (ACTUAL):
 * - Sin login requerido
 * - Acceso libre a todas las URLs
 * - Facilita desarrollo y pruebas rápidas
 * - Swagger UI accesible sin autenticación
 * 
 * 🔒 PRODUCCIÓN (FUTURO):
 * Para habilitar seguridad real, cambiar:
 * 
 * DE:  .anyRequest().permitAll()
 * A:   .anyRequest().authenticated()
 * 
 * Y agregar:
 * - Sistema de usuarios con roles (ADMIN, RECEPCIONISTA, MECANICO)
 * - JWT tokens o sesiones
 * - Endpoints de login/logout
 * - Protección por roles específicos
 * 
 * EJEMPLO PRODUCCIÓN:
 * .authorizeHttpRequests(auth -> auth
 *     .requestMatchers("/api/admin/**").hasRole("ADMIN")
 *     .requestMatchers("/api/usuarios/**").hasAnyRole("ADMIN", "RECEPCIONISTA")
 *     .requestMatchers("/api/ordenes-trabajo/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")
 *     .anyRequest().authenticated()
 * )
 * 
 * NOTA IMPORTANTE: Este archivo es el "portero" de la aplicación
 * - DESARROLLO: Deja pasar a todos libremente
 * - PRODUCCIÓN: Solo deja pasar con credenciales válidas
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Bean para encriptación de passwords usando BCrypt
     * BCrypt es el estándar recomendado para Spring Security
     * Necesario para el UsuarioService
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 🛡️ Deshabilitar CSRF para APIs REST (necesario para Postman/Swagger)
            .csrf(csrf -> csrf.disable())
            
            // � JWT: Configuración de sesiones sin Estado (stateless)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // � CONFIGURACIÓN JWT: ENDPOINTS PÚBLICOS Y PROTEGIDOS
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos (sin autenticación) - ORDEN MUY IMPORTANTE
                .requestMatchers("/api/auth/**").permitAll() // Todos los endpoints de auth
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()  // Swagger UI
                
                // Para desarrollo: permitir todo temporalmente
                .anyRequest().permitAll()
            );
        
        return http.build();
    }
}
