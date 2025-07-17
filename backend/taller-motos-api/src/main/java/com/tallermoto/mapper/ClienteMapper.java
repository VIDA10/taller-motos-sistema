package com.tallermoto.mapper;

import com.tallermoto.dto.CreateClienteDTO;
import com.tallermoto.dto.UpdateClienteDTO;
import com.tallermoto.dto.ClienteResponseDTO;
import com.tallermoto.dto.ClienteSummaryDTO;
import com.tallermoto.entity.Cliente;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre entidad Cliente y sus DTOs
 * Basado en las operaciones definidas en ClienteController y ClienteService
 */
@Component
public class ClienteMapper {

    /**
     * Convierte CreateClienteDTO a entidad Cliente
     */
    public Cliente toEntity(CreateClienteDTO dto) {
        if (dto == null) {
            return null;
        }

        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEmail(dto.getEmail());
        cliente.setDni(dto.getDni());
        cliente.setDireccion(dto.getDireccion());
        cliente.setActivo(true); // Por defecto activo al crear

        return cliente;
    }

    /**
     * Actualiza una entidad Cliente existente con los datos de UpdateClienteDTO
     */
    public void updateEntity(Cliente cliente, UpdateClienteDTO dto) {
        if (cliente == null || dto == null) {
            return;
        }

        cliente.setNombre(dto.getNombre());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEmail(dto.getEmail());
        cliente.setDni(dto.getDni());
        cliente.setDireccion(dto.getDireccion());
        if (dto.getActivo() != null) {
            cliente.setActivo(dto.getActivo());
        }
        // updatedAt se actualiza automáticamente por @UpdateTimestamp
    }

    /**
     * Convierte entidad Cliente a ClienteResponseDTO
     */
    public ClienteResponseDTO toResponseDTO(Cliente cliente) {
        if (cliente == null) {
            return null;
        }

        return new ClienteResponseDTO(
                cliente.getIdCliente(),
                cliente.getNombre(),
                cliente.getTelefono(),
                cliente.getEmail(),
                cliente.getDni(),
                cliente.getDireccion(),
                cliente.getActivo(),
                cliente.getCreatedAt(),
                cliente.getUpdatedAt()
        );
    }

    /**
     * Convierte entidad Cliente a ClienteSummaryDTO
     */
    public ClienteSummaryDTO toSummaryDTO(Cliente cliente) {
        if (cliente == null) {
            return null;
        }

        return new ClienteSummaryDTO(
                cliente.getIdCliente(),
                cliente.getNombre(),
                cliente.getTelefono(),
                cliente.getEmail(),
                cliente.getActivo()
        );
    }
}
