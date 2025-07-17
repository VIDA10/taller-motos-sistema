import axios from 'axios'
import { store } from '../store/store'
import { logout } from '../store/slices/authSlice'

// Configuración base de Axios para comunicación con el backend
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Interceptor de Request - Agregar JWT automáticamente
 * Basado en JwtAuthenticationFilter.java que espera: "Authorization: Bearer <token>"
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      // Log solo para endpoints problemáticos
      if (config.url.includes('pagos') || config.url.includes('ordenes-pendientes')) {
        console.log('� Request a endpoint de pagos:', config.method.toUpperCase(), config.url)
      }
    } else {
      console.warn('⚠️ No hay token en localStorage para:', config.url)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Interceptor de Response - Manejo avanzado de errores
 * Basado en errores reales del backend Spring Boot
 * 
 * 🚧 MODO DEBUG: Redirecciones automáticas DESACTIVADAS temporalmente
 * Para facilitar debugging sin ventanas emergentes molestas
 */
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { response } = error
    
    // Sin respuesta del servidor (sin conexión)
    if (!response) {
      console.error('🔴 Error de conectividad:', error.message)
      // 🚧 DESACTIVADO: window.location.href = '/connectivity-error'
      console.warn('🚧 [DEBUG MODE] Redirección a connectivity-error DESACTIVADA')
      return Promise.reject(error)
    }
    
    // Manejo específico por código de error HTTP
    switch (response.status) {
      case 401:
        // Token expirado o inválido
        console.error('🔴 Error 401: Token expirado o inválido')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        store.dispatch(logout())
        
        // 🚧 DESACTIVADO: Solo redirigir si no estamos ya en login
        // if (window.location.pathname !== '/login') {
        //   window.location.href = '/login'
        // }
        console.warn('🚧 [DEBUG MODE] Redirección automática a /login DESACTIVADA')
        break
        
      case 403:
        // Sin permisos - redirigir a página de acceso denegado
        console.error('🔴 Error 403: Sin permisos para acceder')
        // 🚧 DESACTIVADO: if (window.location.pathname !== '/unauthorized') {
        //   window.location.href = '/unauthorized'
        // }
        console.warn('🚧 [DEBUG MODE] Redirección automática a /unauthorized DESACTIVADA')
        break
        
      case 404:
        // Recurso no encontrado
        console.warn('⚠️ Recurso no encontrado:', error.config?.url)
        // No redirigir automáticamente para 404 de API
        break
        
      case 500:
      case 502:
      case 503:
      case 504:
        // Errores del servidor
        console.error('🔴 Error del servidor:', response.status, error.config?.url)
        // 🚧 DESACTIVADO: if (window.location.pathname !== '/server-error') {
        //   window.location.href = '/server-error'
        // }
        console.warn('🚧 [DEBUG MODE] Redirección automática a /server-error DESACTIVADA')
        break
        
      default:
        // Otros errores - log para debugging
        console.error('🔴 Error HTTP:', response.status, error.config?.url)
        break
    }
    
    return Promise.reject(error)
  }
)

export default api
