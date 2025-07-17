import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Alert,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material'
import {
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as SwapHorizIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material'
import repuestoService from '../../services/repuestoService'

/**
 * Componente para mostrar movimientos de inventario con referencias
 * Tarea 5.4: Movimientos de inventario con referencias
 */
const MovimientosInventario = ({ repuesto = null }) => {
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipoMovimiento: '',
    fechaDesde: null,
    fechaHasta: null
  })

  // Tipos de movimiento disponibles
  const tiposMovimiento = [
    'ENTRADA',
    'SALIDA',
    'AJUSTE',
    'DEVOLUCION',
    'TRANSFERENCIA',
    'MERMA',
    'INVENTARIO'
  ]

  // Cargar movimientos
  const loadMovimientos = async () => {
    try {
      setLoading(true)
      let data = []
      
      if (repuesto) {
        // Movimientos de un repuesto específico
        data = await repuestoService.getMovimientosByRepuesto(repuesto.idRepuesto)
      } else {
        // Todos los movimientos
        data = await repuestoService.getAllMovimientos()
      }
      
      setMovimientos(data.sort((a, b) => new Date(b.fechaMovimiento) - new Date(a.fechaMovimiento)))
    } catch (error) {
      console.error('Error al cargar movimientos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar al montar componente
  useEffect(() => {
    loadMovimientos()
  }, [repuesto])

  // Filtrar movimientos
  const movimientosFiltrados = movimientos.filter(movimiento => {
    // Filtro por búsqueda
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase()
      const match = 
        movimiento.repuesto?.codigo?.toLowerCase().includes(busqueda) ||
        movimiento.repuesto?.nombre?.toLowerCase().includes(busqueda) ||
        movimiento.referencia?.toLowerCase().includes(busqueda) ||
        movimiento.usuarioMovimiento?.nombreCompleto?.toLowerCase().includes(busqueda)
      
      if (!match) return false
    }

    // Filtro por tipo de movimiento
    if (filtros.tipoMovimiento && movimiento.tipoMovimiento !== filtros.tipoMovimiento) {
      return false
    }

    // Filtro por fecha desde
    if (filtros.fechaDesde) {
      const fechaMovimiento = new Date(movimiento.fechaMovimiento)
      const fechaDesde = new Date(filtros.fechaDesde)
      fechaDesde.setHours(0, 0, 0, 0)
      
      if (fechaMovimiento < fechaDesde) return false
    }

    // Filtro por fecha hasta
    if (filtros.fechaHasta) {
      const fechaMovimiento = new Date(movimiento.fechaMovimiento)
      const fechaHasta = new Date(filtros.fechaHasta)
      fechaHasta.setHours(23, 59, 59, 999)
      
      if (fechaMovimiento > fechaHasta) return false
    }

    return true
  })

  // Manejar cambio de filtros
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Limpiar filtros
  const clearFilters = () => {
    setFiltros({
      busqueda: '',
      tipoMovimiento: '',
      fechaDesde: null,
      fechaHasta: null
    })
  }

  // Obtener icono del tipo de movimiento
  const getTipoMovimientoIcon = (tipo) => {
    const icons = {
      'ENTRADA': <TrendingUpIcon />,
      'SALIDA': <TrendingDownIcon />,
      'AJUSTE': <SwapHorizIcon />,
      'DEVOLUCION': <TrendingUpIcon />,
      'TRANSFERENCIA': <SwapHorizIcon />,
      'MERMA': <TrendingDownIcon />,
      'INVENTARIO': <SwapHorizIcon />
    }
    return icons[tipo] || <SwapHorizIcon />
  }

  // Obtener color del tipo de movimiento
  const getTipoMovimientoColor = (tipo) => {
    const colors = {
      'ENTRADA': 'success',
      'SALIDA': 'error',
      'AJUSTE': 'warning',
      'DEVOLUCION': 'info',
      'TRANSFERENCIA': 'secondary',
      'MERMA': 'error',
      'INVENTARIO': 'primary'
    }
    return colors[tipo] || 'default'
  }

  // Formatear fecha
  const formatearFecha = (fecha) => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Cargando movimientos...
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <HistoryIcon color="primary" />
              <Typography variant="h6" component="h2">
                {repuesto ? `Movimientos - ${repuesto.codigo}` : 'Movimientos de Inventario'}
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={loadMovimientos}
              disabled={loading}
            >
              Actualizar
            </Button>
          </Box>

          {/* Filtros */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent sx={{ pb: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <FilterIcon color="action" />
                <Typography variant="subtitle2">
                  Filtros
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {/* Búsqueda */}
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Buscar"
                    value={filtros.busqueda}
                    onChange={(e) => handleFilterChange('busqueda', e.target.value)}
                    placeholder="Código, nombre, referencia..."
                    InputProps={{
                      startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>

                {/* Tipo de movimiento */}
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={filtros.tipoMovimiento}
                      label="Tipo"
                      onChange={(e) => handleFilterChange('tipoMovimiento', e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {tiposMovimiento.map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getTipoMovimientoIcon(tipo)}
                            {tipo}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Fecha desde */}
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Desde"
                    type="date"
                    size="small"
                    fullWidth
                    value={filtros.fechaDesde || ''}
                    onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                {/* Fecha hasta */}
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Hasta"
                    type="date"
                    size="small"
                    fullWidth
                    value={filtros.fechaHasta || ''}
                    onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                {/* Limpiar filtros */}
                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={clearFilters}
                    disabled={!filtros.busqueda && !filtros.tipoMovimiento && !filtros.fechaDesde && !filtros.fechaHasta}
                  >
                    Limpiar Filtros
                  </Button>
                </Grid>
              </Grid>

              {/* Resumen de filtros */}
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Mostrando {movimientosFiltrados.length} de {movimientos.length} movimientos
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Lista de movimientos */}
          {movimientosFiltrados.length === 0 && !loading && (
            <Alert severity="info">
              <Typography variant="body2">
                {movimientos.length === 0 
                  ? 'No hay movimientos registrados para este repuesto.'
                  : 'No se encontraron movimientos que coincidan con los filtros aplicados.'
                }
              </Typography>
            </Alert>
          )}

          {movimientosFiltrados.length > 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha/Hora</TableCell>
                    {!repuesto && <TableCell>Repuesto</TableCell>}
                    <TableCell>Tipo</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="center">Stock Anterior</TableCell>
                    <TableCell align="center">Stock Nuevo</TableCell>
                    <TableCell>Referencia</TableCell>
                    <TableCell>Usuario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movimientosFiltrados.map((movimiento, index) => (
                    <TableRow 
                      key={`${movimiento.idMovimiento}-${index}`}
                      hover
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                    >
                      {/* Fecha/Hora */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatearFecha(movimiento.fechaMovimiento)}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Repuesto (solo si no se está viendo un repuesto específico) */}
                      {!repuesto && (
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {movimiento.repuesto?.codigo}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {movimiento.repuesto?.nombre}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}

                      {/* Tipo de movimiento */}
                      <TableCell>
                        <Chip
                          size="small"
                          icon={getTipoMovimientoIcon(movimiento.tipoMovimiento)}
                          label={movimiento.tipoMovimiento}
                          color={getTipoMovimientoColor(movimiento.tipoMovimiento)}
                          variant="outlined"
                        />
                      </TableCell>

                      {/* Cantidad */}
                      <TableCell align="center">
                        <Typography 
                          variant="body2" 
                          fontWeight="bold"
                          color={
                            ['ENTRADA', 'DEVOLUCION'].includes(movimiento.tipoMovimiento) 
                              ? 'success.main' 
                              : ['SALIDA', 'MERMA'].includes(movimiento.tipoMovimiento)
                              ? 'error.main'
                              : 'text.primary'
                          }
                        >
                          {['ENTRADA', 'DEVOLUCION'].includes(movimiento.tipoMovimiento) && '+'}
                          {['SALIDA', 'MERMA'].includes(movimiento.tipoMovimiento) && '-'}
                          {movimiento.cantidad}
                        </Typography>
                      </TableCell>

                      {/* Stock anterior */}
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {movimiento.stockAnterior}
                        </Typography>
                      </TableCell>

                      {/* Stock nuevo */}
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="bold">
                          {movimiento.stockNuevo}
                        </Typography>
                      </TableCell>

                      {/* Referencia */}
                      <TableCell>
                        {movimiento.referencia ? (
                          <Typography variant="body2" color="primary">
                            {movimiento.referencia}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Sin referencia
                          </Typography>
                        )}
                      </TableCell>

                      {/* Usuario */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                            <PersonIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              {movimiento.usuarioMovimiento?.nombreCompleto || 'Sistema'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {movimiento.usuarioMovimiento?.rol || 'SYSTEM'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
  )
}

export default MovimientosInventario
