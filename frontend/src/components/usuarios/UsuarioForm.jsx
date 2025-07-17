import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton
} from '@mui/material'
import { 
  Save, 
  Cancel, 
  Person, 
  Email, 
  Lock,
  AccountCircle,
  Security,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import usuarioService from '../../services/usuarioService'

/**
 * Formulario para crear/editar usuarios
 * Basado 100% en DTOs del backend:
 * - CreateUsuarioDTO: username*, email*, password*, nombreCompleto*, rol*
 * - UpdateUsuarioDTO: username, email, password, nombreCompleto, rol, activo
 * 
 * Validaciones según CreateUsuarioDTO y UpdateUsuarioDTO:
 * - username: @NotBlank, max 50 caracteres, patrón alfanumérico, único
 * - email: @Email, max 100 caracteres, único
 * - password: min 6, max 50 caracteres (solo en creación o cambio)
 * - nombreCompleto: @NotBlank, max 100 caracteres
 * - rol: @Pattern ADMIN|RECEPCIONISTA|MECANICO
 * - activo: Boolean (solo en modo edición)
 */
const UsuarioForm = ({
  open,
  onClose,
  onSave,
  usuario = null, // null para crear, objeto para editar
  loading = false
}) => {
  // Determinar si es modo edición o creación
  const isEditing = Boolean(usuario)
  
  // Estado del formulario basado en DTOs
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nombreCompleto: '',
    rol: '',
    activo: true // Solo relevante para UpdateUsuarioDTO
  })
  
  // Estado de validaciones
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [validatingUniqueness, setValidatingUniqueness] = useState({
    username: false,
    email: false
  })
  
  // Estado para mostrar/ocultar password
  const [showPassword, setShowPassword] = useState(false)
  
  // Opciones de roles basadas en enum del backend
  const rolesOptions = [
    { value: 'ADMIN', label: 'Administrador', description: 'Acceso completo al sistema' },
    { value: 'RECEPCIONISTA', label: 'Recepcionista', description: 'Gestión de clientes, órdenes y pagos' },
    { value: 'MECANICO', label: 'Mecánico', description: 'Trabajo técnico y servicios' }
  ]

  // Inicializar formulario cuando se abre
  useEffect(() => {
    if (open) {
      if (isEditing && usuario) {
        // Modo edición: cargar datos del usuario (UsuarioResponseDTO)
        setFormData({
          username: usuario.username || '',
          email: usuario.email || '',
          password: '', // No cargar password existente por seguridad
          nombreCompleto: usuario.nombreCompleto || '',
          rol: usuario.rol || '',
          activo: usuario.activo !== undefined ? usuario.activo : true
        })
      } else {
        // Modo creación: valores por defecto (CreateUsuarioDTO)
        setFormData({
          username: '',
          email: '',
          password: '',
          nombreCompleto: '',
          rol: '',
          activo: true
        })
      }
      // Limpiar errores y campos tocados
      setErrors({})
      setTouched({})
      setShowPassword(false)
    }
  }, [open, isEditing, usuario])

  /**
   * Validar unicidad de campos en tiempo real
   * Usando endpoints reales del backend /validar/
   */
  const validateUniqueness = async (field, value) => {
    if (!value || value.trim() === '') return

    const trimmedValue = value.trim()
    setValidatingUniqueness(prev => ({ ...prev, [field]: true }))

    try {
      let exists = false
      
      if (field === 'username') {
        if (isEditing) {
          exists = await usuarioService.existeUsernameExcluyendoUsuario(trimmedValue, usuario.idUsuario)
        } else {
          exists = await usuarioService.existeUsername(trimmedValue)
        }
      } else if (field === 'email') {
        if (isEditing) {
          exists = await usuarioService.existeEmailExcluyendoUsuario(trimmedValue, usuario.idUsuario)
        } else {
          exists = await usuarioService.existeEmail(trimmedValue)
        }
      }

      if (exists) {
        setErrors(prev => ({
          ...prev,
          [field]: `Este ${field === 'username' ? 'nombre de usuario' : 'email'} ya está en uso`
        }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    } catch (error) {
      console.error(`Error validando unicidad de ${field}:`, error)
      // En caso de error de red, no bloquear el formulario
    } finally {
      setValidatingUniqueness(prev => ({ ...prev, [field]: false }))
    }
  }

  /**
   * Validar un campo individual
   */
  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'username':
        if (!value.trim()) {
          newErrors.username = 'El nombre de usuario es obligatorio'
        } else if (value.length > 50) {
          newErrors.username = 'El nombre de usuario no puede exceder 50 caracteres'
        } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
          newErrors.username = 'Solo se permiten letras, números, puntos, guiones y guiones bajos'
        } else {
          delete newErrors.username
        }
        break

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'El email es obligatorio'
        } else if (value.length > 100) {
          newErrors.email = 'El email no puede exceder 100 caracteres'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'El email debe tener un formato válido'
        } else {
          delete newErrors.email
        }
        break

      case 'password':
        if (!isEditing && !value) {
          newErrors.password = 'La contraseña es obligatoria'
        } else if (value && value.length < 6) {
          newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
        } else if (value && value.length > 50) {
          newErrors.password = 'La contraseña no puede exceder 50 caracteres'
        } else {
          delete newErrors.password
        }
        break

      case 'nombreCompleto':
        if (!value.trim()) {
          newErrors.nombreCompleto = 'El nombre completo es obligatorio'
        } else if (value.length > 100) {
          newErrors.nombreCompleto = 'El nombre completo no puede exceder 100 caracteres'
        } else {
          delete newErrors.nombreCompleto
        }
        break

      case 'rol':
        if (!value) {
          newErrors.rol = 'El rol es obligatorio'
        } else if (!['ADMIN', 'RECEPCIONISTA', 'MECANICO'].includes(value)) {
          newErrors.rol = 'Rol inválido'
        } else {
          delete newErrors.rol
        }
        break

      default:
        break
    }

    setErrors(newErrors)
  }

  /**
   * Manejar cambios en los campos
   */
  const handleFieldChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    // Validar el campo
    validateField(name, value)

    // Validar unicidad para username y email con debounce
    if ((name === 'username' || name === 'email') && value.trim()) {
      const timeoutId = setTimeout(() => {
        validateUniqueness(name, value)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }

  /**
   * Validar todo el formulario
   */
  const validateForm = () => {
    const requiredFields = isEditing 
      ? ['username', 'email', 'nombreCompleto', 'rol']
      : ['username', 'email', 'password', 'nombreCompleto', 'rol']

    const newErrors = {}

    requiredFields.forEach(field => {
      validateField(field, formData[field])
    })

    // Verificar si hay errores de unicidad pendientes
    if (validatingUniqueness.username || validatingUniqueness.email) {
      return false
    }

    return Object.keys(errors).length === 0
  }

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = () => {
    // Marcar todos los campos como tocados
    const touchedFields = {}
    Object.keys(formData).forEach(key => {
      touchedFields[key] = true
    })
    setTouched(touchedFields)

    // Validar formulario
    if (!validateForm()) {
      return
    }

    // Preparar datos según DTO correspondiente
    const dataToSend = { ...formData }
    
    // En modo edición, no enviar password vacío
    if (isEditing && !dataToSend.password) {
      delete dataToSend.password
    }

    // Llamar función de guardado
    if (onSave) {
      onSave(dataToSend)
    }
  }

  /**
   * Manejar cierre del formulario
   */
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person color="primary" />
          <Typography variant="h6">
            {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Información básica */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircle color="primary" />
              Información Básica
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre Completo"
              variant="outlined"
              fullWidth
              required
              value={formData.nombreCompleto}
              onChange={(e) => handleFieldChange('nombreCompleto', e.target.value)}
              error={touched.nombreCompleto && !!errors.nombreCompleto}
              helperText={touched.nombreCompleto && errors.nombreCompleto}
              disabled={loading}
              inputProps={{ maxLength: 100 }}
              InputProps={{
                startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre de Usuario"
              variant="outlined"
              fullWidth
              required
              value={formData.username}
              onChange={(e) => handleFieldChange('username', e.target.value)}
              error={touched.username && !!errors.username}
              helperText={touched.username && errors.username}
              disabled={loading}
              inputProps={{ maxLength: 50 }}
              InputProps={{
                startAdornment: <AccountCircle sx={{ color: 'text.secondary', mr: 1 }} />,
                endAdornment: validatingUniqueness.username && <CircularProgress size={20} />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              disabled={loading}
              inputProps={{ maxLength: 100 }}
              InputProps={{
                startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} />,
                endAdornment: validatingUniqueness.email && <CircularProgress size={20} />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label={isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"}
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              required={!isEditing}
              value={formData.password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              error={touched.password && !!errors.password}
              helperText={
                touched.password && errors.password 
                  ? errors.password 
                  : isEditing 
                    ? 'Dejar vacío para mantener la contraseña actual'
                    : 'Mínimo 6 caracteres'
              }
              disabled={loading}
              inputProps={{ maxLength: 50 }}
              InputProps={{
                startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1 }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Configuración de acceso */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Security color="primary" />
              Configuración de Acceso
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={touched.rol && !!errors.rol}>
              <InputLabel>Rol del Usuario</InputLabel>
              <Select
                value={formData.rol}
                label="Rol del Usuario"
                onChange={(e) => handleFieldChange('rol', e.target.value)}
                disabled={loading}
              >
                {rolesOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {option.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {touched.rol && errors.rol && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.rol}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Estado activo solo en modo edición */}
          {isEditing && (
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.activo}
                    onChange={(e) => handleFieldChange('activo', e.target.checked)}
                    disabled={loading}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">
                      Usuario {formData.activo ? 'Activo' : 'Inactivo'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formData.activo 
                        ? 'El usuario puede acceder al sistema'
                        : 'El usuario no puede acceder al sistema'
                      }
                    </Typography>
                  </Box>
                }
              />
            </Grid>
          )}

          {/* Información adicional en modo edición */}
          {isEditing && usuario && (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Información:</strong> Usuario creado el {' '}
                  {new Date(usuario.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {usuario.ultimoLogin && (
                    <>
                      {' • '}Último login: {' '}
                      {new Date(usuario.ultimoLogin).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </>
                  )}
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          startIcon={<Cancel />}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || Object.keys(errors).length > 0 || validatingUniqueness.username || validatingUniqueness.email}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
        >
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UsuarioForm
