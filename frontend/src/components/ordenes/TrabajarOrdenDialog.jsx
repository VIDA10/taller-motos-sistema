import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Grid
} from '@mui/material'
import {
  Build as ServiciosIcon,
  Inventory as RepuestosIcon,
  History as HistorialIcon,
  TrendingUp as ResumenIcon,
  Warning as WarningIcon
} from '@mui/icons-material'

// Importar componentes de tabs
import ServiciosOrdenTab from './ServiciosOrdenTab'
import RepuestosOrdenTab from './RepuestosOrdenTab'
import HistorialOrdenTab from './HistorialOrdenTab'

// Importar servicios
import detalleOrdenService from '../../services/detalleOrdenService'
import usoRepuestoService from '../../services/usoRepuestoService'
import ordenHistorialService from '../../services/ordenHistorialService'
import ordenService from '../../services/ordenService'

/**
 * Diálogo para trabajar en una orden (Tareas 6.6, 6.7, 6.8)
 * Permite al mecánico:
 * - Registrar servicios aplicados
 * - Registrar repuestos utilizados
 * - Ver historial de cambios
 * - Ver resumen de costos
 */
const TrabajarOrdenDialog = ({ 
  open, 
  onClose, 
  orden, 
  onOrdenActualizada 
}) => {
  const { user } = useSelector((state) => state.auth)
  
  // Estados del diálogo
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  
  // Estados de datos
  const [serviciosAplicados, setServiciosAplicados] = useState([])
  const [repuestosUtilizados, setRepuestosUtilizados] = useState([])
  const [historialCambios, setHistorialCambios] = useState([])
  const [totales, setTotales] = useState({
    servicios: 0,
    repuestos: 0,
    total: 0
  })

  // Cargar datos cuando se abre el diálogo
  useEffect(() => {
    if (open && orden) {
      console.log('🚗 Orden recibida en TrabajarOrdenDialog:', orden)
      cargarDatosOrden()
    }
  }, [open, orden])

  /**
   * Cargar todos los datos relacionados con la orden
   */
  const cargarDatosOrden = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Cargar servicios aplicados
      const serviciosResult = await detalleOrdenService.buscarPorOrden(orden.idOrden)
      console.log('🔧 Servicios Result:', serviciosResult)
      if (serviciosResult.success) {
        console.log('✅ Servicios aplicados cargados:', serviciosResult.data)
        setServiciosAplicados(serviciosResult.data || [])
      } else {
        console.error('❌ Error al cargar servicios:', serviciosResult.message)
      }

      // Cargar repuestos utilizados
      const repuestosResult = await usoRepuestoService.buscarPorOrden(orden.idOrden)
      console.log('🔧 Repuestos Result:', repuestosResult)
      if (repuestosResult.success) {
        console.log('✅ Repuestos utilizados cargados:', repuestosResult.data)
        setRepuestosUtilizados(repuestosResult.data || [])
      } else {
        console.error('❌ Error al cargar repuestos:', repuestosResult.message)
      }

      // Cargar historial de cambios
      const historialResult = await ordenHistorialService.buscarPorOrden(orden.idOrden)
      if (historialResult.success) {
        setHistorialCambios(historialResult.data || [])
      }

      // Calcular totales
      await calcularTotales()

    } catch (error) {
      console.error('Error al cargar datos de la orden:', error)
      setError('Error al cargar los datos de la orden')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calcular totales de servicios y repuestos
   */
  const calcularTotales = async () => {
    try {
      const [serviciosTotal, repuestosTotal] = await Promise.all([
        detalleOrdenService.calcularTotalServicios(orden.idOrden),
        usoRepuestoService.calcularTotalRepuestos(orden.idOrden)
      ])

      const totalServicios = serviciosTotal.success ? serviciosTotal.data : 0
      const totalRepuestos = repuestosTotal.success ? repuestosTotal.data : 0

      setTotales({
        servicios: totalServicios,
        repuestos: totalRepuestos,
        total: totalServicios + totalRepuestos
      })
    } catch (error) {
      console.error('Error al calcular totales:', error)
    }
  }

  /**
   * Manejar actualización de servicios
   */
  const handleServiciosActualizados = () => {
    cargarDatosOrden()
  }

  /**
   * Manejar actualización de repuestos
   */
  const handleRepuestosActualizados = () => {
    cargarDatosOrden()
  }

  /**
   * Completar orden y cerrar diálogo
   */
  const handleCompletarOrden = async () => {
    if (!user?.idUsuario) {
      setError('Usuario no encontrado')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Actualizar estado de la orden a COMPLETADA
      const ordenActualizada = {
        ...orden,
        estado: 'COMPLETADA',
        totalServicios: totales.servicios,
        totalRepuestos: totales.repuestos,
        totalOrden: totales.total
      }

      const result = await ordenService.actualizar(orden.idOrden, ordenActualizada)
      
      if (result.success) {
        // Registrar cambio en el historial
        await ordenHistorialService.registrarCambioEstado(
          orden.idOrden,
          orden.estado,
          'COMPLETADA',
          `Orden completada por mecánico. Total: $${totales.total}`,
          user.idUsuario
        )

        // Notificar al componente padre
        if (onOrdenActualizada) {
          onOrdenActualizada(result.data)
        }

        onClose()
      } else {
        setError(result.message || 'Error al completar la orden')
      }
    } catch (error) {
      console.error('Error al completar orden:', error)
      setError('Error inesperado al completar la orden')
    } finally {
      setSaving(false)
    }
  }

  /**
   * Cerrar diálogo
   */
  const handleCerrar = () => {
    setTabValue(0)
    setError(null)
    onClose()
  }

  // Configuración de tabs
  const tabs = [
    { 
      label: 'Servicios', 
      icon: <ServiciosIcon />, 
      count: serviciosAplicados.length 
    },
    { 
      label: 'Repuestos', 
      icon: <RepuestosIcon />, 
      count: repuestosUtilizados.length 
    },
    { 
      label: 'Historial', 
      icon: <HistorialIcon />, 
      count: historialCambios.length 
    }
  ]

  if (!orden) {
    return null
  }

  return (
    <Dialog
      open={open}
      onClose={handleCerrar}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">
              Trabajar en Orden #{orden.numeroOrden}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {orden.moto?.cliente?.nombre} - {orden.moto?.marca} {orden.moto?.modelo}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={orden.estado} 
              color={orden.estado === 'EN_PROCESO' ? 'primary' : 'default'}
              size="small"
            />
            <Chip 
              label={orden.prioridad} 
              color={orden.prioridad === 'URGENTE' ? 'error' : 'default'}
              size="small"
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Resumen de totales */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ResumenIcon />
            Resumen de Costos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">Servicios</Typography>
              <Typography variant="h6">${totales.servicios.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">Repuestos</Typography>
              <Typography variant="h6">${totales.repuestos.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">Total</Typography>
              <Typography variant="h5" color="primary.main">
                ${totales.total.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Advertencia si no hay servicios ni repuestos */}
        {serviciosAplicados.length === 0 && repuestosUtilizados.length === 0 && (
          <Alert severity="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
            No se han registrado servicios ni repuestos para esta orden. 
            Agrega al menos un servicio o repuesto antes de completar la orden.
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    icon={tab.icon}
                    label={`${tab.label} (${tab.count})`}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Box>

            {/* Contenido de tabs */}
            {tabValue === 0 && (
              <ServiciosOrdenTab
                orden={orden}
                serviciosAplicados={serviciosAplicados}
                onServiciosActualizados={handleServiciosActualizados}
              />
            )}

            {tabValue === 1 && (
              <RepuestosOrdenTab
                orden={orden}
                repuestosUtilizados={repuestosUtilizados}
                onRepuestosActualizados={handleRepuestosActualizados}
              />
            )}

            {tabValue === 2 && (
              <HistorialOrdenTab
                orden={orden}
                historialCambios={historialCambios}
              />
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCerrar} disabled={saving}>
          Cerrar
        </Button>
        
        {orden.estado === 'EN_PROCESO' && (
          <Button
            onClick={handleCompletarOrden}
            variant="contained"
            color="success"
            disabled={saving || (serviciosAplicados.length === 0 && repuestosUtilizados.length === 0)}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Completando...' : 'Completar Orden'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

TrabajarOrdenDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orden: PropTypes.object,
  onOrdenActualizada: PropTypes.func
}

export default TrabajarOrdenDialog
