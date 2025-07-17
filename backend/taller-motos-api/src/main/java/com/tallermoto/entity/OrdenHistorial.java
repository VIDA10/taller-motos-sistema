package com.tallermoto.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * Entidad OrdenHistorial del Sistema de Gestión de Taller de Motos
 * Mapea la tabla 'orden_historial' de PostgreSQL
 */
@Entity
@Table(name = "orden_historial")
public class OrdenHistorial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Long idHistorial;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_orden", nullable = false)
    @NotNull(message = "La orden de trabajo es obligatoria")
    private OrdenTrabajo ordenTrabajo;

    @Size(max = 20, message = "El estado anterior no puede exceder 20 caracteres")
    @Column(name = "estado_anterior", length = 20)
    private String estadoAnterior;

    @NotBlank(message = "El estado nuevo es obligatorio")
    @Size(max = 20, message = "El estado nuevo no puede exceder 20 caracteres")
    @Column(name = "estado_nuevo", length = 20, nullable = false)
    private String estadoNuevo;

    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_cambio", nullable = false)
    @NotNull(message = "El usuario que realizó el cambio es obligatorio")
    private Usuario usuarioCambio;

    @Column(name = "fecha_cambio", nullable = false)
    @NotNull(message = "La fecha de cambio es obligatoria")
    private LocalDateTime fechaCambio;

    // Constructores
    public OrdenHistorial() {
        this.fechaCambio = LocalDateTime.now();
    }

    public OrdenHistorial(OrdenTrabajo ordenTrabajo, String estadoAnterior, String estadoNuevo, String comentario, Usuario usuarioCambio) {
        this.ordenTrabajo = ordenTrabajo;
        this.estadoAnterior = estadoAnterior;
        this.estadoNuevo = estadoNuevo;
        this.comentario = comentario;
        this.usuarioCambio = usuarioCambio;
        this.fechaCambio = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getIdHistorial() {
        return idHistorial;
    }

    public void setIdHistorial(Long idHistorial) {
        this.idHistorial = idHistorial;
    }

    public OrdenTrabajo getOrdenTrabajo() {
        return ordenTrabajo;
    }

    public void setOrdenTrabajo(OrdenTrabajo ordenTrabajo) {
        this.ordenTrabajo = ordenTrabajo;
    }

    public String getEstadoAnterior() {
        return estadoAnterior;
    }

    public void setEstadoAnterior(String estadoAnterior) {
        this.estadoAnterior = estadoAnterior;
    }

    public String getEstadoNuevo() {
        return estadoNuevo;
    }

    public void setEstadoNuevo(String estadoNuevo) {
        this.estadoNuevo = estadoNuevo;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public Usuario getUsuarioCambio() {
        return usuarioCambio;
    }

    public void setUsuarioCambio(Usuario usuarioCambio) {
        this.usuarioCambio = usuarioCambio;
    }

    public LocalDateTime getFechaCambio() {
        return fechaCambio;
    }

    public void setFechaCambio(LocalDateTime fechaCambio) {
        this.fechaCambio = fechaCambio;
    }

    @Override
    public String toString() {
        return "OrdenHistorial{" +
                "idHistorial=" + idHistorial +
                ", estadoAnterior='" + estadoAnterior + '\'' +
                ", estadoNuevo='" + estadoNuevo + '\'' +
                ", comentario='" + comentario + '\'' +
                ", fechaCambio=" + fechaCambio +
                '}';
    }
}
