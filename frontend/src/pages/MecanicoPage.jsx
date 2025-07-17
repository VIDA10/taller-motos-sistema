import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
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
  Card,
  CardContent,
  Grid,
  Chip,
  Tab,
  Tabs,
  Badge,
  Fab
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  Assignment as DiagnosticarIcon,
  Build as TrabajarIcon,
  CheckCircle as CompletarIcon,
  Visibility as ViewIcon,
  PlayArrow as IniciarIcon
} from '@mui/icons-material'

// Importar servicios y componentes
import ordenService from '../services/ordenService'
import detalleOrdenService from '../services/detalleOrdenService'
import usoRepuestoService from '../services/usoRepuestoService'
import OrdenesList from '../components/ordenes/OrdenesList'
import OrdenDetail from '../components/ordenes/OrdenDetail'
import DiagnosticoDialog from '../components/ordenes/DiagnosticoDialog'
import EjecutarTrabajoDialog from '../components/ordenes/EjecutarTrabajoDialog'
import TrabajarOrdenDialog from '../components/ordenes/TrabajarOrdenDialog'
import { hasPermission } from '../utils/permissions'

/**
 * Página del mecánico para gestión de sus órdenes asignadas
 * 
 * FLUJO DEL MECÁNICO según el sistema:
 * 1. Ver órdenes asignadas a él filtradas por estado
 * 2. Diagnosticar orden (RECIBIDA → DIAGNOSTICADA)
 * 3. Trabajar en orden (DIAGNOSTICADA → EN_PROCESO)
 *    - Registrar servicios aplicados
 *    - Registrar repuestos utilizados
 * 4. Completar orden (EN_PROCESO → COMPLETADA)
 * 5. Ver historial de cambios
 * 
 * Funcionalidades específicas del mecánico:
 * - Ver solo órdenes asignadas a él
 * - Cambiar estados progresivamente
 * - Registrar trabajo realizado
 * - No puede crear ni eliminar órdenes
 */
