package com.tallermoto.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para listados de órdenes de trabajo
 * Versión resumida con campos esenciales para performance en listados
 */
public class OrdenTrabajoSummaryDTO {

    private Long idOrden;
    private String numeroOrden;
    private String placaMoto;
    private String marcaMoto;
    private String nombreCliente;
    private String nombreMecanicoAsignado;
    private LocalDateTime fechaIngreso;
    private LocalDate fechaEstimadaEntrega;
    private String estado;
    private String prioridad;
    private BigDecimal totalOrden;
    private String estadoPago;

    // Constructor vacío
    public OrdenTrabajoSummaryDTO() {}

    // Constructor completo
    public OrdenTrabajoSummaryDTO(Long idOrden, String numeroOrden, String placaMoto, String marcaMoto,
                                 String nombreCliente, String nombreMecanicoAsignado, 
                                 LocalDateTime fechaIngreso, LocalDate fechaEstimadaEntrega,
                                 String estado, String prioridad, BigDecimal totalOrden, String estadoPago) {
        this.idOrden = idOrden;
        this.numeroOrden = numeroOrden;
        this.placaMoto = placaMoto;
        this.marcaMoto = marcaMoto;
        this.nombreCliente = nombreCliente;
        this.nombreMecanicoAsignado = nombreMecanicoAsignado;
        this.fechaIngreso = fechaIngreso;
        this.fechaEstimadaEntrega = fechaEstimadaEntrega;
        this.estado = estado;
        this.prioridad = prioridad;
        this.totalOrden = totalOrden;
        this.estadoPago = estadoPago;
    }

    // Constructor desde OrdenTrabajoResponseDTO
    public OrdenTrabajoSummaryDTO(OrdenTrabajoResponseDTO ordenCompleta) {
        this.idOrden = ordenCompleta.getIdOrden();
        this.numeroOrden = ordenCompleta.getNumeroOrden();
        this.placaMoto = ordenCompleta.getPlacaMoto();
        this.marcaMoto = ordenCompleta.getMarcaMoto();
        this.nombreCliente = ordenCompleta.getNombreCliente();
        this.nombreMecanicoAsignado = ordenCompleta.getNombreMecanicoAsignado();
        this.fechaIngreso = ordenCompleta.getFechaIngreso();
        this.fechaEstimadaEntrega = ordenCompleta.getFechaEstimadaEntrega();
        this.estado = ordenCompleta.getEstado();
        this.prioridad = ordenCompleta.getPrioridad();
        this.totalOrden = ordenCompleta.getTotalOrden();
        this.estadoPago = ordenCompleta.getEstadoPago();
    }

    // Getters y Setters
    public Long getIdOrden() {
        return idOrden;
    }

    public void setIdOrden(Long idOrden) {
        this.idOrden = idOrden;
    }

    public String getNumeroOrden() {
        return numeroOrden;
    }

    public void setNumeroOrden(String numeroOrden) {
        this.numeroOrden = numeroOrden;
    }

    public String getPlacaMoto() {
        return placaMoto;
    }

    public void setPlacaMoto(String placaMoto) {
        this.placaMoto = placaMoto;
    }

    public String getMarcaMoto() {
        return marcaMoto;
    }

    public void setMarcaMoto(String marcaMoto) {
        this.marcaMoto = marcaMoto;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getNombreMecanicoAsignado() {
        return nombreMecanicoAsignado;
    }

    public void setNombreMecanicoAsignado(String nombreMecanicoAsignado) {
        this.nombreMecanicoAsignado = nombreMecanicoAsignado;
    }

    public LocalDateTime getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDateTime fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
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
        return "OrdenTrabajoSummaryDTO{" +
                "idOrden=" + idOrden +
                ", numeroOrden='" + numeroOrden + '\'' +
                ", placaMoto='" + placaMoto + '\'' +
                ", nombreCliente='" + nombreCliente + '\'' +
                ", estado='" + estado + '\'' +
                ", prioridad='" + prioridad + '\'' +
                ", totalOrden=" + totalOrden +
                ", estadoPago='" + estadoPago + '\'' +
                '}';
    }
}
