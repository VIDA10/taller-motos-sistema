package com.tallermoto.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
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
                
                // Endpoints protegidos por rol - ORDEN ESPECÍFICO A GENERAL
                .requestMatchers("/api/usuarios/**").hasAnyRole("ADMIN", "RECEPCIONISTA")
                .requestMatchers("/api/pagos/**").hasAnyRole("ADMIN", "RECEPCIONISTA")
                
                // Endpoints para MECANICO - TODOS LOS MÉTODOS HTTP
                .requestMatchers(HttpMethod.GET, "/api/clientes/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")
                .requestMatchers(HttpMethod.GET, "/api/motos/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")
                .requestMatchers(HttpMethod.GET, "/api/ordenes-trabajo/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")
                .requestMatchers(HttpMethod.POST, "/api/ordenes-trabajo/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")  // Para buscar órdenes por mecánico
                .requestMatchers(HttpMethod.PUT, "/api/ordenes-trabajo/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")
                .requestMatchers(HttpMethod.GET, "/api/servicios/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")
                .requestMatchers(HttpMethod.GET, "/api/repuestos/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")
                
                // Endpoints DETALLES ORDEN - MECANICO necesita GET y POST
                .requestMatchers("/api/detalles-orden/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")  // Sin especificar método HTTP
                
                // Endpoints USOS REPUESTO - MECANICO necesita TODOS los métodos
                .requestMatchers("/api/usos-repuesto/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")  // Sin especificar método HTTP
                
                // Endpoints ORDEN HISTORIAL - MECANICO necesita GET y POST
                .requestMatchers("/api/orden-historial/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")  // Sin especificar método HTTP
                
                // Todo lo demás requiere autenticación
                .anyRequest().authenticated()
            )
            
            // Configure exception handling for authentication failures
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Authentication required\"}");
                })
            )
            
            // 🔌 Agregar filtro JWT antes del filtro de autenticación por defecto
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
