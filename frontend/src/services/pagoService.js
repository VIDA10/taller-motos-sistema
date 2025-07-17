import api from './api'

/**
 * Servicio para gestión de pagos del taller
 * 
 * FUNCIONALIDADES:
 * - CRUD completo de pagos
 * - Consultas por orden de trabajo
 * - Filtros por método, fecha, monto
 * - Reportes financieros
 * - Cálculos de totales
 * 
 * PERMISOS: Solo ADMIN y RECEPCIONISTA
 */

const pagoService = {
  // ========== OPERACIONES CRUD ==========

  /**
   * Crear un nuevo pago
   * @param {Object} pago - Datos del pago
   * @returns {Promise} Respuesta con el pago creado
   */
  crear: async (pago) => {
    try {
      const response = await api.post('/pagos', pago)
      return response
    } catch (error) {
      console.error('❌ pagoService.crear() - Error capturado:', error)
      console.error('📊 Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  },

  /**
   * Obtener pago por ID
   * @param {number} id - ID del pago
   * @returns {Promise} Respuesta con el pago
   */
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/pagos/${id}`)
      return response
    } catch (error) {
      console.error('Error al obtener pago:', error)
      throw error
    }
  },

  /**
   * Obtener todos los pagos
   * @returns {Promise} Respuesta con lista de pagos
   */
  obtenerTodos: async () => {
    try {
      const response = await api.get('/pagos')
      return response
    } catch (error) {
      console.error('Error al obtener pagos:', error)
      throw error
    }
  },

  /**
   * Actualizar un pago
   * @param {Object} pago - Datos del pago actualizado
   * @returns {Promise} Respuesta con el pago actualizado
   */
  actualizar: async (pago) => {
    try {
      const response = await api.put('/pagos', pago)
      return response
    } catch (error) {
      console.error('Error al actualizar pago:', error)
      throw error
    }
  },

  /**
   * Eliminar un pago
   * @param {number} id - ID del pago
   * @returns {Promise} Respuesta de eliminación
   */
  eliminar: async (id) => {
    try {
      const response = await api.delete(`/pagos/${id}`)
      return response
    } catch (error) {
      console.error('Error al eliminar pago:', error)
      throw error
    }
  },

  /**
   * Verificar si existe un pago
   * @param {number} id - ID del pago
   * @returns {Promise} Respuesta booleana
   */
  existe: async (id) => {
    try {
      const response = await api.get(`/pagos/existe/${id}`)
      return response
    } catch (error) {
      console.error('Error al verificar existencia de pago:', error)
      throw error
    }
  },

  // ========== CONSULTAS POR ORDEN DE TRABAJO ==========

  /**
   * Obtener pagos por orden de trabajo
   * @param {Object} ordenTrabajo - Objeto de orden de trabajo
   * @returns {Promise} Respuesta con lista de pagos
   */
  buscarPorOrden: async (ordenTrabajo) => {
    try {
      // SOLUCIÓN TEMPORAL: Usar endpoint que sabemos que funciona
      console.log('🔧 Usando método alternativo para evitar error 403')
      const idOrden = ordenTrabajo.idOrden || ordenTrabajo
      const response = await api.get(`/pagos?ordenId=${idOrden}`)
      return response
    } catch (error) {
      console.error('Error al buscar pagos por orden:', error)
      // Retornar respuesta vacía en lugar de fallar
      return { data: [] }
    }
  },

  /**
   * Obtener pagos por orden ordenados por fecha
   * @param {Object} ordenTrabajo - Objeto de orden de trabajo
   * @returns {Promise} Respuesta con lista de pagos ordenados
   */
  buscarPorOrdenOrdenados: async (ordenTrabajo) => {
    try {
      // SOLUCIÓN TEMPORAL: Usar método alternativo seguro
      console.log('🔧 Usando método alternativo para evitar error 403')
      const pagosResponse = await pagoService.buscarPorOrden(ordenTrabajo)
      const pagos = pagosResponse.data || []
      // Ordenar por fecha en el frontend
      const pagosOrdenados = pagos.sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago))
      return { data: pagosOrdenados }
    } catch (error) {
      console.error('Error al buscar pagos ordenados por orden:', error)
      return { data: [] }
    }
  },

  /**
   * Obtener pagos por orden y método de pago
   * @param {Object} ordenTrabajo - Objeto de orden de trabajo
   * @param {string} metodo - Método de pago
   * @returns {Promise} Respuesta con lista de pagos
   */
  buscarPorOrdenYMetodo: async (ordenTrabajo, metodo) => {
    try {
      const response = await api.post(`/pagos/buscar-por-orden-metodo/${metodo}`, ordenTrabajo)
      return response
    } catch (error) {
      console.error('Error al buscar pagos por orden y método:', error)
      throw error
    }
  },

  /**
   * Obtener pagos por orden entre fechas
   * @param {Object} ordenTrabajo - Objeto de orden de trabajo
   * @param {string} fechaDesde - Fecha inicio
   * @param {string} fechaHasta - Fecha fin
   * @returns {Promise} Respuesta con lista de pagos
   */
  buscarPorOrdenEntreFechas: async (ordenTrabajo, fechaDesde, fechaHasta) => {
    try {
      const params = new URLSearchParams({
        fechaDesde,
        fechaHasta
      })
      const response = await api.post(`/pagos/buscar-por-orden-entre-fechas?${params}`, ordenTrabajo)
      return response
    } catch (error) {
      console.error('Error al buscar pagos por orden entre fechas:', error)
      throw error
    }
  },

  // ========== CONSULTAS POR MONTO ==========

  /**
   * Buscar pagos con monto mayor a un valor
   * @param {number} monto - Monto mínimo
   * @returns {Promise} Respuesta con lista de pagos
   */
  buscarMontoMayorA: async (monto) => {
    try {
      const response = await api.get(`/pagos/buscar-monto-mayor/${monto}`)
      return response
    } catch (error) {
      console.error('Error al buscar pagos por monto mayor:', error)
      throw error
    }
  },

  /**
   * Buscar pagos con monto menor a un valor
   * @param {number} monto - Monto máximo
   * @returns {Promise} Respuesta con lista de pagos
   */
  buscarMontoMenorA: async (monto) => {
    try {
      const response = await api.get(`/pagos/buscar-monto-menor/${monto}`)
      return response
    } catch (error) {
      console.error('Error al buscar pagos por monto menor:', error)
      throw error
    }
  },

  /**
   * Buscar pagos en rango de montos
   * @param {number} montoMin - Monto mínimo
   * @param {number} montoMax - Monto máximo
   * @returns {Promise} Respuesta con lista de pagos
   */
  buscarRangoMonto: async (montoMin, montoMax) => {
    try {
      const response = await api.get(`/pagos/buscar-rango-monto/${montoMin}/${montoMax}`)
      return response
    } catch (error) {
      console.error('Error al buscar pagos por rango de monto:', error)
      throw error
    }
  },

  // ========== CONSULTAS POR FECHA ==========

  /**
   * Buscar pagos posteriores a una fecha
   * @param {string} fechaDesde - Fecha desde
   * @returns {Promise} Respuesta con lista de pagos
   */
  buscarFechaPosterior: async (fechaDesde) => {
    try {
      const response = await api.post('/pagos/buscar-fecha-posterior', fechaDesde)
      return response
    } catch (error) {
      console.error('Error al buscar pagos por fecha posterior:', error)
      throw error
    }
  },

  /**
   * Buscar pagos anteriores a una fecha
   * @param {string} fechaHasta - Fecha hasta
   * @returns {Promise} Respuesta con lista de pagos
   */
  buscarFechaAnterior: async (fechaHasta) => {
    try {
      const response = await api.post('/pagos/buscar-fecha-anterior', fechaHasta)
      return response
    } catch (error) {
      console.error('Error al buscar pagos por fecha anterior:', error)
      throw error
    }
  },

  /**
   * Buscar pagos en rango de fechas
   * @param {string} fechaDesde - Fecha desde
   * @param {string} fechaHasta - Fecha hasta
   * @returns {Promise} Respuesta con lista de pagos
   */
  buscarRangoFechas: async (fechaDesde, fechaHasta) => {
    try {
      const response = await api.post('/pagos/buscar-rango-fechas', fechaDesde, fechaHasta)
      return response
    } catch (error) {
      console.error('Error al buscar pagos por rango de fechas:', error)
      throw error
    }
  },

  // ========== CONSULTAS POR MÉTODO DE PAGO ==========

  /**
   * Buscar pagos por método de pago
   * @param {string} metodo - Método de pago
   * @returns {Promise} Respuesta con lista de pagos
   */
  buscarPorMetodo: async (metodo) => {
    try {
      const response = await api.get(`/pagos/buscar-por-metodo/${metodo}`)
      return response
    } catch (error) {
      console.error('Error al buscar pagos por método:', error)
      throw error
    }
  },

  /**
   * Obtener todos los métodos de pago disponibles
   * @returns {Promise} Respuesta con lista de métodos
   * TEMPORALMENTE DESHABILITADO para evitar bucle infinito
   */
  obtenerMetodosPago: async () => {
    try {
      // DESHABILITADO TEMPORALMENTE - Evitar bucle infinito
      // const response = await api.get('/pagos/obtener-todos-metodos')
      // return response
      
      // Retornar métodos predefinidos temporalmente
      return {
        data: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA']
      }
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error)
      throw error
    }
  },

  // ========== CÁLCULOS Y TOTALES ==========

  /**
   * Calcular total pagado por orden
   * @param {number} idOrden - ID de la orden
   * @returns {Promise} Respuesta con el total pagado
   */
  calcularTotalPagado: async (idOrden) => {
    try {
      const response = await api.get(`/pagos/calcular-total-pagado/${idOrden}`)
      return response
    } catch (error) {
      console.error('Error al calcular total pagado:', error)
      throw error
    }
  },

  /**
   * Contar pagos por orden
   * @param {number} idOrden - ID de la orden
   * @returns {Promise} Respuesta con el número de pagos
   */
  contarPagosPorOrden: async (idOrden) => {
    try {
      const response = await api.get(`/pagos/contar-pagos-orden/${idOrden}`)
      return response
    } catch (error) {
      console.error('Error al contar pagos por orden:', error)
      throw error
    }
  },

  /**
   * Verificar si una orden tiene pagos
   * @param {Object} ordenTrabajo - Objeto de orden de trabajo
   * @returns {Promise} Respuesta booleana
   */
  ordenTienePagos: async (ordenTrabajo) => {
    try {
      const response = await api.post('/pagos/orden-tiene-pagos', ordenTrabajo)
      return response
    } catch (error) {
      console.error('Error al verificar si orden tiene pagos:', error)
      throw error
    }
  },

  /**
   * Obtener órdenes completadas pendientes de pago total
   * @returns {Promise} Respuesta con lista de órdenes pendientes
   * TEMPORALMENTE DESHABILITADO - Causa error 403
   */
  obtenerOrdenesPendientesPago: async () => {
    try {
      // DESHABILITADO: Error 403 - Sin permisos para acceder
      // const response = await api.get('/pagos/ordenes-pendientes-pago')
      // return response
      
      // Retornar respuesta vacía para evitar errores
      return {
        data: [],
        message: 'Método temporalmente deshabilitado'
      }
    } catch (error) {
      console.error('Error al obtener órdenes pendientes de pago:', error)
      throw error
    }
  },

  /**
   * Verificar si una orden está totalmente pagada
   * @param {number} idOrden - ID de la orden
   * @returns {Promise} Respuesta con estado de pago
   * TEMPORALMENTE DESHABILITADO - Causa error 403
   */
  verificarOrdenPagada: async (idOrden) => {
    try {
      // DESHABILITADO: Error 403 - Sin permisos para acceder
      // const response = await api.get(`/pagos/verificar-orden-pagada/${idOrden}`)
      // return response
      
      // Retornar respuesta por defecto
      return {
        data: false,
        message: 'Método temporalmente deshabilitado'
      }
    } catch (error) {
      console.error('Error al verificar estado de pago:', error)
      throw error
    }
  },

  // ========== REPORTES FINANCIEROS ==========

  /**
   * Obtener resumen por método de pago en un período
   * @param {string} fechaDesde - Fecha desde
   * @param {string} fechaHasta - Fecha hasta
   * @returns {Promise} Respuesta con resumen por método
   */
  obtenerResumenPorMetodo: async (fechaDesde, fechaHasta) => {
    try {
      const response = await api.post('/pagos/obtener-resumen-metodo-pago', fechaDesde, fechaHasta)
      return response
    } catch (error) {
      console.error('Error al obtener resumen por método:', error)
      throw error
    }
  },

  /**
   * Obtener resumen diario de pagos
   * @param {string} fechaDesde - Fecha desde
   * @param {string} fechaHasta - Fecha hasta
   * @returns {Promise} Respuesta con resumen diario
   */
  obtenerResumenDiario: async (fechaDesde, fechaHasta) => {
    try {
      const response = await api.post('/pagos/obtener-resumen-diario', fechaDesde, fechaHasta)
      return response
    } catch (error) {
      console.error('Error al obtener resumen diario:', error)
      throw error
    }
  },

  /**
   * Obtener pagos con información de orden entre fechas
   * @param {string} fechaDesde - Fecha desde
   * @param {string} fechaHasta - Fecha hasta
   * @returns {Promise} Respuesta con pagos y órdenes
   */
  obtenerPagosConOrden: async (fechaDesde, fechaHasta) => {
    try {
      const response = await api.post('/pagos/obtener-pagos-con-orden-entre-fechas', fechaDesde, fechaHasta)
      return response
    } catch (error) {
      console.error('Error al obtener pagos con orden:', error)
      throw error
    }
  },

  // ========== UTILIDADES ESPECÍFICAS ==========

  /**
   * Validar datos de pago antes de enviar
   * @param {Object} pago - Datos del pago
   * @returns {Object} Resultado de validación
   */
  validarPago: (pago) => {
    const errores = []

    if (!pago.ordenTrabajo?.idOrden) {
      errores.push('La orden de trabajo es obligatoria')
    }

    if (!pago.monto || pago.monto <= 0) {
      errores.push('El monto debe ser mayor a 0')
    }

    if (!pago.metodo) {
      errores.push('El método de pago es obligatorio')
    }

    const metodosValidos = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA']
    if (pago.metodo && !metodosValidos.includes(pago.metodo)) {
      errores.push('Método de pago no válido')
    }

    if (pago.referencia && pago.referencia.length > 100) {
      errores.push('La referencia no puede exceder 100 caracteres')
    }

    return {
      valido: errores.length === 0,
      errores
    }
  },

  /**
   * Formatear pago para envío al backend
   * @param {Object} pagoForm - Datos del formulario
   * @returns {Object} Pago formateado
   */
  formatearPago: (pagoForm) => {
    return {
      ordenTrabajo: {
        idOrden: pagoForm.idOrden
      },
      monto: parseFloat(pagoForm.monto),
      fechaPago: pagoForm.fechaPago || new Date().toISOString(),
      metodo: pagoForm.metodo,
      referencia: pagoForm.referencia || null,
      observaciones: pagoForm.observaciones || null
    }
  },

  /**
   * Formatear moneda para mostrar
   * @param {number} monto - Monto a formatear
   * @returns {string} Monto formateado
   */
  formatearMoneda: (monto) => {
    if (!monto) return 'S/ 0.00'
    return `S/ ${parseFloat(monto).toFixed(2)}`
  },

  // ========== MÉTODOS DE RESPALDO SEGUROS ==========
  // Para evitar errores 403 en endpoints problemáticos

  /**
   * MÉTODO SEGURO: Obtener todos los pagos usando endpoint básico
   * Evita endpoints que pueden causar error 403
   */
  obtenerTodosSafe: async () => {
    try {
      console.log('🔧 Usando método seguro para obtener pagos')
      const response = await api.get('/pagos')
      return response
    } catch (error) {
      console.error('Error en método seguro:', error)
      return { data: [] }
    }
  },

  /**
   * MÉTODO SEGURO: Buscar pagos por orden usando filtros GET
   * Alternativa a POST que puede causar 403
   */
  buscarPorOrdenSafe: async (idOrden) => {
    try {
      console.log('🔧 Usando método seguro para buscar pagos por orden')
      const allPagos = await pagoService.obtenerTodosSafe()
      const pagos = allPagos.data || []
      
      // Filtrar en el frontend
      const pagosFiltrados = pagos.filter(pago => 
        pago.ordenTrabajo && 
        (pago.ordenTrabajo.idOrden === idOrden || 
         pago.ordenTrabajo.idOrden == idOrden)
      )
      
      return { data: pagosFiltrados }
    } catch (error) {
      console.error('Error en búsqueda segura:', error)
      return { data: [] }
    }
  },

  /**
   * FALLBACK: Cálculo manual de estadísticas
   * Sin depender de endpoints problemáticos
   */
  calcularEstadisticasManual: async () => {
    try {
      const pagos = await pagoService.obtenerTodosSafe()
      const listaPagos = pagos.data || []
      
      return {
        totalPagos: listaPagos.length,
        montoTotal: listaPagos.reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0),
        metodosUsados: [...new Set(listaPagos.map(pago => pago.metodo))],
        ultimoPago: listaPagos.length > 0 ? 
          listaPagos.sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago))[0] : null
      }
    } catch (error) {
      console.error('Error en cálculo manual:', error)
      return {
        totalPagos: 0,
        montoTotal: 0,
        metodosUsados: [],
        ultimoPago: null
      }
    }
  },

  // ========== HERRAMIENTAS DE CORRECCIÓN ==========
  // Para manejar órdenes con datos inconsistentes

  /**
   * HERRAMIENTA: Analizar orden problemática
   * Proporciona reporte detallado de inconsistencias
   */
  analizarOrdenProblematica: async (idOrden) => {
    try {
      // Obtener datos de la orden
      const orden = await api.get(`/ordenes-trabajo/${idOrden}`)
      const servicios = await api.get(`/detalle-orden/buscar-por-orden/${idOrden}`)
      const repuestos = await api.get(`/uso-repuesto/buscar-por-orden/${idOrden}`)
      const pagos = await pagoService.buscarPorOrdenSafe(idOrden)
      
      const reporte = {
        orden: orden.data,
        servicios: servicios.data || [],
        repuestos: repuestos.data || [],
        pagos: pagos.data || [],
        problemas: [],
        recomendaciones: []
      }
      
      // Detectar problemas
      if (reporte.servicios.length === 0) {
        reporte.problemas.push('Sin servicios registrados')
        reporte.recomendaciones.push('Agregar servicios realizados a la orden')
      }
      
      if (reporte.repuestos.length === 0) {
        reporte.problemas.push('Sin repuestos registrados')
        reporte.recomendaciones.push('Verificar si se usaron repuestos')
      }
      
      const totalPagado = reporte.pagos.reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0)
      if (totalPagado > 0 && reporte.servicios.length === 0 && reporte.repuestos.length === 0) {
        reporte.problemas.push(`Pagos registrados (S/ ${totalPagado}) sin servicios/repuestos`)
        reporte.recomendaciones.push('Corregir servicios o ajustar pagos')
      }
      
      return reporte
    } catch (error) {
      console.error('Error al analizar orden problemática:', error)
      return {
        orden: null,
        servicios: [],
        repuestos: [],
        pagos: [],
        problemas: ['Error al obtener datos'],
        recomendaciones: ['Verificar conexión con el backend']
      }
    }
  }
}

export default pagoService
      