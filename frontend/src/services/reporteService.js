import api from './api'

/**
 * Servicio de Reportes y Auditoría
 * Utiliza SOLO endpoints existentes del backend para generar reportes
 * Basado en análisis exhaustivo de controllers disponibles
 */
class ReporteService {

  // ===============================
  // 9.1 REPORTES POR FECHAS DE CREACIÓN
  // ===============================

  /**
   * Obtener reportes de creación por módulo y período
   */
  async obtenerReporteCreacionPorPeriodo(modulo, fechaDesde, fechaHasta) {
    try {
      const endpoint = this.getEndpointPorModulo(modulo)
      
      // Usar endpoints existentes con filtros de fecha
      const response = await api.get(endpoint, {
        params: {
          fechaDesde: fechaDesde,
          fechaHasta: fechaHasta
        }
      })

      return this.procesarDatosParaReporte(response.data, 'creacion')
    } catch (error) {
      console.error(`Error al obtener reporte de creación para ${modulo}:`, error)
      throw new Error(`No se pudo generar el reporte de creación para ${modulo}`)
    }
  }

  /**
   * Obtener estadísticas de creación por todas las tablas
   */
  async obtenerEstadisticasCreacionGeneral(fechaDesde, fechaHasta) {
    try {
      const modulos = ['usuarios', 'clientes', 'motos', 'servicios', 'repuestos', 'ordenes-trabajo', 'pagos']
      const estadisticas = {}

      for (const modulo of modulos) {
        try {
          const datos = await this.obtenerReporteCreacionPorPeriodo(modulo, fechaDesde, fechaHasta)
          estadisticas[modulo] = {
            total: datos.length,
            datos: datos
          }
        } catch (error) {
          estadisticas[modulo] = { total: 0, datos: [], error: error.message }
        }
      }

      return estadisticas
    } catch (error) {
      console.error('Error al obtener estadísticas generales:', error)
      throw new Error('No se pudieron obtener las estadísticas generales')
    }
  }

  // ===============================
  // 9.2 AUDITORÍA DE MODIFICACIONES
  // ===============================

  /**
   * Obtener auditoría de modificaciones usando campos created_at/updated_at
   */
  async obtenerAuditoriaModificaciones(modulo, fechaDesde, fechaHasta) {
    try {
      const endpoint = this.getEndpointPorModulo(modulo)
      const response = await api.get(endpoint)

      // Filtrar registros modificados en el período
      const registrosModificados = response.data.filter(item => {
        if (!item.updatedAt || !item.createdAt) return false
        
        const fechaModificacion = new Date(item.updatedAt)
        const fechaCreacion = new Date(item.createdAt)
        const desde = new Date(fechaDesde)
        const hasta = new Date(fechaHasta)

        // Solo incluir si fue modificado (diferente a creación) y en el período
        return fechaModificacion > fechaCreacion && 
               fechaModificacion >= desde && 
               fechaModificacion <= hasta
      })

      return registrosModificados.map(item => ({
        id: item.id || item.idUsuario || item.idCliente || item.idMoto || item.idOrden,
        modulo: modulo,
        fechaCreacion: item.createdAt,
        fechaModificacion: item.updatedAt,
        tiempoTranscurrido: this.calcularTiempoTranscurrido(item.createdAt, item.updatedAt),
        descripcion: this.generarDescripcionModificacion(item, modulo)
      }))
    } catch (error) {
      console.error(`Error al obtener auditoría de ${modulo}:`, error)
      throw new Error(`No se pudo obtener la auditoría de ${modulo}`)
    }
  }

  // ===============================
  // 9.3 MONITOREO DE ACTIVIDAD DE USUARIOS
  // ===============================

  /**
   * Obtener actividad de usuarios usando campo ultimo_login
   */
  async obtenerActividadUsuarios() {
    try {
      const response = await api.get('/usuarios')
      
      return response.data.map(usuario => ({
        id: usuario.idUsuario,
        nombreCompleto: usuario.nombreCompleto,
        username: usuario.username,
        rol: usuario.rol,
        activo: usuario.activo,
        ultimoLogin: usuario.ultimoLogin,
        estadoActividad: this.determinarEstadoActividad(usuario.ultimoLogin),
        diasSinActividad: this.calcularDiasSinActividad(usuario.ultimoLogin)
      }))
    } catch (error) {
      console.error('Error al obtener actividad de usuarios:', error)
      throw new Error('No se pudo obtener la actividad de usuarios')
    }
  }

  // ===============================
  // 9.4 ESTADÍSTICAS DE SERVICIOS Y REPUESTOS
  // ===============================

