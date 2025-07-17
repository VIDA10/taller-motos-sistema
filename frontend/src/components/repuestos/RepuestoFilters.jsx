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
  Button,
  Box,
  Typography,
  Chip,
  Collapse,
  IconButton,
  Slider,
  InputAdornment
} from '@mui/material'
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material'
import repuestoService from '../../services/repuestoService'

/**
 * Componente de filtros para repuestos
 * Incluye filtros por búsqueda, categoría, estado de stock, precios
 */
const RepuestoFilters = ({ onFiltersChange, totalCount = 0 }) => {
  // Estados de filtros
  const [filters, setFilters] = useState({
    busqueda: '',
    categoria: '',
    stockStatus: 'all', // all, sin-stock, stock-bajo, stock-normal
    precioMin: 0,
    precioMax: 1000,
    estado: 'all' // all, active, inactive
  })

  // Estados de UI
  const [expanded, setExpanded] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [loadingCategorias, setLoadingCategorias] = useState(true)

  // Cargar categorías disponibles
  useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategorias = async () => {
    try {
      setLoadingCategorias(true)
      const data = await repuestoService.getActiveCategories()
      setCategorias(data)
    } catch (error) {
      console.error('Error al cargar categorías:', error)
    } finally {
      setLoadingCategorias(false)
    }
  }

  // Aplicar filtros cuando cambien
  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  // Manejar cambios en filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      busqueda: '',
      categoria: '',
      stockStatus: 'all',
      precioMin: 0,
      precioMax: 1000,
      estado: 'all'
    })
  }

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== 'all' && value !== 0 && value !== 1000
  ).length

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <FilterIcon color="primary" />
            <Typography variant="h6">
              Filtros de Repuestos
            </Typography>
            {activeFiltersCount > 0 && (
              <Chip 
                size="small" 
                label={`${activeFiltersCount} activo${activeFiltersCount > 1 ? 's' : ''}`}
                color="primary"
              />
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              {totalCount} repuesto{totalCount !== 1 ? 's' : ''} encontrado{totalCount !== 1 ? 's' : ''}
            </Typography>
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Búsqueda principal */}
        <TextField
          fullWidth
          placeholder="Buscar por código, nombre, descripción..."
          value={filters.busqueda}
          onChange={(e) => handleFilterChange('busqueda', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: filters.busqueda && (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={() => handleFilterChange('busqueda', '')}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        {/* Filtros avanzados */}
        <Collapse in={expanded}>
          <Grid container spacing={3}>
            {/* Categoría */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={filters.categoria}
                  label="Categoría"
                  onChange={(e) => handleFilterChange('categoria', e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Todas las categorías</MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria} value={categoria}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: repuestoService.getCategoryColor(categoria)
                          }}
                        />
                        {categoria}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Estado de Stock */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado de Stock</InputLabel>
                <Select
                  value={filters.stockStatus}
                  label="Estado de Stock"
                  onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <InventoryIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">Todos los estados</MenuItem>
                  <MenuItem value="sin-stock">
                    <Chip size="small" label="Sin Stock" color="error" sx={{ mr: 1 }} />
                    Sin Stock
                  </MenuItem>
                  <MenuItem value="stock-bajo">
                    <Chip size="small" label="Stock Bajo" color="warning" sx={{ mr: 1 }} />
                    Stock Bajo
                  </MenuItem>
                  <MenuItem value="stock-normal">
                    <Chip size="small" label="Stock Normal" color="success" sx={{ mr: 1 }} />
                    Stock Normal
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Estado Activo */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.estado}
                  label="Estado"
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="active">
                    <Chip size="small" label="Activo" color="success" sx={{ mr: 1 }} />
                    Activos
                  </MenuItem>
                  <MenuItem value="inactive">
                    <Chip size="small" label="Inactivo" color="default" sx={{ mr: 1 }} />
                    Inactivos
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Rango de Precios */}
            <Grid item xs={12}>
              <Box sx={{ px: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <MoneyIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Rango de Precios: {repuestoService.formatPrice(filters.precioMin)} - {repuestoService.formatPrice(filters.precioMax)}
                  </Typography>
                </Box>
                <Slider
                  value={[filters.precioMin, filters.precioMax]}
                  onChange={(e, newValue) => {
                    handleFilterChange('precioMin', newValue[0])
                    handleFilterChange('precioMax', newValue[1])
                  }}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  step={10}
                  valueLabelFormat={(value) => repuestoService.formatPrice(value)}
                />
              </Box>
            </Grid>

            {/* Botones de acción */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  disabled={activeFiltersCount === 0}
                >
                  Limpiar Filtros
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Filtros Avanzados
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default RepuestoFilters
