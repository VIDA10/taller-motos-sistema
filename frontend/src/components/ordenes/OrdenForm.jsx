import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
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
  Alert,
  Box,
  Typography,
  Autocomplete,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material'
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  TwoWheeler as TwoWheelerIcon,
  Build as BuildIcon,
  CalendarToday as CalendarIcon,
  Error as ErrorIcon
} from '@mui/icons-material'

// Servicios
import { obtenerTodosLosClientes } from '../../services/clienteService'
import { obtenerMotosPorCliente } from '../../services/motoService'
import usuarioService from '../../services/usuarioService'
import { PRIORIDADES_ORDEN } from '../../services/ordenService'

/**
 * Formulario para crear nueva orden de trabajo
 * Sigue el flujo correcto del sistema:
 * 
 * 1. RECEPCIÓN (RECEPCIONISTA/ADMIN):
 *    - Estado inicial: "RECIBIDA" (automático)
 *    - Prioridad: BAJA, NORMAL, ALTA, URGENTE
 *    - Cliente: Selección obligatoria
 *    - Moto: Del cliente seleccionado
 *    - Mecánico: Opcional (se puede asignar después)
 *    - Descripción problema: Obligatorio
 *    - Diagnóstico: Opcional
 *    - Observaciones: Opcional
 */
const OrdenForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  loading = false,
  error = null,
  orden = null // Nueva prop para modo edición
}) => {
  const { user } = useSelector((state) => state.auth)
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    idMoto: '',
    idUsuarioCreador: user?.idUsuario || '',
    idMecanicoAsignado: '',
    fechaEstimadaEntrega: null,
    estado: 'RECIBIDA', // Estado inicial fijo
    prioridad: 'NORMAL', // Por defecto
    descripcionProblema: '',
    diagnostico: '',
    observaciones: ''
  })
  
  // Estados para selecciones
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [selectedMoto, setSelectedMoto] = useState(null)
  
  // Estados de datos
  const [clientes, setClientes] = useState([])
  const [motos, setMotos] = useState([])
  const [mecanicos, setMecanicos] = useState([])
  
  // Estados de carga
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [loadingMotos, setLoadingMotos] = useState(false)
  const [loadingMecanicos, setLoadingMecanicos] = useState(false)
  
  // Estados de validación
  const [errors, setErrors] = useState({})

  // Helper para formatear fechas
  const formatearFechaParaInput = (fecha) => {
    if (!fecha) return ''
    
    try {
      // Si ya es un objeto Date
      if (fecha instanceof Date) {
        if (isNaN(fecha.getTime())) return '' // Fecha inválida
        return fecha.toISOString().split('T')[0]
      }
      
      // Si es un string, convertir a Date primero
      if (typeof fecha === 'string') {
        const dateObj = new Date(fecha)
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toISOString().split('T')[0]
        }
      }
      
      // Si es un número (timestamp)
      if (typeof fecha === 'number') {
        const dateObj = new Date(fecha)
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toISOString().split('T')[0]
        }
      }
    } catch (error) {
      console.error('Error al formatear fecha:', error, fecha)
    }
    
    return ''
  }

  // Cargar datos iniciales
  useEffect(() => {
    if (open) {
      cargarClientes()
      cargarMecanicos()
    }
  }, [open])

  // Cargar datos para edición
  useEffect(() => {
    if (open && orden) {
      // Estamos en modo edición, cargar datos de la orden
      cargarDatosParaEdicion()
    } else if (open && !orden) {
      // Estamos en modo creación, limpiar formulario
      limpiarFormulario()
    }
  }, [open, orden])

  // Sincronizar mecánico cuando la lista de mecánicos cambie y tengamos una orden
  useEffect(() => {
    if (orden?.mecanicoAsignado?.idUsuario && mecanicos.length > 0) {
      const mecanicoExiste = mecanicos.some(m => m.idUsuario === orden.mecanicoAsignado.idUsuario)
      if (mecanicoExiste) {
        setFormData(prev => ({
          ...prev,
          idMecanicoAsignado: orden.mecanicoAsignado.idUsuario
        }))
      }
    }
  }, [mecanicos, orden])

  const cargarDatosParaEdicion = async () => {
    try {
      // Configurar datos básicos del formulario SIN el mecánico (se manejará con useEffect)
      const datosBasicos = {
        idMoto: orden.moto?.idMoto || '',
        idUsuarioCreador: orden.usuarioCreador?.idUsuario || user?.idUsuario || '',
        idMecanicoAsignado: '', // Se establecerá automáticamente con useEffect
        fechaEstimadaEntrega: orden.fechaEstimadaEntrega || null,
        estado: orden.estado || 'RECIBIDA',
        prioridad: orden.prioridad || 'NORMAL',
        descripcionProblema: orden.descripcionProblema || '',
        diagnostico: orden.diagnostico || '',
        observaciones: orden.observaciones || ''
      }
      
      setFormData(datosBasicos)

      // Si tiene moto, configurar el cliente y cargar las motos
      if (orden.moto?.cliente) {
        const cliente = orden.moto.cliente
        
        // Asegurar que el cliente esté en la lista de clientes cargados
        setClientes(prevClientes => {
          const clienteExiste = prevClientes.some(c => c.idCliente === cliente.idCliente)
          if (!clienteExiste) {
            return [...prevClientes, cliente]
          }
          return prevClientes
        })
        
        setSelectedCliente(cliente)
        
        // Cargar motos del cliente
        await cargarMotosPorCliente(cliente)
        
        // Seleccionar la moto después de un breve delay
        setTimeout(() => {
          setSelectedMoto(orden.moto)
        }, 100)
      }

    } catch (err) {
      console.error('Error al cargar datos para edición:', err)
    }
  }

  const limpiarFormulario = () => {
    setFormData({
      idMoto: '',
      idUsuarioCreador: user?.idUsuario || '',
      idMecanicoAsignado: '',
      fechaEstimadaEntrega: null,
      estado: 'RECIBIDA',
      prioridad: 'NORMAL',
      descripcionProblema: '',
      diagnostico: '',
      observaciones: ''
    })
    setSelectedCliente(null)
    setSelectedMoto(null)
    setMotos([])
    setErrors({})
  }

  // Cargar clientes
  const cargarClientes = async () => {
    setLoadingClientes(true)
    try {
      const clientesData = await obtenerTodosLosClientes()
      setClientes(clientesData.filter(cliente => cliente.activo))
    } catch (err) {
      console.error('Error al cargar clientes:', err)
    } finally {
      setLoadingClientes(false)
    }
  }

  // Cargar mecánicos (usuarios con rol MECANICO)
  const cargarMecanicos = async () => {
    setLoadingMecanicos(true)
    try {
      const mecanicosList = await usuarioService.obtenerUsuariosActivosPorRol('MECANICO')
      setMecanicos(mecanicosList || [])
    } catch (err) {
      console.error('Error al cargar mecánicos:', err)
      setMecanicos([])
    } finally {
      setLoadingMecanicos(false)
    }
  }

  // Cargar motos cuando se selecciona un cliente
  const cargarMotosPorCliente = async (cliente) => {
    if (!cliente) {
      setMotos([])
      return
    }
    
    setLoadingMotos(true)
    try {
      const motosData = await obtenerMotosPorCliente(cliente)
      // Si activa es undefined, asumimos que la moto está activa
      // Solo filtramos las que explícitamente están marcadas como inactivas
      const motosActivas = motosData.filter(moto => 
        moto.activa !== false && moto.activa !== 'false' && moto.activa !== 0
      )
      setMotos(motosActivas)
    } catch (err) {
      console.error('Error al cargar motos del cliente:', err)
      setMotos([])
    } finally {
      setLoadingMotos(false)
    }
  }

  // Manejar selección de cliente
  const handleClienteChange = (event, newValue) => {
    setSelectedCliente(newValue)
    setSelectedMoto(null)
    setFormData(prev => ({ ...prev, idMoto: '' }))
    
    if (newValue) {
      cargarMotosPorCliente(newValue)
    } else {
      setMotos([])
    }
    
    // Limpiar error de cliente
    if (errors.cliente) {
      setErrors(prev => ({ ...prev, cliente: null }))
    }
  }

  // Manejar selección de moto
  const handleMotoChange = (event, newValue) => {
    setSelectedMoto(newValue)
    setFormData(prev => ({ 
      ...prev, 
      idMoto: newValue ? newValue.idMoto : '' 
    }))
    
    // Limpiar error de moto
    if (errors.idMoto) {
      setErrors(prev => ({ ...prev, idMoto: null }))
    }
  }

  // Manejar cambios en campos del formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    if (!selectedCliente) {
      newErrors.cliente = 'Debe seleccionar un cliente'
    }

    if (!formData.idMoto) {
      newErrors.idMoto = 'Debe seleccionar una moto'
    }

    if (!formData.descripcionProblema.trim()) {
      newErrors.descripcionProblema = 'La descripción del problema es obligatoria'
    } else if (formData.descripcionProblema.length > 1000) {
      newErrors.descripcionProblema = 'La descripción no puede exceder 1000 caracteres'
    }

    if (formData.diagnostico && formData.diagnostico.length > 1000) {
      newErrors.diagnostico = 'El diagnóstico no puede exceder 1000 caracteres'
    }

    if (formData.observaciones && formData.observaciones.length > 1000) {
      newErrors.observaciones = 'Las observaciones no pueden exceder 1000 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    // Logs de depuración para verificar autenticación
    console.log('🔐 Estado de autenticación actual:')
    console.log('- Usuario completo:', user)
    console.log('- ID Usuario:', user?.idUsuario)
    console.log('- Rol del usuario:', user?.rol)
    console.log('- Token en localStorage:', localStorage.getItem('token'))
    
    // Verificar si el token es válido haciendo una petición de prueba
    console.log('🧪 Verificando validez del token...')
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('- Estado de verificación token:', response.status)
      if (response.ok) {
        const userData = await response.json()
        console.log('- Datos del usuario desde token:', userData)
      } else {
        console.error('- Token inválido o expirado')
      }
    } catch (err) {
      console.error('- Error al verificar token:', err)
    }
    
    console.log('📋 Datos del formulario a enviar:', formData)

    try {
      const result = await onSubmit(formData)
      if (result?.success) {
        // Resetear formulario
        setFormData({
          idMoto: '',
          idUsuarioCreador: user?.idUsuario || '',
          idMecanicoAsignado: '',
          fechaEstimadaEntrega: null,
          estado: 'RECIBIDA',
          prioridad: 'NORMAL',
          descripcionProblema: '',
          diagnostico: '',
          observaciones: ''
        })
        setSelectedCliente(null)
        setSelectedMoto(null)
        setErrors({})
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error)
    }
  }

  // Limpiar formulario al cerrar
  const handleClose = () => {
    setFormData({
      idMoto: '',
      idUsuarioCreador: user?.idUsuario || '',
      idMecanicoAsignado: '',
      fechaEstimadaEntrega: null,
      estado: 'RECIBIDA',
      prioridad: 'NORMAL',
      descripcionProblema: '',
      diagnostico: '',
      observaciones: ''
    })
    setSelectedCliente(null)
    setSelectedMoto(null)
    setMotos([])
    setErrors({})
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { minHeight: '70vh' } }}
    >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon color="primary" />
            <Typography variant="h6">
              {orden ? `Editar Orden #${orden.numeroOrden}` : 'Nueva Orden de Trabajo'}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Sección Cliente y Moto */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6">1. Información del Cliente</Typography>
              </Box>
            </Grid>

            {/* Selección de Cliente */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                value={selectedCliente}
                onChange={handleClienteChange}
                options={clientes}
                getOptionLabel={(cliente) => {
                  if (!cliente) return ''
                  return `${cliente.nombre || ''} - ${cliente.telefono || cliente.dni || cliente.idCliente}`.trim()
                }}
                isOptionEqualToValue={(option, value) => {
                  if (!option || !value) return false
                  return option.idCliente === value.idCliente
                }}
                loading={loadingClientes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cliente *"
                    error={!!errors.cliente}
                    helperText={errors.cliente}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingClientes ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, cliente) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      <Box>
                        <Typography variant="body2">
                          {cliente.nombre} {cliente.apellidos || ''}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {cliente.telefono} • {cliente.email}
                        </Typography>
                      </Box>
                    </Box>
                  );
                }}
              />
            </Grid>

            {/* Selección de Moto */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                value={selectedMoto}
                onChange={handleMotoChange}
                options={motos}
                getOptionLabel={(moto) => `${moto.placa} - ${moto.marca} ${moto.modelo}`}
                isOptionEqualToValue={(option, value) => {
                  if (!option || !value) return false
                  return option.idMoto === value.idMoto
                }}
                loading={loadingMotos}
                disabled={!selectedCliente}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Moto *"
                    error={!!errors.idMoto}
                    helperText={errors.idMoto || (!selectedCliente ? 'Seleccione primero un cliente' : '')}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingMotos ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, moto) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      <TwoWheelerIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2">
                          {moto.placa} - {moto.marca} {moto.modelo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {moto.anio} • {moto.color} • {moto.kilometraje?.toLocaleString()} km
                        </Typography>
                      </Box>
                    </Box>
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Sección Configuración de Orden */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6">2. Configuración de la Orden</Typography>
              </Box>
            </Grid>

            {/* Prioridad */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={formData.prioridad}
                  label="Prioridad"
                  onChange={(e) => handleInputChange('prioridad', e.target.value)}
                >
                  {Object.values(PRIORIDADES_ORDEN).map((prioridad) => (
                    <MenuItem key={prioridad} value={prioridad}>
                      <Chip 
                        label={prioridad} 
                        size="small"
                        color={
                          prioridad === 'URGENTE' ? 'error' :
                          prioridad === 'ALTA' ? 'warning' :
                          prioridad === 'NORMAL' ? 'primary' : 'default'
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Mecánico Asignado */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Mecánico (Opcional)</InputLabel>
                <Select
                  value={
                    formData.idMecanicoAsignado && 
                    mecanicos.some(m => m.idUsuario === formData.idMecanicoAsignado)
                      ? formData.idMecanicoAsignado 
                      : ''
                  }
                  label="Mecánico (Opcional)"
                  onChange={(e) => handleInputChange('idMecanicoAsignado', e.target.value)}
                >
                  <MenuItem value="">
                    <em>Sin asignar</em>
                  </MenuItem>
                  {mecanicos.map((mecanico) => (
                    <MenuItem key={mecanico.idUsuario} value={mecanico.idUsuario}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BuildIcon fontSize="small" />
                        {mecanico.nombreCompleto}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Fecha Estimada de Entrega */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Estimada de Entrega"
                value={formatearFechaParaInput(formData.fechaEstimadaEntrega)}
                onChange={(e) => handleInputChange('fechaEstimadaEntrega', e.target.value ? new Date(e.target.value) : null)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Sección Descripción del Problema */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ErrorIcon color="primary" />
                <Typography variant="h6">3. Descripción del Problema</Typography>
              </Box>
            </Grid>

            {/* Descripción del Problema */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción del Problema *"
                value={formData.descripcionProblema}
                onChange={(e) => handleInputChange('descripcionProblema', e.target.value)}
                error={!!errors.descripcionProblema}
                helperText={
                  errors.descripcionProblema || 
                  `${formData.descripcionProblema.length}/1000 caracteres`
                }
                placeholder="Describa detalladamente el problema reportado por el cliente..."
              />
            </Grid>

            {/* Diagnóstico Inicial */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Diagnóstico Inicial (Opcional)"
                value={formData.diagnostico}
                onChange={(e) => handleInputChange('diagnostico', e.target.value)}
                error={!!errors.diagnostico}
                helperText={
                  errors.diagnostico || 
                  `${formData.diagnostico.length}/1000 caracteres`
                }
                placeholder="Diagnóstico preliminar si es evidente..."
              />
            </Grid>

            {/* Observaciones */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observaciones (Opcional)"
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                error={!!errors.observaciones}
                helperText={
                  errors.observaciones || 
                  `${formData.observaciones.length}/1000 caracteres`
                }
                placeholder="Observaciones adicionales, condiciones especiales..."
              />
            </Grid>

            {/* Información del Estado */}
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Estado inicial:</strong> RECIBIDA - La orden se creará con estado "RECIBIDA" 
                  y podrá ser procesada por el mecánico asignado.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
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
            disabled={loading || !selectedCliente || !formData.idMoto || !formData.descripcionProblema.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <AssignmentIcon />}
          >
            {loading 
              ? (orden ? 'Actualizando...' : 'Creando...') 
              : (orden ? 'Actualizar Orden' : 'Crear Orden')
            }
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

OrdenForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  orden: PropTypes.object // Nueva prop para modo edición
}

export default OrdenForm
