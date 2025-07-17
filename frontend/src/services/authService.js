import api from './api'

/**
 * Servicio de autenticación basado EXACTAMENTE en AuthController.java
 * Implementa todos los endpoints disponibles sin inventar funcionalidades
 */
export const authService = {
  /**
   * Login usando LoginRequestDTO
   * Endpoint: POST /api/auth/login
   * Request: { usernameOrEmail, password }
   * Response: LoginResponseDTO { token, usuario }
   */
  login: async (usernameOrEmail, password) => {
    try {
      const response = await api.post('/auth/login', {
        usernameOrEmail,
        password,
      })
      return {
        success: true,
        data: response.data, // LoginResponseDTO del backend
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.status === 401 
          ? 'Credenciales inválidas' 
          : 'Error en el servidor',
        status: error.response?.status
      }
    }
  },

  /**
   * Logout
   * Endpoint: POST /api/auth/logout
   * Nota: AuthController.java solo retorna mensaje informativo
   * La limpieza real del token debe hacerse en el cliente
   */
  logout: async () => {
    try {
      const response = await api.post('/auth/logout')
      
      // Limpiar almacenamiento local como indica el backend
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      return {
        success: true,
        message: response.data
      }
    } catch (error) {
      // Limpiar aunque el servidor falle
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      return {
        success: false,
        error: 'Error al hacer logout en el servidor',
        cleaned: true // Indica que se limpió localmente
      }
    }
  },

  /**
   * Validar token con el backend
   * Endpoint: GET /api/auth/validate
   * Header: Authorization: Bearer <token>
   */
  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate')
      return {
        valid: true,
        message: response.data
      }
    } catch (error) {
      return {
        valid: false,
        error: error.response?.data || 'Token inválido',
        status: error.response?.status
      }
    }
  },

  /**
   * Obtener información del usuario actual
   * Endpoint: GET /api/auth/me
   * Header: Authorization: Bearer <token>
   * Response: UsuarioResponseDTO
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      return {
        success: true,
        user: response.data // UsuarioResponseDTO del backend
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Error al obtener usuario',
        status: error.response?.status
      }
    }
  },

  /**
   * Verificar si hay una sesión válida
   * Combina validación local y del backend
   */
  checkSession: async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return { valid: false, reason: 'No hay token almacenado' }
    }

    // Validación local rápida de expiración
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Date.now() / 1000
      
      if (payload.exp < now) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return { valid: false, reason: 'Token expirado' }
      }
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { valid: false, reason: 'Token malformado' }
    }

    // Validación con el backend
    const validation = await this.validateToken()
    if (!validation.valid) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { valid: false, reason: 'Token inválido en el servidor' }
    }

    return { valid: true, message: validation.message }
  },

  /**
   * Obtener claims del token JWT sin validar (solo lectura)
   * Versión simplificada para evitar errores de decodificación
   */
  getTokenClaims: () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return null
    }

    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        return null
      }

      // Decodificación simple del payload
      const payload = JSON.parse(atob(parts[1]))
      
      return {
        username: payload.sub,
        rol: payload.rol,
        idUsuario: payload.idUsuario,
        issuedAt: new Date(payload.iat * 1000),
        expiresAt: new Date(payload.exp * 1000),
        isExpired: payload.exp < (Date.now() / 1000)
      }
    } catch (error) {
      console.error('Error al decodificar token:', error)
      return null
    }
  }
}

export default authService
