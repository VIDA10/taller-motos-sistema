import api from './api'

/**
 * Servicio para gestión de usuarios
 * Basado 100% en endpoints reales de UsuarioController.java
 * 
 * Endpoints disponibles:
 * - GET /api/usuarios - Obtener todos los usuarios
 * - GET /api/usuarios/{id} - Obtener usuario por ID
 * - POST /api/usuarios - Crear nuevo usuario
 * - PUT /api/usuarios/{id} - Actualizar usuario
 * - DELETE /api/usuarios/{id} - Eliminar usuario (soft delete)
 * - DELETE /api/usuarios/{id}/permanente - Eliminar permanentemente
 * - GET /api/usuarios/username/{username} - Buscar por username
 * - GET /api/usuarios/email/{email} - Buscar por email
 * - GET /api/usuarios/rol/{rol} - Obtener por rol
 * - GET /api/usuarios/estado/{activo} - Obtener por estado
 * - GET /api/usuarios/buscar?nombre={nombre} - Buscar por nombre
 * - GET /api/usuarios/validar/username/{username} - Verificar username
 * - GET /api/usuarios/validar/email/{email} - Verificar email
 */

// ========== OPERACIONES CRUD ==========

/**
 * Obtener todos los usuarios
 * Endpoint: GET /api/usuarios
 * Retorna: Array de UsuarioResponseDTO
 */
export const obtenerTodosLosUsuarios = async () => {
  try {
    const response = await api.get('/usuarios')
    return response.data
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    throw error
  }
}

/**
 * Obtener usuario por ID
 * Endpoint: GET /api/usuarios/{id}
 * Retorna: UsuarioResponseDTO o 404
 */
export const obtenerUsuarioPorId = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error)
    throw error
  }
}

/**
 * Crear nuevo usuario
 * Endpoint: POST /api/usuarios
 * Body: CreateUsuarioDTO - campos: username*, email*, password*, nombreCompleto*, rol*
 * Campos obligatorios: username, email, password, nombreCompleto, rol
 * Validaciones: username único, email único, rol válido
 */
export const crearUsuario = async (usuarioData) => {
  try {
    const response = await api.post('/usuarios', usuarioData)
    return response.data
  } catch (error) {
    console.error('Error al crear usuario:', error)
    throw error
  }
}

/**
 * Actualizar usuario existente
 * Endpoint: PUT /api/usuarios/{id}
 * Body: UpdateUsuarioDTO - campos opcionales: username, email, password, nombreCompleto, rol, activo
 * Permite reactivar usuarios con campo activo
 */
export const actualizarUsuario = async (id, usuarioData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, usuarioData)
    return response.data
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    throw error
  }
}

/**
 * Eliminar usuario (soft delete)
 * Endpoint: DELETE /api/usuarios/{id}
 * Cambia campo 'activo' a false
 */
export const eliminarUsuario = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`)
    return response.data
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    throw error
  }
}

/**
 * Eliminar usuario permanentemente
 * Endpoint: DELETE /api/usuarios/{id}/permanente
 */
export const eliminarUsuarioPermanente = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}/permanente`)
    return response.data
  } catch (error) {
    console.error('Error al eliminar usuario permanentemente:', error)
    throw error
  }
}

// ========== BÚSQUEDAS ESPECÍFICAS ==========

/**
 * Buscar usuario por username
 * Endpoint: GET /api/usuarios/username/{username}
 */
export const buscarUsuarioPorUsername = async (username) => {
  try {
    const response = await api.get(`/usuarios/username/${username}`)
    return response.data
  } catch (error) {
    console.error('Error al buscar usuario por username:', error)
    throw error
  }
}

/**
 * Buscar usuario por email
 * Endpoint: GET /api/usuarios/email/{email}
 */
export const buscarUsuarioPorEmail = async (email) => {
  try {
    const response = await api.get(`/usuarios/email/${email}`)
    return response.data
  } catch (error) {
    console.error('Error al buscar usuario por email:', error)
    throw error
  }
}

/**
 * Buscar usuarios por nombre completo
 * Endpoint: GET /api/usuarios/buscar?nombre={nombre}
 */
export const buscarUsuariosPorNombre = async (nombre) => {
  try {
    const response = await api.get(`/usuarios/buscar?nombre=${encodeURIComponent(nombre)}`)
    return response.data
  } catch (error) {
    console.error('Error al buscar usuarios por nombre:', error)
    throw error
  }
}

// ========== FILTROS POR ESTADO ==========

/**
 * Obtener usuarios por estado activo
 * Endpoint: GET /api/usuarios/estado/{activo}
 */
