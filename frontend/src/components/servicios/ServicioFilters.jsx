import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Slider,
  Button,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Clear as ClearIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material'
import servicioService from '../../services/servicioService'

/**
 * Componente de filtros para servicios
 * Permite filtrar por nombre, categoría, precio, tiempo estimado y estado
 */
const ServicioFilters = ({ onFiltersChange, totalCount = 0 }) => {
  // Estados de los filtros
  const [filters, setFilters] = useState({
    busqueda: '',
    categoria: '',
    estado: 'all', // 'all', 'active', 'inactive'
    precioMin: 0,
    precioMax: 1000,
    tiempoMin: 0,
    tiempoMax: 480 // 8 horas
  })

  // Estados auxiliares
  const [categorias, setCategorias] = useState([])
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const categoriasData = await servicioService.getActiveCategories()
        setCategorias(categoriasData)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      }
    }
    loadCategorias()
  }, [])

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(filters)
    }, 300) // Debounce de 300ms

    return () => clearTimeout(timer)
  }, [filters, onFiltersChange])

  // Manejar cambios en los filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setFilters({
      busqueda: '',
      categoria: '',
      estado: 'all',
      precioMin: 0,
      precioMax: 1000,
      tiempoMin: 0,
      tiempoMax: 480
    })
  }

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.busqueda) count++
    if (filters.categoria) count++
    if (filters.estado !== 'all') count++
    if (filters.precioMin > 0 || filters.precioMax < 1000) count++
    if (filters.tiempoMin > 0 || filters.tiempoMax < 480) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        {/* Header con título y estadísticas */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <FilterIcon color="primary" />
            <Typography variant="h6">
              Filtros de Servicios
            </Typography>
            {activeFiltersCount > 0 && (
              <Chip 
                label={`${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''}`}
                color="primary" 
                size="small" 
              />
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              {totalCount} servicio{totalCount !== 1 ? 's' : ''} encontrado{totalCount !== 1 ? 's' : ''}
            </Typography>
            {activeFiltersCount > 0 && (
              <Tooltip title="Limpiar filtros">
                <IconButton size="small" onClick={clearAllFilters}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Búsqueda general */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar servicios"
              placeholder="Nombre, código, descripción..."
              value={filters.busqueda}
              onChange={(e) => handleFilterChange('busqueda', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>

          {/* Categoría */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filters.categoria}
                label="Categoría"
                onChange={(e) => handleFilterChange('categoria', e.target.value)}
              >
                <MenuItem value="">
                  <em>Todas las categorías</em>
                </MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: servicioService.getCategoryColor(categoria)
                        }}
                      />
                      {categoria.replace('_', ' ')}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Estado */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.estado}
                label="Estado"
                onChange={(e) => handleFilterChange('estado', e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#4CAF50'
                      }}
                    />
                    Activos
                  </Box>
                </MenuItem>
                <MenuItem value="inactive">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#F44336'
                      }}
                    />
                    Inactivos
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Botón para mostrar filtros avanzados */}
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant={showAdvanced ? "contained" : "outlined"}
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ height: '56px' }}
            >
              Filtros Avanzados
            </Button>
          </Grid>

          {/* Filtros avanzados */}
          {showAdvanced && (
            <>
              {/* Rango de precios */}
              <Grid item xs={12} md={6}>
                <Box sx={{ px: 2 }}>
                  <Typography gutterBottom>
                    Rango de Precios: {servicioService.formatPrice(filters.precioMin)} - {servicioService.formatPrice(filters.precioMax)}
                  </Typography>
                  <Slider
                    value={[filters.precioMin, filters.precioMax]}
                    onChange={(e, newValue) => {
                      handleFilterChange('precioMin', newValue[0])
                      handleFilterChange('precioMax', newValue[1])
                    }}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => servicioService.formatPrice(value)}
                    min={0}
                    max={1000}
                    step={10}
                    marks={[
                      { value: 0, label: 'S/ 0' },
                      { value: 250, label: 'S/ 250' },
                      { value: 500, label: 'S/ 500' },
                      { value: 750, label: 'S/ 750' },
                      { value: 1000, label: 'S/ 1000+' }
                    ]}
                  />
                </Box>
              </Grid>

              {/* Rango de tiempo estimado */}
              <Grid item xs={12} md={6}>
                <Box sx={{ px: 2 }}>
                  <Typography gutterBottom>
                    Tiempo Estimado: {servicioService.formatTime(filters.tiempoMin)} - {servicioService.formatTime(filters.tiempoMax)}
                  </Typography>
                  <Slider
                    value={[filters.tiempoMin, filters.tiempoMax]}
                    onChange={(e, newValue) => {
                      handleFilterChange('tiempoMin', newValue[0])
                      handleFilterChange('tiempoMax', newValue[1])
                    }}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => servicioService.formatTime(value)}
                    min={0}
                    max={480}
                    step={15}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 60, label: '1h' },
                      { value: 120, label: '2h' },
                      { value: 240, label: '4h' },
                      { value: 480, label: '8h+' }
                    ]}
                  />
                </Box>
              </Grid>
            </>
          )}
        </Grid>

        {/* Chips de filtros activos */}
        {activeFiltersCount > 0 && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Filtros activos:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {filters.busqueda && (
                <Chip
                  label={`Búsqueda: "${filters.busqueda}"`}
                  onDelete={() => handleFilterChange('busqueda', '')}
                  size="small"
                />
              )}
              {filters.categoria && (
                <Chip
                  label={`Categoría: ${filters.categoria.replace('_', ' ')}`}
                  onDelete={() => handleFilterChange('categoria', '')}
                  size="small"
                />
              )}
              {filters.estado !== 'all' && (
                <Chip
                  label={`Estado: ${filters.estado === 'active' ? 'Activos' : 'Inactivos'}`}
                  onDelete={() => handleFilterChange('estado', 'all')}
                  size="small"
                />
              )}
              {(filters.precioMin > 0 || filters.precioMax < 1000) && (
                <Chip
                  label={`Precio: ${servicioService.formatPrice(filters.precioMin)} - ${servicioService.formatPrice(filters.precioMax)}`}
                  onDelete={() => {
                    handleFilterChange('precioMin', 0)
                    handleFilterChange('precioMax', 1000)
                  }}
                  size="small"
                />
              )}
              {(filters.tiempoMin > 0 || filters.tiempoMax < 480) && (
                <Chip
                  label={`Tiempo: ${servicioService.formatTime(filters.tiempoMin)} - ${servicioService.formatTime(filters.tiempoMax)}`}
                  onDelete={() => {
                    handleFilterChange('tiempoMin', 0)
                    handleFilterChange('tiempoMax', 480)
                  }}
                  size="small"
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ServicioFilters
