package com.tallermoto.mapper;

import com.tallermoto.dto.CreateUsuarioDTO;
import com.tallermoto.dto.UpdateUsuarioDTO;
import com.tallermoto.dto.UsuarioResponseDTO;
import com.tallermoto.entity.Usuario;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre entidades Usuario y DTOs
 * Centraliza la lógica de conversión y mapeo de campos
 */
@Component
public class UsuarioMapper {

    /**
     * Convierte CreateUsuarioDTO a entidad Usuario
     */
    public Usuario toEntity(CreateUsuarioDTO createDto) {
        if (createDto == null) {
            return null;
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(createDto.getUsername());
        usuario.setEmail(createDto.getEmail());
        usuario.setPasswordHash(createDto.getPassword()); // Se encriptará en el service
        usuario.setNombreCompleto(createDto.getNombreCompleto());
        usuario.setRol(createDto.getRol());
        usuario.setActivo(true); // Por defecto activo
        
        return usuario;
    }

    /**
     * Aplica cambios de UpdateUsuarioDTO a entidad Usuario existente
     */
    public void updateEntity(UpdateUsuarioDTO updateDto, Usuario usuario) {
        if (updateDto == null || usuario == null) {
            return;
        }

        if (updateDto.getUsername() != null) {
            usuario.setUsername(updateDto.getUsername());
        }
        if (updateDto.getEmail() != null) {
            usuario.setEmail(updateDto.getEmail());
        }
        if (updateDto.getPassword() != null && !updateDto.getPassword().isEmpty()) {
            usuario.setPasswordHash(updateDto.getPassword()); // Se encriptará en el service
        }
        if (updateDto.getNombreCompleto() != null) {
            usuario.setNombreCompleto(updateDto.getNombreCompleto());
        }
        if (updateDto.getRol() != null) {
            usuario.setRol(updateDto.getRol());
        }
        if (updateDto.getActivo() != null) {
            usuario.setActivo(updateDto.getActivo());
        }
    }

    /**
     * Convierte entidad Usuario a UsuarioResponseDTO
     */
    public UsuarioResponseDTO toResponseDto(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        return new UsuarioResponseDTO(usuario);
    }

    /**
     * Convierte lista de entidades Usuario a lista de UsuarioResponseDTO
     */
    public List<UsuarioResponseDTO> toResponseDtoList(List<Usuario> usuarios) {
        if (usuarios == null) {
            return null;
        }

        return usuarios.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Convierte entidad Usuario a UsuarioResponseDTO básico (sin timestamps)
     * Útil para respuestas que no requieren metadatos completos
     */
    public UsuarioResponseDTO toBasicResponseDto(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setNombreCompleto(usuario.getNombreCompleto());
        dto.setRol(usuario.getRol());
        dto.setActivo(usuario.getActivo());
        dto.setUltimoLogin(usuario.getUltimoLogin());
        
        return dto;
    }
}
