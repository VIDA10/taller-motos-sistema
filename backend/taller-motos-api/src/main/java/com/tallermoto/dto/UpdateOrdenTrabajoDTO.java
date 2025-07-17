package com.tallermoto.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para actualizar órdenes de trabajo existentes
 * Todos los campos son opcionales para actualización parcial
 */
public class UpdateOrdenTrabajoDTO {

    private Long idMecanicoAsignado;

    private LocalDate fechaEstimadaEntrega;

    @Pattern(regexp = "^(RECIBIDA|DIAGNOSTICADA|EN_PROCESO|COMPLETADA|ENTREGADA|CANCELADA)$", 
             message = "El estado debe ser RECIBIDA, DIAGNOSTICADA, EN_PROCESO, COMPLETADA, ENTREGADA o CANCELADA")
    private String estado;

    @Pattern(regexp = "^(BAJA|NORMAL|ALTA|URGENTE)$", 
             message = "La prioridad debe ser BAJA, NORMAL, ALTA o URGENTE")
    private String prioridad;

    @Size(max = 1000, message = "La descripción del problema no puede exceder 1000 caracteres")
    private String descripcionProblema;

    @Size(max = 1000, message = "El diagnóstico no puede exceder 1000 caracteres")
    private String diagnostico;

    @Size(max = 1000, message = "Las observaciones no pueden exceder 1000 caracteres")
    private String observaciones;

    @DecimalMin(value = "0.0", message = "El total de servicios no puede ser negativo")
    private BigDecimal totalServicios;

    @DecimalMin(value = "0.0", message = "El total de repuestos no puede ser negativo")
    private BigDecimal totalRepuestos;

    @DecimalMin(value = "0.0", message = "El total de la orden no puede ser negativo")
    private BigDecimal totalOrden;

    @Pattern(regexp = "^(PENDIENTE|PARCIAL|COMPLETO)$", 
             message = "El estado de pago debe ser PENDIENTE, PARCIAL o COMPLETO")
    private String estadoPago;

    // Constructor vacío
    public UpdateOrdenTrabajoDTO() {}

    // Getters y Setters
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

    public BigDecimal getTotalServicios() {
        return totalServicios;
    }

    public void setTotalServicios(BigDecimal totalServicios) {
        this.totalServicios = totalServicios;
    }

    public BigDecimal getTotalRepuestos() {
        return totalRepuestos;
    }

    public void setTotalRepuestos(BigDecimal totalRepuestos) {
        this.totalRepuestos = totalRepuestos;
    }

    public BigDecimal getTotalOrden() {
        return totalOrden;
    }

    public void setTotalOrden(BigDecimal totalOrden) {
        this.totalOrden = totalOrden;
    }

    public String getEstadoPago() {
        return estadoPago;
    }

    public void setEstadoPago(String estadoPago) {
        this.estadoPago = estadoPago;
    }

    @Override
    public String toString() {
        return "UpdateOrdenTrabajoDTO{" +
                "idMecanicoAsignado=" + idMecanicoAsignado +
                ", fechaEstimadaEntrega=" + fechaEstimadaEntrega +
                ", estado='" + estado + '\'' +
                ", prioridad='" + prioridad + '\'' +
                ", diagnostico='" + diagnostico + '\'' +
                ", totalOrden=" + totalOrden +
                ", estadoPago='" + estadoPago + '\'' +
                '}';
    }
}
