package com.tallermoto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de login
 * Contiene solo los campos necesarios para autenticación
 */
public class LoginRequestDTO {

    @NotBlank(message = "El username o email es obligatorio")
    @Size(max = 100, message = "El username o email no puede exceder 100 caracteres")
    private String usernameOrEmail;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(max = 50, message = "La contraseña no puede exceder 50 caracteres")
    private String password;

    // Constructor vacío
    public LoginRequestDTO() {}

    // Constructor completo
    public LoginRequestDTO(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    // Getters y Setters
    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginRequestDTO{" +
                "usernameOrEmail='" + usernameOrEmail + '\'' +
                ", password='[PROTECTED]'" +
                '}';
    }
}
