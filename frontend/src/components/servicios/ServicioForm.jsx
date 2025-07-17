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
  AccessTime as TimeIcon,
  Description as DescriptionIcon
} from '@mui/icons-material'
import servicioService from '../../services/servicioService'

/**
 * Formulario para crear/editar servicios
 * Maneja validación y envío de datos
 */
const ServicioForm = ({
  open = false,
  servicio = null,
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
    precioBase: '',
    tiempoEstimadoMinutos: 60,
    activo: true
  })

  // Estados de validación
  const [errors, setErrors] = useState({})
  const [codigoExists, setCodigoExists] = useState(false)

  // Categorías disponibles
  const categorias = [
    'MANTENIMIENTO',
    'REPARACION', 
    'DIAGNOSTICO',
    'INSTALACION',
    'LIMPIEZA',
    'INSPECCION',
    'AJUSTE',
    'LUBRICACION',
    'CAMBIO_ACEITE',
    'REVISION'
  ]

  // Modo edición
  const isEdit = Boolean(servicio)

  // Inicializar formulario
  useEffect(() => {
    if (servicio) {
      setFormData({
        codigo: servicio.codigo || '',
        nombre: servicio.nombre || '',
        descripcion: servicio.descripcion || '',
        categoria: servicio.categoria || '',
        precioBase: servicio.precioBase || '',
        tiempoEstimadoMinutos: servicio.tiempoEstimadoMinutos || 60,
        activo: servicio.activo !== undefined ? servicio.activo : true
      })
    } else {
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        categoria: '',
        precioBase: '',
        tiempoEstimadoMinutos: 60,
        activo: true
      })
    }
    setErrors({})
    setCodigoExists(false)
  }, [servicio, open])

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
      const exists = await servicioService.existsCode(codigo)
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
    } else if (formData.codigo.length > 20) {
      newErrors.codigo = 'El código no puede exceder 20 caracteres'
    } else if (codigoExists) {
      newErrors.codigo = 'Este código ya está en uso'
    }

    // Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres'
    }

    // Categoría
    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es obligatoria'
    }

    // Precio base
    if (!formData.precioBase) {
      newErrors.precioBase = 'El precio base es obligatorio'
    } else {
      const precio = parseFloat(formData.precioBase)
      if (isNaN(precio) || precio < 0) {
        newErrors.precioBase = 'El precio debe ser un número mayor o igual a 0'
      }
    }

    // Tiempo estimado
    if (!formData.tiempoEstimadoMinutos || formData.tiempoEstimadoMinutos < 1) {
      newErrors.tiempoEstimadoMinutos = 'El tiempo estimado debe ser mayor a 0'
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

    const servicioData = {
      ...formData,
      precioBase: parseFloat(formData.precioBase),
      tiempoEstimadoMinutos: parseInt(formData.tiempoEstimadoMinutos)
    }

    await onSave(servicioData)
  }

  // Formatear categoría para mostrar
  const formatCategoria = (categoria) => {
    return categoria.replace('_', ' ')
  }

  // Generar sugerencias de tiempo según categoría
  const getTiempoSugerido = (categoria) => {
    const tiempos = {
      'MANTENIMIENTO': 120,
      'REPARACION': 180,
      'DIAGNOSTICO': 60,
      'INSTALACION': 90,
      'LIMPIEZA': 45,
      'INSPECCION': 30,
      'AJUSTE': 60,
      'LUBRICACION': 30,
      'CAMBIO_ACEITE': 45,
      'REVISION': 90
    }
    return tiempos[categoria] || 60
  }

  // Aplicar tiempo sugerido
  const aplicarTiempoSugerido = () => {
    const tiempoSugerido = getTiempoSugerido(formData.categoria)
    handleChange('tiempoEstimadoMinutos', tiempoSugerido)
  }

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
          <CategoryIcon color="primary" />
          <Typography variant="h6">
            {isEdit ? 'Editar Servicio' : 'Nuevo Servicio'}
          </Typography>
        </Box>
        {isEdit && (
          <Typography variant="body2" color="text.secondary">
            ID: {servicio?.idServicio}
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
              helperText={errors.codigo || 'Código único del servicio'}
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
              label="Nombre del Servicio"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre || 'Nombre descriptivo del servicio'}
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
            <FormControl fullWidth error={Boolean(errors.categoria)}>
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
                      {formatCategoria(categoria)}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.categoria && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.categoria}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Precio base */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Precio Base"
              value={formData.precioBase}
              onChange={(e) => handleChange('precioBase', e.target.value)}
              error={Boolean(errors.precioBase)}
              helperText={errors.precioBase || 'Precio en soles peruanos'}
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

          {/* Tiempo estimado */}
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              type="number"
              label="Tiempo Estimado (minutos)"
              value={formData.tiempoEstimadoMinutos}
              onChange={(e) => handleChange('tiempoEstimadoMinutos', parseInt(e.target.value) || 1)}
              error={Boolean(errors.tiempoEstimadoMinutos)}
              helperText={errors.tiempoEstimadoMinutos || `Equivale a: ${servicioService.formatTime(formData.tiempoEstimadoMinutos)}`}
              inputProps={{ min: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TimeIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Sugerencia de tiempo */}
          <Grid item xs={12} md={4}>
            {formData.categoria && (
              <Box display="flex" alignItems="center" height="100%">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={aplicarTiempoSugerido}
                  sx={{ width: '100%' }}
                >
                  Sugerir: {servicioService.formatTime(getTiempoSugerido(formData.categoria))}
                </Button>
              </Box>
            )}
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
              helperText="Descripción detallada del servicio"
            />
          </Grid>

          {/* Información adicional */}
          {formData.categoria && formData.precioBase && (
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Resumen:</strong> Servicio de {formatCategoria(formData.categoria).toLowerCase()} 
                  con precio base de {servicioService.formatPrice(parseFloat(formData.precioBase) || 0)} 
                  y tiempo estimado de {servicioService.formatTime(formData.tiempoEstimadoMinutos)}
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
          {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')} Servicio
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ServicioForm
