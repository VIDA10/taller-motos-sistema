import api from './api';

// Constantes para estados y prioridades
export const ESTADOS_ORDEN = {
  RECIBIDA: 'RECIBIDA',
  DIAGNOSTICADA: 'DIAGNOSTICADA',
  EN_PROCESO: 'EN_PROCESO',
  COMPLETADA: 'COMPLETADA',
  ENTREGADA: 'ENTREGADA',
  CANCELADA: 'CANCELADA'
};

export const PRIORIDADES_ORDEN = {
  BAJA: 'BAJA',
  NORMAL: 'NORMAL',
  ALTA: 'ALTA',
  URGENTE: 'URGENTE'
};

export const ESTADOS_PAGO = {
  PENDIENTE: 'PENDIENTE',
  PARCIAL: 'PARCIAL',
  COMPLETO: 'COMPLETO'
};

// Configuración de colores para estados
export const COLORES_ESTADO = {
  RECIBIDA: '#2196F3',      // Azul - Nueva orden
  DIAGNOSTICADA: '#FF9800', // Naranja - En análisis
  EN_PROCESO: '#9C27B0',    // Púrpura - Trabajando
  COMPLETADA: '#4CAF50',    // Verde - Terminada
  ENTREGADA: '#00BCD4',     // Cian - Entregada
  CANCELADA: '#F44336'      // Rojo - Cancelada
};

// Configuración de colores para prioridades
export const COLORES_PRIORIDAD = {
  BAJA: '#4CAF50',      // Verde
  NORMAL: '#2196F3',    // Azul
  ALTA: '#FF9800',      // Naranja
  URGENTE: '#F44336'    // Rojo
};

/**
 * Servicio para gestión de órdenes de trabajo
 * Maneja todas las operaciones CRUD y consultas específicas
 */
