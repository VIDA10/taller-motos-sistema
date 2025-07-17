import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Collapse,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material'
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Download as DownloadIcon,
  Money as MoneyIcon
} from '@mui/icons-material'

// Importar servicios
import pagoService from '../../services/pagoService'

/**
 * Componente de filtros avanzados para pagos
 * 
 * FUNCIONALIDADES:
 * - Filtros por fecha, método, monto
 * - Filtros por orden específica
 * - Rangos de montos y fechas
 * - Exportación de resultados
 * - Guardar filtros frecuentes
 * 
 * PERMISOS: Solo ADMIN y RECEPCIONISTA
 */
const PagoFilters = ({
  onFiltrosAplicados,
  onExportarResultados,
  filtrosIniciales = {}
}) => {
  // Estados de los filtros
  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    metodo: '',
    montoMin: '',
    montoMax: '',
    numeroOrden: '',
    referencia: '',
    expandido: false
  })

  // Estados de control
  const [metodosDisponibles, setMetodosDisponibles] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(false)

  // Métodos de pago predefinidos
  const metodosPago = [
    { value: 'EFECTIVO', label: '💵 Efectivo', color: 'success' },
    { value: 'TARJETA', label: '💳 Tarjeta', color: 'primary' },
    { value: 'TRANSFERENCIA', label: '🏦 Transferencia', color: 'secondary' }
  ]

  /**
   * Cargar métodos de pago disponibles
   */
  const cargarMetodosDisponibles = async () => {
    try {
      // TEMPORALMENTE usando métodos predefinidos para evitar bucle infinito
      // En el futuro se puede reactivar la llamada a la API cuando esté estable
      setMetodosDisponibles(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'])
    } catch (error) {
      console.error('Error al cargar métodos disponibles:', error)
    }
  }

  /**
   * Inicializar componente - Solo una vez al montar
   */
  useEffect(() => {
    cargarMetodosDisponibles()
  }, []) // Array vacío = solo al montar el componente

  /**
   * Aplicar filtros iniciales cuando cambien - Solo una vez al montar
   */
  useEffect(() => {
    if (filtrosIniciales && Object.keys(filtrosIniciales).length > 0) {
      setFiltros(prev => ({ ...prev, ...filtrosIniciales }))
    }
  }, []) // Array vacío = solo al montar el componente

  /**
   * Manejar cambios en los filtros
   */
  const handleCambioFiltro = (campo) => (event) => {
    const valor = event.target.value
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  /**
   * Aplicar filtros
   */
  const handleAplicarFiltros = async () => {
    try {
      setLoading(true)

      // Construir objeto de filtros para enviar
      const filtrosActivos = {}

      if (filtros.fechaDesde) filtrosActivos.fechaDesde = filtros.fechaDesde
      if (filtros.fechaHasta) filtrosActivos.fechaHasta = filtros.fechaHasta
      if (filtros.metodo) filtrosActivos.metodo = filtros.metodo
      if (filtros.montoMin) filtrosActivos.montoMin = parseFloat(filtros.montoMin)
      if (filtros.montoMax) filtrosActivos.montoMax = parseFloat(filtros.montoMax)
      if (filtros.numeroOrden) filtrosActivos.numeroOrden = filtros.numeroOrden
      if (filtros.referencia) filtrosActivos.referencia = filtros.referencia

      // Notificar al componente padre
      if (onFiltrosAplicados) {
        onFiltrosAplicados(filtrosActivos)
      }

      // Generar estadísticas rápidas
      await generarEstadisticas(filtrosActivos)
    } catch (error) {
      console.error('Error al aplicar filtros:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Limpiar todos los filtros
   */
  const handleLimpiarFiltros = () => {
    const filtrosLimpios = {
      fechaDesde: '',
      fechaHasta: '',
      metodo: '',
      montoMin: '',
      montoMax: '',
      numeroOrden: '',
      referencia: '',
      expandido: filtros.expandido
    }
    
    setFiltros(filtrosLimpios)
    setEstadisticas(null)
    
    if (onFiltrosAplicados) {
      onFiltrosAplicados({})
    }
  }

  /**
   * Generar estadísticas basadas en filtros
   */
  const generarEstadisticas = async (filtrosActivos) => {
    try {
      // Esta sería una implementación básica
      // En una versión completa, el backend proporcionaría estas estadísticas
      const stats = {
        totalFiltros: Object.keys(filtrosActivos).length,
        rangoFechas: filtrosActivos.fechaDesde && filtrosActivos.fechaHasta ? 
          `${formatearFecha(filtrosActivos.fechaDesde)} - ${formatearFecha(filtrosActivos.fechaHasta)}` : null,
        metodoSeleccionado: filtrosActivos.metodo || null,
        rangoMonto: filtrosActivos.montoMin || filtrosActivos.montoMax ?
          `${formatearMoneda(filtrosActivos.montoMin || 0)} - ${formatearMoneda(filtrosActivos.montoMax || 999999)}` : null
      }
      
      setEstadisticas(stats)
    } catch (error) {
      console.error('Error al generar estadísticas:', error)
    }
  }

  /**
   * Alternar expansión de filtros avanzados
   */
  const toggleExpansion = () => {
    setFiltros(prev => ({ ...prev, expandido: !prev.expandido }))
  }

  /**
   * Formatear fecha para mostrar
   */
  const formatearFecha = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha).toLocaleDateString('es-ES')
  }

  /**
   * Formatear moneda
   */
  const formatearMoneda = (monto) => {
    if (!monto) return 'S/ 0.00'
    return `S/ ${parseFloat(monto).toFixed(2)}`
  }

  /**
   * Verificar si hay filtros activos
   */
  const tienesFiltrosActivos = () => {
    return filtros.fechaDesde || filtros.fechaHasta || filtros.metodo || 
           filtros.montoMin || filtros.montoMax || filtros.numeroOrden || filtros.referencia
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="h3">
            <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filtros de Búsqueda
          </Typography>
          
          <Box>
            <IconButton onClick={toggleExpansion} size="small">
              {filtros.expandido ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Filtros básicos - siempre visibles */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Fecha Desde"
              type="date"
              value={filtros.fechaDesde}
              onChange={handleCambioFiltro('fechaDesde')}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Fecha Hasta"
              type="date"
              value={filtros.fechaHasta}
              onChange={handleCambioFiltro('fechaHasta')}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Método de Pago</InputLabel>
              <Select
                value={filtros.metodo}
                onChange={handleCambioFiltro('metodo')}
                label="Método de Pago"
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {metodosPago.map((metodo) => (
                  <MenuItem key={metodo.value} value={metodo.value}>
                    {metodo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Número de Orden"
              value={filtros.numeroOrden}
              onChange={handleCambioFiltro('numeroOrden')}
              placeholder="ORD-000001"
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>
              }}
            />
          </Grid>
        </Grid>

        {/* Filtros avanzados - colapsables */}
        <Collapse in={filtros.expandido}>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Monto Mínimo"
                type="number"
                value={filtros.montoMin}
                onChange={handleCambioFiltro('montoMin')}
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Monto Máximo"
                type="number"
                value={filtros.montoMax}
                onChange={handleCambioFiltro('montoMax')}
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                label="Referencia"
                value={filtros.referencia}
                onChange={handleCambioFiltro('referencia')}
                placeholder="Número de operación, voucher..."
                size="small"
              />
            </Grid>
          </Grid>
        </Collapse>

        {/* Botones de acción */}
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleAplicarFiltros}
            disabled={loading}
          >
            Buscar
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleLimpiarFiltros}
            disabled={!tienesFiltrosActivos()}
          >
            Limpiar
          </Button>
          
          {onExportarResultados && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => onExportarResultados(filtros)}
              disabled={!tienesFiltrosActivos()}
            >
              Exportar
            </Button>
          )}
          
          {tienesFiltrosActivos() && (
            <Chip
              label={`${Object.keys(filtros).filter(k => filtros[k] && k !== 'expandido').length} filtros activos`}
              color="primary"
              size="small"
            />
          )}
        </Box>

        {/* Estadísticas de filtros */}
        {estadisticas && estadisticas.totalFiltros > 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Filtros Aplicados:</strong>
            </Typography>
            
            {estadisticas.rangoFechas && (
              <Typography variant="caption" display="block">
                📅 Fechas: {estadisticas.rangoFechas}
              </Typography>
            )}
            
            {estadisticas.metodoSeleccionado && (
              <Typography variant="caption" display="block">
                💳 Método: {estadisticas.metodoSeleccionado}
              </Typography>
            )}
            
            {estadisticas.rangoMonto && (
              <Typography variant="caption" display="block">
                💰 Rango: {estadisticas.rangoMonto}
              </Typography>
            )}
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default PagoFilters
