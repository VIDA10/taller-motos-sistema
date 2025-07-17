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
 * Componente de filtros para clientes
 * Basado en los campos disponibles en la entidad Cliente y endpoints de búsqueda
 * 
 * Campos disponibles según Cliente.java:
 * - nombre (String, max 100)
 * - telefono (String, max 20) 
 * - email (String, max 100)
 * - dni (String, max 20)
 * - direccion (String, TEXT)
 * - activo (Boolean)
 * - createdAt (LocalDateTime)
 * - updatedAt (LocalDateTime)
 */
const ClienteFilters = ({ onFilterChange, loading = false }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    // Filtros de texto (según endpoints disponibles)
    nombre: '',
    telefono: '',
    email: '',
    dni: '',
    
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
      nombre: '',
      telefono: '',
      email: '',
      dni: '',
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
    return filters.nombre !== '' ||
           filters.telefono !== '' ||
           filters.email !== '' ||
           filters.dni !== '' ||
           filters.estado !== 'todos' ||
           filters.fechaDesde !== '' ||
           filters.fechaHasta !== ''
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.nombre) count++
    if (filters.telefono) count++
    if (filters.email) count++
    if (filters.dni) count++
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
            Filtrar clientes
          </Typography>
          
          <Grid container spacing={3}>
            {/* Filtros de texto */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Nombre"
                value={filters.nombre}
                onChange={(e) => handleFilterChange('nombre', e.target.value)}
                disabled={loading}
                placeholder="Buscar por nombre..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Teléfono"
                value={filters.telefono}
                onChange={(e) => handleFilterChange('telefono', e.target.value)}
                disabled={loading}
                placeholder="Buscar por teléfono..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                value={filters.email}
                onChange={(e) => handleFilterChange('email', e.target.value)}
                disabled={loading}
                placeholder="Buscar por email..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="DNI"
                value={filters.dni}
                onChange={(e) => handleFilterChange('dni', e.target.value)}
                disabled={loading}
                placeholder="Buscar por DNI..."
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

ClienteFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default ClienteFilters
