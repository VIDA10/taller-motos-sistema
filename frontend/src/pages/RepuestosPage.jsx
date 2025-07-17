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
  DialogContentText,
  Tabs,
  Tab
} from '@mui/material'
import { 
  Add as AddIcon, 
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  History as HistoryIcon
} from '@mui/icons-material'
import { hasPermission } from '../utils/permissions'
import RepuestosList from '../components/repuestos/RepuestosList'
import RepuestoFilters from '../components/repuestos/RepuestoFilters'
import RepuestoForm from '../components/repuestos/RepuestoForm'
import RepuestoDetail from '../components/repuestos/RepuestoDetail'
import StockAlertas from '../components/repuestos/StockAlertas'
import MovimientosInventario from '../components/repuestos/MovimientosInventario'
import repuestoService from '../services/repuestoService'

/**
 * Página principal de gestión de repuestos
 * Inventario completo con stock actual y alertas
 * Tareas 5.1, 5.2, 5.3, 5.4: Sistema completo de repuestos
 */
const RepuestosPage = () => {
  const { user } = useSelector((state) => state.auth)

  // Estados principales
  const [repuestos, setRepuestos] = useState([])
  const [filteredRepuestos, setFilteredRepuestos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados del formulario
  const [formOpen, setFormOpen] = useState(false)
  const [editingRepuesto, setEditingRepuesto] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  // Estados de confirmación
  const [deleteDialog, setDeleteDialog] = useState({ open: false, repuesto: null })
  const [toggleDialog, setToggleDialog] = useState({ open: false, repuesto: null, newState: null })

  // Estados de detalle
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRepuesto, setSelectedRepuesto] = useState(null)

  // Estados de notificaciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Estados de tabs
  const [currentTab, setCurrentTab] = useState(0)

  // Verificar permisos
  const canCreate = hasPermission(user, 'repuestos', 'create')
  const canEdit = hasPermission(user, 'repuestos', 'update')  
  const canDelete = hasPermission(user, 'repuestos', 'delete')

  // Cargar repuestos
  const loadRepuestos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await repuestoService.getAll()
      setRepuestos(data)
      setFilteredRepuestos(data)
    } catch (error) {
      console.error('Error al cargar repuestos:', error)
      setError('Error al cargar los repuestos. Por favor, intenta nuevamente.')
      showSnackbar('Error al cargar repuestos', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Cargar repuestos al montar componente
  useEffect(() => {
    loadRepuestos()
  }, [])

  // Aplicar filtros
  const handleFiltersChange = (filters) => {
    let filtered = [...repuestos]

    // Filtro por búsqueda general
    if (filters.busqueda) {
      const searchTerm = filters.busqueda.toLowerCase()
      filtered = filtered.filter(repuesto =>
        repuesto.nombre.toLowerCase().includes(searchTerm) ||
        repuesto.codigo.toLowerCase().includes(searchTerm) ||
        (repuesto.categoria && repuesto.categoria.toLowerCase().includes(searchTerm)) ||
        (repuesto.descripcion && repuesto.descripcion.toLowerCase().includes(searchTerm))
      )
    }

    // Filtro por categoría
    if (filters.categoria) {
      filtered = filtered.filter(repuesto => repuesto.categoria === filters.categoria)
    }

    // Filtro por estado de stock
    if (filters.stockStatus !== 'all') {
      filtered = filtered.filter(repuesto => {
        const stockStatus = repuestoService.getStockStatus(repuesto.stockActual, repuesto.stockMinimo)
        return stockStatus.status === filters.stockStatus
      })
    }

    // Filtro por estado activo
    if (filters.estado !== 'all') {
      const isActive = filters.estado === 'active'
      filtered = filtered.filter(repuesto => repuesto.activo === isActive)
    }

    // Filtro por rango de precios
    filtered = filtered.filter(repuesto => 
      repuesto.precioUnitario >= filters.precioMin && repuesto.precioUnitario <= filters.precioMax
    )

    setFilteredRepuestos(filtered)
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
  const handleSave = async (repuestoData) => {
    try {
      setFormLoading(true)
      
      if (editingRepuesto) {
        await repuestoService.update(editingRepuesto.idRepuesto, repuestoData)
        showSnackbar('Repuesto actualizado exitosamente')
      } else {
        await repuestoService.create(repuestoData)
        showSnackbar('Repuesto creado exitosamente')
      }

      setFormOpen(false)
      setEditingRepuesto(null)
      await loadRepuestos()
    } catch (error) {
      console.error('Error al guardar repuesto:', error)
      showSnackbar(
        error.response?.data?.message || 'Error al guardar el repuesto',
        'error'
      )
    } finally {
      setFormLoading(false)
    }
  }

  // Funciones de manejo de acciones (placeholder para futuras tareas)
  const handleView = (repuesto) => {
    console.log('Ver repuesto:', repuesto)
    setSelectedRepuesto(repuesto)
    setDetailOpen(true)
  }

  const handleEdit = (repuesto) => {
    console.log('Editar repuesto:', repuesto)
    setEditingRepuesto(repuesto)
    setFormOpen(true)
  }

  const handleDeleteClick = (repuesto) => {
    console.log('Eliminar repuesto:', repuesto)
    setDeleteDialog({ open: true, repuesto })
  }

  const handleToggleClick = (repuestoId, newState) => {
    const repuesto = repuestos.find(r => r.idRepuesto === repuestoId)
    console.log('Toggle repuesto:', repuesto, 'nuevo estado:', newState)
    setToggleDialog({ open: true, repuesto, newState })
  }

  const handleNewRepuesto = () => {
    setEditingRepuesto(null)
    setFormOpen(true)
  }

  // Manejar cambio de tab
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  // Cerrar diálogos
  const handleCloseDialog = () => {
    setDeleteDialog({ open: false, repuesto: null })
    setToggleDialog({ open: false, repuesto: null, newState: null })
  }

  // Confirmar eliminación
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true)
      const { repuesto } = deleteDialog
      await repuestoService.delete(repuesto.idRepuesto)
      showSnackbar('Repuesto eliminado exitosamente')
      setDeleteDialog({ open: false, repuesto: null })
      await loadRepuestos()
    } catch (error) {
      console.error('Error al eliminar repuesto:', error)
      showSnackbar('Error al eliminar el repuesto', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Confirmar cambio de estado
  const handleToggleConfirm = async () => {
    try {
      setLoading(true)
      const { repuesto, newState } = toggleDialog
      await repuestoService.toggleActive(repuesto.idRepuesto, newState)
      showSnackbar('Estado de repuesto actualizado')
      setToggleDialog({ open: false, repuesto: null, newState: null })
      await loadRepuestos()
    } catch (error) {
      console.error('Error al actualizar estado de repuesto:', error)
      showSnackbar('Error al actualizar estado', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Verificar acceso
  if (!canCreate && !canEdit && !canDelete) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          📦 Gestión de Repuestos
        </Typography>
        <Alert severity="warning">
          No tienes permisos para acceder al inventario de repuestos
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
            <InventoryIcon color="primary" />
            <Typography variant="h4" component="h1">
              Gestión de Repuestos
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Inventario completo con control de stock y alertas automáticas
          </Typography>
        </Box>

        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewRepuesto}
            size="large"
          >
            Nuevo Repuesto
          </Button>
        )}
      </Box>

      {/* Error general */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab 
            label="Inventario" 
            icon={<InventoryIcon />}
            iconPosition="start"
          />
          <Tab 
            label="Alertas de Stock" 
            icon={<WarningIcon />}
            iconPosition="start"
          />
          <Tab 
            label="Movimientos" 
            icon={<HistoryIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Contenido de tabs */}
      {currentTab === 0 && (
        <>
          <RepuestoFilters
            onFiltersChange={handleFiltersChange}
            totalCount={filteredRepuestos.length}
          />
          <RepuestosList
            repuestos={filteredRepuestos}
            loading={loading}
            onView={handleView}
            onEdit={canEdit ? handleEdit : null}
            onDelete={canDelete ? handleDeleteClick : null}
            onToggleActive={canEdit ? handleToggleClick : null}
          />
        </>
      )}

      {currentTab === 1 && (
        <StockAlertas
          onViewRepuesto={handleView}
          onEditRepuesto={handleEdit}
        />
      )}

      {currentTab === 2 && (
        <MovimientosInventario />
      )}

      {/* Formulario de repuesto */}
      <RepuestoForm
        open={formOpen}
        repuesto={editingRepuesto}
        onClose={() => {
          setFormOpen(false)
          setEditingRepuesto(null)
        }}
        onSave={handleSave}
        loading={formLoading}
      />

      {/* Detalle de repuesto */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalle de Repuesto
        </DialogTitle>
        <DialogContent>
          <RepuestoDetail repuesto={selectedRepuesto} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este repuesto? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="secondary"
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de estado */}
      <Dialog
        open={toggleDialog.open}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          Confirmar Cambio de Estado
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cambiar el estado de este repuesto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleToggleConfirm} 
            color="secondary"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Confirmar'}
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

export default RepuestosPage