export const obtenerUsuariosPorEstado = async (activo) => {
  try {
    const response = await api.get(`/usuarios/estado/${activo}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener usuarios por estado:', error)
    throw error
  }
}

/**
 * Obtener usuarios activos ordenados por nombre
 * Endpoint: GET /api/usuarios/activos/ordenados
 */
export const obtenerUsuariosActivosOrdenados = async () => {
  try {
    const response = await api.get('/usuarios/activos/ordenados')
    return response.data
  } catch (error) {
    console.error('Error al obtener usuarios activos ordenados:', error)
    throw error
  }
}

// ========== FILTROS POR ROL ==========

/**
 * Obtener usuarios por rol
 * Endpoint: GET /api/usuarios/rol/{rol}
 */
export const obtenerUsuariosPorRol = async (rol) => {
  try {
    const response = await api.get(`/usuarios/rol/${rol}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener usuarios por rol:', error)
    throw error
  }
}

/**
 * Obtener usuarios activos por rol
 * Endpoint: GET /api/usuarios/activos/rol/{rol}
 */
export const obtenerUsuariosActivosPorRol = async (rol) => {
  try {
    const response = await api.get(`/usuarios/activos/rol/${rol}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener usuarios activos por rol:', error)
    throw error
  }
}

// ========== VALIDACIONES ==========

/**
 * Verificar si existe username
 * Endpoint: GET /api/usuarios/validar/username/{username}
 */
export const existeUsername = async (username) => {
  try {
    const response = await api.get(`/usuarios/validar/username/${username}`)
    return response.data
  } catch (error) {
    console.error('Error al validar username:', error)
    throw error
  }
}

/**
 * Verificar si existe email
 * Endpoint: GET /api/usuarios/validar/email/{email}
 */
export const existeEmail = async (email) => {
  try {
    const response = await api.get(`/usuarios/validar/email/${email}`)
    return response.data
  } catch (error) {
    console.error('Error al validar email:', error)
    throw error
  }
}

/**
 * Verificar si existe username excluyendo un usuario específico
 * Para modo edición, verificar si el username pertenece a otro usuario
 */
export const existeUsernameExcluyendoUsuario = async (username, idUsuario) => {
  try {
    const usuario = await buscarUsuarioPorUsername(username)
    return usuario && usuario.idUsuario !== idUsuario
  } catch (error) {
    if (error.response?.status === 404) {
      return false // No existe, por lo tanto no hay conflicto
    }
    throw error
  }
}

/**
 * Verificar si existe email excluyendo un usuario específico
 * Para modo edición, verificar si el email pertenece a otro usuario
 */
export const existeEmailExcluyendoUsuario = async (email, idUsuario) => {
  try {
    const usuario = await buscarUsuarioPorEmail(email)
    return usuario && usuario.idUsuario !== idUsuario
  } catch (error) {
    if (error.response?.status === 404) {
      return false // No existe, por lo tanto no hay conflicto
    }
    throw error
  }
}

// ========== OPERACIONES ESPECIALES ==========

/**
 * Cambiar estado activo de usuario
 * Endpoint: PATCH /api/usuarios/{id}/estado/{nuevoEstado}
 */
export const cambiarEstadoUsuario = async (id, nuevoEstado) => {
  try {
    const response = await api.patch(`/usuarios/${id}/estado/${nuevoEstado}`)
    return response.data
  } catch (error) {
    console.error('Error al cambiar estado de usuario:', error)
    throw error
  }
}

/**
 * Cambiar password de usuario
 * Endpoint: PATCH /api/usuarios/{id}/password
 */
export const cambiarPasswordUsuario = async (id, nuevoPassword) => {
  try {
    const response = await api.patch(`/usuarios/${id}/password`, nuevoPassword)
    return response.data
  } catch (error) {
    console.error('Error al cambiar password de usuario:', error)
    throw error
  }
}

// Exportación por defecto con todas las funciones
const usuarioService = {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  eliminarUsuarioPermanente,
  buscarUsuarioPorUsername,
  buscarUsuarioPorEmail,
  buscarUsuariosPorNombre,
  obtenerUsuariosPorEstado,
  obtenerUsuariosActivosOrdenados,
  obtenerUsuariosPorRol,
  obtenerUsuariosActivosPorRol,
  existeUsername,
  existeEmail,
  existeUsernameExcluyendoUsuario,
  existeEmailExcluyendoUsuario,
  cambiarEstadoUsuario,
  cambiarPasswordUsuario
}

export default usuarioService
