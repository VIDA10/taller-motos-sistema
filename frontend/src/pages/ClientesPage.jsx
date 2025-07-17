import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab
} from '@mui/material'
import {
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'

// Importar servicios y componentes
import * as clienteService from '../services/clienteService'
import ClientesList from '../components/clientes/ClientesList'
import ClienteFilters from '../components/clientes/ClienteFilters'
import ClienteForm from '../components/clientes/ClienteForm'
import { hasPermission } from '../utils/permissions'

/**
 * Página principal de gestión de clientes
 * Implementa CRUD completo basado en endpoints reales del backend
 * 
 * Funcionalidades por rol según permisos configurados:
 * - ADMIN: CRUD completo + reportes + auditoría de fechas
 * - RECEPCIONISTA: CRUD completo + reportes por fechas
 * - MECANICO: Consulta + historial + observaciones técnicas
 */
const ClientesPage = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  
  // Estados principales
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  
  // Estados de UI
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, cliente: null })
  const [toggleDialog, setToggleDialog] = useState({ open: false, cliente: null })
  
  // Estados del formulario (Tarea 2.2)
  const [formDialog, setFormDialog] = useState({ open: false, cliente: null, loading: false })

  // Verificar permisos
  const canCreate = hasPermission(user, 'clientes', 'create')
  const canRead = hasPermission(user, 'clientes', 'read')
  const canUpdate = hasPermission(user, 'clientes', 'update')
  const canDelete = hasPermission(user, 'clientes', 'delete')
  const isAdmin = user?.rol === 'ADMIN'

  /**
   * Cargar clientes desde el backend
   * Usa solo el endpoint principal GET /api/clientes y aplica filtros localmente
   */
  const cargarClientes = useCallback(async () => {
    if (!canRead) {
      setError('No tienes permisos para ver clientes')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Siempre obtener todos los clientes del endpoint principal
      const clientesData = await clienteService.obtenerTodosLosClientes()
      setClientes(clientesData || [])
    } catch (err) {
      console.error('Error al cargar clientes:', err)
      setError('Error al cargar la lista de clientes. Por favor, intenta de nuevo.')
      setClientes([])
    } finally {
      setLoading(false)
    }
  }, [canRead])

  // Cargar clientes al montar el componente (sin depender de filtros)
  useEffect(() => {
    cargarClientes()
  }, [cargarClientes])

  // Aplicar filtros localmente a los clientes cargados
  const clientesFiltrados = useMemo(() => {
    if (!clientes.length) return []

    return clientes.filter(cliente => {
      // Filtro por nombre
      if (filters.nombre) {
        const nombre = cliente.nombre?.toLowerCase() || ''
        const filtroNombre = filters.nombre.toLowerCase()
        if (!nombre.includes(filtroNombre)) return false
      }

      // Filtro por teléfono
      if (filters.telefono) {
        const telefono = cliente.telefono || ''
        if (!telefono.includes(filters.telefono)) return false
      }

      // Filtro por email
      if (filters.email) {
        const email = cliente.email?.toLowerCase() || ''
        const filtroEmail = filters.email.toLowerCase()
        if (!email.includes(filtroEmail)) return false
      }

      // Filtro por DNI
      if (filters.dni) {
        const dni = cliente.dni || ''
        if (!dni.includes(filters.dni)) return false
      }

      // Filtro por estado
      if (filters.estado === 'activos') {
        if (!cliente.activo) return false
      } else if (filters.estado === 'inactivos') {
        if (cliente.activo) return false
      }

      // Filtro por fechas
      if (filters.fechaDesde || filters.fechaHasta) {
        const fechaCreacion = new Date(cliente.createdAt)
        
        if (filters.fechaDesde) {
          const fechaDesde = new Date(filters.fechaDesde)
          if (fechaCreacion < fechaDesde) return false
        }
        
        if (filters.fechaHasta) {
          const fechaHasta = new Date(filters.fechaHasta)
          fechaHasta.setHours(23, 59, 59) // Incluir todo el día
          if (fechaCreacion > fechaHasta) return false
        }
      }

      return true
    })
  }, [clientes, filters])

  /**
   * Manejar cambios de filtros
   */
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  /**
   * Manejar creación de cliente
   * Implementación Tarea 2.2: Abre formulario en modo creación
   */
  const handleCreateCliente = () => {
    if (!canCreate) {
      setSnackbar({
        open: true,
        message: 'No tienes permisos para crear clientes',
        severity: 'warning'
      })
      return
    }
    
    setFormDialog({
      open: true,
      cliente: null, // null indica modo creación
      loading: false
    })
  }

  /**
   * Manejar edición de cliente
   * Implementación Tarea 2.2: Abre formulario en modo edición
   */
  const handleEditCliente = (cliente) => {
    if (!canUpdate) {
      setSnackbar({
        open: true,
        message: 'No tienes permisos para editar clientes',
        severity: 'warning'
      })
      return
    }
    
    setFormDialog({
      open: true,
      cliente: cliente, // cliente existente indica modo edición
      loading: false
    })
  }

  /**
   * Navegar a vista detalle del cliente
   * Implementado en Tarea 2.3 (Vista detalle de cliente)
   */
  const handleViewCliente = (cliente) => {
    navigate(`/clientes/${cliente.idCliente}`)
  }

  /**
   * Confirmar eliminación de cliente
   */
  const handleDeleteCliente = (cliente) => {
    setDeleteDialog({ open: true, cliente })
  }

  /**
   * Ejecutar eliminación de cliente (soft delete)
   * Nota: Eliminación permanente tiene restricciones de seguridad adicionales
   */
  const confirmDeleteCliente = async () => {
    const { cliente } = deleteDialog
    
    if (!cliente || !canDelete) {
      setDeleteDialog({ open: false, cliente: null })
      return
    }

    try {
      setLoading(true)
      // Usar soft delete (DELETE /api/clientes/{id}) que sí funciona
      await clienteService.eliminarCliente(cliente.idCliente)
      
      setSnackbar({
        open: true,
        message: `Cliente "${cliente.nombre}" eliminado correctamente`,
        severity: 'success'
      })
      
      // Recargar lista
      cargarClientes()
    } catch (err) {
      console.error('Error al eliminar cliente:', err)
      
      let errorMessage = 'Error al eliminar el cliente. Por favor, intenta de nuevo.'
      
      // Manejar errores específicos del backend
      if (err.response?.status === 404) {
        errorMessage = 'Cliente no encontrado.'
      } else if (err.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar este cliente.'
      } else if (err.response?.status === 400) {
        errorMessage = 'No se puede eliminar el cliente. Puede tener datos relacionados.'
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      })
    } finally {
      setLoading(false)
      setDeleteDialog({ open: false, cliente: null })
    }
  }

  // Cancelar eliminación
  const cancelDeleteCliente = () => {
    setDeleteDialog({ open: false, cliente: null })
  }

  /**
   * Manejar toggle de estado de clientes (activar/desactivar)
   * Solo disponible para ADMIN - permite desactivar Y reactivar
   */
  const handleToggleEstado = (cliente) => {
    if (!isAdmin) {
      setSnackbar({
        open: true,
        message: 'Solo los administradores pueden cambiar el estado de los clientes',
        severity: 'warning'
      })
      return
    }
    
    // Permitir tanto activar como desactivar
    setToggleDialog({ open: true, cliente })
  }

  /**
   * Ejecutar toggle de estado (activar/desactivar)
   */
  const confirmToggleEstado = async () => {
    const { cliente } = toggleDialog
    
    if (!cliente || !isAdmin) {
      setToggleDialog({ open: false, cliente: null })
      return
    }

    try {
      setLoading(true)
      
      if (cliente.activo) {
        // Desactivar cliente (soft delete)
        await clienteService.desactivarCliente(cliente.idCliente)
        
        setSnackbar({
          open: true,
          message: `Cliente "${cliente.nombre}" desactivado correctamente`,
          severity: 'success'
        })
      } else {
        // Reactivar cliente usando UpdateClienteDTO
        await clienteService.reactivarCliente(cliente.idCliente)
        
        setSnackbar({
          open: true,
          message: `Cliente "${cliente.nombre}" reactivado correctamente`,
          severity: 'success'
        })
      }
      
      // Recargar lista
      cargarClientes()
    } catch (err) {
      console.error('Error al cambiar estado del cliente:', err)
      
      const accion = cliente.activo ? 'desactivar' : 'reactivar'
      let errorMessage = `Error al ${accion} el cliente. Por favor, intenta de nuevo.`
      
      // Manejar errores específicos del backend
      if (err.response?.status === 400) {
        errorMessage = 'Datos inválidos para cambiar el estado del cliente.'
      } else if (err.response?.status === 404) {
        errorMessage = 'Cliente no encontrado.'
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      })
    } finally {
      setLoading(false)
      setToggleDialog({ open: false, cliente: null })
    }
  }

  // Cancelar toggle de estado
  const cancelToggleEstado = () => {
    setToggleDialog({ open: false, cliente: null })
  }

  /**
   * Manejar guardado del formulario (crear/editar)
   * Implementación Tarea 2.2: Función para procesar datos del formulario
   */
  const handleSaveCliente = async (clienteData) => {
    setFormDialog(prev => ({ ...prev, loading: true }))
    
    try {
      const isEditing = Boolean(formDialog.cliente)
      let clienteGuardado
      
      if (isEditing) {
        // Modo edición: usar UpdateClienteDTO con PUT
        clienteGuardado = await clienteService.actualizarCliente(
          formDialog.cliente.idCliente, 
          clienteData
        )
        
        setSnackbar({
          open: true,
          message: `Cliente "${clienteGuardado.nombre}" actualizado correctamente`,
          severity: 'success'
        })
      } else {
        // Modo creación: usar CreateClienteDTO con POST
        clienteGuardado = await clienteService.crearCliente(clienteData)
        
        setSnackbar({
          open: true,
          message: `Cliente "${clienteGuardado.nombre}" creado correctamente`,
          severity: 'success'
        })
      }
      
      // Cerrar formulario y recargar lista
      setFormDialog({ open: false, cliente: null, loading: false })
      cargarClientes()
      
    } catch (err) {
      console.error('Error al guardar cliente:', err)
      
      let errorMessage = 'Error al guardar el cliente. Por favor, intenta de nuevo.'
      
      // Manejar errores específicos del backend
      if (err.response?.status === 400) {
        // Errores de validación del backend
        if (err.response.data?.message) {
          errorMessage = err.response.data.message
        } else if (err.response.data?.errors) {
          errorMessage = Object.values(err.response.data.errors).join(', ')
        } else {
          errorMessage = 'Datos inválidos. Verifica los campos obligatorios.'
        }
      } else if (err.response?.status === 409) {
        // Conflicto - datos únicos duplicados
        errorMessage = 'Ya existe un cliente con el mismo teléfono, email o DNI.'
      } else if (err.response?.status === 404) {
        errorMessage = 'Cliente no encontrado.'
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      })
    } finally {
      setFormDialog(prev => ({ ...prev, loading: false }))
    }
  }

  /**
   * Cerrar formulario de cliente
   */
  const handleCloseForm = () => {
    setFormDialog({ open: false, cliente: null, loading: false })
  }

  // Cerrar snackbar
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Información estadística
  const estadisticas = useMemo(() => {
    if (!clientesFiltrados.length) return null
    
    const activos = clientesFiltrados.filter(c => c.activo).length
    const inactivos = clientesFiltrados.length - activos
    
    return { total: clientesFiltrados.length, activos, inactivos }
  }, [clientesFiltrados])

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            📋 Gestión de Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Usuario: {user?.nombreCompleto} ({user?.rol})
          </Typography>
          {estadisticas && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Total: {estadisticas.total} | Activos: {estadisticas.activos} | Inactivos: {estadisticas.inactivos}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={cargarClientes}
            disabled={loading}
          >
            Actualizar
          </Button>
          
          {canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateCliente}
              disabled={loading}
            >
              Nuevo Cliente
            </Button>
          )}
        </Box>
      </Box>

      {/* Filtros */}
      <ClienteFilters 
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Lista de clientes */}
      <ClientesList
        clientes={clientesFiltrados}
        loading={loading}
        error={error}
        onEdit={canUpdate ? handleEditCliente : null}
        onView={canRead ? handleViewCliente : null}
        onDelete={canDelete ? handleDeleteCliente : null}
        onRefresh={cargarClientes}
        onToggleEstado={isAdmin ? handleToggleEstado : null}
      />

      {/* FAB para móvil */}
      {canCreate && (
        <Fab
          color="primary"
          aria-label="Agregar cliente"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', md: 'none' }
          }}
          onClick={handleCreateCliente}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={cancelDeleteCliente}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          🗑️ Eliminar Cliente
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar al cliente "{deleteDialog.cliente?.nombre}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            � Esta acción realizará un "soft delete":
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            • El cliente se marcará como inactivo
            <br />
            • No aparecerá en las búsquedas principales
            <br />
            • Se mantiene el historial y datos relacionados
            <br />
            • Puede ser reactivado posteriormente
          </Typography>
          <Typography variant="body2" color="info.main" sx={{ mt: 2 }}>
            💡 Si necesitas eliminación permanente, contacta al administrador del sistema.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteCliente}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteCliente} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación de toggle estado */}
      <Dialog
        open={toggleDialog.open}
        onClose={cancelToggleEstado}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {toggleDialog.cliente?.activo ? 'Desactivar Cliente' : 'Reactivar Cliente'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres {toggleDialog.cliente?.activo ? 'desactivar' : 'reactivar'} al cliente "{toggleDialog.cliente?.nombre}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {toggleDialog.cliente?.activo 
              ? 'El cliente se marcará como inactivo y no aparecerá en las búsquedas principales, pero mantendrá su historial.'
              : 'El cliente se marcará como activo y volverá a aparecer en las búsquedas principales.'
            }
          </Typography>
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            ✅ Nota: Esta acción usa el endpoint PUT con UpdateClienteDTO para cambiar el estado.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelToggleEstado}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmToggleEstado} 
            color={toggleDialog.cliente?.activo ? "error" : "success"}
            variant="contained"
            disabled={loading}
          >
            {toggleDialog.cliente?.activo ? 'Desactivar' : 'Reactivar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Formulario de cliente (crear/editar) */}
      <ClienteForm
        open={formDialog.open}
        onClose={handleCloseForm}
        onSave={handleSaveCliente}
        cliente={formDialog.cliente}
        loading={formDialog.loading}
      />
    </Box>
  )
}

export default ClientesPage
