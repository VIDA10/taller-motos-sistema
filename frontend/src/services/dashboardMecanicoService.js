import api from './api'

/**
 * Servicio para Dashboard de Mecánico
 * Proporciona información específica y relevante para el trabajo diario del mecánico
 * Utiliza SOLO endpoints existentes del backend
 */
class DashboardMecanicoService {

  /**
   * Obtener resumen completo para dashboard del mecánico
   */
  async obtenerResumenMecanico(usuarioId) {
    try {
      const [
        ordenesAsignadas,
        todasLasOrdenes,
        repuestos,
        motos,
        servicios
      ] = await Promise.all([
        this.obtenerOrdenesAsignadas(usuarioId),
        api.get('/ordenes-trabajo'),
        api.get('/repuestos'),
        api.get('/motos'),
        api.get('/servicios')
      ])

      return {
        ordenesAsignadas: this.procesarOrdenesAsignadas(ordenesAsignadas),
        estadisticasOrdenes: this.calcularEstadisticasOrdenes(todasLasOrdenes.data, usuarioId),
        alertasRepuestos: this.identificarAlertasRepuestos(repuestos.data),
        motosRecientes: this.obtenerMotosRecientes(motos.data),
        serviciosReferencia: this.obtenerServiciosFrecuentes(servicios.data),
        resumenProductividad: this.calcularProductividad(todasLasOrdenes.data, usuarioId)
      }
    } catch (error) {
      console.error('Error al obtener resumen del mecánico:', error)
      throw new Error('No se pudo cargar la información del dashboard')
    }
  }

  /**
   * Obtener órdenes asignadas al mecánico
   */
  async obtenerOrdenesAsignadas(usuarioId) {
    try {
      const response = await api.get('/ordenes-trabajo')
      
      // Filtrar órdenes asignadas al mecánico específico
      const ordenesAsignadas = response.data.filter(orden => 
        orden.idMecanicoAsignado === usuarioId || 
        (orden.mecanicoAsignado && orden.mecanicoAsignado.idUsuario === usuarioId)
      )

      return ordenesAsignadas
    } catch (error) {
      console.error('Error al obtener órdenes asignadas:', error)
      return []
    }
  }

  /**
   * Procesar órdenes asignadas por prioridad y estado
   */
  procesarOrdenesAsignadas(ordenes) {
    const hoy = new Date()
    
    return {
      pendientes: ordenes.filter(orden => 
        ['RECIBIDA', 'DIAGNOSTICADA'].includes(orden.estado)
      ),
      enProceso: ordenes.filter(orden => 
        orden.estado === 'EN_PROCESO'
      ),
      urgentes: ordenes.filter(orden => 
        orden.prioridad === 'URGENTE' && 
        !['COMPLETADA', 'ENTREGADA', 'CANCELADA'].includes(orden.estado)
      ),
      vencidas: ordenes.filter(orden => {
        if (!orden.fechaEstimadaEntrega) return false
        const fechaEstimada = new Date(orden.fechaEstimadaEntrega)
        return fechaEstimada < hoy && 
               !['COMPLETADA', 'ENTREGADA', 'CANCELADA'].includes(orden.estado)
      }),
      totalAsignadas: ordenes.length
    }
  }

  /**
   * Calcular estadísticas de órdenes del mecánico
   */
  calcularEstadisticasOrdenes(todasLasOrdenes, usuarioId) {
    const ordenesDelMecanico = todasLasOrdenes.filter(orden => 
      orden.idMecanicoAsignado === usuarioId || 
      (orden.mecanicoAsignado && orden.mecanicoAsignado.idUsuario === usuarioId)
    )

    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)

    const ordenesDelMes = ordenesDelMecanico.filter(orden => {
      const fechaOrden = new Date(orden.createdAt || orden.fechaIngreso)
      return fechaOrden >= inicioMes && fechaOrden <= finMes
    })

    const ordenesCompletadas = ordenesDelMecanico.filter(orden => 
      orden.estado === 'COMPLETADA'
    )

    const ordenesCompletadasMes = ordenesDelMes.filter(orden => 
      orden.estado === 'COMPLETADA'
    )

