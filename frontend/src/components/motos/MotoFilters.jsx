import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Collapse,
  Typography,
  Grid,
  Button,
  Chip
} from '@mui/material'
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon
} from '@mui/icons-material'

/**
 * Componente de filtros para motos
 * Basado en los campos disponibles en la entidad Moto y endpoints de búsqueda
 * Replicando exactamente la funcionalidad de ClienteFilters
 * 
 * Campos disponibles según Moto.java:
 * - marca (String, max 50)
 * - modelo (String, max 50) 
 * - placa (String, max 20)
 * - vin (String, max 50)
 * - color (String, max 30)
 * - anio (Integer)
 * - activo (Boolean)
 * - createdAt (LocalDateTime)
 * - updatedAt (LocalDateTime)
 */
const MotoFilters = ({ onFilterChange, loading = false }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    // Filtros de texto (según campos de Moto)
    marca: '',
    modelo: '',
    placa: '',
    vin: '',
    color: '',
    anio: '',
    cliente: '',
    
    // Filtro por estado (según endpoints /activos /inactivos)
    estado: 'todos', // 'todos', 'activos', 'inactivos'
    
    // Filtros por fecha (según endpoint /fechas)
    fechaDesde: '',
    fechaHasta: ''
  })

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value
    }
    setFilters(newFilters)
    
    // Notificar al componente padre sobre los cambios
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  const clearFilters = () => {
    const clearedFilters = {
      marca: '',
      modelo: '',
      placa: '',
      vin: '',
      color: '',
      anio: '',
      cliente: '',
      estado: 'todos',
      fechaDesde: '',
      fechaHasta: ''
    }
    setFilters(clearedFilters)
    
    if (onFilterChange) {
      onFilterChange(clearedFilters)
    }
  }

  const hasActiveFilters = () => {
    return filters.marca !== '' ||
           filters.modelo !== '' ||
           filters.placa !== '' ||
           filters.vin !== '' ||
           filters.color !== '' ||
           filters.anio !== '' ||
           filters.cliente !== '' ||
           filters.estado !== 'todos' ||
           filters.fechaDesde !== '' ||
           filters.fechaHasta !== ''
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.marca) count++
    if (filters.modelo) count++
    if (filters.placa) count++
    if (filters.vin) count++
    if (filters.color) count++
    if (filters.anio) count++
    if (filters.cliente) count++
    if (filters.estado !== 'todos') count++
    if (filters.fechaDesde || filters.fechaHasta) count++
    return count
  }

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header de filtros */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => setShowFilters(!showFilters)}
          disabled={loading}
        >
          Filtros
          {getActiveFiltersCount() > 0 && (
            <Chip 
              label={getActiveFiltersCount()} 
              size="small" 
              color="primary" 
              sx={{ ml: 1 }} 
            />
          )}
        </Button>
        
        {hasActiveFilters() && (
          <Button
            variant="text"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            disabled={loading}
            size="small"
          >
            Limpiar filtros
          </Button>
        )}
      </Box>

      {/* Panel de filtros colapsable */}
      <Collapse in={showFilters}>
        <Box sx={{ 
          p: 3, 
          border: 1, 
          borderColor: 'divider', 
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}>
          <Typography variant="h6" gutterBottom>
            Filtrar motos
          </Typography>
          
          <Grid container spacing={3}>
            {/* Filtros de texto - Primera fila */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Marca"
                value={filters.marca}
                onChange={(e) => handleFilterChange('marca', e.target.value)}
                disabled={loading}
                placeholder="Buscar por marca..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Modelo"
                value={filters.modelo}
                onChange={(e) => handleFilterChange('modelo', e.target.value)}
                disabled={loading}
                placeholder="Buscar por modelo..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Placa"
                value={filters.placa}
                onChange={(e) => handleFilterChange('placa', e.target.value)}
                disabled={loading}
                placeholder="Buscar por placa..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="VIN"
                value={filters.vin}
                onChange={(e) => handleFilterChange('vin', e.target.value)}
                disabled={loading}
                placeholder="Buscar por VIN..."
              />
            </Grid>

            {/* Filtros de texto - Segunda fila */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Cliente"
                value={filters.cliente}
                onChange={(e) => handleFilterChange('cliente', e.target.value)}
                disabled={loading}
                placeholder="Buscar por cliente..."
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Color"
                value={filters.color}
                onChange={(e) => handleFilterChange('color', e.target.value)}
                disabled={loading}
                placeholder="Buscar por color..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Año"
                value={filters.anio}
                onChange={(e) => handleFilterChange('anio', e.target.value)}
                disabled={loading}
                placeholder="Buscar por año..."
                type="number"
              />
            </Grid>
            
            {/* Filtro por estado */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.estado}
                  label="Estado"
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="activos">Activos</MenuItem>
                  <MenuItem value="inactivos">Inactivos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Filtros por fecha de creación */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Fecha desde"
                value={filters.fechaDesde}
                onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Fecha hasta"
                value={filters.fechaHasta}
                onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          
          {/* Información de ayuda */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            💡 Los filtros se aplican en tiempo real sobre los datos cargados. Los filtros funcionan localmente para mejor rendimiento.
          </Typography>
        </Box>
      </Collapse>
    </Box>
  )
}

MotoFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default MotoFilters
