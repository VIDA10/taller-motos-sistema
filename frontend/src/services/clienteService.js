import api from './api'

/**
 * Servicio para gestión de clientes
 * Basado 100% en endpoints reales de ClienteController.java
 * 
 * Endpoints disponibles:
 * - GET /api/clientes - Obtener todos los clientes
 * - GET /api/clientes/{id} - Obtener cliente por ID
 * - POST /api/clientes - Crear nuevo cliente
 * - PUT /api/clientes/{id} - Actualizar cliente
 * - DELETE /api/clientes/{id} - Eliminar cliente (soft delete)
 * - DELETE /api/clientes/{id}/permanente - Eliminar permanentemente
 * - GET /api/clientes/telefono/{telefono} - Buscar por teléfono
 * - GET /api/clientes/dni/{dni} - Buscar por DNI
 * - GET /api/clientes/email/{email} - Buscar por email
 * - GET /api/clientes/nombre/{nombre} - Buscar por nombre
 * - GET /api/clientes/activos - Obtener solo activos
 * - GET /api/clientes/inactivos - Obtener solo inactivos
 * - GET /api/clientes/fechas - Búsqueda por rango de fechas
 */

// ========== OPERACIONES CRUD ==========

/**
 * Obtener todos los clientes
 * Endpoint: GET /api/clientes
 * Retorna: Array de Cliente (entidad completa)
 */
export const obtenerTodosLosClientes = async () => {
  try {
    const response = await api.get('/clientes')
    return response.data
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    throw error
  }
}

/**
 * Obtener cliente por ID
 * Endpoint: GET /api/clientes/{id}
 * Retorna: Cliente (entidad completa) o 404
 */
export const obtenerClientePorId = async (id) => {
  try {
    const response = await api.get(`/clientes/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error al obtener cliente ${id}:`, error)
    throw error
  }
}

/**
 * Crear nuevo cliente
 * Endpoint: POST /api/clientes
 * Body: CreateClienteDTO - campos: nombre*, telefono*, email, dni, direccion
 * Campos obligatorios: nombre, telefono
 * Campos opcionales: email, dni, direccion
 * Validaciones: email único, dni único, telefono único
 */
export const crearCliente = async (clienteData) => {
  try {
    // Validar que los datos correspondan al CreateClienteDTO
    const createDTO = {
      nombre: clienteData.nombre,
      telefono: clienteData.telefono,
      email: clienteData.email || null,
      dni: clienteData.dni || null,
      direccion: clienteData.direccion || null
    };
    
    const response = await api.post('/clientes', createDTO)
    return response.data
  } catch (error) {
    console.error('Error al crear cliente:', error)
    throw error
  }
}

/**
 * Actualizar cliente existente
 * Endpoint: PUT /api/clientes/{id}
 * Body: UpdateClienteDTO - campos: nombre*, telefono*, email, dni, direccion, activo
 * Campos obligatorios: nombre, telefono
 * Campos opcionales: email, dni, direccion, activo
 * Permite reactivar clientes con campo activo
 */
export const actualizarCliente = async (id, clienteData) => {
  try {
    // Validar que los datos correspondan al UpdateClienteDTO
    const updateDTO = {
      nombre: clienteData.nombre,
      telefono: clienteData.telefono,
      email: clienteData.email || null,
      dni: clienteData.dni || null,
      direccion: clienteData.direccion || null,
      activo: clienteData.activo !== undefined ? clienteData.activo : true
    };
    
    const response = await api.put(`/clientes/${id}`, updateDTO)
    return response.data
  } catch (error) {
    console.error(`Error al actualizar cliente ${id}:`, error)
    throw error
  }
}

/**
 * Eliminar cliente (soft delete)
 * Endpoint: DELETE /api/clientes/{id}
 * Cambia campo 'activo' a false
 */
export const eliminarCliente = async (id) => {
  try {
    await api.delete(`/clientes/${id}`)
  } catch (error) {
    console.error(`Error al eliminar cliente ${id}:`, error)
    throw error
  }
}

/**
 * Eliminar cliente permanentemente
 * Endpoint: DELETE /api/clientes/{id}/permanente
 */
export const eliminarClientePermanente = async (id) => {
  try {
    await api.delete(`/clientes/${id}/permanente`)
  } catch (error) {
    console.error(`Error al eliminar permanentemente cliente ${id}:`, error)
    throw error
  }
}