    return {
      totalHistorico: ordenesDelMecanico.length,
      completadasHistorico: ordenesCompletadas.length,
      ordenesDelMes: ordenesDelMes.length,
      completadasDelMes: ordenesCompletadasMes.length,
      porcentajeCompletadas: ordenesDelMecanico.length > 0 
        ? Math.round((ordenesCompletadas.length / ordenesDelMecanico.length) * 100)
        : 0,
      porcentajeCompletadasMes: ordenesDelMes.length > 0
        ? Math.round((ordenesCompletadasMes.length / ordenesDelMes.length) * 100)
        : 0
    }
  }

  /**
   * Identificar alertas de repuestos con stock bajo
   */
  identificarAlertasRepuestos(repuestos) {
    const repuestosStockBajo = repuestos.filter(repuesto => 
      repuesto.stockActual <= repuesto.stockMinimo && repuesto.activo
    )

    const repuestosSinStock = repuestos.filter(repuesto => 
      repuesto.stockActual === 0 && repuesto.activo
    )

    return {
      stockBajo: repuestosStockBajo.slice(0, 10), // Máximo 10 para dashboard
      sinStock: repuestosSinStock.slice(0, 5),    // Máximo 5 para dashboard
      totalStockBajo: repuestosStockBajo.length,
      totalSinStock: repuestosSinStock.length
    }
  }

  /**
   * Obtener motos modificadas recientemente
   */
  obtenerMotosRecientes(motos) {
    const hoy = new Date()
    const hace7Dias = new Date(hoy.getTime() - (7 * 24 * 60 * 60 * 1000))

    const motosRecientes = motos
      .filter(moto => {
        const fechaModificacion = new Date(moto.updatedAt)
        return fechaModificacion >= hace7Dias && moto.activo
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 8) // Máximo 8 para dashboard

    return motosRecientes.map(moto => ({
      ...moto,
      diasDesdeModificacion: Math.floor((hoy - new Date(moto.updatedAt)) / (1000 * 60 * 60 * 24))
    }))
  }

  /**
   * Obtener servicios de referencia más utilizados
   */
  obtenerServiciosFrecuentes(servicios) {
    // Retornar servicios activos ordenados por precio (como referencia técnica)
    return servicios
      .filter(servicio => servicio.activo)
      .sort((a, b) => {
        // Ordenar por categoría primero, luego por precio
        if (a.categoria !== b.categoria) {
          return a.categoria.localeCompare(b.categoria)
        }
        return a.precioBase - b.precioBase
      })
      .slice(0, 12) // Máximo 12 para dashboard
  }

  /**
   * Calcular productividad del mecánico
   */
  calcularProductividad(todasLasOrdenes, usuarioId) {
    const ordenesDelMecanico = todasLasOrdenes.filter(orden => 
      orden.idMecanicoAsignado === usuarioId || 
      (orden.mecanicoAsignado && orden.mecanicoAsignado.idUsuario === usuarioId)
    )

    const hoy = new Date()
    const hace30Dias = new Date(hoy.getTime() - (30 * 24 * 60 * 60 * 1000))

    const ordenesUltimos30Dias = ordenesDelMecanico.filter(orden => {
      const fechaOrden = new Date(orden.createdAt || orden.fechaIngreso)
      return fechaOrden >= hace30Dias
    })

    const ordenesCompletadasUltimos30Dias = ordenesUltimos30Dias.filter(orden => 
      orden.estado === 'COMPLETADA'
    )

    const tiemposCompletado = ordenesCompletadasUltimos30Dias
      .filter(orden => orden.fechaEstimadaEntrega && orden.updatedAt)
      .map(orden => {
        const fechaEstimada = new Date(orden.fechaEstimadaEntrega)
        const fechaCompletada = new Date(orden.updatedAt)
        return {
          orden: orden.numeroOrden,
          tiempoReal: fechaCompletada - new Date(orden.createdAt || orden.fechaIngreso),
          cumplioTiempo: fechaCompletada <= fechaEstimada
        }
      })

    const ordenesATiempo = tiemposCompletado.filter(t => t.cumplioTiempo).length

    return {
      ordenes30Dias: ordenesUltimos30Dias.length,
      completadas30Dias: ordenesCompletadasUltimos30Dias.length,
      porcentajeCumplimiento: tiemposCompletado.length > 0 
        ? Math.round((ordenesATiempo / tiemposCompletado.length) * 100)
        : 0,
      promedioOrdenesPorSemana: Math.round(ordenesUltimos30Dias.length / 4.3), // 30 días ≈ 4.3 semanas
      tendencia: this.calcularTendenciaProductividad(ordenesDelMecanico)
    }
  }

  /**
   * Calcular tendencia de productividad (comparar últimos 30 vs anteriores 30 días)
   */
  calcularTendenciaProductividad(ordenesDelMecanico) {
    const hoy = new Date()
    const hace30Dias = new Date(hoy.getTime() - (30 * 24 * 60 * 60 * 1000))
    const hace60Dias = new Date(hoy.getTime() - (60 * 24 * 60 * 60 * 1000))

    const ordenesUltimos30Dias = ordenesDelMecanico.filter(orden => {
      const fechaOrden = new Date(orden.createdAt || orden.fechaIngreso)
      return fechaOrden >= hace30Dias
    }).length

    const ordenesAnteriores30Dias = ordenesDelMecanico.filter(orden => {
      const fechaOrden = new Date(orden.createdAt || orden.fechaIngreso)
      return fechaOrden >= hace60Dias && fechaOrden < hace30Dias
    }).length

    if (ordenesAnteriores30Dias === 0) {
      return { tipo: 'neutral', cambio: 0 }
    }

    const cambio = Math.round(((ordenesUltimos30Dias - ordenesAnteriores30Dias) / ordenesAnteriores30Dias) * 100)

    return {
      tipo: cambio > 5 ? 'positiva' : cambio < -5 ? 'negativa' : 'neutral',
      cambio: Math.abs(cambio)
    }
  }

  /**
   * Obtener órdenes por estado para gráfico rápido
   */
  async obtenerDistribucionEstados(usuarioId) {
    try {
      const ordenes = await this.obtenerOrdenesAsignadas(usuarioId)
      
      const distribucion = {
        'RECIBIDA': 0,
        'DIAGNOSTICADA': 0,
        'EN_PROCESO': 0,
        'COMPLETADA': 0,
        'ENTREGADA': 0,
        'CANCELADA': 0
      }

      ordenes.forEach(orden => {
        if (distribucion.hasOwnProperty(orden.estado)) {
          distribucion[orden.estado]++
        }
      })

      return distribucion
    } catch (error) {
      console.error('Error al obtener distribución de estados:', error)
      return {}
    }
  }

  /**
   * Obtener información rápida de alertas críticas
   */
  async obtenerAlertasCriticas(usuarioId) {
    try {
      const [ordenes, repuestos] = await Promise.all([
        this.obtenerOrdenesAsignadas(usuarioId),
        api.get('/repuestos')
      ])

      const hoy = new Date()
      
      const ordenesVencidas = ordenes.filter(orden => {
        if (!orden.fechaEstimadaEntrega) return false
        const fechaEstimada = new Date(orden.fechaEstimadaEntrega)
        return fechaEstimada < hoy && 
               !['COMPLETADA', 'ENTREGADA', 'CANCELADA'].includes(orden.estado)
      })

      const ordenesUrgentes = ordenes.filter(orden => 
        orden.prioridad === 'URGENTE' && 
        !['COMPLETADA', 'ENTREGADA', 'CANCELADA'].includes(orden.estado)
      )

      const repuestosSinStock = repuestos.data.filter(repuesto => 
        repuesto.stockActual === 0 && repuesto.activo
      )

      return {
        ordenesVencidas: ordenesVencidas.length,
        ordenesUrgentes: ordenesUrgentes.length,
        repuestosSinStock: repuestosSinStock.length,
        tieneAlertas: ordenesVencidas.length > 0 || ordenesUrgentes.length > 0 || repuestosSinStock.length > 0
      }
    } catch (error) {
      console.error('Error al obtener alertas críticas:', error)
      return { 
        ordenesVencidas: 0, 
        ordenesUrgentes: 0, 
        repuestosSinStock: 0, 
        tieneAlertas: false 
      }
    }
  }
}

export default new DashboardMecanicoService()
