/**
 * Servicio para verificar permisos y manejar errores de autorización
 * Especialmente útil para dashboards que requieren acceso a múltiples recursos
 */

import { store } from '../store/store'

const permisosService = {
  
  /**
   * Verifica si el usuario actual tiene un rol específico
   */
  tieneRol(rol) {
    const state = store.getState()
    const usuario = state.auth.user
    return usuario && usuario.rol === rol
  },

  /**
   * Verifica si el token está presente y válido
   */
  tieneTokenValido() {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    try {
      // Verificar si el token no está expirado
      const payload = JSON.parse(atob(token.split('.')[1]))
      const ahora = Date.now() / 1000
      return payload.exp > ahora
    } catch (error) {
      console.error('Error al verificar token:', error)
      return false
    }
  },

  /**
   * Obtiene los permisos del usuario actual
   */
  obtenerPermisosUsuario() {
    const state = store.getState()
    const usuario = state.auth.user
    
    if (!usuario) return []
    
    // Mapear roles a permisos específicos
    const permisosPorRol = {
      'ADMIN': ['ordenes', 'clientes', 'motos', 'pagos', 'servicios', 'repuestos', 'reportes', 'usuarios'],
      'RECEPCIONISTA': ['ordenes', 'clientes', 'motos', 'pagos', 'servicios', 'repuestos', 'reportes'],
      'MECANICO': ['ordenes', 'motos', 'repuestos', 'servicios']
    }
    
    return permisosPorRol[usuario.rol] || []
  },

  /**
   * Verifica si el usuario puede acceder a un recurso específico
   */
  puedeAcceder(recurso) {
    const permisos = this.obtenerPermisosUsuario()
    return permisos.includes(recurso)
  },

  /**
   * Obtiene información de diagnóstico para debugging
   */
  obtenerDiagnostico() {
    const state = store.getState()
    const usuario = state.auth.user
    const token = localStorage.getItem('token')
    
    return {
      usuarioLogueado: !!usuario,
      tieneToken: !!token,
      tokenValido: this.tieneTokenValido(),
      rolUsuario: usuario?.rol || 'Sin rol',
      permisos: this.obtenerPermisosUsuario(),
      timestamp: new Date().toISOString()
    }
  }
}

export default permisosService
