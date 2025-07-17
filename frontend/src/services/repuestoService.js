import api from './api'

/**
 * Servicio para gestión de repuestos
 * Conecta con los endpoints del backend /api/repuestos
 */
const repuestoService = {
  // ========== OPERACIONES CRUD ==========
  
  /**
   * Obtener todos los repuestos
   */
  getAll: async () => {
    const response = await api.get('/repuestos')
    return response.data
  },

  /**
   * Obtener repuestos activos
   */
  getActive: async () => {
    const response = await api.get('/repuestos/activo/true')
    return response.data
  },

  /**
   * Obtener repuesto por ID
   */
  getById: async (id) => {
    const response = await api.get(`/repuestos/${id}`)
    return response.data
  },

  /**
   * Crear nuevo repuesto
   */
  create: async (repuesto) => {
    const response = await api.post('/repuestos', repuesto)
    return response.data
  },

  /**
   * Actualizar repuesto
   */
  update: async (id, repuesto) => {
    const response = await api.put(`/repuestos/${id}`, repuesto)
    return response.data
  },

  /**
   * Eliminar repuesto (soft delete)
   */
  delete: async (id) => {
    const response = await api.delete(`/repuestos/${id}`)
    return response.data
  },

  /**
   * Cambiar estado activo/inactivo de repuesto
   */
  toggleActive: async (id, activo) => {
    // Primero obtenemos el repuesto actual
    const repuesto = await repuestoService.getById(id)
    // Actualizamos solo el campo activo
    const repuestoActualizado = { ...repuesto, activo }
    const response = await api.put(`/repuestos/${id}`, repuestoActualizado)
    return response.data
  },

  // ========== CONSULTAS ESPECÍFICAS ==========

  /**
   * Buscar por código
   */
  findByCode: async (codigo) => {
    const response = await api.get(`/repuestos/codigo/${codigo}`)
    return response.data
  },

  /**
   * Verificar si existe código
   */
  existsCode: async (codigo) => {
    const response = await api.get(`/repuestos/codigo/${codigo}/existe`)
    return response.data
  },

  /**
   * Buscar por categoría
   */
  findByCategory: async (categoria) => {
    const response = await api.get(`/repuestos/categoria/${categoria}`)
    return response.data
  },

  /**
   * Obtener categorías activas
   */
  getActiveCategories: async () => {
    const response = await api.get('/repuestos/categorias-activas')
    return response.data
  },

  /**
   * Buscar repuestos con stock bajo
   */
  getLowStock: async () => {
    const response = await api.get('/repuestos/stock-bajo/activos')
    return response.data
  },

  /**
   * Buscar repuestos sin stock
   */
  getWithoutStock: async () => {
    const response = await api.get('/repuestos/sin-stock')
    return response.data
  },

  /**
   * Contar repuestos con stock bajo
   */
  countLowStock: async () => {
    const response = await api.get('/repuestos/stock-bajo/contar/activo/true')
    return response.data
  },

  // ========== UTILIDADES ==========

  /**
   * Formatear precio
   */
  formatPrice: (precio) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio)
  },

  /**
   * Formatear stock
   */
  formatStock: (stock) => {
    return new Intl.NumberFormat('es-PE').format(stock)
  },

  /**
   * Obtener color de categoría
   */
  getCategoryColor: (categoria) => {
    const colors = {
      'MOTOR': '#FF5722',
      'FRENOS': '#F44336', 
      'SUSPENSION': '#9C27B0',
      'ELECTRICO': '#2196F3',
      'CARROCERIA': '#4CAF50',
      'TRANSMISION': '#FF9800',
      'FILTROS': '#795548',
      'LUBRICANTES': '#607D8B',
      'NEUMATICOS': '#424242',
      'ACCESORIOS': '#9E9E9E'
    }
    return colors[categoria] || '#757575'
  },

  /**
   * Obtener estado de stock
   */
  getStockStatus: (stockActual, stockMinimo) => {
    if (stockActual === 0) {
      return { status: 'sin-stock', color: '#f44336', label: 'Sin Stock' }
    } else if (stockActual <= stockMinimo) {
      return { status: 'stock-bajo', color: '#ff9800', label: 'Stock Bajo' }
    } else if (stockActual <= stockMinimo * 2) {
      return { status: 'stock-medio', color: '#ffc107', label: 'Stock Medio' }
    } else {
      return { status: 'stock-alto', color: '#4caf50', label: 'Stock Normal' }
    }
  },

  /**
   * Obtener icono de categoría
   */
  getCategoryIcon: (categoria) => {
    const icons = {
      'MOTOR': 'engineering',
      'FRENOS': 'do_not_disturb_on',
      'SUSPENSION': 'vertical_align_center',
      'ELECTRICO': 'electrical_services',
      'CARROCERIA': 'directions_car',
      'TRANSMISION': 'settings',
      'FILTROS': 'filter_alt',
      'LUBRICANTES': 'opacity',
      'NEUMATICOS': 'trip_origin',
      'ACCESORIOS': 'build'
    }
    return icons[categoria] || 'inventory'
  },

  // ========== MOVIMIENTOS DE INVENTARIO ==========

  /**
   * Obtener todos los movimientos de inventario
   */
  getAllMovimientos: async () => {
    const response = await api.get('/repuesto-movimientos')
    return response.data
  },

  /**
   * Obtener movimientos por repuesto
   */
  getMovimientosByRepuesto: async (repuestoId) => {
    const response = await api.get(`/repuesto-movimientos/buscar-por-repuesto-nativo/${repuestoId}`)
    return response.data
  },

  /**
   * Obtener movimientos por tipo
   */
  getMovimientosByTipo: async (tipoMovimiento) => {
    const response = await api.get(`/repuesto-movimientos/buscar-por-tipo/${tipoMovimiento}`)
    return response.data
  },

  /**
   * Obtener movimientos por tipo entre fechas
   */
  getMovimientosByTipoEntreFechas: async (tipoMovimiento, fechaInicio, fechaFin) => {
    const response = await api.get(`/repuesto-movimientos/buscar-por-tipo-entre-fechas/${tipoMovimiento}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
    return response.data
  },

  /**
   * Obtener movimientos por referencia
   */
  getMovimientosByReferencia: async (referencia) => {
    const response = await api.get(`/repuesto-movimientos/buscar-por-referencia/${referencia}`)
    return response.data
  }
}

export default repuestoService
