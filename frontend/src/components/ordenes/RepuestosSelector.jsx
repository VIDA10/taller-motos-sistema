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
  TextField,
  Autocomplete,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material'

// Importar servicios
import repuestoService from '../../services/repuestoService'

/**
 * Componente para seleccionar repuestos en el diálogo de trabajo
 * Permite buscar, seleccionar y configurar cantidad de repuestos
 */
const RepuestosSelector = ({ 
  repuestosSeleccionados = [],
  onRepuestosChange
}) => {
  // Estados del componente
  const [repuestosDisponibles, setRepuestosDisponibles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cargar repuestos disponibles
  useEffect(() => {
    cargarRepuestosDisponibles()
  }, [])

  const cargarRepuestosDisponibles = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🔧 Cargando repuestos disponibles...')
      
      // Intentar obtener repuestos activos primero
      let result
      try {
        result = await repuestoService.getActive()
        console.log('📦 Respuesta repuestos activos:', result)
      } catch (error) {
        console.warn('⚠️ No se pudo obtener repuestos activos, intentando obtener todos:', error)
        result = await repuestoService.getAll()
        console.log('📦 Respuesta todos los repuestos:', result)
      }
      
      // Manejar diferentes estructuras de respuesta
      let repuestos = []
      
      if (result) {
        if (result.success && result.data) {
          repuestos = Array.isArray(result.data) ? result.data : []
        } else if (Array.isArray(result.data)) {
          repuestos = result.data
        } else if (Array.isArray(result)) {
          repuestos = result
        } else {
          console.warn('⚠️ Estructura de respuesta no reconocida:', result)
        }
      }
      
      // Filtrar solo repuestos con stock disponible
      const repuestosConStock = repuestos.filter(r => (r.stockActual || r.stock || 0) > 0)
      
      console.log(`✅ Repuestos cargados: ${repuestos.length}, con stock: ${repuestosConStock.length}`)
      setRepuestosDisponibles(repuestosConStock)
      
      if (repuestosConStock.length === 0) {
        if (repuestos.length === 0) {
          setError('No hay repuestos disponibles en el sistema')
        } else {
          setError('No hay repuestos con stock disponible')
        }
      }
    } catch (error) {
      console.error('❌ Error al cargar repuestos:', error)
      if (error.response?.status === 403) {
        setError('Sin permisos para acceder a los repuestos. Contacte al administrador.')
      } else {
        setError('Error inesperado al cargar repuestos')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAgregarRepuesto = (repuesto) => {
    if (!repuesto) return

    // Verificar si ya está seleccionado
    const yaSeleccionado = repuestosSeleccionados.find(r => r.idRepuesto === repuesto.idRepuesto)
    if (yaSeleccionado) return

    const nuevoRepuesto = {
      idRepuesto: repuesto.idRepuesto,
      nombre: repuesto.nombre || 'Repuesto sin nombre',
      descripcion: repuesto.descripcion || '',
      precio: parseFloat(repuesto.precioUnitario || repuesto.precio) || 0,
      stockDisponible: parseInt(repuesto.stockActual || repuesto.stock) || 0,
      cantidad: 1,
      comentario: ''
    }

    console.log('➕ Agregando repuesto:', nuevoRepuesto)
    onRepuestosChange([...repuestosSeleccionados, nuevoRepuesto])
  }

  const handleCantidadChange = (idRepuesto, nuevaCantidad) => {
    const repuesto = repuestosSeleccionados.find(r => r.idRepuesto === idRepuesto)
    if (!repuesto) return

    const cantidad = parseInt(nuevaCantidad) || 1
    
    // Verificar stock disponible
    if (cantidad > repuesto.stockDisponible) {
      return // No permitir más cantidad que el stock
    }

    if (cantidad < 1) return

    const repuestosActualizados = repuestosSeleccionados.map(r =>
      r.idRepuesto === idRepuesto 
        ? { ...r, cantidad }
        : r
    )
    onRepuestosChange(repuestosActualizados)
  }

  const handleComentarioChange = (idRepuesto, comentario) => {
    const repuestosActualizados = repuestosSeleccionados.map(r =>
      r.idRepuesto === idRepuesto 
        ? { ...r, comentario }
        : r
    )
    onRepuestosChange(repuestosActualizados)
  }

  const handleEliminarRepuesto = (idRepuesto) => {
    const repuestosActualizados = repuestosSeleccionados.filter(r => r.idRepuesto !== idRepuesto)
    onRepuestosChange(repuestosActualizados)
  }

  // Repuestos disponibles que no están seleccionados y tienen stock
  const repuestosNoSeleccionados = repuestosDisponibles.filter(
    repuesto => !repuestosSeleccionados.find(r => r.idRepuesto === repuesto.idRepuesto)
  )

  const totalRepuestos = repuestosSeleccionados.reduce((sum, r) => {
    const precio = parseFloat(r.precio) || 0
    const cantidad = parseInt(r.cantidad) || 0
    return sum + (precio * cantidad)
  }, 0)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando repuestos...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Seleccionar Repuestos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Selector de repuestos */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Agregar Repuesto
          </Typography>
          <Autocomplete
            options={repuestosNoSeleccionados}
            getOptionLabel={(option) => `${option.nombre} - $${parseFloat(option.precioUnitario || option.precio || 0).toFixed(2)} (Stock: ${parseInt(option.stockActual || option.stock) || 0})`}
            isOptionEqualToValue={(option, value) => option.idRepuesto === value.idRepuesto}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props
              return (
                <li key={key} {...otherProps}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {option.nombre}
                      </Typography>
                      <Chip 
                        label={`Stock: ${option.stockActual || option.stock || 0}`} 
                        size="small" 
                        color={(option.stockActual || option.stock || 0) <= (option.stockMinimo || 5) ? 'warning' : 'success'}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {option.descripcion} - ${parseFloat(option.precioUnitario || option.precio || 0).toFixed(2)}
                    </Typography>
                  </Box>
                </li>
              )
            }}
            onChange={(event, value) => handleAgregarRepuesto(value)}
            value={null} // Siempre reset después de seleccionar
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar repuesto"
                placeholder="Escriba para buscar..."
                fullWidth
              />
            )}
            noOptionsText="No hay repuestos disponibles con stock"
          />
        </CardContent>
      </Card>

      {/* Lista de repuestos seleccionados */}
      {repuestosSeleccionados.length > 0 ? (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Repuestos Seleccionados ({repuestosSeleccionados.length})
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Repuesto</TableCell>
                  <TableCell align="center">Precio Unit.</TableCell>
                  <TableCell align="center">Stock</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="center">Subtotal</TableCell>
                  <TableCell>Comentario</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {repuestosSeleccionados.map((repuesto) => (
                  <TableRow key={repuesto.idRepuesto}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {repuesto.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {repuesto.descripcion}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      ${parseFloat(repuesto.precio || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={repuesto.stockDisponible} 
                        size="small"
                        color={repuesto.stockDisponible <= 5 ? 'warning' : 'success'}
                        icon={repuesto.stockDisponible <= 5 ? <WarningIcon /> : null}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleCantidadChange(repuesto.idRepuesto, repuesto.cantidad - 1)}
                          disabled={repuesto.cantidad <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          size="small"
                          type="number"
                          value={repuesto.cantidad}
                          onChange={(e) => handleCantidadChange(repuesto.idRepuesto, e.target.value)}
                          inputProps={{ 
                            min: 1, 
                            max: repuesto.stockDisponible,
                            style: { textAlign: 'center', width: '60px' } 
                          }}
                          error={repuesto.cantidad > repuesto.stockDisponible}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleCantidadChange(repuesto.idRepuesto, repuesto.cantidad + 1)}
                          disabled={repuesto.cantidad >= repuesto.stockDisponible}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      ${((parseFloat(repuesto.precio) || 0) * (parseInt(repuesto.cantidad) || 0)).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="Comentarios adicionales..."
                        value={repuesto.comentario}
                        onChange={(e) => handleComentarioChange(repuesto.idRepuesto, e.target.value)}
                        multiline
                        maxRows={2}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleEliminarRepuesto(repuesto.idRepuesto)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Total */}
          <Card sx={{ mt: 2, bgcolor: 'secondary.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Total Repuestos:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  ${totalRepuestos.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </>
      ) : (
        <Alert severity="info">
          No hay repuestos seleccionados. Los repuestos son opcionales, pero puede agregarlos si son necesarios para la reparación.
        </Alert>
      )}
    </Box>
  )
}

RepuestosSelector.propTypes = {
  repuestosSeleccionados: PropTypes.array,
  onRepuestosChange: PropTypes.func.isRequired
}

export default RepuestosSelector
