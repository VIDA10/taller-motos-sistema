import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Alert,
  Chip,
  CircularProgress,
  Tooltip
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Build as ServiciosIcon
} from '@mui/icons-material'

// Importar servicios
import detalleOrdenService from '../../services/detalleOrdenService'
import servicioService from '../../services/servicioService'

/**
 * Tab para gestión de servicios aplicados a una orden (Tarea 6.6)
 * Permite agregar, editar y eliminar servicios de la orden
 * También funciona en modo selección para EjecutarTrabajoDialog
 */
const ServiciosOrdenTab = ({ 
  orden, 
  serviciosAplicados = [], 
  onServiciosActualizados,
  // Props para modo selección
  serviciosSeleccionados = [],
  onServiciosChange,
  modoSeleccion = false
}) => {
  // Estados del componente
  const [serviciosDisponibles, setServiciosDisponibles] = useState([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState(null)
  
  // Estados del formulario
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [precioAplicado, setPrecioAplicado] = useState('')
  const [observaciones, setObservaciones] = useState('')

  // Cargar servicios disponibles al montar
  useEffect(() => {
    cargarServiciosDisponibles()
  }, [])

  /**
   * Cargar lista de servicios activos disponibles
   */
  const cargarServiciosDisponibles = async () => {
    try {
      const servicios = await servicioService.getActiveOrderedByName()
      console.log('🔧 Servicios disponibles cargados:', servicios)
      setServiciosDisponibles(servicios || [])
    } catch (error) {
      console.error('Error al cargar servicios:', error)
      setError('Error al cargar servicios disponibles')
    }
  }

  /**
   * Abrir diálogo para agregar servicio
   */
  const handleAgregarServicio = () => {
    setEditando(null)
    setServicioSeleccionado(null)
    setPrecioAplicado('')
    setObservaciones('')
    setError(null)
    setDialogOpen(true)
  }

  /**
   * Abrir diálogo para editar servicio
   */
  const handleEditarServicio = (detalle) => {
    setEditando(detalle)
    setServicioSeleccionado(detalle.servicio)
    setPrecioAplicado(detalle.precioAplicado.toString())
    setObservaciones(detalle.observaciones || '')
    setError(null)
    setDialogOpen(true)
  }

  /**
   * Guardar servicio (crear o actualizar)
   */
  const handleGuardarServicio = async () => {
    if (!servicioSeleccionado) {
      setError('Debe seleccionar un servicio')
      return
    }

    if (!precioAplicado || isNaN(precioAplicado) || parseFloat(precioAplicado) <= 0) {
      setError('Debe ingresar un precio válido')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const detalleData = {
        ordenTrabajo: { idOrden: orden.idOrden },
        servicio: { idServicio: servicioSeleccionado.idServicio },
        precioAplicado: parseFloat(precioAplicado),
        observaciones: observaciones.trim() || null
      }

      let result
      if (editando) {
        // Actualizar servicio existente
        result = await detalleOrdenService.actualizar(editando.idDetalle, detalleData)
      } else {
        // Verificar si el servicio ya existe en la orden
        const existeResult = await detalleOrdenService.verificarServicioEnOrden(
          orden.idOrden, 
          servicioSeleccionado.idServicio
        )
        
        if (existeResult.success && existeResult.data) {
          setError('Este servicio ya está aplicado a la orden')
          return
        }

        // Crear nuevo detalle
        result = await detalleOrdenService.crear(detalleData)
      }

      if (result.success) {
        setDialogOpen(false)
        onServiciosActualizados()
      } else {
        setError(result.message || 'Error al guardar servicio')
      }
    } catch (error) {
      console.error('Error al guardar servicio:', error)
      setError('Error inesperado al guardar servicio')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Eliminar servicio de la orden
   */
  const handleEliminarServicio = async (detalle) => {
    if (!window.confirm(`¿Está seguro de eliminar el servicio "${detalle.servicio?.nombre}"?`)) {
      return
    }

    setLoading(true)
    
    try {
      const result = await detalleOrdenService.eliminar(detalle.idDetalle)
      
      if (result.success) {
        onServiciosActualizados()
      } else {
        setError(result.message || 'Error al eliminar servicio')
      }
    } catch (error) {
      console.error('Error al eliminar servicio:', error)
      setError('Error inesperado al eliminar servicio')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Manejar selección de servicio y autocompletar precio
   */
  const handleServicioSeleccionado = (servicio) => {
    setServicioSeleccionado(servicio)
    if (servicio && !editando) {
      setPrecioAplicado(servicio.precioBase?.toString() || '')
    }
  }

  /**
   * Cerrar diálogo
   */
  const handleCerrarDialog = () => {
    setDialogOpen(false)
    setError(null)
  }

  // Calcular total de servicios
  const totalServicios = serviciosAplicados.reduce(
    (total, detalle) => total + (detalle.precioAplicado || 0), 
    0
  )

  return (
    <Box>
      {/* Header con botón agregar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ServiciosIcon />
          Servicios Aplicados ({serviciosAplicados.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAgregarServicio}
          disabled={loading}
        >
          Agregar Servicio
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabla de servicios */}
      {serviciosAplicados.length === 0 ? (
        <Alert severity="info">
          No hay servicios aplicados a esta orden. Use el botón "Agregar Servicio" para comenzar.
        </Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Servicio</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell align="right">Precio Aplicado</TableCell>
                <TableCell>Observaciones</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serviciosAplicados.map((detalle) => (
                <TableRow key={detalle.idDetalle}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {detalle.servicio?.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Código: {detalle.servicio?.codigo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={detalle.servicio?.categoria} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      ${detalle.precioAplicado?.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {detalle.observaciones || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar servicio">
                      <IconButton
                        size="small"
                        onClick={() => handleEditarServicio(detalle)}
                        disabled={loading}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar servicio">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleEliminarServicio(detalle)}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {/* Fila de total */}
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell colSpan={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total Servicios
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" color="primary">
                    ${totalServicios.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo para agregar/editar servicio */}
      <Dialog open={dialogOpen} onClose={handleCerrarDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editando ? 'Editar Servicio' : 'Agregar Servicio'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 1 }}>
            {/* Selector de servicio */}
            <Autocomplete
              value={servicioSeleccionado}
              onChange={(e, newValue) => handleServicioSeleccionado(newValue)}
              options={serviciosDisponibles}
              getOptionLabel={(option) => `${option.nombre} (${option.codigo})`}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2">{option.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.categoria} - ${option.precioBase}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Servicio"
                  required
                  helperText="Seleccione el servicio a aplicar"
                />
              )}
              disabled={loading || editando} // No permitir cambiar servicio al editar
              sx={{ mb: 2 }}
            />

            {/* Precio aplicado */}
            <TextField
              fullWidth
              label="Precio Aplicado"
              type="number"
              value={precioAplicado}
              onChange={(e) => setPrecioAplicado(e.target.value)}
              required
              inputProps={{ min: 0, step: 0.01 }}
              helperText={
                servicioSeleccionado 
                  ? `Precio base: $${servicioSeleccionado.precioBase}` 
                  : 'Ingrese el precio a aplicar'
              }
              sx={{ mb: 2 }}
            />

            {/* Observaciones */}
            <TextField
              fullWidth
              label="Observaciones"
              multiline
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Observaciones adicionales sobre la aplicación del servicio..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarDialog} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleGuardarServicio}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Guardando...' : (editando ? 'Actualizar' : 'Agregar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

ServiciosOrdenTab.propTypes = {
  orden: PropTypes.object.isRequired,
  serviciosAplicados: PropTypes.array,
  onServiciosActualizados: PropTypes.func.isRequired
}

export default ServiciosOrdenTab