/**
 * Desactivar cliente (solo desactivar disponible)
 * Endpoint: DELETE /api/clientes/{id} (soft delete confirmado que funciona)
 * Nota: Reactivación no disponible en esta versión del backend
 */
export const desactivarCliente = async (id) => {
  try {
    await api.delete(`/clientes/${id}`)
    // DELETE no retorna data, solo confirma éxito
  } catch (error) {
    console.error(`Error al desactivar cliente ${id}:`, error)
    throw error
  }
}

/**
 * Reactivar cliente inactivo
 * Endpoint: PUT /api/clientes/{id} con UpdateClienteDTO {activo: true}
 * Permite reactivar clientes desactivados usando el campo activo
 */
export const reactivarCliente = async (id) => {
  try {
    // Obtener datos actuales del cliente
    const clienteActual = await obtenerClientePorId(id)
    
    // Usar UpdateClienteDTO para reactivar
    const updateDTO = {
      nombre: clienteActual.nombre,
      telefono: clienteActual.telefono,
      email: clienteActual.email || null,
      dni: clienteActual.dni || null,
      direccion: clienteActual.direccion || null,
      activo: true // Reactivar cliente
    }
    
    const response = await api.put(`/clientes/${id}`, updateDTO)
    return response.data
  } catch (error) {
    console.error(`Error al reactivar cliente ${id}:`, error)
    throw error
  }
}

// ========== BÚSQUEDAS ESPECÍFICAS ==========

/**
 * Buscar cliente por teléfono
 * Endpoint: GET /api/clientes/telefono/{telefono}
 */
export const buscarClientePorTelefono = async (telefono) => {
  try {
    const response = await api.get(`/clientes/telefono/${telefono}`)
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      return null // Cliente no encontrado
    }
    console.error(`Error al buscar cliente por teléfono ${telefono}:`, error)
    throw error
  }
}

/**
 * Buscar cliente por DNI
 * Endpoint: GET /api/clientes/dni/{dni}
 */
export const buscarClientePorDni = async (dni) => {
  try {
    const response = await api.get(`/clientes/dni/${dni}`)
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      return null // Cliente no encontrado
    }
    console.error(`Error al buscar cliente por DNI ${dni}:`, error)
    throw error
  }
}

/**
 * Buscar cliente por email
 * Endpoint: GET /api/clientes/email/{email}
 */
export const buscarClientePorEmail = async (email) => {
  try {
    const response = await api.get(`/clientes/email/${encodeURIComponent(email)}`)
    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      return null // Cliente no encontrado
    }
    console.error(`Error al buscar cliente por email ${email}:`, error)
    throw error
  }
}

/**
 * Buscar clientes por nombre
 * Endpoint: GET /api/clientes/nombre/{nombre}
 */
export const buscarClientesPorNombre = async (nombre) => {
  try {
    const response = await api.get(`/clientes/nombre/${encodeURIComponent(nombre)}`)
    return response.data
  } catch (error) {
    console.error(`Error al buscar clientes por nombre ${nombre}:`, error)
    throw error
  }
}

// ========== FILTROS POR ESTADO ==========

/**
 * Obtener solo clientes activos
 * Endpoint: GET /api/clientes/activos/ordenados
 */
export const obtenerClientesActivos = async () => {
  try {
    const response = await api.get('/clientes/activos/ordenados')
    return response.data
  } catch (error) {
    console.error('Error al obtener clientes activos:', error)
    throw error
  }
}

/**
 * Obtener solo clientes inactivos
 * Endpoint: GET /api/clientes/inactivos
 */
export const obtenerClientesInactivos = async () => {
  try {
    const response = await api.get('/clientes/inactivos')
    return response.data
  } catch (error) {
    console.error('Error al obtener clientes inactivos:', error)
    throw error
  }
}

// ========== BÚSQUEDAS POR FECHAS ==========

/**
 * Buscar clientes por rango de fechas
 * Endpoint: GET /api/clientes/fechas?desde={fecha}&hasta={fecha}
 * Fechas en formato: YYYY-MM-DD
 */
