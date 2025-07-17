import api from './api'

/**
 * Servicio para el Dashboard de Administrador
 * Proporciona resumen global del taller y todas las operaciones
 */

const dashboardAdministradorService = {
  
  /**
   * Obtiene datos con reintentos para manejar errores
   */
  async obtenerDatosConReintentos(endpoint, nombreRecurso, reintentos = 1) {
    console.log(`🔄 [ADMIN] Intentando obtener datos de: ${endpoint} (${nombreRecurso})`)
    
    for (let i = 0; i <= reintentos; i++) {
      try {
        const response = await api.get(endpoint)
        console.log(`✅ [ADMIN] Éxito obteniendo ${nombreRecurso} de ${endpoint}`)
        return response
      } catch (error) {
        console.warn(`❌ [ADMIN] Intento ${i + 1} falló para ${nombreRecurso} en ${endpoint}:`, error.response?.status, error.message)
        
        if (error.response?.status === 403) {
          console.warn(`🚫 [ADMIN] Error 403 para ${nombreRecurso} - verificar permisos`)
          if (i < reintentos) {
            console.log(`🔄 [ADMIN] Reintentando ${nombreRecurso} en 1000ms...`)
            await new Promise(resolve => setTimeout(resolve, 1000))
            continue
          } else {
            console.warn(`🚫 [ADMIN] Error 403 persistente para ${nombreRecurso}. Devolviendo datos vacíos.`)
            return { data: [] }
          }
        }
        
        console.warn(`⚠️ [ADMIN] Error no-403 para ${nombreRecurso}, usando datos vacíos`)
        return { data: [] }
      }
    }
    
    return { data: [] }
  },

  /**
   * Obtiene resumen completo del sistema para administrador
   */
  async obtenerResumenAdministrador() {
    try {
      console.log('🚀 [ADMIN] Iniciando carga de dashboard de administrador...')

      // Obtener todos los datos del sistema
      const [
        responseOrdenes,
        responseClientes,
        responseMotos,
        responseUsuarios,
        responseServicios,
        responseRepuestos,
        responsePagos
      ] = await Promise.all([
        this.obtenerDatosConReintentos('/ordenes-trabajo', 'órdenes', 2),
        this.obtenerDatosConReintentos('/clientes', 'clientes', 2),
        this.obtenerDatosConReintentos('/motos', 'motos', 2),
        this.obtenerDatosConReintentos('/usuarios', 'usuarios', 2),
        this.obtenerDatosConReintentos('/servicios', 'servicios', 2),
        this.obtenerDatosConReintentos('/repuestos', 'repuestos', 2),
        this.obtenerDatosConReintentos('/pagos', 'pagos', 2)
      ])

      const ordenes = responseOrdenes.data || []
      const clientes = responseClientes.data || []
      const motos = responseMotos.data || []
      const usuarios = responseUsuarios.data || []
      const servicios = responseServicios.data || []
      const repuestos = responseRepuestos.data || []
      const pagos = responsePagos.data || []

      console.log('📊 [ADMIN] Datos obtenidos:')
      console.log(`   - Órdenes: ${ordenes.length}`)
      console.log(`   - Clientes: ${clientes.length}`)
      console.log(`   - Motos: ${motos.length}`)
      console.log(`   - Usuarios: ${usuarios.length}`)
      console.log(`   - Servicios: ${servicios.length}`)
      console.log(`   - Repuestos: ${repuestos.length}`)
      console.log(`   - Pagos: ${pagos.length}`)

      // Procesar y agregar datos
      const resumen = {
        // Estadísticas generales del sistema
        estadisticasGenerales: this.procesarEstadisticasGenerales(ordenes, clientes, motos, usuarios),
        
        // Estadísticas financieras
        resumenFinanciero: this.procesarResumenFinanciero(pagos, ordenes),
        
        // Gestión de usuarios y roles
        resumenUsuarios: this.procesarResumenUsuarios(usuarios),
        
        // Estado del inventario
        estadoInventario: this.procesarEstadoInventario(repuestos),
        
        // Productividad del taller
        productividadTaller: this.procesarProductividad(ordenes, usuarios),
        
        // Servicios más demandados
        serviciosPopulares: this.procesarServiciosPopulares(servicios, ordenes),
        
        // Alertas administrativas
        alertasAdministrativas: this.procesarAlertasAdmin(ordenes, repuestos, usuarios),
        
        // Tendencias y métricas
        tendenciasOperativas: this.procesarTendencias(ordenes, pagos)
      }

      console.log('✅ [ADMIN] Dashboard de administrador cargado exitosamente')
      return resumen

    } catch (error) {
      console.error('❌ [ADMIN] Error al obtener resumen de administrador:', error)
      return {
        estadisticasGenerales: { totalOrdenes: 0, totalClientes: 0, totalMotos: 0, totalUsuarios: 0, nuevasHoy: 0 },
        resumenFinanciero: { totalRecaudado: 0, recaudadoMes: 0, pagosPendientes: 0, promedioFactura: 0 },
        resumenUsuarios: { totalUsuarios: 0, admins: 0, recepcionistas: 0, mecanicos: 0, usuariosActivos: 0 },
        estadoInventario: { totalRepuestos: 0, stockBajo: 0, valorInventario: 0, categorias: [] },
        productividadTaller: { ordenesCompletadas: 0, tiempoPromedio: 0, eficienciaMecanicos: 0 },
        serviciosPopulares: [],
        alertasAdministrativas: [],
        tendenciasOperativas: { crecimientoMensual: 0, satisfaccionClientes: 0 }
      }
    }
  },

  /**
   * Procesa estadísticas generales del sistema
   */
  procesarEstadisticasGenerales(ordenes, clientes, motos, usuarios) {
    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

    // Filtrar órdenes activas (sin canceladas)
    const ordenesActivas = ordenes.filter(orden => orden.estado !== 'CANCELADA')
    
    // Órdenes nuevas hoy
    const nuevasHoy = ordenesActivas.filter(orden => {
      if (!orden.fechaCreacion && !orden.fechaIngreso) return false
      try {
        const fechaOrden = new Date(orden.fechaCreacion || orden.fechaIngreso)
        return fechaOrden.toDateString() === hoy.toDateString()
      } catch (e) {
        return false
      }
    }).length

    // Clientes nuevos este mes
    const clientesNuevosMes = clientes.filter(cliente => {
      if (!cliente.fechaRegistro) return false
      try {
        const fechaRegistro = new Date(cliente.fechaRegistro)
        return fechaRegistro >= inicioMes
      } catch (e) {
        return false
      }
    }).length

    return {
      totalOrdenes: ordenesActivas.length,
      totalClientes: clientes.length,
      totalMotos: motos.length,
      totalUsuarios: usuarios.length,
      nuevasHoy,
      clientesNuevosMes,
      ordenesEsteMes: ordenesActivas.filter(orden => {
        if (!orden.fechaCreacion && !orden.fechaIngreso) return false
        try {
          const fechaOrden = new Date(orden.fechaCreacion || orden.fechaIngreso)
          return fechaOrden >= inicioMes
        } catch (e) {
          return false
        }
      }).length
    }
  },

  /**
   * Procesa resumen financiero
   */
  procesarResumenFinanciero(pagos, ordenes) {
    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

    // Total recaudado
    const totalRecaudado = pagos.reduce((sum, pago) => sum + (pago.monto || 0), 0)

    // Recaudado este mes
    const recaudadoMes = pagos.filter(pago => {
      if (!pago.fechaPago) return false
      try {
        const fechaPago = new Date(pago.fechaPago)
        return fechaPago >= inicioMes
      } catch (e) {
        return false
      }
    }).reduce((sum, pago) => sum + (pago.monto || 0), 0)

    // Órdenes completadas sin facturar
    const ordenesCompletadas = ordenes.filter(orden => orden.estado === 'COMPLETADA')
    const pagosPendientes = ordenesCompletadas.filter(orden => {
      return !pagos.some(pago => 
        pago.numeroOrden === (orden.numeroOrden || orden.id)
      )
    }).length

    // Promedio de factura
    const promedioFactura = pagos.length > 0 ? totalRecaudado / pagos.length : 0

    return {
      totalRecaudado,
      recaudadoMes,
      pagosPendientes,
      promedioFactura,
      totalFacturas: pagos.length,
      facturasMes: pagos.filter(pago => {
        if (!pago.fechaPago) return false
        try {
          const fechaPago = new Date(pago.fechaPago)
          return fechaPago >= inicioMes
        } catch (e) {
          return false
        }
      }).length
    }
  },

  /**
   * Procesa resumen de usuarios por rol
   */
  procesarResumenUsuarios(usuarios) {
    const totalUsuarios = usuarios.length
    const admins = usuarios.filter(user => user.rol === 'ADMIN').length
    const recepcionistas = usuarios.filter(user => user.rol === 'RECEPCIONISTA').length
    const mecanicos = usuarios.filter(user => user.rol === 'MECANICO').length
    const usuariosActivos = usuarios.filter(user => user.activo !== false).length

    return {
      totalUsuarios,
      admins,
      recepcionistas,
      mecanicos,
      usuariosActivos,
      distribucionRoles: {
        ADMIN: admins,
        RECEPCIONISTA: recepcionistas,
        MECANICO: mecanicos
      }
    }
  },

  /**
   * Procesa estado del inventario
   */
  procesarEstadoInventario(repuestos) {
    const totalRepuestos = repuestos.length
    const stockBajo = repuestos.filter(repuesto => 
      (repuesto.cantidadStock || 0) <= (repuesto.stockMinimo || 5)
    ).length

    const valorInventario = repuestos.reduce((sum, repuesto) => 
      sum + ((repuesto.cantidadStock || 0) * (repuesto.precio || 0)), 0
    )

    // Agrupar por categoría
    const categorias = repuestos.reduce((acc, repuesto) => {
      const categoria = repuesto.categoria || 'Sin categoría'
      if (!acc[categoria]) {
        acc[categoria] = { nombre: categoria, cantidad: 0, valor: 0 }
      }
      acc[categoria].cantidad += repuesto.cantidadStock || 0
      acc[categoria].valor += (repuesto.cantidadStock || 0) * (repuesto.precio || 0)
      return acc
    }, {})

    return {
      totalRepuestos,
      stockBajo,
      valorInventario,
      categorias: Object.values(categorias),
      repuestosCriticos: repuestos.filter(repuesto => 
        (repuesto.cantidadStock || 0) === 0
      ).length
    }
  },

  /**
   * Procesa productividad del taller
   */
  procesarProductividad(ordenes, usuarios) {
    const ordenesCompletadas = ordenes.filter(orden => 
      ['COMPLETADA', 'ENTREGADA'].includes(orden.estado)
    ).length

    const mecanicos = usuarios.filter(user => user.rol === 'MECANICO')
    const ordenesConTiempo = ordenes.filter(orden => 
      orden.fechaCreacion && orden.fechaCompletada && 
      ['COMPLETADA', 'ENTREGADA'].includes(orden.estado)
    )

    // Calcular tiempo promedio
    let tiempoPromedio = 0
    if (ordenesConTiempo.length > 0) {
      const tiempoTotal = ordenesConTiempo.reduce((sum, orden) => {
        try {
          const inicio = new Date(orden.fechaCreacion || orden.fechaIngreso)
          const fin = new Date(orden.fechaCompletada)
          const dias = (fin - inicio) / (1000 * 60 * 60 * 24)
          return sum + dias
        } catch (e) {
          return sum
        }
      }, 0)
      tiempoPromedio = tiempoTotal / ordenesConTiempo.length
    }

    return {
      ordenesCompletadas,
      tiempoPromedio: Math.round(tiempoPromedio * 10) / 10, // Redondear a 1 decimal
      totalMecanicos: mecanicos.length,
      ordenesEnProceso: ordenes.filter(orden => 
        ['EN_PROCESO', 'DIAGNOSTICADA'].includes(orden.estado)
      ).length,
      eficiencia: mecanicos.length > 0 ? (ordenesCompletadas / mecanicos.length) : 0
    }
  },

  /**
   * Procesa servicios más populares
   */
  procesarServiciosPopulares(servicios, ordenes) {
    // Por ahora, devolver servicios básicos
    // En una implementación completa, se analizarían las órdenes para ver qué servicios se solicitan más
    return servicios.slice(0, 5).map(servicio => ({
      nombre: servicio.nombre,
      precio: servicio.precio,
      demanda: Math.floor(Math.random() * 20) + 1 // Placeholder
    }))
  },

  /**
   * Procesa tendencias operativas
   */
  procesarTendencias(ordenes, pagos) {
    const hoy = new Date()
    const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

    const ordenesMesActual = ordenes.filter(orden => {
      if (!orden.fechaCreacion && !orden.fechaIngreso) return false
      try {
        const fechaOrden = new Date(orden.fechaCreacion || orden.fechaIngreso)
        return fechaOrden >= inicioMes
      } catch (e) {
        return false
      }
    }).length

    const ordenesMesAnterior = ordenes.filter(orden => {
      if (!orden.fechaCreacion && !orden.fechaIngreso) return false
      try {
        const fechaOrden = new Date(orden.fechaCreacion || orden.fechaIngreso)
        return fechaOrden >= mesAnterior && fechaOrden < inicioMes
      } catch (e) {
        return false
      }
    }).length

    const crecimientoMensual = ordenesMesAnterior > 0 ? 
      ((ordenesMesActual - ordenesMesAnterior) / ordenesMesAnterior) * 100 : 0

    return {
      crecimientoMensual: Math.round(crecimientoMensual * 10) / 10,
      ordenesMesActual,
      ordenesMesAnterior,
      tendenciaPositiva: crecimientoMensual > 0
    }
  },

  /**
   * Procesa alertas administrativas
   * NOTA: Alertas deshabilitadas para mantener dashboard limpio
   */
  procesarAlertasAdmin(ordenes, repuestos, usuarios) {
    // Retornar array vacío - alertas deshabilitadas
    return []
  }
}

export default dashboardAdministradorService
