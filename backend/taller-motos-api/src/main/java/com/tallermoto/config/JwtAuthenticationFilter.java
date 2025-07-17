package com.tallermoto.config;

import com.tallermoto.service.UsuarioService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

/**
 * Filtro de autenticación JWT
 * Intercepta requests y valida tokens JWT en el header Authorization
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UsuarioService usuarioService;    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, 
                                   @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        System.out.println("🔍 JwtAuthenticationFilter - Procesando: " + requestURI);
        
        try {
            String jwt = parseJwt(request);
            System.out.println("📋 Token extraído: " + (jwt != null ? "SÍ (longitud: " + jwt.length() + ")" : "NO"));
            
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUsernameFromJwtToken(jwt);
                String rol = jwtUtils.getRolFromJwtToken(jwt);
                
                System.out.println("✅ Token válido - Usuario: " + username + ", Rol: " + rol);
                
                // Verificar que el usuario existe y está activo
                Optional<com.tallermoto.entity.Usuario> usuarioOpt = usuarioService.buscarActivoPorUsername(username);
                
                if (usuarioOpt.isPresent()) {
                    // 🔧 SOLUCIÓN ROBUSTA: Asegurar que la autoridad SIEMPRE tenga el prefijo 'ROLE_'
                    // para ser compatible con Spring Security, sin importar si el token ya lo incluye.
                    String authorityString = rol.startsWith("ROLE_") ? rol : "ROLE_" + rol;
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority(authorityString);
                    System.out.println("🔐 Autoridad creada: " + authority.getAuthority());
                    
                    // Crear autenticación
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(username, null, Collections.singletonList(authority));
                    
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Establecer en el contexto de seguridad
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("✅ Autenticación establecida correctamente");
                } else {
                    System.err.println("❌ Usuario no encontrado o inactivo: " + username);
                }
            } else {
                System.out.println("❌ Token inválido o no presente");
            }
        } catch (Exception e) {
            System.err.println("❌ Error al procesar JWT: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extraer JWT del header Authorization
     */
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        
        return null;
    }
}
