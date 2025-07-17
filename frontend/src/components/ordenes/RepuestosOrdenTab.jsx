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
  Tooltip,
  InputAdornment
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Inventory as RepuestosIcon,
  Warning as WarningIcon
} from '@mui/icons-material'

// Importar servicios
import usoRepuestoService from '../../services/usoRepuestoService'
import repuestoService from '../../services/repuestoService'

/**
 * Tab para gestión de repuestos utilizados en una orden (Tarea 6.7)
 * Permite agregar, editar y eliminar repuestos de la orden
 */
const RepuestosOrdenTab = ({ 
  orden, 
  repuestosUtilizados = [], 
  onRepuestosActualizados 
}) => {
  // Estados del componente
  const [repuestosDisponibles, setRepuestosDisponibles] = useState([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState(null)
  
  // Estados del formulario
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState(null)
  const [cantidad, setCantidad] = useState('')
  const [precioUnitario, setPrecioUnitario] = useState('')
  const [stockDisponible, setStockDisponible] = useState(0)

  // Cargar repuestos disponibles al montar
  useEffect(() => {
    cargarRepuestosDisponibles()
  }, [])

  /**
   * Cargar lista de repuestos activos disponibles
   */
  const cargarRepuestosDisponibles = async () => {
    try {
      const repuestos = await repuestoService.getActive()
      console.log('🔩 Repuestos disponibles cargados:', repuestos)
      setRepuestosDisponibles(repuestos || [])
    } catch (error) {
      console.error('Error al cargar repuestos:', error)
      setError('Error al cargar repuestos disponibles')
    }
  }

  /**
   * Abrir diálogo para agregar repuesto
   */
  const handleAgregarRepuesto = () => {
    setEditando(null)
    setRepuestoSeleccionado(null)
    setCantidad('')
    setPrecioUnitario('')
    setStockDisponible(0)
    setError(null)
    setDialogOpen(true)
  }

  /**
   * Abrir diálogo para editar repuesto
   */
  const handleEditarRepuesto = (uso) => {
    setEditando(uso)
    setRepuestoSeleccionado(uso.repuesto)
    setCantidad(uso.cantidad.toString())
    setPrecioUnitario(uso.precioUnitario.toString())
    setStockDisponible(uso.repuesto?.stockActual || 0)
    setError(null)
    setDialogOpen(true)
  }

  /**
   * Guardar repuesto (crear o actualizar)
   */
  const handleGuardarRepuesto = async () => {
    if (!repuestoSeleccionado) {
      setError('Debe seleccionar un repuesto')
      return
    }

    if (!cantidad || isNaN(cantidad) || parseInt(cantidad) <= 0) {
      setError('Debe ingresar una cantidad válida')
      return
    }

    if (!precioUnitario || isNaN(precioUnitario) || parseFloat(precioUnitario) <= 0) {
      setError('Debe ingresar un precio unitario válido')
      return
    }

    const cantidadNum = parseInt(cantidad)
    const precioNum = parseFloat(precioUnitario)

    // Verificar stock disponible (solo para nuevos usos)
    if (!editando && cantidadNum > stockDisponible) {
      setError(`Stock insuficiente. Disponible: ${stockDisponible} unidades`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const usoData = {
        ordenTrabajo: { idOrden: orden.idOrden },
        repuesto: { idRepuesto: repuestoSeleccionado.idRepuesto },
        cantidad: cantidadNum,
        precioUnitario: precioNum
        // El subtotal se calcula automáticamente en el backend
      }

      let result
      if (editando) {
        // Actualizar uso existente
        result = await usoRepuestoService.actualizar(editando.idUso, usoData)
      } else {
        // Verificar stock antes de crear
        const stockResult = await usoRepuestoService.verificarStock(
          repuestoSeleccionado.idRepuesto, 
          cantidadNum
        )
        
        if (!stockResult.success || !stockResult.data) {
          setError('Stock insuficiente para la cantidad solicitada')
          return
        }

        // Crear nuevo uso
        result = await usoRepuestoService.crear(usoData)
      }

      if (result.success) {
        setDialogOpen(false)
        onRepuestosActualizados()
      } else {
        setError(result.message || 'Error al guardar repuesto')
      }
    } catch (error) {
      console.error('Error al guardar repuesto:', error)
      setError('Error inesperado al guardar repuesto')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Eliminar repuesto de la orden
   */
  const handleEliminarRepuesto = async (uso) => {
    if (!window.confirm(`¿Está seguro de eliminar el repuesto "${uso.repuesto?.nombre}"?`)) {
      return
    }

    setLoading(true)
    
    try {
      const result = await usoRepuestoService.eliminar(uso.idUso)
      
      if (result.success) {
        onRepuestosActualizados()
      } else {
        setError(result.message || 'Error al eliminar repuesto')
      }
    } catch (error) {
      console.error('Error al eliminar repuesto:', error)
      setError('Error inesperado al eliminar repuesto')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Manejar selección de repuesto y autocompletar datos
   */
  const handleRepuestoSeleccionado = (repuesto) => {
    setRepuestoSeleccionado(repuesto)
    if (repuesto && !editando) {
      setPrecioUnitario(repuesto.precioUnitario?.toString() || '')
      setStockDisponible(repuesto.stockActual || 0)
    }
  }

  /**
   * Cerrar diálogo
   */
  const handleCerrarDialog = () => {
    setDialogOpen(false)
    setError(null)
  }

  // Calcular total de repuestos
  const totalRepuestos = repuestosUtilizados.reduce(
    (total, uso) => total + (uso.subtotal || (uso.cantidad * uso.precioUnitario) || 0), 
    0
  )

  return (
    <Box>
      {/* Header con botón agregar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RepuestosIcon />
          Repuestos Utilizados ({repuestosUtilizados.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAgregarRepuesto}
          disabled={loading}
        >
          Agregar Repuesto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabla de repuestos */}
      {repuestosUtilizados.length === 0 ? (
        <Alert severity="info">
          No hay repuestos utilizados en esta orden. Use el botón "Agregar Repuesto" para comenzar.
        </Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Repuesto</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="right">Precio Unit.</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repuestosUtilizados.map((uso) => (
                <TableRow key={uso.idUso}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {uso.repuesto?.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Código: {uso.repuesto?.codigo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={uso.repuesto?.categoria || 'Sin categoría'} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="medium">
                      {uso.cantidad}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      ${uso.precioUnitario?.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium" color="primary">
                      ${(uso.subtotal || (uso.cantidad * uso.precioUnitario))?.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar repuesto">
                      <IconButton
                        size="small"
                        onClick={() => handleEditarRepuesto(uso)}
                        disabled={loading}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar repuesto">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleEliminarRepuesto(uso)}
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
                <TableCell colSpan={4}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total Repuestos
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" color="primary">
                    ${totalRepuestos.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo para agregar/editar repuesto */}
      <Dialog open={dialogOpen} onClose={handleCerrarDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editando ? 'Editar Repuesto' : 'Agregar Repuesto'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 1 }}>
            {/* Selector de repuesto */}
            <Autocomplete
              value={repuestoSeleccionado}
              onChange={(e, newValue) => handleRepuestoSeleccionado(newValue)}
              options={repuestosDisponibles}
              getOptionLabel={(option) => `${option.nombre} (${option.codigo})`}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{option.nombre}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {option.stockActual <= option.stockMinimo && (
                          <WarningIcon color="warning" fontSize="small" />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Stock: {option.stockActual}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {option.categoria} - ${option.precioUnitario}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Repuesto"
                  required
                  helperText="Seleccione el repuesto a utilizar"
                />
              )}
              disabled={loading || editando} // No permitir cambiar repuesto al editar
              sx={{ mb: 2 }}
            />

            {/* Stock disponible */}
            {repuestoSeleccionado && (
              <Alert 
                severity={stockDisponible <= repuestoSeleccionado.stockMinimo ? 'warning' : 'info'}
                sx={{ mb: 2 }}
              >
                Stock disponible: {stockDisponible} unidades
                {stockDisponible <= repuestoSeleccionado.stockMinimo && 
                  ' (Stock bajo - mínimo requerido: ' + repuestoSeleccionado.stockMinimo + ')'
                }
              </Alert>
            )}

            {/* Cantidad */}
            <TextField
              fullWidth
              label="Cantidad"
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
              inputProps={{ 
                min: 1, 
                max: editando ? undefined : stockDisponible 
              }}
              helperText={
                !editando && stockDisponible > 0 
                  ? `Máximo disponible: ${stockDisponible} unidades` 
                  : 'Ingrese la cantidad utilizada'
              }
              sx={{ mb: 2 }}
            />

            {/* Precio unitario */}
            <TextField
              fullWidth
              label="Precio Unitario"
              type="number"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value)}
              required
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              helperText={
                repuestoSeleccionado 
                  ? `Precio base: $${repuestoSeleccionado.precioUnitario}` 
                  : 'Ingrese el precio unitario aplicado'
              }
              sx={{ mb: 2 }}
            />

            {/* Subtotal calculado */}
            {cantidad && precioUnitario && (
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal: 
                </Typography>
                <Typography variant="h6" color="primary">
                  ${(parseFloat(cantidad || 0) * parseFloat(precioUnitario || 0)).toFixed(2)}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarDialog} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleGuardarRepuesto}
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

RepuestosOrdenTab.propTypes = {
  orden: PropTypes.object.isRequired,
  repuestosUtilizados: PropTypes.array,
  onRepuestosActualizados: PropTypes.func.isRequired
}

export default RepuestosOrdenTab
