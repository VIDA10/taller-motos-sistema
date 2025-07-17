import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  InputAdornment,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Code as CodeIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Description as DescriptionIcon
} from '@mui/icons-material'
import repuestoService from '../../services/repuestoService'

/**
 * Formulario para crear/editar repuestos
 * Tarea 5.2: Formulario gestión de repuestos
 */
const RepuestoForm = ({
  open = false,
  repuesto = null,
  onClose,
  onSave,
  loading = false
}) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    stockActual: 0,
    stockMinimo: 5,
    precioUnitario: '',
    activo: true
  })

  // Estados de validación
  const [errors, setErrors] = useState({})
  const [codigoExists, setCodigoExists] = useState(false)

  // Categorías disponibles
  const categorias = [
    'MOTOR',
    'FRENOS',
    'SUSPENSION',
    'ELECTRICO',
    'CARROCERIA',
    'NEUMATICOS',
    'ACEITES',
    'FILTROS',
    'BUJIAS',
    'CADENAS',
    'TRANSMISION',
    'REFRIGERACION',
    'COMBUSTIBLE',
    'ESCAPE',
    'ILUMINACION',
    'OTROS'
  ]

  // Modo edición
  const isEdit = Boolean(repuesto)

  // Inicializar formulario
  useEffect(() => {
    if (repuesto) {
      setFormData({
        codigo: repuesto.codigo || '',
        nombre: repuesto.nombre || '',
        descripcion: repuesto.descripcion || '',
        categoria: repuesto.categoria || '',
        stockActual: repuesto.stockActual || 0,
        stockMinimo: repuesto.stockMinimo || 5,
        precioUnitario: repuesto.precioUnitario || '',
        activo: repuesto.activo !== undefined ? repuesto.activo : true
      })
    } else {
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        categoria: '',
        stockActual: 0,
        stockMinimo: 5,
        precioUnitario: '',
        activo: true
      })
    }
    setErrors({})
    setCodigoExists(false)
  }, [repuesto, open])

  // Manejar cambios en el formulario
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }

    // Verificar código único (solo en modo creación)
    if (field === 'codigo' && !isEdit && value) {
      checkCodigoExists(value)
    }
  }

  // Verificar si el código ya existe
  const checkCodigoExists = async (codigo) => {
    try {
      const exists = await repuestoService.existsCode(codigo)
      setCodigoExists(exists)
      if (exists) {
        setErrors(prev => ({
          ...prev,
          codigo: 'Este código ya está en uso'
        }))
      }
    } catch (error) {
      console.error('Error al verificar código:', error)
    }
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    // Código
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es obligatorio'
    } else if (formData.codigo.length > 30) {
      newErrors.codigo = 'El código no puede exceder 30 caracteres'
    } else if (codigoExists) {
      newErrors.codigo = 'Este código ya está en uso'
    }

    // Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres'
    }

    // Precio unitario
    if (!formData.precioUnitario) {
      newErrors.precioUnitario = 'El precio unitario es obligatorio'
    } else {
      const precio = parseFloat(formData.precioUnitario)
      if (isNaN(precio) || precio < 0) {
        newErrors.precioUnitario = 'El precio debe ser un número mayor o igual a 0'
      }
    }

    // Stock actual
    if (formData.stockActual < 0) {
      newErrors.stockActual = 'El stock actual no puede ser negativo'
    }

    // Stock mínimo
    if (formData.stockMinimo < 0) {
      newErrors.stockMinimo = 'El stock mínimo no puede ser negativo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const repuestoData = {
      ...formData,
      precioUnitario: parseFloat(formData.precioUnitario),
      stockActual: parseInt(formData.stockActual),
      stockMinimo: parseInt(formData.stockMinimo)
    }

    await onSave(repuestoData)
  }

  // Formatear categoría para mostrar
  const formatCategoria = (categoria) => {
    return categoria.replace('_', ' ')
  }

  // Verificar si hay stock bajo
  const isStockBajo = formData.stockActual <= formData.stockMinimo

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <InventoryIcon color="primary" />
          <Typography variant="h6">
            {isEdit ? 'Editar Repuesto' : 'Nuevo Repuesto'}
          </Typography>
        </Box>
        {isEdit && (
          <Typography variant="body2" color="text.secondary">
            ID: {repuesto?.idRepuesto}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          {/* Código */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Código"
              value={formData.codigo}
              onChange={(e) => handleChange('codigo', e.target.value.toUpperCase())}
              error={Boolean(errors.codigo)}
              helperText={errors.codigo || 'Código único del repuesto'}
              disabled={isEdit} // No permitir cambiar código en edición
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CodeIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Estado activo */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" height="100%">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.activo}
                    onChange={(e) => handleChange('activo', e.target.checked)}
                    color="success"
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography>Estado:</Typography>
                    <Chip
                      size="small"
                      label={formData.activo ? 'Activo' : 'Inactivo'}
                      color={formData.activo ? 'success' : 'default'}
                    />
                  </Box>
                }
              />
            </Box>
          </Grid>

          {/* Nombre */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del Repuesto"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre || 'Nombre descriptivo del repuesto'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Categoría */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={formData.categoria}
                label="Categoría"
                onChange={(e) => handleChange('categoria', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>Sin categoría</em>
                </MenuItem>
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
                      {formatCategoria(categoria)}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Precio unitario */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Precio Unitario"
              value={formData.precioUnitario}
              onChange={(e) => handleChange('precioUnitario', e.target.value)}
              error={Boolean(errors.precioUnitario)}
              helperText={errors.precioUnitario || 'Precio en soles peruanos'}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Stock actual */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Stock Actual"
              value={formData.stockActual}
              onChange={(e) => handleChange('stockActual', parseInt(e.target.value) || 0)}
              error={Boolean(errors.stockActual)}
              helperText={errors.stockActual || 'Cantidad disponible en inventario'}
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InventoryIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Stock mínimo */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Stock Mínimo"
              value={formData.stockMinimo}
              onChange={(e) => handleChange('stockMinimo', parseInt(e.target.value) || 0)}
              error={Boolean(errors.stockMinimo)}
              helperText={errors.stockMinimo || 'Cantidad mínima para alertas'}
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WarningIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción (Opcional)"
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              helperText="Descripción detallada del repuesto"
            />
          </Grid>

          {/* Alerta de stock bajo */}
          {isStockBajo && formData.stockActual > 0 && (
            <Grid item xs={12}>
              <Alert severity="warning" icon={<WarningIcon />}>
                <Typography variant="body2">
                  <strong>¡Atención!</strong> El stock actual ({formData.stockActual}) está por debajo 
                  del stock mínimo ({formData.stockMinimo}). Se recomienda reabastecer este repuesto.
                </Typography>
              </Alert>
            </Grid>
          )}

          {/* Sin stock */}
          {formData.stockActual === 0 && (
            <Grid item xs={12}>
              <Alert severity="error">
                <Typography variant="body2">
                  <strong>Sin Stock:</strong> Este repuesto no tiene unidades disponibles.
                </Typography>
              </Alert>
            </Grid>
          )}

          {/* Información del repuesto */}
          {formData.nombre && formData.precioUnitario && (
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Resumen:</strong> {formData.nombre}
                  {formData.categoria && ` - ${formatCategoria(formData.categoria)}`}
                  {' '}- Precio: {repuestoService.formatPrice(parseFloat(formData.precioUnitario) || 0)}
                  {' '}- Stock: {formData.stockActual} unidades 
                  {' '}(Mín: {formData.stockMinimo})
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          startIcon={<CancelIcon />}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || Object.keys(errors).length > 0 || codigoExists}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')} Repuesto
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RepuestoForm
