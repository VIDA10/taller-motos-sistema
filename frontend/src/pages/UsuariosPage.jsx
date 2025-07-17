import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Alert,
  Button,
  Paper,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material'
import { Add as AddIcon, People as PeopleIcon } from '@mui/icons-material'
import { hasPermission } from '../utils/permissions'
import UsuariosList from '../components/usuarios/UsuariosList'
import UsuarioFilters from '../components/usuarios/UsuarioFilters'
import UsuarioForm from '../components/usuarios/UsuarioForm'
import UsuarioDetail from '../components/usuarios/UsuarioDetail'
import usuarioService from '../services/usuarioService'

/**
 * Página principal de gestión de usuarios
 * Integra filtros, lista y formulario de usuarios
 * Basada en la estructura de ClientesPage.jsx
 */
const UsuariosPage = () => {
  const { user } = useSelector((state) => state.auth)

  // Estados principales
  const [usuarios, setUsuarios] = useState([])
  const [filteredUsuarios, setFilteredUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados del formulario
  const [formOpen, setFormOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  // Estados de confirmación
  const [deleteDialog, setDeleteDialog] = useState({ open: false, usuario: null })
  const [toggleDialog, setToggleDialog] = useState({ open: false, usuario: null })

  // Estado para el modal de detalles
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState(null)

  // Estados de notificaciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Verificar permisos
  const canManageUsers = hasPermission(user, 'usuarios', 'read')
  const canCreateUsers = hasPermission(user, 'usuarios', 'create')

  // Cargar usuarios al montar el componente
  useEffect(() => {
    if (canManageUsers) {
      loadUsuarios()
    }
  }, [canManageUsers])

  // Aplicar filtros cuando cambien los usuarios o filtros
  const [currentFilters, setCurrentFilters] = useState({})
  
  const handleFilterChange = (filters) => {
    setCurrentFilters(filters)
  }

  // Aplicar filtros con useMemo para optimizar rendimiento
  const applyFilters = useMemo(() => {
    let filtered = [...usuarios]

    // Filtro por nombre completo
    if (currentFilters.nombreCompleto) {
      const searchTerm = currentFilters.nombreCompleto.toLowerCase()
      filtered = filtered.filter(usuario =>
        usuario.nombreCompleto.toLowerCase().includes(searchTerm)
      )
    }

    // Filtro por username
    if (currentFilters.username) {
      const searchTerm = currentFilters.username.toLowerCase()
      filtered = filtered.filter(usuario =>
        usuario.username.toLowerCase().includes(searchTerm)
      )
    }

    // Filtro por email
    if (currentFilters.email) {
      const searchTerm = currentFilters.email.toLowerCase()
      filtered = filtered.filter(usuario =>
        usuario.email.toLowerCase().includes(searchTerm)
      )
    }

    // Filtro por rol
    if (currentFilters.rol && currentFilters.rol !== 'todos') {
      filtered = filtered.filter(usuario => usuario.rol === currentFilters.rol)
    }

    // Filtro por estado
    if (currentFilters.estado && currentFilters.estado !== 'todos') {
      const isActive = currentFilters.estado === 'activos'
      filtered = filtered.filter(usuario => usuario.activo === isActive)
    }

    // Filtro por rango de fechas
    if (currentFilters.fechaDesde) {
      const fechaDesde = new Date(currentFilters.fechaDesde)
      filtered = filtered.filter(usuario => {
        const fechaCreacion = new Date(usuario.createdAt)
        return fechaCreacion >= fechaDesde
      })
    }

    if (currentFilters.fechaHasta) {
      const fechaHasta = new Date(currentFilters.fechaHasta)
      fechaHasta.setHours(23, 59, 59, 999) // Incluir todo el día
      filtered = filtered.filter(usuario => {
        const fechaCreacion = new Date(usuario.createdAt)
        return fechaCreacion <= fechaHasta
      })
    }

    return filtered
  }, [usuarios, currentFilters])

  useEffect(() => {
    setFilteredUsuarios(applyFilters)
  }, [applyFilters])

  /**
   * Cargar todos los usuarios
   */
  const loadUsuarios = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await usuarioService.obtenerTodosLosUsuarios()
      setUsuarios(data)
    } catch (err) {
      console.error('Error cargando usuarios:', err)
      setError(err)
      showSnackbar('Error al cargar usuarios', 'error')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Mostrar notificación
   */
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  /**
   * Abrir formulario para crear usuario
   */
  const handleCreate = () => {
    setEditingUsuario(null)
    setFormOpen(true)
  }

  /**
   * Abrir formulario para editar usuario
   */
  const handleEdit = (usuario) => {
    setEditingUsuario(usuario)
    setFormOpen(true)
  }

  /**
   * Ver detalles del usuario
   */
  const handleView = (usuario) => {
    setSelectedUsuario(usuario)
    setDetailOpen(true)
  }

  /**
   * Confirmar eliminación de usuario
   */
  const handleDelete = (usuario) => {
    setDeleteDialog({ open: true, usuario })
  }

  /**
   * Confirmar cambio de estado
   */
  const handleToggleEstado = (usuario) => {
    setToggleDialog({ open: true, usuario })
  }

  /**
   * Guardar usuario (crear o actualizar)
   */
  const handleSave = async (usuarioData) => {
    try {
      setFormLoading(true)
      
      if (editingUsuario) {
        // Actualizar usuario existente
        await usuarioService.actualizarUsuario(editingUsuario.idUsuario, usuarioData)
        showSnackbar('Usuario actualizado exitosamente')
      } else {
        // Crear nuevo usuario
        await usuarioService.crearUsuario(usuarioData)
        showSnackbar('Usuario creado exitosamente')
      }
      
      setFormOpen(false)
      setEditingUsuario(null)
      await loadUsuarios() // Recargar lista
    } catch (err) {
      console.error('Error guardando usuario:', err)
      showSnackbar(
        err.response?.data?.message || 'Error al guardar usuario', 
        'error'
      )
    } finally {
      setFormLoading(false)
    }
  }

  /**
   * Ejecutar eliminación de usuario
   */
  const executeDelete = async () => {
    const usuario = deleteDialog.usuario
    if (!usuario) return

    try {
      await usuarioService.eliminarUsuario(usuario.idUsuario)
      showSnackbar(`Usuario ${usuario.nombreCompleto} eliminado exitosamente`)
      setDeleteDialog({ open: false, usuario: null })
      await loadUsuarios() // Recargar lista
    } catch (err) {
      console.error('Error eliminando usuario:', err)
      showSnackbar(
        err.response?.data?.message || 'Error al eliminar usuario',
        'error'
      )
    }
  }

  /**
   * Ejecutar cambio de estado
   */
  const executeToggleEstado = async () => {
    const usuario = toggleDialog.usuario
    if (!usuario) return

    try {
      const nuevoEstado = !usuario.activo
      await usuarioService.cambiarEstadoUsuario(usuario.idUsuario, nuevoEstado)
      
      const accion = nuevoEstado ? 'activado' : 'desactivado'
      showSnackbar(`Usuario ${usuario.nombreCompleto} ${accion} exitosamente`)
      
      setToggleDialog({ open: false, usuario: null })
      await loadUsuarios() // Recargar lista
    } catch (err) {
      console.error('Error cambiando estado de usuario:', err)
      showSnackbar(
        err.response?.data?.message || 'Error al cambiar estado del usuario',
        'error'
      )
    }
  }

  // Verificar permisos
  if (!canManageUsers) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          👥 Gestión de Usuarios
        </Typography>
        <Alert severity="warning" sx={{ mt: 2 }}>
          No tienes permisos para acceder a este módulo
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon color="primary" />
            Gestión de Usuarios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administrar usuarios del sistema • Total: {usuarios.length} • Filtrados: {filteredUsuarios.length}
          </Typography>
        </Box>
        
        {canCreateUsers && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            disabled={loading}
            sx={{ minWidth: 140 }}
          >
            Nuevo Usuario
          </Button>
        )}
      </Box>

      {/* Filtros */}
      <UsuarioFilters
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Lista de usuarios */}
      <Paper elevation={0}>
        <UsuariosList
          usuarios={filteredUsuarios}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onToggleEstado={handleToggleEstado}
          onRefresh={loadUsuarios}
        />
      </Paper>

      {/* Formulario de usuario */}
      <UsuarioForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingUsuario(null)
        }}
        onSave={handleSave}
        usuario={editingUsuario}
        loading={formLoading}
      />

      {/* Modal de detalles de usuario */}
      <UsuarioDetail
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false)
          setSelectedUsuario(null)
        }}
        usuario={selectedUsuario}
      />

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, usuario: null })}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar al usuario{' '}
            <strong>{deleteDialog.usuario?.nombreCompleto}</strong>?
            <br />
            <br />
            Esta acción desactivará al usuario, pero no eliminará permanentemente sus datos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, usuario: null })}>
            Cancelar
          </Button>
          <Button onClick={executeDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación de cambio de estado */}
      <Dialog
        open={toggleDialog.open}
        onClose={() => setToggleDialog({ open: false, usuario: null })}
      >
        <DialogTitle>
          {toggleDialog.usuario?.activo ? 'Desactivar' : 'Activar'} Usuario
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas{' '}
            {toggleDialog.usuario?.activo ? 'desactivar' : 'activar'} al usuario{' '}
            <strong>{toggleDialog.usuario?.nombreCompleto}</strong>?
            <br />
            <br />
            {toggleDialog.usuario?.activo 
              ? 'El usuario no podrá acceder al sistema.'
              : 'El usuario podrá acceder al sistema nuevamente.'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToggleDialog({ open: false, usuario: null })}>
            Cancelar
          </Button>
          <Button 
            onClick={executeToggleEstado} 
            color={toggleDialog.usuario?.activo ? 'warning' : 'success'}
            variant="contained"
          >
            {toggleDialog.usuario?.activo ? 'Desactivar' : 'Activar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default UsuariosPage
