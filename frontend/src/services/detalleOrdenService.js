import api from './api'

/**
 * Servicio para gestión de detalles de orden (servicios aplicados)
 * Conecta con el endpoint /api/detalles-orden del backend
 */
const detalleOrdenService = {
  
  /**
   * Crear nuevo detalle de orden (agregar servicio a orden)
   */
  async crear(detalleOrden) {
    try {
      const response = await api.post('/detalles-orden', detalleOrden)
      return {
        success: true,
        data: response.data,
        message: 'Servicio agregado a la orden exitosamente'
      }
    } catch (error) {
      console.error('Error al crear detalle de orden:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al agregar servicio a la orden'
      }
    }
  },

  /**
   * Obtener detalle de orden por ID
   */
  async obtenerPorId(id) {
    try {
      const response = await api.get(`/detalles-orden/${id}`)
      return {
        success: true,
        data: response.data,
        message: 'Detalle obtenido exitosamente'
      }
    } catch (error) {
      console.error('Error al obtener detalle de orden:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al obtener detalle de orden'
      }
    }
  },

  /**
   * Obtener todos los detalles de orden
   */
  async obtenerTodos() {
    try {
      const response = await api.get('/detalles-orden')
      return {
        success: true,
        data: response.data,
        message: 'Detalles obtenidos exitosamente'
      }
    } catch (error) {
      console.error('Error al obtener detalles de orden:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener detalles de orden'
      }
    }
  },

  /**
   * Actualizar detalle de orden
   */
  async actualizar(id, detalleOrden) {
    try {
      const response = await api.put(`/detalles-orden/${id}`, detalleOrden)
      return {
        success: true,
        data: response.data,
        message: 'Detalle actualizado exitosamente'
      }
    } catch (error) {
      console.error('Error al actualizar detalle de orden:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al actualizar detalle de orden'
      }
    }
  },

  /**
   * Eliminar detalle de orden (quitar servicio de orden)
   */
  async eliminar(id) {
    try {
      await api.delete(`/detalles-orden/${id}`)
      return {
        success: true,
        data: null,
        message: 'Servicio removido de la orden exitosamente'
      }
    } catch (error) {
      console.error('Error al eliminar detalle de orden:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al remover servicio de la orden'
      }
    }
  },

  /**
   * Buscar detalles por orden de trabajo
   */
  async buscarPorOrden(idOrden) {
    try {
      const response = await api.get(`/detalles-orden/buscar-por-orden/${idOrden}/nativo`)
      return {
        success: true,
        data: response.data,
        message: 'Servicios de la orden obtenidos exitosamente'
      }
    } catch (error) {
      console.error('Error al buscar detalles por orden:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener servicios de la orden'
      }
    }
  },

  /**
   * Buscar detalles por servicio
   */
  async buscarPorServicio(idServicio) {
    try {
      const response = await api.get(`/detalles-orden/buscar-por-servicio/${idServicio}`)
      return {
        success: true,
        data: response.data,
        message: 'Órdenes con este servicio obtenidas exitosamente'
      }
    } catch (error) {
      console.error('Error al buscar detalles por servicio:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener órdenes con este servicio'
      }
    }
  },

  /**
   * Calcular total de servicios para una orden
   */
  async calcularTotalServicios(idOrden) {
    try {
      const response = await api.get(`/detalles-orden/calcular-total/${idOrden}`)
      return {
        success: true,
        data: response.data,
        message: 'Total calculado exitosamente'
      }
    } catch (error) {
      console.error('Error al calcular total de servicios:', error)
      return {
        success: false,
        data: 0,
        message: error.response?.data?.message || 'Error al calcular total de servicios'
      }
    }
  },

  /**
   * Verificar si un servicio ya está en una orden
   */
  async verificarServicioEnOrden(idOrden, idServicio) {
    try {
      const response = await api.get(`/detalles-orden/existe/${idOrden}/${idServicio}`)
      return {
        success: true,
        data: response.data,
        message: 'Verificación completada'
      }
    } catch (error) {
      console.error('Error al verificar servicio en orden:', error)
      return {
        success: false,
        data: false,
        message: error.response?.data?.message || 'Error al verificar servicio en orden'
      }
    }
  }
}

export default detalleOrdenService
