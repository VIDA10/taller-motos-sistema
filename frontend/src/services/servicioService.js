import api from './api'

/**
 * Servicio para gestión de servicios del taller
 * Conecta con los endpoints del backend ServicioController
 */
const servicioService = {
  // ========== OPERACIONES CRUD ==========
  
  /**
   * Obtener todos los servicios
   */
  getAll: async () => {
    const response = await api.get('/servicios')
    return response.data
  },

  /**
   * Obtener servicio por ID
   */
  getById: async (id) => {
    const response = await api.get(`/servicios/${id}`)
    return response.data
  },

  /**
   * Crear nuevo servicio
   */
  create: async (servicio) => {
    const response = await api.post('/servicios', servicio)
    return response.data
  },

  /**
   * Actualizar servicio existente
   */
  update: async (id, servicio) => {
    const response = await api.put(`/servicios/${id}`, servicio)
    return response.data
  },

  /**
   * Eliminar servicio (soft delete)
   */
  delete: async (id) => {
    const response = await api.delete(`/servicios/${id}`)
    return response.data
  },

  /**
   * Cambiar estado activo de servicio
   */
  toggleActive: async (id, activo) => {
    // Primero obtenemos el servicio actual
    const servicio = await servicioService.getById(id)
    // Actualizamos solo el campo activo
    const servicioActualizado = { ...servicio, activo }
    const response = await api.put(`/servicios/${id}`, servicioActualizado)
    return response.data
  },

  // ========== CONSULTAS ESPECÍFICAS ==========

  /**
   * Obtener servicios activos
   */
  getActive: async () => {
    const response = await api.get('/servicios/estado/true')
    return response.data
  },

  /**
   * Obtener servicios activos ordenados por nombre
   */
  getActiveOrderedByName: async () => {
    const response = await api.get('/servicios/activos/ordenados/nombre')
    return response.data
  },

  /**
   * Obtener servicios activos ordenados por categoría
   */
  getActiveOrderedByCategory: async () => {
    const response = await api.get('/servicios/activos/ordenados/categoria')
    return response.data
  },

  /**
   * Obtener servicios activos ordenados por precio
   */
  getActiveOrderedByPrice: async () => {
    const response = await api.get('/servicios/activos/ordenados/precio')
    return response.data
  },

  /**
   * Obtener servicios por categoría
   */
  getByCategory: async (categoria) => {
    const response = await api.get(`/servicios/categoria/${categoria}`)
    return response.data
  },

  /**
   * Obtener servicios activos por categoría
   */
  getActiveByCategory: async (categoria) => {
    const response = await api.get(`/servicios/activos/categoria/${categoria}`)
    return response.data
  },

  /**
   * Obtener todas las categorías activas
   */
  getActiveCategories: async () => {
    const response = await api.get('/servicios/categorias/activas')
    return response.data
  },

  /**
   * Buscar servicios activos (búsqueda general)
   */
  searchActive: async (busqueda) => {
    const response = await api.get('/servicios/buscar/activos', {
      params: { busqueda }
    })
    return response.data
  },

  /**
   * Buscar servicios activos por nombre
   */
  searchActiveByName: async (nombre) => {
    const response = await api.get('/servicios/buscar/activos/nombre', {
      params: { nombre }
    })
    return response.data
  },

  /**
   * Buscar servicios por categoría (contiene texto)
   */
  searchByCategory: async (categoria) => {
    const response = await api.get('/servicios/buscar/categoria', {
      params: { categoria }
    })
    return response.data
  },

  /**
   * Obtener servicios por rango de precios
   */
  getByPriceRange: async (precioMin, precioMax) => {
    const response = await api.get('/servicios/precio/rango', {
      params: { precioMin, precioMax }
    })
    return response.data
  },

  /**
   * Obtener servicios por rango de tiempo estimado
   */
  getByTimeRange: async (tiempoMin, tiempoMax) => {
    const response = await api.get('/servicios/tiempo/rango', {
      params: { tiempoMin, tiempoMax }
    })
    return response.data
  },

  /**
   * Verificar si existe código
   */
  existsCode: async (codigo) => {
    const response = await api.get(`/servicios/existe/codigo/${codigo}`)
    return response.data
  },

  /**
   * Buscar servicio por código
   */
  getByCode: async (codigo) => {
    const response = await api.get(`/servicios/codigo/${codigo}`)
    return response.data
  },

  // ========== MÉTODOS DE UTILIDAD ==========

  /**
   * Formatear precio en soles peruanos
   */
  formatPrice: (precio) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio)
  },

  /**
   * Formatear tiempo estimado
   */
  formatTime: (minutos) => {
    if (minutos < 60) {
      return `${minutos} min`
    }
    const horas = Math.floor(minutos / 60)
    const minutosRestantes = minutos % 60
    if (minutosRestantes === 0) {
      return `${horas}h`
    }
    return `${horas}h ${minutosRestantes}min`
  },

  /**
   * Obtener color para la categoría
   */
  getCategoryColor: (categoria) => {
    const colors = {
      'MANTENIMIENTO': '#2196F3', // Azul
      'REPARACION': '#FF9800', // Naranja
      'DIAGNOSTICO': '#9C27B0', // Púrpura
      'INSTALACION': '#4CAF50', // Verde
      'LIMPIEZA': '#00BCD4', // Cian
      'INSPECCION': '#FF5722', // Rojo-naranja
      'AJUSTE': '#795548', // Marrón
      'LUBRICACION': '#607D8B', // Azul gris
      'CAMBIO_ACEITE': '#FFC107', // Ámbar
      'REVISION': '#E91E63' // Rosa
    }
    return colors[categoria] || '#757575' // Gris por defecto
  },

  /**
   * Obtener icono para la categoría
   */
  getCategoryIcon: (categoria) => {
    const icons = {
      'MANTENIMIENTO': 'build',
      'REPARACION': 'handyman',
      'DIAGNOSTICO': 'search',
      'INSTALACION': 'add_circle',
      'LIMPIEZA': 'cleaning_services',
      'INSPECCION': 'visibility',
      'AJUSTE': 'tune',
      'LUBRICACION': 'oil_barrel',
      'CAMBIO_ACEITE': 'local_gas_station',
      'REVISION': 'assignment'
    }
    return icons[categoria] || 'miscellaneous_services'
  }
}

export default servicioService
