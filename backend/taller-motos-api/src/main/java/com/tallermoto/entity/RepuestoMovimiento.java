package com.tallermoto.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * Entidad RepuestoMovimiento del Sistema de Gestión de Taller de Motos
 * Mapea la tabla 'repuesto_movimientos' de PostgreSQL
 */
@Entity
@Table(name = "repuesto_movimientos")
public class RepuestoMovimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Long idMovimiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_repuesto", nullable = false)
    @NotNull(message = "El repuesto es obligatorio")
    private Repuesto repuesto;

    @NotBlank(message = "El tipo de movimiento es obligatorio")
    @Size(max = 20, message = "El tipo de movimiento no puede exceder 20 caracteres")
    @Column(name = "tipo_movimiento", length = 20, nullable = false)
    private String tipoMovimiento;

    @NotNull(message = "La cantidad es obligatoria")
    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @NotNull(message = "El stock anterior es obligatorio")
    @Min(value = 0, message = "El stock anterior no puede ser negativo")
    @Column(name = "stock_anterior", nullable = false)
    private Integer stockAnterior;

    @NotNull(message = "El stock nuevo es obligatorio")
    @Min(value = 0, message = "El stock nuevo no puede ser negativo")
    @Column(name = "stock_nuevo", nullable = false)
    private Integer stockNuevo;

    @Size(max = 100, message = "La referencia no puede exceder 100 caracteres")
    @Column(name = "referencia", length = 100)
    private String referencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_movimiento", nullable = false)
    @NotNull(message = "El usuario que realizó el movimiento es obligatorio")
    private Usuario usuarioMovimiento;

    @Column(name = "fecha_movimiento", nullable = false)
    @NotNull(message = "La fecha de movimiento es obligatoria")
    private LocalDateTime fechaMovimiento;

    // Constructores
    public RepuestoMovimiento() {
        this.fechaMovimiento = LocalDateTime.now();
    }

    public RepuestoMovimiento(Repuesto repuesto, String tipoMovimiento, Integer cantidad, Integer stockAnterior, Integer stockNuevo, String referencia, Usuario usuarioMovimiento) {
        this.repuesto = repuesto;
        this.tipoMovimiento = tipoMovimiento;
        this.cantidad = cantidad;
        this.stockAnterior = stockAnterior;
        this.stockNuevo = stockNuevo;
        this.referencia = referencia;
        this.usuarioMovimiento = usuarioMovimiento;
        this.fechaMovimiento = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getIdMovimiento() {
        return idMovimiento;
    }

    public void setIdMovimiento(Long idMovimiento) {
        this.idMovimiento = idMovimiento;
    }

    public Repuesto getRepuesto() {
        return repuesto;
    }

    public void setRepuesto(Repuesto repuesto) {
        this.repuesto = repuesto;
    }

    public String getTipoMovimiento() {
        return tipoMovimiento;
    }

    public void setTipoMovimiento(String tipoMovimiento) {
        this.tipoMovimiento = tipoMovimiento;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Integer getStockAnterior() {
        return stockAnterior;
    }

    public void setStockAnterior(Integer stockAnterior) {
        this.stockAnterior = stockAnterior;
    }

    public Integer getStockNuevo() {
        return stockNuevo;
    }

    public void setStockNuevo(Integer stockNuevo) {
        this.stockNuevo = stockNuevo;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public Usuario getUsuarioMovimiento() {
        return usuarioMovimiento;
    }

    public void setUsuarioMovimiento(Usuario usuarioMovimiento) {
        this.usuarioMovimiento = usuarioMovimiento;
    }

    public LocalDateTime getFechaMovimiento() {
        return fechaMovimiento;
    }

    public void setFechaMovimiento(LocalDateTime fechaMovimiento) {
        this.fechaMovimiento = fechaMovimiento;
    }

    @Override
    public String toString() {
        return "RepuestoMovimiento{" +
                "idMovimiento=" + idMovimiento +
                ", tipoMovimiento='" + tipoMovimiento + '\'' +
                ", cantidad=" + cantidad +
                ", stockAnterior=" + stockAnterior +
                ", stockNuevo=" + stockNuevo +
                ", referencia='" + referencia + '\'' +
                ", fechaMovimiento=" + fechaMovimiento +
                '}';
    }
}
