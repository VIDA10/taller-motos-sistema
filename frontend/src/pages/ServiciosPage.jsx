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
import { Add as AddIcon, Build as BuildIcon } from '@mui/icons-material'
import { hasPermission } from '../utils/permissions'
import ServiciosList from '../components/servicios/ServiciosList'
import ServicioFilters from '../components/servicios/ServicioFilters'
import ServicioForm from '../components/servicios/ServicioForm'
import ServicioDetail from '../components/servicios/ServicioDetail'
import servicioService from '../services/servicioService'

/**
 * Página principal de gestión de servicios
 * Integra filtros, lista y formulario de servicios
 * Basada en la estructura de ClientesPage.jsx y UsuariosPage.jsx
 */
const ServiciosPage = () => {
  const { user } = useSelector((state) => state.auth)

  // Estados principales
  const [servicios, setServicios] = useState([])
  const [filteredServicios, setFilteredServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados del formulario
  const [formOpen, setFormOpen] = useState(false)
  const [editingServicio, setEditingServicio] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  // Estados de confirmación
  const [deleteDialog, setDeleteDialog] = useState({ open: false, servicio: null })
  const [toggleDialog, setToggleDialog] = useState({ open: false, servicio: null })

  // Estados de detalle
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedServicio, setSelectedServicio] = useState(null)

  // Estados de notificaciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Verificar permisos
  const canCreate = hasPermission(user, 'servicios', 'create')
  const canEdit = hasPermission(user, 'servicios', 'update')  
  const canDelete = hasPermission(user, 'servicios', 'delete')

  // Cargar servicios
  const loadServicios = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await servicioService.getAll()
      setServicios(data)
      setFilteredServicios(data)
    } catch (error) {
      console.error('Error al cargar servicios:', error)
      setError('Error al cargar los servicios. Por favor, intenta nuevamente.')
      showSnackbar('Error al cargar servicios', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Cargar servicios al montar componente
  useEffect(() => {
    loadServicios()
  }, [])

  // Aplicar filtros
  const handleFiltersChange = (filters) => {
    let filtered = [...servicios]

    // Filtro por búsqueda general
    if (filters.busqueda) {
      const searchTerm = filters.busqueda.toLowerCase()
      filtered = filtered.filter(servicio =>
        servicio.nombre.toLowerCase().includes(searchTerm) ||
        servicio.codigo.toLowerCase().includes(searchTerm) ||
        servicio.categoria.toLowerCase().includes(searchTerm) ||
        (servicio.descripcion && servicio.descripcion.toLowerCase().includes(searchTerm))
      )
    }

    // Filtro por categoría
    if (filters.categoria) {
      filtered = filtered.filter(servicio => servicio.categoria === filters.categoria)
    }

    // Filtro por estado
    if (filters.estado !== 'all') {
      const isActive = filters.estado === 'active'
      filtered = filtered.filter(servicio => servicio.activo === isActive)
    }

    // Filtro por rango de precios
    filtered = filtered.filter(servicio => 
      servicio.precioBase >= filters.precioMin && servicio.precioBase <= filters.precioMax
    )

    // Filtro por rango de tiempo
    filtered = filtered.filter(servicio => 
      servicio.tiempoEstimadoMinutos >= filters.tiempoMin && servicio.tiempoEstimadoMinutos <= filters.tiempoMax
    )

    setFilteredServicios(filtered)
  }

  // Mostrar notificación
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  // Cerrar notificación
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  // Manejar creación/edición
  const handleSave = async (servicioData) => {
    try {
      setFormLoading(true)
      
      if (editingServicio) {
        // Actualizar servicio existente
        await servicioService.update(editingServicio.idServicio, servicioData)
        showSnackbar('Servicio actualizado exitosamente')
      } else {
        // Crear nuevo servicio
        await servicioService.create(servicioData)
        showSnackbar('Servicio creado exitosamente')
      }

      setFormOpen(false)
      setEditingServicio(null)
      await loadServicios()
    } catch (error) {
      console.error('Error al guardar servicio:', error)
      showSnackbar(
        error.response?.data?.message || 'Error al guardar el servicio',
        'error'
      )
    } finally {
      setFormLoading(false)
    }
  }

  // Manejar eliminación
  const handleDelete = async () => {
    try {
      await servicioService.delete(deleteDialog.servicio.idServicio)
      showSnackbar('Servicio eliminado exitosamente')
      setDeleteDialog({ open: false, servicio: null })
      await loadServicios()
    } catch (error) {
      console.error('Error al eliminar servicio:', error)
      showSnackbar('Error al eliminar el servicio', 'error')
    }
  }

  // Manejar cambio de estado activo
  const handleToggleActive = async () => {
    try {
      const servicio = toggleDialog.servicio
      await servicioService.toggleActive(servicio.idServicio, !servicio.activo)
      
      const action = servicio.activo ? 'desactivado' : 'activado'
      showSnackbar(`Servicio ${action} exitosamente`)
      
      setToggleDialog({ open: false, servicio: null })
      await loadServicios()
    } catch (error) {
      console.error('Error al cambiar estado del servicio:', error)
      showSnackbar('Error al cambiar el estado del servicio', 'error')
    }
  }

  // Funciones de manejo de acciones
  const handleView = (servicio) => {
    setSelectedServicio(servicio)
    setDetailOpen(true)
  }

  const handleEdit = (servicio) => {
    setEditingServicio(servicio)
    setFormOpen(true)
  }

  const handleDeleteClick = (servicio) => {
    setDeleteDialog({ open: true, servicio })
  }

  const handleToggleClick = async (servicioId, newStatus) => {
    const servicio = servicios.find(s => s.idServicio === servicioId)
    if (servicio) {
      setToggleDialog({ open: true, servicio })
    }
  }

  const handleNewServicio = () => {
    setEditingServicio(null)
    setFormOpen(true)
  }

  // Verificar acceso por rol
  if (user?.rol === 'MECANICO') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          🛠️ Gestión de Servicios
        </Typography>
        <Alert severity="warning">
          Tu rol MECANICO no tiene acceso a este módulo
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <BuildIcon color="primary" />
            <Typography variant="h4" component="h1">
              Gestión de Servicios
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Administra el catálogo de servicios del taller
          </Typography>
        </Box>

        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewServicio}
            size="large"
          >
            Nuevo Servicio
          </Button>
        )}
      </Box>

      {/* Error general */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <ServicioFilters
        onFiltersChange={handleFiltersChange}
        totalCount={filteredServicios.length}
      />

      {/* Lista de servicios */}
      <ServiciosList
        servicios={filteredServicios}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onToggleActive={handleToggleClick}
      />

      {/* Formulario de servicio */}
      <ServicioForm
        open={formOpen}
        servicio={editingServicio}
        onClose={() => {
          setFormOpen(false)
          setEditingServicio(null)
        }}
        onSave={handleSave}
        loading={formLoading}
      />

      {/* Detalle de servicio */}
      <ServicioDetail
        open={detailOpen}
        servicio={selectedServicio}
        onClose={() => {
          setDetailOpen(false)
          setSelectedServicio(null)
        }}
      />

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, servicio: null })}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el servicio{' '}
            <strong>"{deleteDialog.servicio?.nombre}"</strong>?
            Esta acción cambiará su estado a inactivo.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, servicio: null })}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación de cambio de estado */}
      <Dialog
        open={toggleDialog.open}
        onClose={() => setToggleDialog({ open: false, servicio: null })}
      >
        <DialogTitle>Confirmar Cambio de Estado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas{' '}
            <strong>
              {toggleDialog.servicio?.activo ? 'desactivar' : 'activar'}
            </strong>{' '}
            el servicio "{toggleDialog.servicio?.nombre}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToggleDialog({ open: false, servicio: null })}>
            Cancelar
          </Button>
          <Button onClick={handleToggleActive} color="primary" variant="contained">
            {toggleDialog.servicio?.activo ? 'Desactivar' : 'Activar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ServiciosPage
