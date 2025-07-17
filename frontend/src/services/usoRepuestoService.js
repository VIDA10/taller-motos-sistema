import api from './api'

/**
 * Servicio para gestión de uso de repuestos
 * Conecta con el endpoint /api/usos-repuesto del backend
 */
const usoRepuestoService = {
  
  /**
   * Crear nuevo uso de repuesto (agregar repuesto a orden)
   */
  async crear(usoRepuesto) {
    try {
      const response = await api.post('/usos-repuesto', usoRepuesto)
      return {
        success: true,
        data: response.data,
        message: 'Repuesto agregado a la orden exitosamente'
      }
    } catch (error) {
      console.error('Error al crear uso de repuesto:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al agregar repuesto a la orden'
      }
    }
  },

  /**
   * Obtener uso de repuesto por ID
   */
  async obtenerPorId(id) {
    try {
      const response = await api.get(`/usos-repuesto/${id}`)
      return {
        success: true,
        data: response.data,
        message: 'Uso de repuesto obtenido exitosamente'
      }
    } catch (error) {
      console.error('Error al obtener uso de repuesto:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al obtener uso de repuesto'
      }
    }
  },

  /**
   * Obtener todos los usos de repuesto
   */
  async obtenerTodos() {
    try {
      const response = await api.get('/usos-repuesto')
      return {
        success: true,
        data: response.data,
        message: 'Usos de repuesto obtenidos exitosamente'
      }
    } catch (error) {
      console.error('Error al obtener usos de repuesto:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener usos de repuesto'
      }
    }
  },

  /**
   * Actualizar uso de repuesto
   */
  async actualizar(id, usoRepuesto) {
    try {
      const response = await api.put(`/usos-repuesto/${id}`, usoRepuesto)
      return {
        success: true,
        data: response.data,
        message: 'Uso de repuesto actualizado exitosamente'
      }
    } catch (error) {
      console.error('Error al actualizar uso de repuesto:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al actualizar uso de repuesto'
      }
    }
  },

  /**
   * Eliminar uso de repuesto (quitar repuesto de orden)
   */
  async eliminar(id) {
    try {
      await api.delete(`/usos-repuesto/${id}`)
      return {
        success: true,
        data: null,
        message: 'Repuesto removido de la orden exitosamente'
      }
    } catch (error) {
      console.error('Error al eliminar uso de repuesto:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al remover repuesto de la orden'
      }
    }
  },

  /**
   * Buscar usos de repuesto por orden de trabajo
   */
  async buscarPorOrden(idOrden) {
    try {
      const response = await api.get(`/usos-repuesto/buscar-por-orden-nativo/${idOrden}`)
      return {
        success: true,
        data: response.data,
        message: 'Repuestos de la orden obtenidos exitosamente'
      }
    } catch (error) {
      console.error('Error al buscar usos por orden:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener repuestos de la orden'
      }
    }
  },

  /**
   * Buscar usos de repuesto por repuesto específico
   */
  async buscarPorRepuesto(idRepuesto) {
    try {
      const response = await api.get(`/usos-repuesto/buscar-por-repuesto/${idRepuesto}`)
      return {
        success: true,
        data: response.data,
        message: 'Órdenes con este repuesto obtenidas exitosamente'
      }
    } catch (error) {
      console.error('Error al buscar usos por repuesto:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener órdenes con este repuesto'
      }
    }
  },

  /**
   * Calcular total de repuestos para una orden
   */
  async calcularTotalRepuestos(idOrden) {
    try {
      const response = await api.get(`/usos-repuesto/calcular-total-repuestos/${idOrden}`)
      return {
        success: true,
        data: response.data,
        message: 'Total calculado exitosamente'
      }
    } catch (error) {
      console.error('Error al calcular total de repuestos:', error)
      return {
        success: false,
        data: 0,
        message: error.response?.data?.message || 'Error al calcular total de repuestos'
      }
    }
  },

  /**
   * Obtener resumen de repuestos por orden (agrupado)
   */
  async obtenerResumenPorOrden(idOrden) {
    try {
      const response = await api.get(`/usos-repuesto/resumen/${idOrden}`)
      return {
        success: true,
        data: response.data,
        message: 'Resumen obtenido exitosamente'
      }
    } catch (error) {
      console.error('Error al obtener resumen de repuestos:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener resumen de repuestos'
      }
    }
  },

  /**
   * Verificar stock disponible antes de usar repuesto
   */
  async verificarStock(idRepuesto, cantidad) {
    try {
      const response = await api.get(`/usos-repuesto/verificar-stock/${idRepuesto}/${cantidad}`)
      return {
        success: true,
        data: response.data,
        message: 'Verificación de stock completada'
      }
    } catch (error) {
      console.error('Error al verificar stock:', error)
      return {
        success: false,
        data: false,
        message: error.response?.data?.message || 'Error al verificar stock'
      }
    }
  },

  /**
   * Buscar usos por rango de fechas
   */
  async buscarPorFechas(fechaDesde, fechaHasta) {
    try {
      const response = await api.get(`/usos-repuesto/buscar-por-fechas`, {
        params: { fechaDesde, fechaHasta }
      })
      return {
        success: true,
        data: response.data,
        message: 'Usos por fechas obtenidos exitosamente'
      }
    } catch (error) {
      console.error('Error al buscar usos por fechas:', error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener usos por fechas'
      }
    }
  }
}

export default usoRepuestoService
