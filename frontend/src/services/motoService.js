import api from './api'

/**
 * Servicio para gestión de motos
 * Basado 100% en endpoints reales de MotoController.java
 * 
 * IMPORTANTE: Backend NO usa DTOs para motos, usa directamente entidad Moto
 * - Crear: POST /api/motos con entidad Moto completa
 * - Actualizar: PUT /api/motos/{id} con entidad Moto completa  
 * - Respuesta: Moto (entidad completa)
 * 
 * Endpoints disponibles según MotoController.java:
 * - GET /api/motos - Obtener todas las motos
 * - GET /api/motos/{id} - Obtener moto por ID
 * - POST /api/motos - Crear nueva moto
 * - PUT /api/motos/{id} - Actualizar moto
 * - DELETE /api/motos/{id} - Eliminar moto (soft delete)
 * - DELETE /api/motos/{id}/permanente - Eliminar permanentemente
 * - GET /api/motos/placa/{placa} - Buscar por placa
 * - GET /api/motos/activa/placa/{placa} - Buscar activa por placa
 * - POST /api/motos/cliente - Obtener motos por cliente
 */

// ========== OPERACIONES CRUD ==========

/**
 * Obtener todas las motos
 * Endpoint: GET /motos (se combina con baseURL: '/api' → '/api/motos')
 * Retorna: Array de Moto (entidad completa)
 */
export const obtenerTodasLasMotos = async () => {
  try {
    console.log('🔍 Obteniendo todas las motos...')
    const response = await api.get('/motos')
    console.log('✅ Motos obtenidas:', response.data?.length || 0)
    return response.data || []
  } catch (error) {
    console.error('❌ Error al obtener motos:', error)
    throw error
  }
}

/**
 * Obtener moto por ID
 * Endpoint: GET /api/motos/{id}
 * Retorna: Moto (entidad completa) o 404
 */
export const obtenerMotoPorId = async (id) => {
  try {
    console.log('🔍 Obteniendo moto por ID:', id)
    const response = await api.get(`/motos/${id}`)
    console.log('✅ Moto obtenida:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error al obtener moto:', error)
    if (error.response?.status === 404) {
      throw new Error('Moto no encontrada')
    }
    throw error
  }
}

/**
 * Crear nueva moto
 * Endpoint: POST /api/motos
 * Body: Moto (entidad completa) - NO hay DTOs específicos
 * Campos obligatorios según Moto.java: cliente, marca, modelo, placa
 * Campos opcionales: anio, vin, color, kilometraje
 * Validaciones: placa única
 */
export const crearMoto = async (motoData) => {
  try {
    console.log('🚀 Creando nueva moto:', motoData)
    
    // Limpiar datos antes de enviar
    const motoLimpia = {
      cliente: motoData.cliente, // Relación obligatoria
      marca: motoData.marca?.trim() || '',
      modelo: motoData.modelo?.trim() || '',
      placa: motoData.placa?.trim().toUpperCase() || '',
      anio: motoData.anio || null,
      vin: motoData.vin?.trim() || null,
      color: motoData.color?.trim() || null,
      kilometraje: motoData.kilometraje || 0,
      activo: true // Siempre true al crear
    }
    
    const response = await api.post('/motos', motoLimpia)
    console.log('✅ Moto creada exitosamente:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error al crear moto:', error)
    if (error.response?.status === 400) {
      throw new Error('Datos de moto inválidos. Verifique los campos obligatorios.')
    }
    throw error
  }
}

/**
 * Actualizar moto existente
 * Endpoint: PUT /api/motos/{id}
 * Body: Moto (entidad completa) - NO hay DTOs específicos
 * Campos obligatorios: cliente, marca, modelo, placa
 * Campos opcionales: anio, vin, color, kilometraje, activo
 * Permite reactivar motos con campo activo
 */
export const actualizarMoto = async (id, motoData) => {
  try {
    console.log('📝 Actualizando moto:', id, motoData)
    
    // Limpiar datos antes de enviar
    const motoLimpia = {
      cliente: motoData.cliente, // Relación obligatoria
      marca: motoData.marca?.trim() || '',
      modelo: motoData.modelo?.trim() || '',
      placa: motoData.placa?.trim().toUpperCase() || '',
      anio: motoData.anio || null,
      vin: motoData.vin?.trim() || null,
      color: motoData.color?.trim() || null,
      kilometraje: motoData.kilometraje || 0,
      activo: motoData.activo !== undefined ? motoData.activo : true
    }
    
    const response = await api.put(`/motos/${id}`, motoLimpia)
    console.log('✅ Moto actualizada exitosamente:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error al actualizar moto:', error)
    if (error.response?.status === 404) {
      throw new Error('Moto no encontrada')
    }
    if (error.response?.status === 400) {
      throw new Error('Datos de moto inválidos. Verifique los campos obligatorios.')
    }
    throw error
  }
}

/**
 * Eliminar moto (soft delete)
 * Endpoint: DELETE /api/motos/{id}
 * Cambia campo 'activo' a false
 */
export const eliminarMoto = async (id) => {
  try {
    console.log('🗑️ Eliminando moto (soft delete):', id)
    const response = await api.delete(`/motos/${id}`)
    console.log('✅ Moto eliminada exitosamente')
    return response.data
  } catch (error) {
    console.error('❌ Error al eliminar moto:', error)
    if (error.response?.status === 404) {
      throw new Error('Moto no encontrada')
    }
    throw error
  }
}

/**
 * Eliminar moto permanentemente
 * Endpoint: DELETE /api/motos/{id}/permanente
 */
