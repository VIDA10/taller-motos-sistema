import api from './api'

/**
 * Servicio para gestión de historial de órdenes
 * Conecta con el endpoint /api/orden-historial del backend
 */
const ordenHistorialService = {
  
  /**
   * Crear nuevo registro de historial
   */
  async crear(historial) {
    try {
      const response = await api.post('/orden-historial', historial)
      return {
        success: true,
        data: response.data,
        message: 'Historial registrado exitosamente'
      }
    } catch (error) {
      console.error('Error al crear historial:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al registrar historial'
      }
    }
  },

  /**
   * Obtener historial por ID
   */
  async obtenerPorId(id) {
    try {
      const response = await api.get(`/orden-historial/${id}`)
      return {
        success: true,
        data: response.data,
        message: 'Historial obtenido exitosamente'
      }
    } catch (error) {
      console.error('Error al obtener historial:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al obtener historial'
      }
    }
  },

  /**
   * Obtener todo el historial
   */
  async obtenerTodos() {
    try {
      const response = await api.get('/orden-historial')
      return {
        success: true,
        data: response.data,
        message: 'Historial obtenido exitosamente'
      }
    } catch (error) {
      console.error('Error al obtener historial:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener historial'
      }
    }
  },

  /**
   * Buscar historial por orden de trabajo
   */
  async buscarPorOrden(idOrden) {
    try {
      const response = await api.get(`/orden-historial/buscar-por-orden-nativo/${idOrden}`)
      return {
        success: true,
        data: response.data,
        message: 'Historial de la orden obtenido exitosamente'
      }
    } catch (error) {
      console.error('Error al buscar historial por orden:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener historial de la orden'
      }
    }
  },

  /**
   * Buscar historial por usuario que realizó cambios
   */
  async buscarPorUsuario(idUsuario) {
    try {
      const response = await api.get(`/orden-historial/buscar-por-usuario/${idUsuario}`)
      return {
        success: true,
        data: response.data,
        message: 'Historial del usuario obtenido exitosamente'
      }
    } catch (error) {
      console.error('Error al buscar historial por usuario:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener historial del usuario'
      }
    }
  },

  /**
   * Buscar historial por estado específico
   */
  async buscarPorEstado(estado) {
    try {
      const response = await api.get(`/orden-historial/buscar-por-estado/${estado}`)
      return {
        success: true,
        data: response.data,
        message: 'Historial por estado obtenido exitosamente'
      }
    } catch (error) {
      console.error('Error al buscar historial por estado:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener historial por estado'
      }
    }
  },

  /**
   * Buscar historial por rango de fechas
   */
  async buscarPorFechas(fechaDesde, fechaHasta) {
    try {
      const response = await api.get(`/orden-historial/buscar-por-fechas`, {
        params: { fechaDesde, fechaHasta }
      })
      return {
        success: true,
        data: response.data,
        message: 'Historial por fechas obtenido exitosamente'
      }
    } catch (error) {
      console.error('Error al buscar historial por fechas:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener historial por fechas'
      }
    }
  },

  /**
   * Registrar cambio de estado automáticamente
   * Utilidad para registrar cambios cuando se actualiza una orden
   */
  async registrarCambioEstado(idOrden, estadoAnterior, estadoNuevo, comentario, idUsuario) {
    try {
      const historial = {
        ordenTrabajo: { idOrden },
        estadoAnterior,
        estadoNuevo,
        comentario,
        usuarioCambio: { idUsuario },
        fechaCambio: new Date().toISOString()
      }
      
      return await this.crear(historial)
    } catch (error) {
      console.error('Error al registrar cambio de estado:', error)
      return {
        success: false,
        data: null,
        message: 'Error al registrar cambio de estado'
      }
    }
  },

  /**
   * Obtener último cambio de estado de una orden
   */
  async obtenerUltimoCambio(idOrden) {
    try {
      const response = await api.get(`/orden-historial/ultimo-cambio/${idOrden}`)
      return {
        success: true,
        data: response.data,
        message: 'Último cambio obtenido exitosamente'
      }
    } catch (error) {
      console.error('Error al obtener último cambio:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al obtener último cambio'
      }
    }
  },

  /**
   * Contar cambios de estado de una orden
   */
  async contarCambios(idOrden) {
    try {
      const response = await api.get(`/orden-historial/contar-cambios/${idOrden}`)
      return {
        success: true,
        data: response.data,
        message: 'Conteo obtenido exitosamente'
      }
    } catch (error) {
      console.error('Error al contar cambios:', error)
      return {
        success: false,
        data: 0,
        message: error.response?.data?.message || 'Error al contar cambios'
      }
    }
  }
}

export default ordenHistorialService
