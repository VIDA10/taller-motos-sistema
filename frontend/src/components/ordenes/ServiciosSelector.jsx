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
  Checkbox,
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'

// Importar servicios
import servicioService from '../../services/servicioService'

/**
 * Componente para seleccionar servicios en el diálogo de trabajo
 * Permite buscar, seleccionar y configurar cantidad de servicios
 */
const ServiciosSelector = ({ 
  serviciosSeleccionados = [],
  onServiciosChange
}) => {
  // Estados del componente
  const [serviciosDisponibles, setServiciosDisponibles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cargar servicios disponibles
  useEffect(() => {
    cargarServiciosDisponibles()
  }, [])

  const cargarServiciosDisponibles = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🔧 Cargando servicios disponibles...')
      
      // Intentar obtener servicios activos primero
      let result
      try {
        result = await servicioService.getActive()
        console.log('📋 Respuesta servicios activos:', result)
      } catch (error) {
        console.warn('⚠️ No se pudo obtener servicios activos, intentando obtener todos:', error)
        result = await servicioService.getAll()
        console.log('📋 Respuesta todos los servicios:', result)
      }
      
      // Manejar diferentes estructuras de respuesta
      let servicios = []
      
      if (result) {
        if (result.success && result.data) {
          servicios = Array.isArray(result.data) ? result.data : []
        } else if (Array.isArray(result.data)) {
          servicios = result.data
        } else if (Array.isArray(result)) {
          servicios = result
        } else {
          console.warn('⚠️ Estructura de respuesta no reconocida:', result)
        }
      }
      
      console.log(`✅ Servicios cargados: ${servicios.length}`)
      setServiciosDisponibles(servicios)
      
      if (servicios.length === 0) {
        setError('No hay servicios disponibles en el sistema')
      }
    } catch (error) {
      console.error('❌ Error al cargar servicios:', error)
      if (error.response?.status === 403) {
        setError('Sin permisos para acceder a los servicios. Contacte al administrador.')
      } else {
        setError('Error inesperado al cargar servicios')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAgregarServicio = (servicio) => {
    if (!servicio) return

    // Verificar si ya está seleccionado
    const yaSeleccionado = serviciosSeleccionados.find(s => s.idServicio === servicio.idServicio)
    if (yaSeleccionado) return

    const nuevoServicio = {
      idServicio: servicio.idServicio,
      nombre: servicio.nombre || 'Servicio sin nombre',
      descripcion: servicio.descripcion || '',
      precio: parseFloat(servicio.precioBase || servicio.precio) || 0, // Buscar precioBase primero
      cantidad: 1,
      comentario: ''
    }

    console.log('➕ Agregando servicio:', nuevoServicio)
    onServiciosChange([...serviciosSeleccionados, nuevoServicio])
  }

  const handleCantidadChange = (idServicio, nuevaCantidad) => {
    if (nuevaCantidad < 1) return

    const serviciosActualizados = serviciosSeleccionados.map(s =>
      s.idServicio === idServicio 
        ? { ...s, cantidad: parseInt(nuevaCantidad) || 1 }
        : s
    )
    onServiciosChange(serviciosActualizados)
  }

  const handleComentarioChange = (idServicio, comentario) => {
    const serviciosActualizados = serviciosSeleccionados.map(s =>
      s.idServicio === idServicio 
        ? { ...s, comentario }
        : s
    )
    onServiciosChange(serviciosActualizados)
  }

  const handleEliminarServicio = (idServicio) => {
    const serviciosActualizados = serviciosSeleccionados.filter(s => s.idServicio !== idServicio)
    onServiciosChange(serviciosActualizados)
  }

  // Servicios disponibles que no están seleccionados
  const serviciosNoSeleccionados = serviciosDisponibles.filter(
    servicio => !serviciosSeleccionados.find(s => s.idServicio === servicio.idServicio)
  )

  const totalServicios = serviciosSeleccionados.reduce((sum, s) => {
    const precio = parseFloat(s.precio) || 0
    const cantidad = parseInt(s.cantidad) || 0
    return sum + (precio * cantidad)
  }, 0)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando servicios...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Seleccionar Servicios
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Selector de servicios */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Agregar Servicio
          </Typography>
          <Autocomplete
            options={serviciosNoSeleccionados}
            getOptionLabel={(option) => `${option.nombre} - $${parseFloat(option.precioBase || option.precio || 0).toFixed(2)}`}
            isOptionEqualToValue={(option, value) => option.idServicio === value.idServicio}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props
              return (
                <li key={key} {...otherProps}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {option.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.descripcion} - ${parseFloat(option.precioBase || option.precio || 0).toFixed(2)}
                    </Typography>
                  </Box>
                </li>
              )
            }}
            onChange={(event, value) => handleAgregarServicio(value)}
            value={null} // Siempre reset después de seleccionar
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar servicio"
                placeholder="Escriba para buscar..."
                fullWidth
              />
            )}
            noOptionsText="No hay servicios disponibles"
          />
        </CardContent>
      </Card>

      {/* Lista de servicios seleccionados */}
      {serviciosSeleccionados.length > 0 ? (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Servicios Seleccionados ({serviciosSeleccionados.length})
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Servicio</TableCell>
                  <TableCell align="center">Precio Unit.</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="center">Subtotal</TableCell>
                  <TableCell>Comentario</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviciosSeleccionados.map((servicio) => (
                  <TableRow key={servicio.idServicio}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {servicio.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {servicio.descripcion}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      ${parseFloat(servicio.precio || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleCantidadChange(servicio.idServicio, servicio.cantidad - 1)}
                          disabled={servicio.cantidad <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          size="small"
                          type="number"
                          value={servicio.cantidad}
                          onChange={(e) => handleCantidadChange(servicio.idServicio, e.target.value)}
                          inputProps={{ min: 1, style: { textAlign: 'center', width: '60px' } }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleCantidadChange(servicio.idServicio, servicio.cantidad + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      ${((parseFloat(servicio.precio) || 0) * (parseInt(servicio.cantidad) || 0)).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="Comentarios adicionales..."
                        value={servicio.comentario}
                        onChange={(e) => handleComentarioChange(servicio.idServicio, e.target.value)}
                        multiline
                        maxRows={2}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleEliminarServicio(servicio.idServicio)}
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
          <Card sx={{ mt: 2, bgcolor: 'primary.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Total Servicios:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  ${totalServicios.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </>
      ) : (
        <Alert severity="info">
          No hay servicios seleccionados. Use el selector de arriba para agregar servicios.
        </Alert>
      )}
    </Box>
  )
}

ServiciosSelector.propTypes = {
  serviciosSeleccionados: PropTypes.array,
  onServiciosChange: PropTypes.func.isRequired
}

export default ServiciosSelector
