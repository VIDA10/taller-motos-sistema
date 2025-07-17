import api from '../services/api'

/**
 * Utilidad para diagnosticar la conectividad con el backend
 * Verifica qué endpoints están funcionando y cuáles no
 */
const diagnosticoBackend = {
  
  /**
   * Endpoints del backend según la documentación
   */
  endpoints: {
    // Endpoints principales
    'ordenes-trabajo': '/ordenes-trabajo',
    'clientes': '/clientes',
    'motos': '/motos',
    'pagos': '/pagos',
    'servicios': '/servicios',
    'repuestos': '/repuestos',
    'usuarios': '/usuarios',
    
    // Endpoints específicos
    'detalles-orden': '/detalles-orden',
    'usos-repuesto': '/usos-repuesto',
    'orden-historial': '/orden-historial',
    'repuesto-movimientos': '/repuesto-movimientos',
    'configuraciones': '/configuraciones',
    
    // Autenticación
    'auth': '/auth'
  },

  /**
   * Prueba todos los endpoints para ver cuáles funcionan
   */
  async probarTodosLosEndpoints() {
    console.log('🔍 Iniciando diagnóstico completo del backend...')
    
    const resultados = {
      exitosos: [],
      fallidos: [],
      sin_permisos: [],
      resumen: {
        total: 0,
        exitosos: 0,
        fallidos: 0,
        sin_permisos: 0
      }
    }
    
    for (const [nombre, endpoint] of Object.entries(this.endpoints)) {
      try {
        console.log(`🔄 Probando endpoint: ${endpoint}`)
        const response = await api.get(endpoint)
        
        resultados.exitosos.push({
          nombre,
          endpoint,
          status: response.status,
          datos: Array.isArray(response.data) ? response.data.length : 'objeto'
        })
        
        console.log(`✅ ${endpoint} funcionando - Status: ${response.status}`)
        
      } catch (error) {
        const errorInfo = {
          nombre,
          endpoint,
          error: error.message,
          status: error.response?.status,
          detalle: error.response?.data?.message || error.response?.statusText
        }
        
        if (error.response?.status === 403) {
          resultados.sin_permisos.push(errorInfo)
          console.log(`🚫 ${endpoint} sin permisos - Status: 403`)
        } else {
          resultados.fallidos.push(errorInfo)
          console.log(`❌ ${endpoint} falló - Status: ${error.response?.status || 'N/A'}`)
        }
      }
    }
    
    resultados.resumen.total = Object.keys(this.endpoints).length
    resultados.resumen.exitosos = resultados.exitosos.length
    resultados.resumen.fallidos = resultados.fallidos.length
    resultados.resumen.sin_permisos = resultados.sin_permisos.length
    
    console.log('📊 Resumen del diagnóstico:', resultados.resumen)
    
    return resultados
  },

  /**
   * Prueba endpoints específicos para un rol
   */
  async probarEndpointsParaRol(rol) {
    console.log(`🔍 Probando endpoints para rol: ${rol}`)
    
    const endpointsPorRol = {
      'RECEPCIONISTA': [
        '/clientes',
        '/motos', 
        '/ordenes-trabajo',
        '/pagos',
        '/servicios',
        '/repuestos'
      ],
      'MECANICO': [
        '/clientes',
        '/motos',
        '/ordenes-trabajo',
        '/servicios',
        '/repuestos',
        '/detalles-orden',
        '/usos-repuesto',
        '/orden-historial'
      ],
      'ADMIN': [
        '/usuarios',
        '/clientes',
        '/motos',
        '/ordenes-trabajo',
        '/pagos',
        '/servicios',
        '/repuestos',
        '/configuraciones'
      ]
    }
    
    const endpoints = endpointsPorRol[rol] || []
    const resultados = {
      rol,
      endpoints_probados: endpoints.length,
      exitosos: [],
      fallidos: []
    }
    
    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint)
        resultados.exitosos.push({
          endpoint,
          status: response.status,
          datos: Array.isArray(response.data) ? response.data.length : 'objeto'
        })
        console.log(`✅ ${endpoint} OK para ${rol}`)
      } catch (error) {
        resultados.fallidos.push({
          endpoint,
          error: error.message,
          status: error.response?.status
        })
        console.log(`❌ ${endpoint} falló para ${rol}: ${error.response?.status}`)
      }
    }
    
    return resultados
  },

  /**
   * Información sobre permisos según configuración de seguridad
   */
  obtenerInfoPermisos() {
    return {
      'RECEPCIONISTA': {
        descripcion: 'Gestión de recepción y atención al cliente',
        permisos: [
          'Ver clientes (GET)',
          'Ver motos (GET)', 
          'Ver órdenes de trabajo (GET)',
          'Gestionar pagos (GET/POST/PUT)',
          'Ver servicios (GET)',
          'Ver repuestos (GET)',
          'Gestionar usuarios (GET/POST/PUT)'
        ],
        endpoints_permitidos: [
          '/clientes/**',
          '/motos/**',
          '/ordenes-trabajo/**',
          '/pagos/**',
          '/servicios/**',
          '/repuestos/**',
          '/usuarios/**'
        ]
      },
      'MECANICO': {
        descripcion: 'Ejecución de trabajos y mantenimiento',
        permisos: [
          'Ver clientes (GET)',
          'Ver motos (GET)',
          'Ver/editar órdenes de trabajo (GET/POST/PUT)',
          'Ver servicios (GET)',
          'Ver repuestos (GET)',
          'Gestionar detalles de orden (GET/POST/PUT)',
          'Gestionar uso de repuestos (GET/POST/PUT)',
          'Gestionar historial de órdenes (GET/POST)'
        ],
        endpoints_permitidos: [
          '/clientes/** (GET)',
          '/motos/** (GET)',
          '/ordenes-trabajo/**',
          '/servicios/** (GET)',
          '/repuestos/** (GET)',
          '/detalles-orden/**',
          '/usos-repuesto/**',
          '/orden-historial/**'
        ]
      },
      'ADMIN': {
        descripcion: 'Administración completa del sistema',
        permisos: [
          'Acceso completo a todos los módulos',
          'Gestión de usuarios',
          'Configuración del sistema',
          'Acceso a todos los reportes'
        ],
        endpoints_permitidos: [
          '/** (todos los endpoints)'
        ]
      }
    }
  },

  /**
   * Genera un reporte de diagnóstico
   */
  async generarReporteDiagnostico() {
    console.log('📋 Generando reporte de diagnóstico...')
    
    const diagnostico = await this.probarTodosLosEndpoints()
    const infoPermisos = this.obtenerInfoPermisos()
    
    const reporte = {
      fecha: new Date().toISOString(),
      resumen: diagnostico.resumen,
      endpoints_exitosos: diagnostico.exitosos,
      endpoints_fallidos: diagnostico.fallidos,
      endpoints_sin_permisos: diagnostico.sin_permisos,
      informacion_permisos: infoPermisos,
      recomendaciones: []
    }
    
    // Generar recomendaciones
    if (diagnostico.sin_permisos.length > 0) {
      reporte.recomendaciones.push({
        tipo: 'warning',
        mensaje: `Se encontraron ${diagnostico.sin_permisos.length} endpoints sin permisos. Verificar configuración de roles.`,
        endpoints: diagnostico.sin_permisos.map(e => e.endpoint)
      })
    }
    
    if (diagnostico.fallidos.length > 0) {
      reporte.recomendaciones.push({
        tipo: 'error',
        mensaje: `Se encontraron ${diagnostico.fallidos.length} endpoints con fallos. Verificar conectividad del backend.`,
        endpoints: diagnostico.fallidos.map(e => e.endpoint)
      })
    }
    
    if (diagnostico.exitosos.length === diagnostico.resumen.total) {
      reporte.recomendaciones.push({
        tipo: 'success',
        mensaje: 'Todos los endpoints están funcionando correctamente.',
        endpoints: []
      })
    }
    
    console.log('📊 Reporte generado:', reporte)
    
    return reporte
  }
}

export default diagnosticoBackend
