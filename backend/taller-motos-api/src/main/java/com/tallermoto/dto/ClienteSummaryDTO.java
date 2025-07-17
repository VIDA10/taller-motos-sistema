package com.tallermoto.dto;

/**
 * DTO de resumen para Cliente
 * Contiene solo la información esencial para listados y búsquedas
 */
public class ClienteSummaryDTO {

    private Long id;
    private String nombre;
    private String telefono;
    private String email;
    private Boolean activo;

    // Constructores
    public ClienteSummaryDTO() {}

    public ClienteSummaryDTO(Long id, String nombre, String telefono, String email, Boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.telefono = telefono;
        this.email = email;
        this.activo = activo;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    @Override
    public String toString() {
        return "ClienteSummaryDTO{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", telefono='" + telefono + '\'' +
                ", email='" + email + '\'' +
                ", activo=" + activo +
                '}';
    }
}
