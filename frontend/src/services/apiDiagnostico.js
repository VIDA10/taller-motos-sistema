/**
 * Utilidad para verificar la configuración de la API y diagnosticar problemas
 */

import api from './api'

const apiDiagnostico = {
  
  /**
   * Verifica la configuración básica de la API
   */
  verificarConfiguracion() {
    console.log('🔍 Verificando configuración de API...')
    console.log('📍 Base URL:', api.defaults.baseURL)
    console.log('⏱️ Timeout:', api.defaults.timeout)
    console.log('📋 Headers por defecto:', api.defaults.headers)
    
    const token = localStorage.getItem('token')
    console.log('🔑 Token presente:', !!token)
    console.log('🔑 Longitud del token:', token?.length || 0)
    
    return {
      baseURL: api.defaults.baseURL,
      timeout: api.defaults.timeout,
      tieneToken: !!token,
      longitudToken: token?.length || 0
    }
  },

  /**
   * Prueba la conectividad con endpoints específicos
   */
  async probarConectividad(endpoints = ['/ordenes-trabajo', '/clientes', '/motos']) {
    console.log('🧪 Probando conectividad con endpoints...')
    
    const resultados = {}
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Probando ${endpoint}...`)
        const startTime = Date.now()
        
        // Hacer una petición HEAD para verificar conectividad sin descargar datos
        const response = await api.head(endpoint)
        const endTime = Date.now()
        
        resultados[endpoint] = {
          estado: 'éxito',
          status: response.status,
          tiempoRespuesta: endTime - startTime,
          headers: response.headers
        }
        
        console.log(`✅ ${endpoint}: ${response.status} (${endTime - startTime}ms)`)
        
      } catch (error) {
        const endTime = Date.now()
        
        resultados[endpoint] = {
          estado: 'error',
          status: error.response?.status || 0,
          mensaje: error.message,
          tiempoRespuesta: endTime - startTime
        }
        
        console.log(`❌ ${endpoint}: ${error.response?.status || 'Sin respuesta'} - ${error.message}`)
      }
    }
    
    return resultados
  },

  /**
   * Genera un reporte completo de diagnóstico
   */
  async generarReporteCompleto() {
    console.log('📊 Generando reporte completo de diagnóstico...')
    
    const configuracion = this.verificarConfiguracion()
    const conectividad = await this.probarConectividad()
    
    const reporte = {
      timestamp: new Date().toISOString(),
      configuracion,
      conectividad,
      resumen: {
        endpointsOperativos: Object.values(conectividad).filter(r => r.estado === 'éxito').length,
        endpointsConProblemas: Object.values(conectividad).filter(r => r.estado === 'error').length,
        tiempoPromedioRespuesta: Object.values(conectividad)
          .filter(r => r.estado === 'éxito')
          .reduce((acc, r) => acc + r.tiempoRespuesta, 0) / 
          Object.values(conectividad).filter(r => r.estado === 'éxito').length || 0
      }
    }
    
    console.log('📊 Reporte de diagnóstico:', reporte)
    return reporte
  },

  /**
   * Solución rápida para problemas comunes
   */
  async intentarSolucionRapida() {
    console.log('🔧 Intentando solución rápida...')
    
    // Verificar y limpiar token si está corrupto
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const ahora = Date.now() / 1000
        
        if (payload.exp <= ahora) {
          console.log('⚠️ Token expirado, removiendo...')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          return { accion: 'token_expirado_removido', requiereLogin: true }
        }
      } catch (error) {
        console.log('⚠️ Token corrupto, removiendo...')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return { accion: 'token_corrupto_removido', requiereLogin: true }
      }
    }
    
    // Prueba de conectividad básica
    try {
      await api.get('/servicios')
      return { accion: 'conectividad_ok', requiereLogin: false }
    } catch (error) {
      if (error.response?.status === 403) {
        return { accion: 'problema_permisos', requiereLogin: true }
      }
      return { accion: 'problema_conexion', requiereLogin: false }
    }
  }
}

export default apiDiagnostico