export const eliminarMotoPermanente = async (id) => {
  try {
    console.log('🗑️ Eliminando moto permanentemente:', id)
    const response = await api.delete(`/motos/${id}/permanente`)
    console.log('✅ Moto eliminada permanentemente')
    return response.data
  } catch (error) {
    console.error('❌ Error al eliminar moto permanentemente:', error)
    if (error.response?.status === 404) {
      throw new Error('Moto no encontrada')
    }
    throw error
  }
}

/**
 * Reactivar moto inactiva
 * Endpoint: PUT /api/motos/{id} con entidad Moto {activo: true}
 * Permite reactivar motos desactivadas usando el campo activo
 */
export const reactivarMoto = async (id) => {
  try {
    console.log('🔄 Reactivando moto:', id)
    
    // Primero obtener la moto actual
    const motoActual = await obtenerMotoPorId(id)
    
    // Actualizar solo el campo activo
    const motoReactivada = {
      ...motoActual,
      activo: true
    }
    
    const response = await api.put(`/motos/${id}`, motoReactivada)
    console.log('✅ Moto reactivada exitosamente')
    return response.data
  } catch (error) {
    console.error('❌ Error al reactivar moto:', error)
    throw error
  }
}

// ========== BÚSQUEDAS ESPECÍFICAS ==========

/**
 * Buscar moto por placa
 * Endpoint: GET /api/motos/placa/{placa}
 */
export const buscarMotoPorPlaca = async (placa) => {
  try {
    console.log('🔍 Buscando moto por placa:', placa)
    const response = await api.get(`/motos/placa/${placa}`)
    console.log('✅ Moto encontrada por placa:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error al buscar moto por placa:', error)
    if (error.response?.status === 404) {
      return null // No encontrada
    }
    throw error
  }
}

/**
 * Buscar moto activa por placa
 * Endpoint: GET /api/motos/activa/placa/{placa}
 */
export const buscarMotoActivaPorPlaca = async (placa) => {
  try {
    console.log('🔍 Buscando moto activa por placa:', placa)
    const response = await api.get(`/motos/activa/placa/${placa}`)
    console.log('✅ Moto activa encontrada por placa:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error al buscar moto activa por placa:', error)
    if (error.response?.status === 404) {
      return null // No encontrada
    }
    throw error
  }
}

/**
 * Obtener motos por cliente
 * Endpoint: POST /api/motos/cliente
 * Body: Cliente (entidad completa)
 */
export const obtenerMotosPorCliente = async (cliente) => {
  try {
    console.log('🔍 Obteniendo motos por cliente:', cliente.idCliente)
    const response = await api.post('/motos/cliente', cliente)
    console.log('✅ Motos del cliente obtenidas:', response.data?.length || 0)
    return response.data || []
  } catch (error) {
    console.error('❌ Error al obtener motos por cliente:', error)
    throw error
  }
}

// ========== VALIDACIONES ==========

/**
 * Verificar si una placa ya existe
 * Usa endpoint GET /api/motos/placa/{placa}
 */
export const existePlaca = async (placa) => {
  try {
    const moto = await buscarMotoPorPlaca(placa)
    return moto !== null
  } catch (error) {
    console.error('❌ Error al verificar existencia de placa:', error)
    return false
  }
}

/**
 * Verificar si una placa ya existe excluyendo una moto específica
 * Para modo edición, buscar moto existente y verificar si es diferente
 */
export const existePlacaExcluyendoMoto = async (placa, idMoto) => {
  try {
    const moto = await buscarMotoPorPlaca(placa)
    // Si no existe, no hay duplicado
    if (!moto) return false
    // Si existe pero es la misma moto, no hay duplicado
    return moto.idMoto !== idMoto
  } catch (error) {
    console.error('❌ Error al verificar existencia de placa excluyendo moto:', error)
    return false
  }
}

/**
 * Verificar si un VIN ya existe
 * Nota: Backend no tiene endpoint específico para VIN, usar búsqueda general y filtrar
 */
export const existeVin = async (vin) => {
  try {
    if (!vin || vin.trim() === '') return false
    
    const todasLasMotos = await obtenerTodasLasMotos()
    const motoConVin = todasLasMotos.find(moto => 
      moto.vin && moto.vin.trim().toLowerCase() === vin.trim().toLowerCase()
    )
    return motoConVin !== undefined
  } catch (error) {
    console.error('❌ Error al verificar existencia de VIN:', error)
    return false
  }
}

/**
 * Verificar si un VIN ya existe excluyendo una moto específica
 */
export const existeVinExcluyendoMoto = async (vin, idMoto) => {
  try {
    if (!vin || vin.trim() === '') return false
    
    const todasLasMotos = await obtenerTodasLasMotos()
    const motoConVin = todasLasMotos.find(moto => 
      moto.vin && 
      moto.vin.trim().toLowerCase() === vin.trim().toLowerCase() &&
      moto.idMoto !== idMoto
    )
    return motoConVin !== undefined
  } catch (error) {
    console.error('❌ Error al verificar existencia de VIN excluyendo moto:', error)
    return false
  }
}

// ========== OBJETO EXPORTADO POR DEFECTO ==========

const motoService = {
  // CRUD
  obtenerTodas: obtenerTodasLasMotos,
  obtenerPorId: obtenerMotoPorId,
  crear: crearMoto,
  actualizar: actualizarMoto,
  eliminar: eliminarMoto,
  eliminarPermanente: eliminarMotoPermanente,
  reactivar: reactivarMoto,
  
  // Búsquedas
  buscarPorPlaca: buscarMotoPorPlaca,
  buscarActivaPorPlaca: buscarMotoActivaPorPlaca,
  obtenerPorCliente: obtenerMotosPorCliente,
  
  // Validaciones
  existePlaca,
  existePlacaExcluyendoMoto,
  existeVin,
  existeVinExcluyendoMoto
}

export default motoService