export const buscarClientesPorFechas = async (fechaDesde, fechaHasta) => {
  try {
    const params = new URLSearchParams()
    if (fechaDesde) params.append('desde', fechaDesde)
    if (fechaHasta) params.append('hasta', fechaHasta)
    
    const response = await api.get(`/clientes/fechas?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error('Error al buscar clientes por fechas:', error)
    throw error
  }
}

// ========== VALIDACIONES CORREGIDAS ==========

/**
 * Verificar si un teléfono ya existe
 * CORREGIDO: Usa endpoint GET /api/clientes/existe/telefono/{telefono} que SÍ existe
 */
export const existeTelefono = async (telefono) => {
  try {
    const response = await api.get(`/clientes/existe/telefono/${telefono}`)
    return response.data // Retorna boolean directamente
  } catch (error) {
    console.error(`Error al verificar teléfono ${telefono}:`, error)
    return false // En caso de error, asumir que no existe
  }
}

/**
 * Verificar si un teléfono ya existe excluyendo un cliente específico
 * CORREGIDO: Para modo edición, buscar cliente existente y verificar si es diferente
 */
export const existeTelefonoExcluyendoCliente = async (telefono, idCliente) => {
  try {
    // Primero verificar si existe el teléfono
    const existe = await existeTelefono(telefono)
    if (!existe) {
      return false // No existe, está disponible
    }
    
    // Si existe, buscar el cliente que lo tiene
    const clienteExistente = await buscarClientePorTelefono(telefono)
    if (!clienteExistente) {
      return false // No se encontró, está disponible
    }
    
    // Verificar si es diferente al cliente actual
    return clienteExistente.idCliente !== idCliente
  } catch (error) {
    console.error(`Error al verificar teléfono ${telefono} excluyendo cliente ${idCliente}:`, error)
    return false
  }
}

/**
 * Verificar si un DNI ya existe
 * CORREGIDO: Usa endpoint GET /api/clientes/existe/dni/{dni} que SÍ existe
 */
export const existeDni = async (dni) => {
  try {
    const response = await api.get(`/clientes/existe/dni/${dni}`)
    return response.data // Retorna boolean directamente
  } catch (error) {
    console.error(`Error al verificar DNI ${dni}:`, error)
    return false // En caso de error, asumir que no existe
  }
}

/**
 * Verificar si un DNI ya existe excluyendo un cliente específico
 * CORREGIDO: Para modo edición, buscar cliente existente y verificar si es diferente
 */
export const existeDniExcluyendoCliente = async (dni, idCliente) => {
  try {
    // Primero verificar si existe el DNI
    const existe = await existeDni(dni)
    if (!existe) {
      return false // No existe, está disponible
    }
    
    // Si existe, buscar el cliente que lo tiene
    const clienteExistente = await buscarClientePorDni(dni)
    if (!clienteExistente) {
      return false // No se encontró, está disponible
    }
    
    // Verificar si es diferente al cliente actual
    return clienteExistente.idCliente !== idCliente
  } catch (error) {
    console.error(`Error al verificar DNI ${dni} excluyendo cliente ${idCliente}:`, error)
    return false
  }
}

/**
 * Verificar si un email ya existe
 * CORREGIDO: Usa endpoint GET /api/clientes/existe/email/{email} que SÍ existe
 */
export const existeEmail = async (email) => {
  try {
    const response = await api.get(`/clientes/existe/email/${encodeURIComponent(email)}`)
    return response.data // Retorna boolean directamente
  } catch (error) {
    console.error(`Error al verificar email ${email}:`, error)
    return false // En caso de error, asumir que no existe
  }
}

/**
 * Verificar si un email ya existe excluyendo un cliente específico
 * CORREGIDO: Para modo edición, buscar cliente existente y verificar si es diferente
 */
export const existeEmailExcluyendoCliente = async (email, idCliente) => {
  try {
    // Primero verificar si existe el email
    const existe = await existeEmail(email)
    if (!existe) {
      return false // No existe, está disponible
    }
    
    // Si existe, buscar el cliente que lo tiene
    const clienteExistente = await buscarClientePorEmail(email)
    if (!clienteExistente) {
      return false // No se encontró, está disponible
    }
    
    // Verificar si es diferente al cliente actual
    return clienteExistente.idCliente !== idCliente
  } catch (error) {
    console.error(`Error al verificar email ${email} excluyendo cliente ${idCliente}:`, error)
    return false
  }
}

// ========== ESTADÍSTICAS ==========

/**
 * Obtener conteo de clientes
 * Endpoint: GET /api/clientes/stats/count
 */
export const obtenerConteoClientes = async () => {
  try {
    const response = await api.get('/clientes/stats/count')
    return response.data
  } catch (error) {
    console.error('Error al obtener conteo de clientes:', error)
    throw error
  }
}

/**
 * Obtener estadísticas de clientes por mes
 * Endpoint: GET /api/clientes/stats/por-mes?year={año}
 */
export const obtenerEstadisticasPorMes = async (year) => {
  try {
    const params = year ? `?year=${year}` : ''
    const response = await api.get(`/clientes/stats/por-mes${params}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener estadísticas por mes:', error)
    throw error
  }
}

// ========== BÚSQUEDAS AVANZADAS ADICIONALES ==========

/**
 * Buscar clientes por teléfono que contenga el texto
 * Endpoint: GET /api/clientes/telefono/contiene/{telefono}
 */
export const buscarPorTelefonoContiene = async (telefono) => {
  try {
    const response = await api.get(`/clientes/telefono/contiene/${telefono}`)
    return response.data
  } catch (error) {
    console.error(`Error al buscar por teléfono contiene ${telefono}:`, error)
    throw error
  }
}

/**
 * Buscar clientes por email que contenga el texto
 * Endpoint: GET /api/clientes/email/contiene/{email}
 */
export const buscarPorEmailContiene = async (email) => {
  try {
    const response = await api.get(`/clientes/email/contiene/${encodeURIComponent(email)}`)
    return response.data
  } catch (error) {
    console.error(`Error al buscar por email contiene ${email}:`, error)
    throw error
  }
}

/**
 * Buscar clientes por nombre que comience con el texto
 * Endpoint: GET /api/clientes/buscar/nombre/comienza?nombre={texto}
 */
export const buscarPorNombreComienza = async (nombre) => {
  try {
    const response = await api.get(`/clientes/buscar/nombre/comienza?nombre=${encodeURIComponent(nombre)}`)
    return response.data
  } catch (error) {
    console.error(`Error al buscar por nombre comienza con ${nombre}:`, error)
    throw error
  }
}

/**
 * Buscar clientes por dirección
 * Endpoint: GET /api/clientes/buscar/direccion?direccion={texto}
 */
export const buscarPorDireccion = async (direccion) => {
  try {
    const response = await api.get(`/clientes/buscar/direccion?direccion=${encodeURIComponent(direccion)}`)
    return response.data
  } catch (error) {
    console.error(`Error al buscar por dirección ${direccion}:`, error)
    throw error
  }
}

/**
 * Búsqueda combinada por nombre o teléfono
 * Endpoint: GET /api/clientes/buscar/nombre-telefono?nombre={}&telefono={}
 */
export const buscarPorNombreOTelefono = async (nombre, telefono) => {
  try {
    const params = new URLSearchParams()
    if (nombre) params.append('nombre', nombre)
    if (telefono) params.append('telefono', telefono)
    
    const response = await api.get(`/clientes/buscar/nombre-telefono?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error('Error al buscar por nombre o teléfono:', error)
    throw error
  }
}

/**
 * Búsqueda general en clientes activos
 * Endpoint: GET /api/clientes/buscar/activos?busqueda={texto}
 */
export const busquedaGeneralActivos = async (busqueda) => {
  try {
    const response = await api.get(`/clientes/buscar/activos?busqueda=${encodeURIComponent(busqueda)}`)
    return response.data
  } catch (error) {
    console.error(`Error en búsqueda general activos ${busqueda}:`, error)
    throw error
  }
}

// ========== FILTROS AVANZADOS POR ESTADO ==========

/**
 * Obtener clientes activos ordenados alfabéticamente
 * Endpoint: GET /api/clientes/activos/ordenados
 */
export const obtenerActivosOrdenados = async () => {
  try {
    const response = await api.get('/clientes/activos/ordenados')
    return response.data
  } catch (error) {
    console.error('Error al obtener clientes activos ordenados:', error)
    throw error
  }
}

/**
 * Obtener clientes sin dirección registrada
 * Endpoint: GET /api/clientes/sin-direccion
 */
export const obtenerSinDireccion = async () => {
  try {
    const response = await api.get('/clientes/sin-direccion')
    return response.data
  } catch (error) {
    console.error('Error al obtener clientes sin dirección:', error)
    throw error
  }
}

/**
 * Obtener clientes con dirección registrada
 * Endpoint: GET /api/clientes/con-direccion
 */
export const obtenerConDireccion = async () => {
  try {
    const response = await api.get('/clientes/con-direccion')
    return response.data
  } catch (error) {
    console.error('Error al obtener clientes con dirección:', error)
    throw error
  }
}

// ========== FILTROS TEMPORALES AVANZADOS ==========

/**
 * Obtener clientes creados después de una fecha
 * Endpoint: GET /api/clientes/creados/despues-de?fechaDesde={ISO_DateTime}
 */
export const obtenerCreadosDespuesDe = async (fechaDesde) => {
  try {
    const response = await api.get(`/clientes/creados/despues-de?fechaDesde=${fechaDesde}`)
    return response.data
  } catch (error) {
    console.error(`Error al obtener clientes creados después de ${fechaDesde}:`, error)
    throw error
  }
}

/**
 * Obtener clientes actualizados después de una fecha
 * Endpoint: GET /api/clientes/actualizados/despues-de?fechaDesde={ISO_DateTime}
 */
export const obtenerActualizadosDespuesDe = async (fechaDesde) => {
  try {
    const response = await api.get(`/clientes/actualizados/despues-de?fechaDesde=${fechaDesde}`)
    return response.data
  } catch (error) {
    console.error(`Error al obtener clientes actualizados después de ${fechaDesde}:`, error)
    throw error
  }
}

// ========== CONTADORES ESPECÍFICOS ==========

/**
 * Contar clientes con email registrado
 * Endpoint: GET /api/clientes/contar/con-email
 */
export const contarConEmail = async () => {
  try {
    const response = await api.get('/clientes/contar/con-email')
    return response.data
  } catch (error) {
    console.error('Error al contar clientes con email:', error)
    throw error
  }
}

/**
 * Contar clientes con DNI registrado
 * Endpoint: GET /api/clientes/contar/con-dni
 */
export const contarConDni = async () => {
  try {
    const response = await api.get('/clientes/contar/con-dni')
    return response.data
  } catch (error) {
    console.error('Error al contar clientes con DNI:', error)
    throw error
  }
}

// ========== OBJETO SERVICIO EXPORTADO ACTUALIZADO ==========

const clienteService = {
  // CRUD básico
  getAll: obtenerTodosLosClientes,
  getById: obtenerClientePorId,
  create: crearCliente,
  update: actualizarCliente,
  delete: eliminarCliente,
  deletePermanent: eliminarClientePermanente,
  
  // Operaciones de estado
  deactivate: desactivarCliente,
  reactivate: reactivarCliente,
  
  // Búsquedas específicas básicas
  findByPhone: buscarClientePorTelefono,
  findByDni: buscarClientePorDni,
  findByEmail: buscarClientePorEmail,
  findByName: buscarClientesPorNombre,
  
  // Búsquedas avanzadas adicionales
  findByPhoneContains: buscarPorTelefonoContiene,
  findByEmailContains: buscarPorEmailContiene,
  findByNameStartsWith: buscarPorNombreComienza,
  findByAddress: buscarPorDireccion,
  findByNameOrPhone: buscarPorNombreOTelefono,
  searchActiveClients: busquedaGeneralActivos,
  
  // Filtros por estado básicos
  getActive: obtenerClientesActivos,
  getInactive: obtenerClientesInactivos,
  
  // Filtros avanzados por estado
  getActiveSorted: obtenerActivosOrdenados,
  getWithoutAddress: obtenerSinDireccion,
  getWithAddress: obtenerConDireccion,
  
  // Búsquedas por fechas básicas
  findByDateRange: buscarClientesPorFechas,
  
  // Filtros temporales avanzados
  getCreatedAfter: obtenerCreadosDespuesDe,
  getUpdatedAfter: obtenerActualizadosDespuesDe,
  
  // Validaciones de existencia
  checkPhoneExists: existeTelefono,
  checkDniExists: existeDni,
  checkEmailExists: existeEmail,
  
  // Validaciones con exclusión para edición
  checkPhoneExistsExcluding: existeTelefonoExcluyendoCliente,
  checkDniExistsExcluding: existeDniExcluyendoCliente,
  checkEmailExistsExcluding: existeEmailExcluyendoCliente,
  
  // Estadísticas básicas
  getCount: obtenerConteoClientes,
  getStatsByMonth: obtenerEstadisticasPorMes,
  
  // Contadores específicos
  countWithEmail: contarConEmail,
  countWithDni: contarConDni
}

export { clienteService }
export default clienteService