const ordenService = {
  // ===============================
  // OPERACIONES CRUD BÁSICAS
  // ===============================

  /**
   * Obtener todas las órdenes de trabajo
   */
  async obtenerTodas() {
    try {
      const response = await api.get('/ordenes-trabajo');
      return {
        success: true,
        data: response.data,
        message: 'Órdenes obtenidas exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener las órdenes de trabajo'
      };
    }
  },

  /**
   * Obtener órdenes con paginación
   */
  async obtenerPaginadas(page = 0, size = 10, sort = 'fechaIngreso,desc') {
    try {
      const response = await api.get('/ordenes-trabajo/paginadas', {
        params: { page, size, sort }
      });
      return {
        success: true,
        data: response.data,
        message: 'Órdenes paginadas obtenidas exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener órdenes paginadas:', error);
      return {
        success: false,
        data: { content: [], totalElements: 0, totalPages: 0 },
        message: error.response?.data?.message || 'Error al obtener las órdenes paginadas'
      };
    }
  },

  /**
   * Obtener orden por ID
   */
  async obtenerPorId(id) {
    try {
      const response = await api.get(`/ordenes-trabajo/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Orden obtenida exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener orden:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al obtener la orden de trabajo'
      };
    }
  },

  /**
   * Crear nueva orden de trabajo
   */
  async crear(ordenData) {
    try {
      // Validar datos requeridos
      if (!ordenData.idMoto || !ordenData.idUsuarioCreador || !ordenData.descripcionProblema) {
        throw new Error('Datos incompletos: se requiere moto, usuario creador y descripción del problema');
      }

      const response = await api.post('/ordenes-trabajo', ordenData);
      return {
        success: true,
        data: response.data,
        message: 'Orden de trabajo creada exitosamente'
      };
    } catch (error) {
      console.error('Error al crear orden:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al crear la orden de trabajo'
      };
    }
  },

  /**
   * Actualizar orden de trabajo
   */
  async actualizar(id, ordenData) {
    try {
      const response = await api.put(`/ordenes-trabajo/${id}`, ordenData);
      return {
        success: true,
        data: response.data,
        message: 'Orden de trabajo actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al actualizar la orden de trabajo'
      };
    }
  },

  /**
   * Eliminar orden de trabajo
   */
  async eliminar(id) {
    try {
      await api.delete(`/ordenes-trabajo/${id}`);
      return {
        success: true,
        data: null,
        message: 'Orden de trabajo eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al eliminar la orden de trabajo'
      };
    }
  },

  // ===============================
  // CONSULTAS ESPECÍFICAS
  // ===============================

  /**
   * Buscar orden por número de orden
   */
  async buscarPorNumeroOrden(numeroOrden) {
    try {
      const response = await api.get(`/ordenes-trabajo/numero-orden/${numeroOrden}`);
      return {
        success: true,
        data: response.data,
        message: 'Orden encontrada exitosamente'
      };
    } catch (error) {
      console.error('Error al buscar orden por número:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'No se encontró la orden con ese número'
      };
    }
  },

  /**
   * Verificar si existe un número de orden
   */
  async existeNumeroOrden(numeroOrden) {
    try {
      const response = await api.get(`/ordenes-trabajo/numero-orden/${numeroOrden}/existe`);
      return {
        success: true,
        data: response.data,
        message: 'Verificación completada'
      };
    } catch (error) {
      console.error('Error al verificar número de orden:', error);
      return {
        success: false,
        data: false,
        message: 'Error al verificar el número de orden'
      };
    }
  },

  /**
   * Buscar órdenes por moto
   */
  async buscarPorMoto(moto) {
    try {
      const response = await api.post('/ordenes-trabajo/buscar-por-moto-ordenadas', moto);
      return {
        success: true,
        data: response.data,
        message: 'Órdenes de la moto obtenidas exitosamente'
      };
    } catch (error) {
      console.error('Error al buscar órdenes por moto:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener las órdenes de la moto'
      };
    }
  },

  /**
   * Buscar órdenes por mecánico asignado
   */
  async buscarPorMecanico(mecanico) {
    try {
      const response = await api.post('/ordenes-trabajo/buscar-por-mecanico-asignado-ordenadas', mecanico);
      return {
        success: true,
        data: response.data,
        message: 'Órdenes del mecánico obtenidas exitosamente'
      };
    } catch (error) {
      console.error('Error al buscar órdenes por mecánico:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener las órdenes del mecánico'
      };
    }
  },

  /**
   * Buscar órdenes por usuario creador
   */
  async buscarPorUsuarioCreador(usuario) {
    try {
      const response = await api.post('/ordenes-trabajo/buscar-por-usuario-creador-ordenadas', usuario);
      return {
        success: true,
        data: response.data,
        message: 'Órdenes del usuario obtenidas exitosamente'
      };
    } catch (error) {
      console.error('Error al buscar órdenes por usuario creador:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener las órdenes del usuario'
      };
    }
  },

  // ===============================
  // FUNCIONES AUXILIARES
  // ===============================

  /**
   * Formatear fecha para mostrar
   */
  formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Formatear solo fecha (sin hora)
   */
  formatearFechaSolo(fecha) {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  },

  /**
   * Formatear precio
   */
  formatearPrecio(precio) {
    if (!precio || precio === 0) return 'S/ 0.00';
    return `S/ ${parseFloat(precio).toFixed(2)}`;
  },

  /**
   * Obtener color del estado
   */
  obtenerColorEstado(estado) {
    return COLORES_ESTADO[estado] || '#757575';
  },

  /**
   * Obtener color de prioridad
   */
  obtenerColorPrioridad(prioridad) {
    return COLORES_PRIORIDAD[prioridad] || '#757575';
  },

  /**
   * Generar número de orden automático
   */
  generarNumeroOrden() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    
    return `ORD-${año}${mes}${dia}-${timestamp}`;
  },

  /**
   * Validar datos de orden
   */
  validarOrden(ordenData) {
    const errores = [];

    if (!ordenData.idMoto) {
      errores.push('La moto es obligatoria');
    }

    if (!ordenData.idUsuarioCreador) {
      errores.push('El usuario creador es obligatorio');
    }

    if (!ordenData.descripcionProblema || ordenData.descripcionProblema.trim().length === 0) {
      errores.push('La descripción del problema es obligatoria');
    }

    if (ordenData.descripcionProblema && ordenData.descripcionProblema.length > 1000) {
      errores.push('La descripción del problema no puede exceder 1000 caracteres');
    }

    if (ordenData.estado && !Object.values(ESTADOS_ORDEN).includes(ordenData.estado)) {
      errores.push('Estado no válido');
    }

    if (ordenData.prioridad && !Object.values(PRIORIDADES_ORDEN).includes(ordenData.prioridad)) {
      errores.push('Prioridad no válida');
    }

    return {
      esValido: errores.length === 0,
      errores
    };
  },

  /**
   * Asignar mecánico a una orden de trabajo
   */
  async asignarMecanico(idOrden, idMecanico) {
    try {
      // Primero obtenemos la orden actual
      const ordenActual = await this.obtenerPorId(idOrden);
      if (!ordenActual.success) {
        throw new Error('No se pudo obtener la orden actual');
      }

      // Preparamos los datos para actualizar solo el mecánico
      const ordenActualizada = {
        ...ordenActual.data,
        mecanicoAsignado: { idUsuario: idMecanico }
      };

      // Actualizamos la orden
      const response = await api.put(`/ordenes-trabajo/${idOrden}`, ordenActualizada);
      return {
        success: true,
        data: response.data,
        message: 'Mecánico asignado exitosamente'
      };
    } catch (error) {
      console.error('Error al asignar mecánico:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al asignar el mecánico'
      };
    }
  },

  // ===============================
  // MÉTODOS DE BÚSQUEDA POR ESTADO
  // ===============================

  /**
   * Buscar órdenes por estado específico
   * @param {string} estado - Estado a buscar (RECIBIDA, DIAGNOSTICADA, EN_PROCESO, COMPLETADA, ENTREGADA, CANCELADA)
   * @returns {Promise} Respuesta con las órdenes filtradas
   */
  async buscarPorEstado(estado) {
    try {
      const response = await api.post('/ordenes-trabajo/buscar-por-estados', [estado]);
      return {
        ...response,
        message: `Órdenes con estado ${estado} cargadas correctamente`
      };
    } catch (error) {
      console.error(`Error al buscar órdenes por estado ${estado}:`, error);
      throw error;
    }
  },

  /**
   * Buscar órdenes por múltiples estados
   * @param {Array} estados - Array de estados a buscar
   * @returns {Promise} Respuesta con las órdenes filtradas
   */
  async buscarPorEstados(estados) {
    try {
      const response = await api.post('/ordenes-trabajo/buscar-por-estados', estados);
      return {
        ...response,
        message: `Órdenes con estados ${estados.join(', ')} cargadas correctamente`
      };
    } catch (error) {
      console.error('Error al buscar órdenes por estados:', error);
      throw error;
    }
  },

  /**
   * Obtener órdenes completadas (método específico para pagos)
   * @returns {Promise} Respuesta con las órdenes completadas
   */
  async obtenerCompletadas() {
    return this.buscarPorEstado('COMPLETADA');
  },
};

export default ordenService;

// Exportar funciones individuales para uso directo
export const {
  obtenerTodas,
  obtenerPaginadas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  buscarPorNumeroOrden,
  existeNumeroOrden,
  buscarPorMoto,
  buscarPorMecanico,
  buscarPorUsuarioCreador,
  buscarPorEstado,
  buscarPorEstados,
  obtenerCompletadas,
  formatearFecha,
  formatearFechaSolo,
  formatearPrecio,
  obtenerColorEstado,
  obtenerColorPrioridad,
  generarNumeroOrden,
  validarOrdenTrabajo,
  asignarMecanico
} = ordenService;

// Alias para compatibilidad
export const formatearMoneda = ordenService.formatearPrecio;