  /**
   * Obtener estadísticas de servicios
   */
  async obtenerEstadisticasServicios() {
    try {
      const [servicios, detallesOrden] = await Promise.all([
        api.get('/servicios'),
        api.get('/detalles-orden')
      ])

      const serviciosData = servicios.data
      const detallesData = detallesOrden.data

      // Calcular estadísticas de uso de servicios
      const estadisticasServicios = serviciosData.map(servicio => {
        const usosEnOrdenes = detallesData.filter(detalle => 
          detalle.servicio && detalle.servicio.idServicio === servicio.idServicio
        )

        return {
          ...servicio,
          vecesUtilizado: usosEnOrdenes.length,
          ingresoTotal: usosEnOrdenes.reduce((total, detalle) => 
            total + (detalle.precioUnitario * detalle.cantidad), 0
          )
        }
      })

      return {
        servicios: estadisticasServicios,
        totalServicios: serviciosData.length,
        serviciosActivos: serviciosData.filter(s => s.activo).length,
        servicioMasUtilizado: estadisticasServicios.reduce((prev, current) => 
          (prev.vecesUtilizado > current.vecesUtilizado) ? prev : current
        )
      }
    } catch (error) {
      console.error('Error al obtener estadísticas de servicios:', error)
      throw new Error('No se pudieron obtener las estadísticas de servicios')
    }
  }

  /**
   * Obtener estadísticas de repuestos
   */
  async obtenerEstadisticasRepuestos() {
    try {
      const [repuestos, usosRepuesto, movimientos] = await Promise.all([
        api.get('/repuestos'),
        api.get('/usos-repuesto'),
        api.get('/repuesto-movimientos')
      ])

      const repuestosData = repuestos.data
      const usosData = usosRepuesto.data
      const movimientosData = movimientos.data

      const estadisticasRepuestos = repuestosData.map(repuesto => {
        const usos = usosData.filter(uso => 
          uso.repuesto && uso.repuesto.idRepuesto === repuesto.idRepuesto
        )
        
        const movimientosRepuesto = movimientosData.filter(mov => 
          mov.repuesto && mov.repuesto.idRepuesto === repuesto.idRepuesto
        )

        return {
          ...repuesto,
          vecesUtilizado: usos.length,
          totalMovimientos: movimientosRepuesto.length,
          stockBajo: repuesto.stockActual <= repuesto.stockMinimo
        }
      })

      return {
        repuestos: estadisticasRepuestos,
        totalRepuestos: repuestosData.length,
        repuestosStockBajo: estadisticasRepuestos.filter(r => r.stockBajo).length,
        repuestoMasUtilizado: estadisticasRepuestos.reduce((prev, current) => 
          (prev.vecesUtilizado > current.vecesUtilizado) ? prev : current
        )
      }
    } catch (error) {
      console.error('Error al obtener estadísticas de repuestos:', error)
      throw new Error('No se pudieron obtener las estadísticas de repuestos')
    }
  }

  // ===============================
  // 9.5 ANÁLISIS DE INGRESOS POR PERÍODO
  // ===============================

  /**
   * Obtener análisis de ingresos usando endpoint de pagos
   */
  async obtenerAnalisisIngresos(fechaDesde, fechaHasta) {
    try {
      const response = await api.get('/pagos')
      
      // Filtrar pagos en el período especificado
      const pagosPeriodo = response.data.filter(pago => {
        const fechaPago = new Date(pago.createdAt || pago.fechaPago)
        const desde = new Date(fechaDesde)
        const hasta = new Date(fechaHasta)
        
        return fechaPago >= desde && fechaPago <= hasta
      })

      // Calcular estadísticas de ingresos
      const ingresoTotal = pagosPeriodo.reduce((total, pago) => total + pago.monto, 0)
      
      const ingresosPorMetodo = pagosPeriodo.reduce((acc, pago) => {
        acc[pago.metodoPago] = (acc[pago.metodoPago] || 0) + pago.monto
        return acc
      }, {})

      const ingresosPorMes = this.agruparIngresosPorMes(pagosPeriodo)

      return {
        periodo: { fechaDesde, fechaHasta },
        ingresoTotal,
        totalPagos: pagosPeriodo.length,
        promedioIngresoPorPago: pagosPeriodo.length > 0 ? ingresoTotal / pagosPeriodo.length : 0,
        ingresosPorMetodo,
        ingresosPorMes,
        pagosDetallados: pagosPeriodo
      }
    } catch (error) {
      console.error('Error al obtener análisis de ingresos:', error)
      throw new Error('No se pudo obtener el análisis de ingresos')
    }
  }

  // ===============================
  // 9.6 DASHBOARD EJECUTIVO
  // ===============================

