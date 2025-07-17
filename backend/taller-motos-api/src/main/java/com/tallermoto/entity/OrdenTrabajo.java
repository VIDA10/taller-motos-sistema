package com.tallermoto.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad OrdenTrabajo del Sistema de Gestión de Taller de Motos
 * Mapea la tabla 'ordenes_trabajo' de PostgreSQL
 */
@Entity
@Table(name = "ordenes_trabajo")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class OrdenTrabajo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden")
    private Long idOrden;

    @Size(max = 20, message = "El número de orden no puede exceder 20 caracteres")
    @Column(name = "numero_orden", length = 20, unique = true, nullable = false)
    private String numeroOrden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_moto", nullable = false)
    @NotNull(message = "La moto es obligatoria")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Moto moto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_creador", nullable = false)
    @NotNull(message = "El usuario creador es obligatorio")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario usuarioCreador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mecanico_asignado")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario mecanicoAsignado;

    @Column(name = "fecha_ingreso", nullable = false)
    @NotNull(message = "La fecha de ingreso es obligatoria")
    private LocalDateTime fechaIngreso;

    @Column(name = "fecha_estimada_entrega")
    private LocalDate fechaEstimadaEntrega;

    @Size(max = 20, message = "El estado no puede exceder 20 caracteres")
    @Column(name = "estado", length = 20, nullable = false)
    private String estado = "RECIBIDA";

    @Size(max = 20, message = "La prioridad no puede exceder 20 caracteres")
    @Column(name = "prioridad", length = 20, nullable = false)
    private String prioridad = "NORMAL";

    @NotBlank(message = "La descripción del problema es obligatoria")
    @Column(name = "descripcion_problema", columnDefinition = "TEXT", nullable = false)
    private String descripcionProblema;

    @Column(name = "diagnostico", columnDefinition = "TEXT")
    private String diagnostico;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @DecimalMin(value = "0.0", message = "El total de servicios no puede ser negativo")
    @Column(name = "total_servicios", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalServicios = BigDecimal.ZERO;

    @DecimalMin(value = "0.0", message = "El total de repuestos no puede ser negativo")
    @Column(name = "total_repuestos", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalRepuestos = BigDecimal.ZERO;

    @DecimalMin(value = "0.0", message = "El total de la orden no puede ser negativo")
    @Column(name = "total_orden", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalOrden = BigDecimal.ZERO;

    @Size(max = 20, message = "El estado de pago no puede exceder 20 caracteres")
    @Column(name = "estado_pago", length = 20, nullable = false)
    private String estadoPago = "PENDIENTE";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Constructores
    public OrdenTrabajo() {
        this.fechaIngreso = LocalDateTime.now();
    }

    public OrdenTrabajo(String numeroOrden, Moto moto, Usuario usuarioCreador, String descripcionProblema) {
        this.numeroOrden = numeroOrden;
        this.moto = moto;
        this.usuarioCreador = usuarioCreador;
        this.descripcionProblema = descripcionProblema;
        this.fechaIngreso = LocalDateTime.now();
        this.estado = "RECIBIDA";
        this.prioridad = "NORMAL";
        this.totalServicios = BigDecimal.ZERO;
        this.totalRepuestos = BigDecimal.ZERO;
        this.totalOrden = BigDecimal.ZERO;
        this.estadoPago = "PENDIENTE";
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

    public Moto getMoto() {
        return moto;
    }

    public void setMoto(Moto moto) {
        this.moto = moto;
    }

    public Usuario getUsuarioCreador() {
        return usuarioCreador;
    }

    public void setUsuarioCreador(Usuario usuarioCreador) {
        this.usuarioCreador = usuarioCreador;
    }

    public Usuario getMecanicoAsignado() {
        return mecanicoAsignado;
    }

    public void setMecanicoAsignado(Usuario mecanicoAsignado) {
        this.mecanicoAsignado = mecanicoAsignado;
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
        return "OrdenTrabajo{" +
                "idOrden=" + idOrden +
                ", numeroOrden='" + numeroOrden + '\'' +
                ", fechaIngreso=" + fechaIngreso +
                ", fechaEstimadaEntrega=" + fechaEstimadaEntrega +
                ", estado='" + estado + '\'' +
                ", prioridad='" + prioridad + '\'' +
                ", descripcionProblema='" + descripcionProblema + '\'' +
                ", totalOrden=" + totalOrden +
                ", estadoPago='" + estadoPago + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
