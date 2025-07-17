package com.tallermoto.dto;

/**
 * DTO para respuestas de login exitoso
 * Contiene el token JWT y información básica del usuario
 */
public class LoginResponseDTO {

    private String token;
    private String tokenType = "Bearer";
    private Long idUsuario;
    private String username;
    private String email;
    private String nombreCompleto;
    private String rol;

    // Constructor vacío
    public LoginResponseDTO() {}

    // Constructor completo
    public LoginResponseDTO(String token, Long idUsuario, String username, String email, 
                           String nombreCompleto, String rol) {
        this.token = token;
        this.idUsuario = idUsuario;
        this.username = username;
        this.email = email;
        this.nombreCompleto = nombreCompleto;
        this.rol = rol;
    }

    // Constructor desde UsuarioResponseDTO
    public LoginResponseDTO(String token, UsuarioResponseDTO usuario) {
        this.token = token;
        this.idUsuario = usuario.getIdUsuario();
        this.username = usuario.getUsername();
        this.email = usuario.getEmail();
        this.nombreCompleto = usuario.getNombreCompleto();
        this.rol = usuario.getRol();
    }

    // Getters y Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    @Override
    public String toString() {
        return "LoginResponseDTO{" +
                "tokenType='" + tokenType + '\'' +
                ", idUsuario=" + idUsuario +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", nombreCompleto='" + nombreCompleto + '\'' +
                ", rol='" + rol + '\'' +
                '}';
    }
}
