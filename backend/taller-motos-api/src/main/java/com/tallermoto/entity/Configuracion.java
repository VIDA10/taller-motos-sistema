package com.tallermoto.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entidad Configuracion del Sistema de Gestión de Taller de Motos
 * Mapea la tabla 'configuraciones' de PostgreSQL
 */
@Entity
@Table(name = "configuraciones")
public class Configuracion {

    @Id
    @NotBlank(message = "La clave es obligatoria")
    @Size(max = 100, message = "La clave no puede exceder 100 caracteres")
    @Column(name = "clave", length = 100)
    private String clave;

    @NotNull(message = "El valor es obligatorio")
    @Column(name = "valor", columnDefinition = "TEXT", nullable = false)
    private String valor;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Size(max = 20, message = "El tipo de dato no puede exceder 20 caracteres")
    @Column(name = "tipo_dato", length = 20, nullable = false)
    private String tipoDato = "STRING";

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Constructores
    public Configuracion() {}

    public Configuracion(String clave, String valor, String descripcion, String tipoDato) {
        this.clave = clave;
        this.valor = valor;
        this.descripcion = descripcion;
        this.tipoDato = tipoDato != null ? tipoDato : "STRING";
    }

    public Configuracion(String clave, String valor, String descripcion) {
        this(clave, valor, descripcion, "STRING");
    }

    // Getters y Setters
    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getValor() {
        return valor;
    }

    public void setValor(String valor) {
        this.valor = valor;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getTipoDato() {
        return tipoDato;
    }

    public void setTipoDato(String tipoDato) {
        this.tipoDato = tipoDato;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Configuracion{" +
                "clave='" + clave + '\'' +
                ", valor='" + valor + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", tipoDato='" + tipoDato + '\'' +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
