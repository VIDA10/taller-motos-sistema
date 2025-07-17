package com.tallermoto.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad DetalleOrden del Sistema de Gestión de Taller de Motos
 * Mapea la tabla 'detalle_orden' de PostgreSQL
 */
@Entity
@Table(name = "detalle_orden", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"id_orden", "id_servicio"})
})
public class DetalleOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long idDetalle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_orden", nullable = false)
    @NotNull(message = "La orden de trabajo es obligatoria")
    private OrdenTrabajo ordenTrabajo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_servicio", nullable = false)
    @NotNull(message = "El servicio es obligatorio")
    private Servicio servicio;

    @NotNull(message = "El precio aplicado es obligatorio")
    @DecimalMin(value = "0.0", message = "El precio aplicado no puede ser negativo")
    @Column(name = "precio_aplicado", precision = 10, scale = 2, nullable = false)
    private BigDecimal precioAplicado;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructores
    public DetalleOrden() {}

    public DetalleOrden(OrdenTrabajo ordenTrabajo, Servicio servicio, BigDecimal precioAplicado, String observaciones) {
        this.ordenTrabajo = ordenTrabajo;
        this.servicio = servicio;
        this.precioAplicado = precioAplicado;
        this.observaciones = observaciones;
    }

    // Getters y Setters
    public Long getIdDetalle() {
        return idDetalle;
    }

    public void setIdDetalle(Long idDetalle) {
        this.idDetalle = idDetalle;
    }

    public OrdenTrabajo getOrdenTrabajo() {
        return ordenTrabajo;
    }

    public void setOrdenTrabajo(OrdenTrabajo ordenTrabajo) {
        this.ordenTrabajo = ordenTrabajo;
    }

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }

    public BigDecimal getPrecioAplicado() {
        return precioAplicado;
    }

    public void setPrecioAplicado(BigDecimal precioAplicado) {
        this.precioAplicado = precioAplicado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "DetalleOrden{" +
                "idDetalle=" + idDetalle +
                ", precioAplicado=" + precioAplicado +
                ", observaciones='" + observaciones + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