const MecanicoPage = () => {
  const { user } = useSelector((state) => state.auth)
  
  // Estados principales
  const [ordenesAsignadas, setOrdenesAsignadas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Estados de UI
  const [tabValue, setTabValue] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  
  // Estados de diálogos
  const [detailDialog, setDetailDialog] = useState({ open: false, orden: null, estadoContext: null })
  const [diagnosticoDialog, setDiagnosticoDialog] = useState({ open: false, orden: null })
  const [ejecutarTrabajoDialog, setEjecutarTrabajoDialog] = useState({ open: false, orden: null })
  const [trabajoDialog, setTrabajoDialog] = useState({ open: false, orden: null, loading: false })
  const [completarDialog, setCompletarDialog] = useState({ open: false, orden: null })

  // Verificar permisos del mecánico
  const canUpdate = hasPermission(user, 'ordenes', 'update')
  const canRead = hasPermission(user, 'ordenes', 'read')

  /**
   * Cargar órdenes asignadas al mecánico actual
   * Usa el endpoint específico para mecánico
   */
  const cargarOrdenesAsignadas = useCallback(async () => {
    if (!canRead || !user?.idUsuario) {
      setError('No tienes permisos para ver órdenes de trabajo')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Usar el endpoint específico para buscar por mecánico
      const result = await ordenService.buscarPorMecanico({
        idUsuario: user.idUsuario,
        nombreCompleto: user.nombreCompleto,
        rol: user.rol
      })
      
      if (result.success) {
        console.log('🔧 Órdenes asignadas al mecánico:', result.data)
        setOrdenesAsignadas(result.data || [])
        showSnackbar('Órdenes cargadas correctamente', 'success')
      } else {
        console.error('Error al obtener órdenes del mecánico:', result.message)
        setError(result.message || 'Error al cargar las órdenes asignadas')
        showSnackbar('Error al cargar órdenes', 'error')
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      setError('Error inesperado al cargar las órdenes')
      showSnackbar('Error inesperado', 'error')
    } finally {
      setLoading(false)
    }
  }, [user, canRead])

  // Cargar órdenes al montar el componente
  useEffect(() => {
    cargarOrdenesAsignadas()
  }, [cargarOrdenesAsignadas])

  /**
   * Filtrar órdenes por estado para las tabs
   */
  const ordenesPorEstado = useMemo(() => {
    return {
      recibidas: ordenesAsignadas.filter(o => o.estado === 'RECIBIDA'),
      diagnosticadas: ordenesAsignadas.filter(o => o.estado === 'DIAGNOSTICADA'),
      enProceso: ordenesAsignadas.filter(o => o.estado === 'EN_PROCESO'),
      completadas: ordenesAsignadas.filter(o => ['COMPLETADA', 'ENTREGADA'].includes(o.estado))
    }
  }, [ordenesAsignadas])

  /**
   * Obtener las órdenes según la tab activa
   */
  const ordenesActuales = useMemo(() => {
    switch (tabValue) {
      case 0: return ordenesPorEstado.recibidas
      case 1: return ordenesPorEstado.diagnosticadas
      case 2: return ordenesPorEstado.enProceso
      case 3: return ordenesPorEstado.completadas
      default: return []
    }
  }, [tabValue, ordenesPorEstado])

  /**
   * Cambiar estado de una orden según el flujo del mecánico
   */
  const handleCambiarEstado = async (orden, nuevoEstado) => {
    if (!canUpdate) {
      showSnackbar('No tienes permisos para actualizar órdenes', 'error')
      return
    }

    try {
      setLoading(true)
      
      const ordenActualizada = {
        ...orden,
        estado: nuevoEstado,
        // Agregar timestamp de cambio
        updatedAt: new Date().toISOString()
      }

      const result = await ordenService.actualizar(orden.idOrden, ordenActualizada)
      
      if (result.success) {
        // Actualizar la lista local
        setOrdenesAsignadas(prev => 
          prev.map(o => o.idOrden === orden.idOrden ? result.data : o)
        )
        showSnackbar(`Orden cambiada a ${nuevoEstado}`, 'success')
      } else {
        showSnackbar(result.message || 'Error al cambiar estado', 'error')
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      showSnackbar('Error inesperado al cambiar estado', 'error')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Diagnosticar orden (RECIBIDA → DIAGNOSTICADA)
   * Abre el diálogo de diagnóstico
   */
  const handleDiagnosticar = (orden) => {
    if (orden.estado === 'RECIBIDA') {
      setDiagnosticoDialog({ open: true, orden })
    }
  }

  /**
   * Procesar diagnóstico completado
   */
  const handleDiagnosticoCompleto = async (ordenConDiagnostico) => {
    try {
      setLoading(true)
      
      const result = await ordenService.actualizar(ordenConDiagnostico.idOrden, ordenConDiagnostico)
      
      if (result.success) {
        // Actualizar la lista local
        setOrdenesAsignadas(prev => 
          prev.map(o => o.idOrden === ordenConDiagnostico.idOrden ? result.data : o)
        )
        showSnackbar('Diagnóstico guardado correctamente', 'success')
      } else {
        showSnackbar(result.message || 'Error al guardar diagnóstico', 'error')
      }
    } catch (error) {
      console.error('Error al guardar diagnóstico:', error)
      showSnackbar('Error inesperado al guardar diagnóstico', 'error')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Iniciar trabajo en orden (DIAGNOSTICADA → EN_PROCESO)
   * Abre el diálogo para seleccionar servicios y repuestos
   */
  const handleIniciarTrabajo = (orden) => {
    if (orden.estado === 'DIAGNOSTICADA') {
      setEjecutarTrabajoDialog({ open: true, orden })
    }
  }

  /**
   * Procesar trabajo iniciado (servicios y repuestos seleccionados)
   */
  const handleTrabajoIniciado = async (trabajoData) => {
    try {
      setLoading(true)
      
      // Primero actualizar el estado de la orden
      const ordenResult = await ordenService.actualizar(trabajoData.orden.idOrden, trabajoData.orden)
      
      if (ordenResult.success) {
        // Registrar servicios aplicados en detalles_orden
        for (const servicio of trabajoData.servicios) {
          const detalleOrden = {
            ordenTrabajo: { idOrden: trabajoData.orden.idOrden },
            servicio: { idServicio: servicio.idServicio },
            precioAplicado: servicio.precio,
            observaciones: servicio.comentario || ''
          }
          
          const servicioResult = await detalleOrdenService.crear(detalleOrden)
          if (!servicioResult.success) {
            console.error('Error al registrar servicio:', servicioResult.message)
          }
        }
        
        // Registrar repuestos utilizados en usos_repuesto
        for (const repuesto of trabajoData.repuestos) {
          const usoRepuesto = {
            ordenTrabajo: { idOrden: trabajoData.orden.idOrden },
            repuesto: { idRepuesto: repuesto.idRepuesto },
            cantidad: repuesto.cantidad,
            precioUnitario: repuesto.precio,
            subtotal: repuesto.cantidad * repuesto.precio,
            observaciones: repuesto.comentario || ''
          }
          
          const repuestoResult = await usoRepuestoService.crear(usoRepuesto)
          if (!repuestoResult.success) {
            console.error('Error al registrar uso de repuesto:', repuestoResult.message)
          }
        }
        
        // Actualizar estado local
        setOrdenesAsignadas(prev => 
          prev.map(o => o.idOrden === trabajoData.orden.idOrden ? ordenResult.data : o)
        )
        showSnackbar('Trabajo iniciado correctamente. Servicios y repuestos registrados.', 'success')
      } else {
        showSnackbar(ordenResult.message || 'Error al iniciar trabajo', 'error')
      }
    } catch (error) {
      console.error('Error al iniciar trabajo:', error)
      showSnackbar('Error inesperado al iniciar trabajo', 'error')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Completar orden (EN_PROCESO → COMPLETADA)
   */
  const handleCompletar = (orden) => {
    if (orden.estado === 'EN_PROCESO') {
      setCompletarDialog({ open: true, orden })
    }
  }

  /**
   * Confirmar completar orden después del diálogo
   */
  const handleConfirmarCompletar = async () => {
    const { orden } = completarDialog
    setCompletarDialog({ open: false, orden: null })
    await handleCambiarEstado(orden, 'COMPLETADA')
  }

  /**
   * Abrir dialog para trabajar en orden
   * Permite registrar servicios y repuestos aplicados
   */
  const handleTrabajarEnOrden = (orden) => {
    setTrabajoDialog({ open: true, orden, loading: false })
  }

  /**
   * Callback para actualizar orden después de trabajar
   */
  const handleOrdenActualizada = (ordenActualizada) => {
    // Actualizar la lista local
    setOrdenesAsignadas(prev => 
      prev.map(o => o.idOrden === ordenActualizada.idOrden ? ordenActualizada : o)
    )
    showSnackbar('Orden actualizada correctamente', 'success')
  }

  /**
   * Ver detalles de orden con contexto del estado actual
   */
  const handleVerDetalles = (orden) => {
    // Obtener el contexto de estado basado en la pestaña actual
    const estadosContext = ['NUEVA', 'DIAGNOSTICADA', 'EN_PROCESO', 'COMPLETADA']
    const estadoContext = estadosContext[tabValue] || orden.estado
    
    setDetailDialog({ 
      open: true, 
      orden, 
      estadoContext 
    })
  }

  /**
   * Mostrar snackbar
   */
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity })
  }

  /**
   * Obtener acciones disponibles según el estado de la orden
   */
  const getAccionesDisponibles = (orden) => {
    const acciones = []

    // Siempre se puede ver detalles
    acciones.push({
      label: 'Ver Detalles',
      icon: <ViewIcon />,
      onClick: () => handleVerDetalles(orden),
      color: 'primary'
    })

    // Acciones según estado
    switch (orden.estado) {
      case 'RECIBIDA':
        acciones.push({
          label: 'Diagnosticar',
          icon: <DiagnosticarIcon />,
          onClick: () => handleDiagnosticar(orden),
          color: 'warning'
        })
        break
        
      case 'DIAGNOSTICADA':
        acciones.push({
          label: 'Iniciar Trabajo',
          icon: <IniciarIcon />,
          onClick: () => handleIniciarTrabajo(orden),
          color: 'info'
        })
        break
        
      case 'EN_PROCESO':
        acciones.push({
          label: 'Gestionar Trabajo',
          icon: <TrabajarIcon />,
          onClick: () => handleTrabajarEnOrden(orden),
          color: 'primary'
        })
        acciones.push({
          label: 'Completar',
          icon: <CompletarIcon />,
          onClick: () => handleCompletar(orden),
          color: 'success'
        })
        break
    }

    return acciones
  }

  // Tabs para filtrar por estado
  const tabs = [
    { label: 'Nuevas', count: ordenesPorEstado.recibidas.length },
    { label: 'Diagnosticadas', count: ordenesPorEstado.diagnosticadas.length },
    { label: 'En Proceso', count: ordenesPorEstado.enProceso.length },
    { label: 'Completadas', count: ordenesPorEstado.completadas.length }
  ]

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={cargarOrdenesAsignadas} startIcon={<RefreshIcon />}>
          Reintentar
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Mis Órdenes de Trabajo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Mecánico: {user?.nombreCompleto}
          </Typography>
        </Box>
        
        <Button
          onClick={cargarOrdenesAsignadas}
          disabled={loading}
          startIcon={<RefreshIcon />}
          variant="outlined"
        >
          Actualizar
        </Button>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {ordenesPorEstado.recibidas.length}
              </Typography>
              <Typography variant="body2">Nuevas</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {ordenesPorEstado.diagnosticadas.length}
              </Typography>
              <Typography variant="body2">Diagnosticadas</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {ordenesPorEstado.enProceso.length}
              </Typography>
              <Typography variant="body2">En Proceso</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {ordenesPorEstado.completadas.length}
              </Typography>
              <Typography variant="body2">Completadas</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs por estado */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Badge badgeContent={tab.count} color="primary">
                  {tab.label}
                </Badge>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Lista de órdenes */}
      {ordenesAsignadas.length === 0 && !loading ? (
        <Alert severity="info">
          No tienes órdenes asignadas en este momento.
        </Alert>
      ) : (
        <OrdenesList
          ordenes={ordenesActuales}
          loading={loading}
          error={null}
          onView={handleVerDetalles}
          onEdit={null} // Mecánico no puede editar directamente
          onDelete={null} // Mecánico no puede eliminar
          onChangeEstado={handleCambiarEstado}
          onAssignMecanico={null} // Mecánico no puede asignar
          onRefresh={cargarOrdenesAsignadas}
          customActions={getAccionesDisponibles} // Acciones específicas del mecánico
          hideCreateButton={true} // Mecánico no puede crear órdenes
        />
      )}

      {/* Dialog para detalles */}
      <Dialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, orden: null })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {detailDialog.estadoContext ? 
            `${detailDialog.estadoContext} - Orden #${detailDialog.orden?.numeroOrden}` :
            `Detalles de Orden #${detailDialog.orden?.numeroOrden}`
          }
        </DialogTitle>
        <DialogContent>
          {detailDialog.orden && (
            <OrdenDetail
              orden={detailDialog.orden}
              onClose={() => setDetailDialog({ open: false, orden: null, estadoContext: null })}
              readOnly={false}
              mecanicoView={true} // Vista específica del mecánico
              estadoContext={detailDialog.estadoContext} // Contexto de estado para mostrar info específica
              inline={true} // Modo inline para renderizar dentro de otro dialog
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog({ open: false, orden: null, estadoContext: null })}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para trabajar en orden (servicios y repuestos) */}
      <TrabajarOrdenDialog
        open={trabajoDialog.open}
        orden={trabajoDialog.orden}
        onClose={() => setTrabajoDialog({ open: false, orden: null, loading: false })}
        onOrdenActualizada={handleOrdenActualizada}
        mecanicoId={user?.idUsuario}
        mecanicoNombre={user?.nombreCompleto}
      />

      {/* Dialog para diagnóstico */}
      <DiagnosticoDialog
        open={diagnosticoDialog.open}
        orden={diagnosticoDialog.orden}
        onClose={() => setDiagnosticoDialog({ open: false, orden: null })}
        onDiagnosticoCompleto={handleDiagnosticoCompleto}
        loading={loading}
      />

      {/* Dialog para iniciar trabajo (seleccionar servicios y repuestos) */}
      <EjecutarTrabajoDialog
        open={ejecutarTrabajoDialog.open}
        orden={ejecutarTrabajoDialog.orden}
        onClose={() => setEjecutarTrabajoDialog({ open: false, orden: null })}
        onTrabajoIniciado={handleTrabajoIniciado}
        loading={loading}
      />

      {/* Dialog de confirmación para completar orden */}
      <Dialog
        open={completarDialog.open}
        onClose={() => setCompletarDialog({ open: false, orden: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CompletarIcon color="warning" />
            Confirmar Completar Orden
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>¡Atención!</strong> Esta acción no se puede deshacer.
          </Alert>
          <Typography variant="body1" gutterBottom>
            ¿Está seguro que desea marcar como <strong>COMPLETADA</strong> la orden{' '}
            <strong>{completarDialog.orden?.numeroOrden}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Una vez completada, la orden no podrá modificarse ni volver a estados anteriores.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCompletarDialog({ open: false, orden: null })}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarCompletar}
            color="success"
            variant="contained"
            startIcon={<CompletarIcon />}
          >
            Sí, Completar Orden
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MecanicoPage
