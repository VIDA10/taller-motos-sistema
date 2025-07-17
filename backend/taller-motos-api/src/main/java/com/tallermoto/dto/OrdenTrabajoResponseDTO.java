package com.tallermoto.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para respuestas de orden de trabajo
 * Incluye información completa sin relaciones pesadas
 */
public class OrdenTrabajoResponseDTO {

    private Long idOrden;
    private String numeroOrden;
    private Long idMoto;
    private String placaMoto;
    private String marcaMoto;
    private String modeloMoto;
    private Long idCliente;
    private String nombreCliente;
    private Long idUsuarioCreador;
    private String nombreUsuarioCreador;
    private Long idMecanicoAsignado;
    private String nombreMecanicoAsignado;
    private LocalDateTime fechaIngreso;
    private LocalDate fechaEstimadaEntrega;
    private String estado;
    private String prioridad;
    private String descripcionProblema;
    private String diagnostico;
    private String observaciones;
    private BigDecimal totalServicios;
    private BigDecimal totalRepuestos;
    private BigDecimal totalOrden;
    private String estadoPago;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor vacío
    public OrdenTrabajoResponseDTO() {}

    // Constructor básico desde entidad
    public OrdenTrabajoResponseDTO(com.tallermoto.entity.OrdenTrabajo ordenTrabajo) {
        this.idOrden = ordenTrabajo.getIdOrden();
        this.numeroOrden = ordenTrabajo.getNumeroOrden();
        this.fechaIngreso = ordenTrabajo.getFechaIngreso();
        this.fechaEstimadaEntrega = ordenTrabajo.getFechaEstimadaEntrega();
        this.estado = ordenTrabajo.getEstado();
        this.prioridad = ordenTrabajo.getPrioridad();
        this.descripcionProblema = ordenTrabajo.getDescripcionProblema();
        this.diagnostico = ordenTrabajo.getDiagnostico();
        this.observaciones = ordenTrabajo.getObservaciones();
        this.totalServicios = ordenTrabajo.getTotalServicios();
        this.totalRepuestos = ordenTrabajo.getTotalRepuestos();
        this.totalOrden = ordenTrabajo.getTotalOrden();
        this.estadoPago = ordenTrabajo.getEstadoPago();
        this.createdAt = ordenTrabajo.getCreatedAt();
        this.updatedAt = ordenTrabajo.getUpdatedAt();
        
        // Relaciones básicas (solo IDs para evitar lazy loading issues)
        if (ordenTrabajo.getMoto() != null) {
            this.idMoto = ordenTrabajo.getMoto().getIdMoto();
            this.placaMoto = ordenTrabajo.getMoto().getPlaca();
            this.marcaMoto = ordenTrabajo.getMoto().getMarca();
            this.modeloMoto = ordenTrabajo.getMoto().getModelo();
            
            if (ordenTrabajo.getMoto().getCliente() != null) {
                this.idCliente = ordenTrabajo.getMoto().getCliente().getIdCliente();
                this.nombreCliente = ordenTrabajo.getMoto().getCliente().getNombre();
            }
        }
        
        if (ordenTrabajo.getUsuarioCreador() != null) {
            this.idUsuarioCreador = ordenTrabajo.getUsuarioCreador().getIdUsuario();
            this.nombreUsuarioCreador = ordenTrabajo.getUsuarioCreador().getNombreCompleto();
        }
        
        if (ordenTrabajo.getMecanicoAsignado() != null) {
            this.idMecanicoAsignado = ordenTrabajo.getMecanicoAsignado().getIdUsuario();
            this.nombreMecanicoAsignado = ordenTrabajo.getMecanicoAsignado().getNombreCompleto();
        }
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

    public Long getIdMoto() {
        return idMoto;
    }

    public void setIdMoto(Long idMoto) {
        this.idMoto = idMoto;
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

    public String getModeloMoto() {
        return modeloMoto;
    }

    public void setModeloMoto(String modeloMoto) {
        this.modeloMoto = modeloMoto;
    }

    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public Long getIdUsuarioCreador() {
        return idUsuarioCreador;
    }

    public void setIdUsuarioCreador(Long idUsuarioCreador) {
        this.idUsuarioCreador = idUsuarioCreador;
    }

    public String getNombreUsuarioCreador() {
        return nombreUsuarioCreador;
    }

    public void setNombreUsuarioCreador(String nombreUsuarioCreador) {
        this.nombreUsuarioCreador = nombreUsuarioCreador;
    }

    public Long getIdMecanicoAsignado() {
        return idMecanicoAsignado;
    }

    public void setIdMecanicoAsignado(Long idMecanicoAsignado) {
        this.idMecanicoAsignado = idMecanicoAsignado;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "OrdenTrabajoResponseDTO{" +
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