  /**
   * Obtener métricas para dashboard ejecutivo
   */
  async obtenerMetricasDashboardEjecutivo() {
    try {
      const [
        usuarios,
        clientes,
        motos,
        ordenes,
        pagos,
        servicios,
        repuestos
      ] = await Promise.all([
        api.get('/usuarios'),
        api.get('/clientes'),
        api.get('/motos'),
        api.get('/ordenes-trabajo'),
        api.get('/pagos'),
        api.get('/servicios'),
        api.get('/repuestos')
      ])

      // Calcular métricas ejecutivas
      const hoy = new Date()
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)

      const ordenesDelMes = ordenes.data.filter(orden => {
        const fechaOrden = new Date(orden.createdAt)
        return fechaOrden >= inicioMes && fechaOrden <= finMes
      })

      const pagosDelMes = pagos.data.filter(pago => {
        const fechaPago = new Date(pago.createdAt)
        return fechaPago >= inicioMes && fechaPago <= finMes
      })

      return {
        resumenGeneral: {
          totalUsuarios: usuarios.data.length,
          usuariosActivos: usuarios.data.filter(u => u.activo).length,
          totalClientes: clientes.data.length,
          clientesActivos: clientes.data.filter(c => c.activo).length,
          totalMotos: motos.data.length,
          motosActivas: motos.data.filter(m => m.activo).length
        },
        operacionesDelMes: {
          totalOrdenes: ordenesDelMes.length,
          ordenesCompletadas: ordenesDelMes.filter(o => o.estado === 'COMPLETADA').length,
          ordenesPendientes: ordenesDelMes.filter(o => 
            ['RECIBIDA', 'DIAGNOSTICADA', 'EN_PROCESO'].includes(o.estado)
          ).length
        },
        financiero: {
          ingresosMes: pagosDelMes.reduce((total, pago) => total + pago.monto, 0),
          totalPagosMes: pagosDelMes.length,
          serviciosDisponibles: servicios.data.filter(s => s.activo).length,
          repuestosStockBajo: repuestos.data.filter(r => 
            r.stockActual <= r.stockMinimo
          ).length
        }
      }
    } catch (error) {
      console.error('Error al obtener métricas del dashboard:', error)
      throw new Error('No se pudieron obtener las métricas del dashboard ejecutivo')
    }
  }

  // ===============================
  // MÉTODOS AUXILIARES
  // ===============================

  getEndpointPorModulo(modulo) {
    const endpoints = {
      'usuarios': '/usuarios',
      'clientes': '/clientes',
      'motos': '/motos',
      'servicios': '/servicios',
      'repuestos': '/repuestos',
      'ordenes-trabajo': '/ordenes-trabajo',
      'pagos': '/pagos',
      'detalles-orden': '/detalles-orden',
      'usos-repuesto': '/usos-repuesto'
    }
    
    return endpoints[modulo] || `/${modulo}`
  }

  procesarDatosParaReporte(datos, tipo) {
    return datos.map(item => ({
      ...item,
      tipoReporte: tipo,
      fechaCreacion: item.createdAt,
      fechaModificacion: item.updatedAt
    }))
  }

  calcularTiempoTranscurrido(fechaCreacion, fechaModificacion) {
    const creacion = new Date(fechaCreacion)
    const modificacion = new Date(fechaModificacion)
    const diferencia = modificacion - creacion
    
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return `${dias} días, ${horas} horas`
  }

  generarDescripcionModificacion(item, modulo) {
    const descripciones = {
      'usuarios': `Usuario ${item.nombreCompleto} (${item.username})`,
      'clientes': `Cliente ${item.nombreCompleto} - ${item.telefono}`,
      'motos': `Moto ${item.marca} ${item.modelo} - Placa: ${item.placa}`,
      'servicios': `Servicio ${item.nombre} (${item.codigo})`,
      'repuestos': `Repuesto ${item.nombre} (${item.codigo})`,
      'ordenes-trabajo': `Orden ${item.numeroOrden} - Estado: ${item.estado}`,
      'pagos': `Pago de S/ ${item.monto} - Método: ${item.metodoPago}`
    }
    
    return descripciones[modulo] || `Registro modificado en ${modulo}`
  }

  determinarEstadoActividad(ultimoLogin) {
    if (!ultimoLogin) return 'Sin login'
    
    const dias = this.calcularDiasSinActividad(ultimoLogin)
    
    if (dias === 0) return 'Activo hoy'
    if (dias <= 7) return 'Activo reciente'
    if (dias <= 30) return 'Actividad moderada'
    return 'Inactivo'
  }

  calcularDiasSinActividad(ultimoLogin) {
    if (!ultimoLogin) return null
    
    const hoy = new Date()
    const fechaLogin = new Date(ultimoLogin)
    const diferencia = hoy - fechaLogin
    
    return Math.floor(diferencia / (1000 * 60 * 60 * 24))
  }

  agruparIngresosPorMes(pagos) {
    return pagos.reduce((acc, pago) => {
      const fecha = new Date(pago.createdAt || pago.fechaPago)
      const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      
      acc[mesAno] = (acc[mesAno] || 0) + pago.monto
      return acc
    }, {})
  }
}

export default new ReporteService()
