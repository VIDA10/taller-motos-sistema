package com.tallermoto.mapper;

import com.tallermoto.dto.CreateOrdenTrabajoDTO;
import com.tallermoto.dto.UpdateOrdenTrabajoDTO;
import com.tallermoto.dto.OrdenTrabajoResponseDTO;
import com.tallermoto.dto.OrdenTrabajoSummaryDTO;
import com.tallermoto.entity.OrdenTrabajo;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre entidades OrdenTrabajo y DTOs
 * Centraliza la lógica de conversión y mapeo de campos
 */
@Component
public class OrdenTrabajoMapper {

    /**
     * Convierte CreateOrdenTrabajoDTO a entidad OrdenTrabajo
     * NOTA: Las relaciones (Moto, Usuario) deben ser establecidas en el service
     */
    public OrdenTrabajo toEntity(CreateOrdenTrabajoDTO createDto) {
        if (createDto == null) {
            return null;
        }

        OrdenTrabajo ordenTrabajo = new OrdenTrabajo();
        
        // Campos directos
        ordenTrabajo.setFechaEstimadaEntrega(createDto.getFechaEstimadaEntrega());
        ordenTrabajo.setEstado(createDto.getEstado() != null ? createDto.getEstado() : "RECIBIDA");
        ordenTrabajo.setPrioridad(createDto.getPrioridad() != null ? createDto.getPrioridad() : "NORMAL");
        ordenTrabajo.setDescripcionProblema(createDto.getDescripcionProblema());
        ordenTrabajo.setDiagnostico(createDto.getDiagnostico());
        ordenTrabajo.setObservaciones(createDto.getObservaciones());
        
        // Valores por defecto
        ordenTrabajo.setFechaIngreso(LocalDateTime.now());
        ordenTrabajo.setTotalServicios(BigDecimal.ZERO);
        ordenTrabajo.setTotalRepuestos(BigDecimal.ZERO);
        ordenTrabajo.setTotalOrden(BigDecimal.ZERO);
        ordenTrabajo.setEstadoPago("PENDIENTE");
        
        // NOTA: Los IDs se convierten a entidades en el service:
        // - createDto.getIdMoto() → Moto entity
        // - createDto.getIdUsuarioCreador() → Usuario entity
        // - createDto.getIdMecanicoAsignado() → Usuario entity
        
        return ordenTrabajo;
    }

    /**
     * Aplica cambios de UpdateOrdenTrabajoDTO a entidad OrdenTrabajo existente
     */
    public void updateEntity(UpdateOrdenTrabajoDTO updateDto, OrdenTrabajo ordenTrabajo) {
        if (updateDto == null || ordenTrabajo == null) {
            return;
        }

        // NOTA: idMecanicoAsignado se maneja en el service para buscar la entidad Usuario
        
        if (updateDto.getFechaEstimadaEntrega() != null) {
            ordenTrabajo.setFechaEstimadaEntrega(updateDto.getFechaEstimadaEntrega());
        }
        if (updateDto.getEstado() != null) {
            ordenTrabajo.setEstado(updateDto.getEstado());
        }
        if (updateDto.getPrioridad() != null) {
            ordenTrabajo.setPrioridad(updateDto.getPrioridad());
        }
        if (updateDto.getDescripcionProblema() != null) {
            ordenTrabajo.setDescripcionProblema(updateDto.getDescripcionProblema());
        }
        if (updateDto.getDiagnostico() != null) {
            ordenTrabajo.setDiagnostico(updateDto.getDiagnostico());
        }
        if (updateDto.getObservaciones() != null) {
            ordenTrabajo.setObservaciones(updateDto.getObservaciones());
        }
        if (updateDto.getTotalServicios() != null) {
            ordenTrabajo.setTotalServicios(updateDto.getTotalServicios());
        }
        if (updateDto.getTotalRepuestos() != null) {
            ordenTrabajo.setTotalRepuestos(updateDto.getTotalRepuestos());
        }
        if (updateDto.getTotalOrden() != null) {
            ordenTrabajo.setTotalOrden(updateDto.getTotalOrden());
        }
        if (updateDto.getEstadoPago() != null) {
            ordenTrabajo.setEstadoPago(updateDto.getEstadoPago());
        }
    }

    /**
     * Convierte entidad OrdenTrabajo a OrdenTrabajoResponseDTO
     */
    public OrdenTrabajoResponseDTO toResponseDto(OrdenTrabajo ordenTrabajo) {
        if (ordenTrabajo == null) {
            return null;
        }

        return new OrdenTrabajoResponseDTO(ordenTrabajo);
    }

    /**
     * Convierte entidad OrdenTrabajo a OrdenTrabajoSummaryDTO
     */
    public OrdenTrabajoSummaryDTO toSummaryDto(OrdenTrabajo ordenTrabajo) {
        if (ordenTrabajo == null) {
            return null;
        }

        OrdenTrabajoSummaryDTO summary = new OrdenTrabajoSummaryDTO();
        summary.setIdOrden(ordenTrabajo.getIdOrden());
        summary.setNumeroOrden(ordenTrabajo.getNumeroOrden());
        summary.setFechaIngreso(ordenTrabajo.getFechaIngreso());
        summary.setFechaEstimadaEntrega(ordenTrabajo.getFechaEstimadaEntrega());
        summary.setEstado(ordenTrabajo.getEstado());
        summary.setPrioridad(ordenTrabajo.getPrioridad());
        summary.setTotalOrden(ordenTrabajo.getTotalOrden());
        summary.setEstadoPago(ordenTrabajo.getEstadoPago());
        
        // Información de relaciones básicas
        if (ordenTrabajo.getMoto() != null) {
            summary.setPlacaMoto(ordenTrabajo.getMoto().getPlaca());
            summary.setMarcaMoto(ordenTrabajo.getMoto().getMarca());
            
            if (ordenTrabajo.getMoto().getCliente() != null) {
                summary.setNombreCliente(ordenTrabajo.getMoto().getCliente().getNombre());
            }
        }
        
        if (ordenTrabajo.getMecanicoAsignado() != null) {
            summary.setNombreMecanicoAsignado(ordenTrabajo.getMecanicoAsignado().getNombreCompleto());
        }
        
        return summary;
    }

    /**
     * Convierte lista de entidades OrdenTrabajo a lista de OrdenTrabajoResponseDTO
     */
    public List<OrdenTrabajoResponseDTO> toResponseDtoList(List<OrdenTrabajo> ordenes) {
        if (ordenes == null) {
            return null;
        }

        return ordenes.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Convierte lista de entidades OrdenTrabajo a lista de OrdenTrabajoSummaryDTO
     */
    public List<OrdenTrabajoSummaryDTO> toSummaryDtoList(List<OrdenTrabajo> ordenes) {
        if (ordenes == null) {
            return null;
        }

        return ordenes.stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    /**
     * Convierte OrdenTrabajoResponseDTO a OrdenTrabajoSummaryDTO
     */
    public OrdenTrabajoSummaryDTO responseToSummary(OrdenTrabajoResponseDTO responseDto) {
        if (responseDto == null) {
            return null;
        }

        return new OrdenTrabajoSummaryDTO(responseDto);
    }
}
