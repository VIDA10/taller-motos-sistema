import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  Box,
  Alert,
  Chip,
  Divider,
  InputAdornment
} from '@mui/material'
import {
  DirectionsCar,
  Build,
  Badge,
  Speed,
  Palette,
  CalendarToday,
  Person,
  Assignment,
  LocalHospital,
  Engineering
} from '@mui/icons-material'

/**
 * Formulario adaptativo para CRUD de motos según perfil
 * 
 * ADMIN: Formulario completo + VIN modificable
 * RECEPCIONISTA: Formulario completo inicial + VIN editable solo en creación
 * MECANICO: Edición + VIN modificable + campos técnicos editables (NO puede crear)
 */
const MotoForm = ({
  open = false,
  onClose,
  onSubmit,
  moto = null, // null = crear, objeto = editar
  loading = false,
  clientes = [],
  clientesLoading = false
}) => {
  const { user } = useSelector((state) => state.auth)
  const isCreating = !moto
  const isEditing = !!moto

  // Determinar capacidades según perfil
  const isAdmin = user?.rol === 'ADMIN'
  const isRecepcionista = user?.rol === 'RECEPCIONISTA'
  const isMecanico = user?.rol === 'MECANICO'

  // Configuración de campos según perfil
  const canEditVIN = isAdmin || (isRecepcionista && isCreating) || isMecanico
  const showTechnicalFields = isMecanico // Solo MECANICO puede editar campos técnicos
  const showAdminFields = isAdmin

  // Estado del formulario
  const [formData, setFormData] = useState({
    clienteId: '',
    marca: '',
    modelo: '',
    anio: '',
    placa: '',
    vin: '',
    color: '',
    kilometraje: 0,
    activo: true,
    // Campos técnicos (MECANICO)
    estadoTecnico: 'OPERATIVA', // OPERATIVA, EN_REPARACION, FUERA_SERVICIO
    diagnosticoActual: '',
    ultimaRevision: '',
    proximoMantenimiento: '',
    observacionesTecnicas: '',
    // Campos admin
    observacionesAdmin: ''
  })

  const [errors, setErrors] = useState({})

  // Inicializar formulario cuando se abre o cambia la moto
  useEffect(() => {
    if (open) {
      if (isEditing && moto) {
        setFormData({
          clienteId: moto.cliente?.idCliente || '',
          marca: moto.marca || '',
          modelo: moto.modelo || '',
          anio: moto.anio || '',
          placa: moto.placa || '',
          vin: moto.vin || '',
          color: moto.color || '',
          kilometraje: moto.kilometraje || 0,
          activo: moto.activo ?? true,
          estadoTecnico: moto.estadoTecnico || 'OPERATIVA',
          diagnosticoActual: moto.diagnosticoActual || '',
          ultimaRevision: moto.ultimaRevision || '',
          proximoMantenimiento: moto.proximoMantenimiento || '',
          observacionesTecnicas: moto.observacionesTecnicas || '',
          observacionesAdmin: moto.observacionesAdmin || ''
        })
      } else {
        // Resetear para crear nueva moto
        setFormData({
          clienteId: '',
          marca: '',
          modelo: '',
          anio: '',
          placa: '',
          vin: '',
          color: '',
          kilometraje: 0,
          activo: true,
          estadoTecnico: 'OPERATIVA',
          diagnosticoActual: '',
          ultimaRevision: '',
          proximoMantenimiento: '',
          observacionesTecnicas: '',
          observacionesAdmin: ''
        })
      }
      setErrors({})
    }
  }, [open, moto, isEditing])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error del campo al cambiar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validaciones básicas
    if (!formData.clienteId) newErrors.clienteId = 'Cliente es requerido'
    if (!formData.marca.trim()) newErrors.marca = 'Marca es requerida'
    if (!formData.modelo.trim()) newErrors.modelo = 'Modelo es requerido'
    if (!formData.placa.trim()) newErrors.placa = 'Placa es requerida'

    // Validaciones de VIN (si es editable)
    if (canEditVIN && formData.vin && formData.vin.length !== 17) {
      newErrors.vin = 'VIN debe tener exactamente 17 caracteres'
    }

    // Validaciones técnicas para mecánico
    if (isMecanico) {
      if (formData.kilometraje < 0) {
        newErrors.kilometraje = 'Kilometraje no puede ser negativo'
      }
      // Si está editando, validar que el kilometraje no disminuya
      if (isEditing && moto && formData.kilometraje < moto.kilometraje) {
        newErrors.kilometraje = 'Kilometraje no puede ser menor al actual'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const dataToSubmit = {
      ...formData,
      // Convertir strings vacíos a null para campos opcionales
      anio: formData.anio ? parseInt(formData.anio) : null,
      vin: formData.vin.trim() || null,
      color: formData.color.trim() || null,
      kilometraje: parseInt(formData.kilometraje) || 0
    }

    onSubmit(dataToSubmit)
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  // Título según contexto
  const getTitle = () => {
    if (isCreating) {
      if (isMecanico) return '🔧 Registrar Nueva Moto - Técnico'
      if (isRecepcionista) return '📝 Registrar Nueva Moto - Recepción'
      return '🏍️ Registrar Nueva Moto - Admin'
    } else {
      if (isMecanico) return '🔧 Editar Moto - Técnico'
      if (isRecepcionista) return '📝 Editar Moto - Recepción'
      return '🏍️ Editar Moto - Admin'
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component="span">
            {getTitle()}
          </Typography>
          {isEditing && (
            <Chip 
              label={`ID: #${moto.idMoto}`} 
              size="small" 
              variant="outlined" 
            />
          )}
        </Box>
        {/* Indicador de perfil */}
        <Box sx={{ mt: 1 }}>
          <Chip 
            label={`Perfil: ${user?.rol}`}
            size="small"
            color={isAdmin ? 'error' : isRecepcionista ? 'warning' : 'success'}
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* SECCIÓN: Información Básica */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <DirectionsCar />
              Información Básica
            </Typography>
          </Grid>

          {/* Cliente */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.clienteId}>
              <InputLabel>Cliente *</InputLabel>
              <Select
                value={formData.clienteId}
                label="Cliente *"
                onChange={(e) => handleInputChange('clienteId', e.target.value)}
                disabled={loading || clientesLoading || (isMecanico && isEditing)}
                startAdornment={<Person sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                {clientesLoading ? (
                  <MenuItem disabled>
                    Cargando clientes...
                  </MenuItem>
                ) : clientes.length === 0 ? (
                  <MenuItem disabled>
                    No hay clientes disponibles
                  </MenuItem>
                ) : (
                  clientes.map((cliente, index) => (
                    <MenuItem key={cliente.idCliente} value={cliente.idCliente}>
                      {index === 0 && clientes.length > 1 ? '🆕 ' : ''}
                      {cliente.nombre} - {cliente.telefono}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.clienteId && (
                <Typography variant="caption" color="error">
                  {errors.clienteId}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Marca */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Marca *"
              value={formData.marca}
              onChange={(e) => handleInputChange('marca', e.target.value)}
              error={!!errors.marca}
              helperText={errors.marca}
              disabled={loading}
              placeholder="ej: Honda, Yamaha, Suzuki..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsCar />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Modelo */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Modelo *"
              value={formData.modelo}
              onChange={(e) => handleInputChange('modelo', e.target.value)}
              error={!!errors.modelo}
              helperText={errors.modelo}
              disabled={loading}
              placeholder="ej: CBR 600RR, XTZ 250..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Build />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Año */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Año"
              value={formData.anio}
              onChange={(e) => handleInputChange('anio', e.target.value)}
              disabled={loading}
              placeholder="ej: 2020"
              inputProps={{ 
                min: 1900, 
                max: new Date().getFullYear() + 1 
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Placa */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Placa *"
              value={formData.placa}
              onChange={(e) => handleInputChange('placa', e.target.value.toUpperCase())}
              error={!!errors.placa}
              helperText={errors.placa}
              disabled={loading || (isMecanico && isEditing)}
              placeholder="ej: ABC-123"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* VIN */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="VIN (Número de Chasis)"
              value={formData.vin}
              onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
              error={!!errors.vin}
              helperText={errors.vin || 'Opcional - 17 caracteres'}
              disabled={loading || !canEditVIN}
              placeholder="ej: 1HGCM82633A123456"
              inputProps={{ maxLength: 17 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Assignment />
                  </InputAdornment>
                )
              }}
            />
            {!canEditVIN && isRecepcionista && isEditing && (
              <Typography variant="caption" color="text.secondary">
                💡 Solo lectura - VIN se puede editar solo al crear
              </Typography>
            )}
          </Grid>

          {/* Color */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Color"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              disabled={loading}
              placeholder="ej: Rojo, Azul, Negro..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Palette />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Kilometraje */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label={isMecanico ? "Kilometraje Actual *" : "Kilometraje"}
              value={formData.kilometraje}
              onChange={(e) => handleInputChange('kilometraje', e.target.value)}
              error={!!errors.kilometraje}
              helperText={errors.kilometraje || (isMecanico ? 'Campo prioritario - Solo puede incrementar' : '')}
              disabled={loading}
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Speed />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">km</InputAdornment>
              }}
            />
          </Grid>

          {/* SECCIÓN: Campos Técnicos (solo MECANICO) */}
          {showTechnicalFields && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Engineering />
                  Información Técnica
                </Typography>
              </Grid>

              {/* Estado Técnico */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado Técnico</InputLabel>
                  <Select
                    value={formData.estadoTecnico}
                    label="Estado Técnico"
                    onChange={(e) => handleInputChange('estadoTecnico', e.target.value)}
                    disabled={loading}
                  >
                    <MenuItem value="OPERATIVA">🟢 Operativa</MenuItem>
                    <MenuItem value="EN_REPARACION">🟡 En Reparación</MenuItem>
                    <MenuItem value="FUERA_SERVICIO">🔴 Fuera de Servicio</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Última Revisión */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Última Revisión"
                  value={formData.ultimaRevision}
                  onChange={(e) => handleInputChange('ultimaRevision', e.target.value)}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Próximo Mantenimiento */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Próximo Mantenimiento"
                  value={formData.proximoMantenimiento}
                  onChange={(e) => handleInputChange('proximoMantenimiento', e.target.value)}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Diagnóstico Actual */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Diagnóstico Actual"
                  value={formData.diagnosticoActual}
                  onChange={(e) => handleInputChange('diagnosticoActual', e.target.value)}
                  disabled={loading}
                  placeholder="Describe el estado actual de la moto, problemas detectados, etc."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalHospital />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Observaciones Técnicas */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Observaciones Técnicas"
                  value={formData.observacionesTecnicas}
                  onChange={(e) => handleInputChange('observacionesTecnicas', e.target.value)}
                  disabled={loading}
                  placeholder="Notas técnicas adicionales, recomendaciones, etc."
                />
              </Grid>
            </>
          )}

          {/* SECCIÓN: Campos Admin (solo ADMIN) */}
          {showAdminFields && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Assignment />
                  Información Administrativa
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Observaciones Administrativas"
                  value={formData.observacionesAdmin}
                  onChange={(e) => handleInputChange('observacionesAdmin', e.target.value)}
                  disabled={loading}
                  placeholder="Notas administrativas, historial especial, etc."
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          color="primary"
        >
          {loading ? 'Guardando...' : (isCreating ? 'Registrar Moto' : 'Actualizar Moto')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

MotoForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  moto: PropTypes.object, // null para crear, objeto para editar
  loading: PropTypes.bool,
  clientes: PropTypes.array,
  clientesLoading: PropTypes.bool
}

export default MotoForm
