package com.tallermoto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * DTO para crear nuevas órdenes de trabajo
 * Contiene solo los campos obligatorios y necesarios para creación
 */
public class CreateOrdenTrabajoDTO {

    @NotNull(message = "El ID de la moto es obligatorio")
    private Long idMoto;

    @NotNull(message = "El ID del usuario creador es obligatorio")
    private Long idUsuarioCreador;

    private Long idMecanicoAsignado;

    private LocalDate fechaEstimadaEntrega;

    @Pattern(regexp = "^(RECIBIDA|DIAGNOSTICADA|EN_PROCESO|COMPLETADA|ENTREGADA|CANCELADA)$", 
             message = "El estado debe ser RECIBIDA, DIAGNOSTICADA, EN_PROCESO, COMPLETADA, ENTREGADA o CANCELADA")
    private String estado = "RECIBIDA";

    @Pattern(regexp = "^(BAJA|NORMAL|ALTA|URGENTE)$", 
             message = "La prioridad debe ser BAJA, NORMAL, ALTA o URGENTE")
    private String prioridad = "NORMAL";

    @NotBlank(message = "La descripción del problema es obligatoria")
    @Size(max = 1000, message = "La descripción del problema no puede exceder 1000 caracteres")
    private String descripcionProblema;

    @Size(max = 1000, message = "El diagnóstico no puede exceder 1000 caracteres")
    private String diagnostico;

    @Size(max = 1000, message = "Las observaciones no pueden exceder 1000 caracteres")
    private String observaciones;

    // Constructor vacío
    public CreateOrdenTrabajoDTO() {}

    // Constructor básico
    public CreateOrdenTrabajoDTO(Long idMoto, Long idUsuarioCreador, String descripcionProblema) {
        this.idMoto = idMoto;
        this.idUsuarioCreador = idUsuarioCreador;
        this.descripcionProblema = descripcionProblema;
        this.estado = "RECIBIDA";
        this.prioridad = "NORMAL";
    }

    // Getters y Setters
    public Long getIdMoto() {
        return idMoto;
    }

    public void setIdMoto(Long idMoto) {
        this.idMoto = idMoto;
    }

    public Long getIdUsuarioCreador() {
        return idUsuarioCreador;
    }

    public void setIdUsuarioCreador(Long idUsuarioCreador) {
        this.idUsuarioCreador = idUsuarioCreador;
    }

    public Long getIdMecanicoAsignado() {
        return idMecanicoAsignado;
    }

    public void setIdMecanicoAsignado(Long idMecanicoAsignado) {
        this.idMecanicoAsignado = idMecanicoAsignado;
    }

    public LocalDate getFechaEstimadaEntrega() {
        return fechaEstimadaEntrega;
    }

    public void setFechaEstimadaEntrega(LocalDate fechaEstimadaEntrega) {
        this.fechaEstimadaEntrega = fechaEstimadaEntrega;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public String getDescripcionProblema() {
        return descripcionProblema;
    }

    public void setDescripcionProblema(String descripcionProblema) {
        this.descripcionProblema = descripcionProblema;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    @Override
    public String toString() {
        return "CreateOrdenTrabajoDTO{" +
                "idMoto=" + idMoto +
                ", idUsuarioCreador=" + idUsuarioCreador +
                ", idMecanicoAsignado=" + idMecanicoAsignado +
                ", fechaEstimadaEntrega=" + fechaEstimadaEntrega +
                ", estado='" + estado + '\'' +
                ", prioridad='" + prioridad + '\'' +
                ", descripcionProblema='" + descripcionProblema + '\'' +
                '}';
    }
}
