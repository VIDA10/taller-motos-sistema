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
 * Componente de filtros para usuarios
 * Basado en los campos disponibles en UsuarioResponseDTO y endpoints de búsqueda
 * 
 * Campos disponibles según UsuarioResponseDTO:
 * - nombreCompleto (String, max 100)
 * - username (String, max 50, único)
 * - email (String, max 100, único)
 * - rol (String: ADMIN, RECEPCIONISTA, MECANICO)
 * - activo (Boolean)
 * - ultimoLogin (LocalDateTime)
 * - createdAt (LocalDateTime)
 * - updatedAt (LocalDateTime)
 */
const UsuarioFilters = ({ onFilterChange, loading = false }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    // Filtros de texto (según endpoints disponibles)
    nombreCompleto: '',
    username: '',
    email: '',
    
    // Filtro por rol (según endpoints /rol/{rol})
    rol: 'todos', // 'todos', 'ADMIN', 'RECEPCIONISTA', 'MECANICO'
    
    // Filtro por estado (según endpoints /estado/{activo})
    estado: 'todos', // 'todos', 'activos', 'inactivos'
    
    // Filtros por fecha de creación
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
      nombreCompleto: '',
      username: '',
      email: '',
      rol: 'todos',
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
    return filters.nombreCompleto !== '' ||
           filters.username !== '' ||
           filters.email !== '' ||
           filters.rol !== 'todos' ||
           filters.estado !== 'todos' ||
           filters.fechaDesde !== '' ||
           filters.fechaHasta !== ''
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.nombreCompleto) count++
    if (filters.username) count++
    if (filters.email) count++
    if (filters.rol !== 'todos') count++
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
            Filtrar usuarios
          </Typography>
          
          <Grid container spacing={3}>
            {/* Filtros de texto */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Nombre Completo"
                value={filters.nombreCompleto}
                onChange={(e) => handleFilterChange('nombreCompleto', e.target.value)}
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
                label="Nombre de Usuario"
                value={filters.username}
                onChange={(e) => handleFilterChange('username', e.target.value)}
                disabled={loading}
                placeholder="Buscar por username..."
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
            
            {/* Filtro por rol */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Rol</InputLabel>
                <Select
                  value={filters.rol}
                  label="Rol"
                  onChange={(e) => handleFilterChange('rol', e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                  <MenuItem value="RECEPCIONISTA">Recepcionista</MenuItem>
                  <MenuItem value="MECANICO">Mecánico</MenuItem>
                </Select>
              </FormControl>
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

UsuarioFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default UsuarioFilters
