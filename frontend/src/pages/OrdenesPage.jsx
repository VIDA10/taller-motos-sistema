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
  Fab,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material'
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Build as BuildIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material'

// Importar servicios y componentes
import ordenService from '../services/ordenService'
import OrdenesList from '../components/ordenes/OrdenesList'
import OrdenForm from '../components/ordenes/OrdenForm'
import OrdenDetail from '../components/ordenes/OrdenDetail'
import AssignMecanicoDialog from '../components/ordenes/AssignMecanicoDialog'
import { hasPermission } from '../utils/permissions'

/**
 * Página principal de gestión de órdenes de trabajo
 * Implementa CRUD completo basado en endpoints reales del backend
 * 
 * Funcionalidades por rol según permisos configurados:
 * - ADMIN: CRUD completo + asignación mecánicos + reportes
 * - RECEPCIONISTA: CRUD completo + asignación mecánicos + reportes por fechas
 * - MECANICO: Consulta + cambio de estado + observaciones técnicas
 */
const OrdenesPage = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  
  // Estados principales
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  
  // Estados de UI
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, orden: null })
  
  // Estados del formulario y diálogos
  const [formDialog, setFormDialog] = useState({ open: false, orden: null, loading: false })
  const [detailDialog, setDetailDialog] = useState({ open: false, orden: null })
  const [assignDialog, setAssignDialog] = useState({ open: false, orden: null, loading: false })

  // Verificar permisos
  const canCreate = hasPermission(user, 'ordenes', 'create')
  const canRead = hasPermission(user, 'ordenes', 'read')
  const canUpdate = hasPermission(user, 'ordenes', 'update')
  const canDelete = hasPermission(user, 'ordenes', 'delete')
  const canAssignMecanico = user?.rol === 'ADMIN' || user?.rol === 'RECEPCIONISTA'
  const isAdmin = user?.rol === 'ADMIN'

  /**
   * Cargar órdenes desde el backend
   * Usa el endpoint principal GET /api/ordenes-trabajo
   */
  const cargarOrdenes = useCallback(async () => {
    if (!canRead) {
      setError('No tienes permisos para ver órdenes de trabajo')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Obtener todas las órdenes del endpoint principal
      const result = await ordenService.obtenerTodas()
      
      if (result.success) {
        console.log('Datos de órdenes recibidos:', result.data)
        console.log('Primera orden (si existe):', result.data?.[0])
        if (result.data?.[0]) {
          console.log('Estructura de moto:', result.data[0].moto)
          console.log('Estructura de mecánico:', result.data[0].mecanicoAsignado)
        }
        setOrdenes(result.data || [])
      } else {
        console.error('Error al obtener órdenes:', result.message)
        setError(result.message || 'Error al cargar las órdenes')
        setOrdenes([])
      }
    } catch (err) {
      console.error('Error al cargar órdenes:', err)
      setError('Error al cargar la lista de órdenes de trabajo. Por favor, intenta de nuevo.')
      setOrdenes([])
    } finally {
      setLoading(false)
    }
  }, [canRead])

  // Cargar órdenes al montar el componente
  useEffect(() => {
    cargarOrdenes()
  }, [cargarOrdenes])

  // Aplicar filtros localmente a las órdenes cargadas (implementaremos filtros después)
  const ordenesFiltradas = useMemo(() => {
    if (!ordenes.length) return []

    return ordenes.filter(orden => {
      // Por ahora solo aplicamos filtros básicos
      // Los filtros avanzados se implementarán en el siguiente paso
      
      // Filtro por estado
      if (filters.estado && filters.estado !== 'todos') {
        if (orden.estado !== filters.estado) return false
      }

      // Filtro por prioridad
      if (filters.prioridad && filters.prioridad !== 'todos') {
        if (orden.prioridad !== filters.prioridad) return false
      }

      return true
    })
  }, [ordenes, filters])

  /**
   * Calcular métricas del dashboard
   */
  const metricas = useMemo(() => {
    if (!ordenes.length) return {
      total: 0,
      pendientes: 0,
      enProceso: 0,
      completadas: 0,
      sinMecanico: 0
    }

    return {
      total: ordenes.length,
      pendientes: ordenes.filter(o => o.estado === 'RECIBIDA' || o.estado === 'DIAGNOSTICADA').length,
      enProceso: ordenes.filter(o => o.estado === 'EN_PROCESO').length,
      completadas: ordenes.filter(o => o.estado === 'COMPLETADA' || o.estado === 'ENTREGADA').length,
      sinMecanico: ordenes.filter(o => !o.idMecanicoAsignado).length
    }
  }, [ordenes])

  /**
   * Manejar cambios de filtros (implementaremos después)
   */
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  /**
   * Manejar refresh de datos
   */
  const handleRefresh = useCallback(() => {
    cargarOrdenes()
    setSnackbar({
      open: true,
      message: 'Datos actualizados correctamente',
      severity: 'success'
    })
  }, [cargarOrdenes])

  /**
   * Manejar creación de orden
   */
  const handleCreateOrden = () => {
    if (!canCreate) {
      setSnackbar({
        open: true,
        message: 'No tienes permisos para crear órdenes de trabajo',
        severity: 'warning'
      })
      return
    }
    
    setFormDialog({ open: true, orden: null, loading: false })
  }

  /**
   * Manejar envío del formulario de creación
   */
  const handleSubmitOrden = async (ordenData) => {
    setFormDialog(prev => ({ ...prev, loading: true }))
    
    try {
      const result = await ordenService.crear(ordenData)
      
      if (result.success) {
        // Actualizar lista de órdenes
        await cargarOrdenes()
        
        // Cerrar formulario y mostrar mensaje de éxito
        setFormDialog({ open: false, orden: null, loading: false })
        setSnackbar({
          open: true,
          message: result.data?.numeroOrden 
            ? `Orden #${result.data.numeroOrden} creada correctamente`
            : 'Orden creada correctamente',
          severity: 'success'
        })
      } else {
        // Error en la creación
        setFormDialog(prev => ({ ...prev, loading: false }))
        setSnackbar({
          open: true,
          message: result.message || 'Error al crear la orden',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Error al crear orden:', error)
      setFormDialog(prev => ({ ...prev, loading: false }))
      setSnackbar({
        open: true,
        message: 'Error al crear la orden. Por favor, intenta de nuevo.',
        severity: 'error'
      })
    }
  }

  /**
   * Cerrar formulario de orden
   */
  const handleCloseFormDialog = () => {
    setFormDialog({ open: false, orden: null, loading: false })
  }

  /**
   * Manejar vista de detalles de orden
   */
  const handleViewOrden = (orden) => {
    setDetailDialog({ open: true, orden })
  }

  /**
   * Manejar edición de orden
   */
  const handleEditOrden = (orden) => {
    if (!canUpdate) {
      setSnackbar({
        open: true,
        message: 'No tienes permisos para editar órdenes de trabajo',
        severity: 'warning'
      })
      return
    }
    
    setFormDialog({ open: true, orden, loading: false })
  }

  /**
   * Manejar asignación de mecánico
   */
  const handleAssignMecanico = (orden) => {
    if (!canAssignMecanico) {
      setSnackbar({
        open: true,
        message: 'No tienes permisos para asignar mecánicos',
        severity: 'warning'
      })
      return
    }
    
    setAssignDialog({ open: true, orden, loading: false })
  }

  /**
   * Procesar asignación de mecánico
   */
  const handleProcessAssignMecanico = async (orden, mecanico) => {
    setAssignDialog(prev => ({ ...prev, loading: true }))
    
    try {
      const result = await ordenService.asignarMecanico(orden.idOrden, mecanico.idUsuario)
      
      if (result.success) {
        // Actualizar lista local
        setOrdenes(prev => prev.map(o => 
          o.idOrden === orden.idOrden 
            ? { ...o, mecanicoAsignado: mecanico }
            : o
        ))
        
        setSnackbar({
          open: true,
          message: `Mecánico ${mecanico.nombreCompleto} asignado exitosamente`,
          severity: 'success'
        })
        
        setAssignDialog({ open: false, orden: null, loading: false })
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Error al asignar mecánico',
          severity: 'error'
        })
      }
    } catch (err) {
      console.error('Error al asignar mecánico:', err)
      setSnackbar({
        open: true,
        message: 'Error al asignar mecánico',
        severity: 'error'
      })
    } finally {
      setAssignDialog(prev => ({ ...prev, loading: false }))
    }
  }

  /**
   * Manejar eliminación de orden
   */
  const handleDeleteOrden = (orden) => {
    if (!canDelete) {
      setSnackbar({
        open: true,
        message: 'No tienes permisos para eliminar órdenes de trabajo',
        severity: 'warning'
      })
      return
    }
    
    setDeleteDialog({ open: true, orden })
  }

  /**
   * Confirmar eliminación de orden
   */
  const confirmDeleteOrden = async () => {
    const { orden } = deleteDialog
    
    try {
      await ordenService.eliminar(orden.idOrden)
      
      // Actualizar lista local
      setOrdenes(prev => prev.filter(o => o.idOrden !== orden.idOrden))
      
      setSnackbar({
        open: true,
        message: `Orden #${orden.numeroOrden} eliminada correctamente`,
        severity: 'success'
      })
    } catch (err) {
      console.error('Error al eliminar orden:', err)
      setSnackbar({
        open: true,
        message: 'Error al eliminar la orden. Intenta de nuevo.',
        severity: 'error'
      })
    } finally {
      setDeleteDialog({ open: false, orden: null })
    }
  }

  /**
   * Cerrar snackbar
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'info' })
  }

  // Mostrar mensaje si no tiene permisos de lectura
  if (!canRead) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          No tienes permisos para acceder a las órdenes de trabajo.
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ fontSize: 40 }} />
            Órdenes de Trabajo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Usuario: {user?.nombreCompleto} ({user?.rol})
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Botón Refresh */}
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Actualizar
          </Button>
          
          {/* Botón Nueva Orden */}
          {canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateOrden}
            >
              Nueva Orden
            </Button>
          )}
        </Box>
      </Box>

      {/* Dashboard de métricas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {metricas.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Órdenes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {metricas.pendientes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {metricas.enProceso}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En Proceso
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {metricas.completadas}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros (placeholder - implementaremos después) */}
      {/* <OrdenesFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        loading={loading}
      /> */}

      {/* Lista de órdenes */}
      <OrdenesList
        ordenes={ordenesFiltradas}
        loading={loading}
        error={error}
        onEdit={handleEditOrden}
        onView={handleViewOrden}
        onDelete={handleDeleteOrden}
        onAssignMecanico={handleAssignMecanico}
        onRefresh={handleRefresh}
      />

      {/* FAB para crear nueva orden en móvil */}
      {canCreate && (
        <Fab
          color="primary"
          aria-label="nueva orden"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' }
          }}
          onClick={handleCreateOrden}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, orden: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la orden #{deleteDialog.orden?.numeroOrden}?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, orden: null })}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteOrden}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Formulario de crear/editar orden */}
      <OrdenForm
        open={formDialog.open}
        onClose={handleCloseFormDialog}
        onSubmit={handleSubmitOrden}
        loading={formDialog.loading}
        error={error}
        orden={formDialog.orden}
      />

      {/* Diálogo de detalles de orden */}
      <OrdenDetail
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, orden: null })}
        orden={detailDialog.orden}
        onEdit={handleEditOrden}
        onAssignMecanico={handleAssignMecanico}
        canEdit={canUpdate}
        canAssignMecanico={canAssignMecanico}
      />

      {/* Diálogo de asignación de mecánico */}
      <AssignMecanicoDialog
        open={assignDialog.open}
        onClose={() => setAssignDialog({ open: false, orden: null, loading: false })}
        orden={assignDialog.orden}
        onAssign={handleProcessAssignMecanico}
        loading={assignDialog.loading}
      />
    </Box>
  )
}

export default OrdenesPage
