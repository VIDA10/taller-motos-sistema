import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Grid,
  Chip,
  CircularProgress,
  InputAdornment
} from '@mui/material'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon,
  Money as MoneyIcon
} from '@mui/icons-material'

// Importar servicios
import pagoService from '../../services/pagoService'
import ordenService from '../../services/ordenService'

/**
 * Formulario para crear/editar pagos
 * 
 * FUNCIONALIDADES:
 * - Crear nuevo pago
 * - Editar pago existente
 * - Validaciones frontend
 * - Selección de orden completada
 * - Métodos de pago múltiples
 * 
 * PERMISOS: Solo ADMIN y RECEPCIONISTA
 */
const PagoForm = ({
  open,
  onClose,
  onPagoGuardado,
  pagoEditar = null,
  ordenPreseleccionada = null
}) => {
  const { user } = useSelector((state) => state.auth)
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    idOrden: '',
    monto: '',
    metodo: '',
    referencia: '',
    observaciones: '',
    fechaPago: new Date().toISOString().slice(0, 16) // Formato datetime-local
  })
  
  // Estados de control
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [ordenesCompletadas, setOrdenesCompletadas] = useState([])
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  // Métodos de pago disponibles
  const metodosPago = [
    { value: 'EFECTIVO', label: '💵 Efectivo', color: 'success' },
    { value: 'TARJETA', label: '💳 Tarjeta', color: 'primary' },
    { value: 'TRANSFERENCIA', label: '🏦 Transferencia', color: 'secondary' }
  ]

  /**
   * Cargar órdenes completadas disponibles para pago
   */
  const cargarOrdenesCompletadas = async () => {
    try {
      const response = await ordenService.buscarPorEstado('COMPLETADA')
      if (response.data) {
        setOrdenesCompletadas(response.data)
      }
    } catch (error) {
      console.error('Error al cargar órdenes completadas:', error)
    }
  }

  /**
   * Cargar información de orden seleccionada
   */
  const cargarInfoOrden = async (idOrden) => {
    try {
      const response = await ordenService.obtenerPorId(idOrden)
      if (response.data) {
        setOrdenSeleccionada(response.data)
        
        // Si es un nuevo pago, sugerir el monto pendiente
        if (!pagoEditar) {
          const totalOrden = parseFloat(response.data.totalOrden || 0)
          const totalPagado = await obtenerTotalPagado(idOrden)
          const montoPendiente = totalOrden - totalPagado
          
          if (montoPendiente > 0) {
            setFormData(prev => ({
              ...prev,
              monto: montoPendiente.toFixed(2)
            }))
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar información de orden:', error)
    }
  }

  /**
   * Obtener total ya pagado de una orden
   */
  const obtenerTotalPagado = async (idOrden) => {
    try {
      const response = await pagoService.calcularTotalPagado(idOrden)
      return parseFloat(response.data || 0)
    } catch (error) {
      console.error('Error al obtener total pagado:', error)
      return 0
    }
  }

  /**
   * Inicializar formulario
   */
  useEffect(() => {
    if (open) {
      cargarOrdenesCompletadas()
      
      if (pagoEditar) {
        // Modo edición
        setFormData({
          idOrden: pagoEditar.ordenTrabajo?.idOrden || '',
          monto: pagoEditar.monto || '',
          metodo: pagoEditar.metodo || '',
          referencia: pagoEditar.referencia || '',
          observaciones: pagoEditar.observaciones || '',
          fechaPago: pagoEditar.fechaPago ? 
            new Date(pagoEditar.fechaPago).toISOString().slice(0, 16) : 
            new Date().toISOString().slice(0, 16)
        })
        
        if (pagoEditar.ordenTrabajo?.idOrden) {
          cargarInfoOrden(pagoEditar.ordenTrabajo.idOrden)
        }
      } else if (ordenPreseleccionada) {
        // Nuevo pago con orden preseleccionada
        setFormData(prev => ({
          ...prev,
          idOrden: ordenPreseleccionada.idOrden || ordenPreseleccionada.id
        }))
        cargarInfoOrden(ordenPreseleccionada.idOrden || ordenPreseleccionada.id)
      } else {
        // Nuevo pago sin preselección
        setFormData({
          idOrden: '',
          monto: '',
          metodo: '',
          referencia: '',
          observaciones: '',
          fechaPago: new Date().toISOString().slice(0, 16)
        })
      }
      
      setError(null)
      setSuccess(null)
      setValidationErrors({})
    }
  }, [open, pagoEditar, ordenPreseleccionada])

  /**
   * Manejar cambios en el formulario
   */
  const handleChange = (field) => (event) => {
    const value = event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Si cambió la orden, cargar su información
    if (field === 'idOrden' && value) {
      cargarInfoOrden(value)
    }

    // Limpiar error de validación del campo
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  /**
   * Validar formulario
   */
  const validarFormulario = () => {
    const errores = {}

    if (!formData.idOrden) {
      errores.idOrden = 'Debe seleccionar una orden'
    }

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      errores.monto = 'El monto debe ser mayor a 0'
    }

    if (!formData.metodo) {
      errores.metodo = 'Debe seleccionar un método de pago'
    }

    if (formData.metodo === 'TRANSFERENCIA' && !formData.referencia) {
      errores.referencia = 'La referencia es obligatoria para transferencias'
    }

    if (formData.referencia && formData.referencia.length > 100) {
      errores.referencia = 'La referencia no puede exceder 100 caracteres'
    }

    setValidationErrors(errores)
    return Object.keys(errores).length === 0
  }

  /**
   * Guardar pago
   */
  const handleGuardar = async () => {
    if (!validarFormulario()) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Formatear datos para el backend
      const pagoData = pagoService.formatearPago(formData)

      let response
      if (pagoEditar) {
        // Actualizar pago existente
        pagoData.idPago = pagoEditar.idPago
        response = await pagoService.actualizar(pagoData)
      } else {
        // Crear nuevo pago
        response = await pagoService.crear(pagoData)
      }

      if (response.data) {
        setSuccess(pagoEditar ? 'Pago actualizado correctamente' : 'Pago registrado correctamente')
        
        // Notificar al componente padre
        if (onPagoGuardado) {
          onPagoGuardado(response.data)
        }

        // Cerrar dialog después de un momento
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    } catch (error) {
      console.error('Error al guardar pago:', error)
      
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Error al guardar el pago. Verifica los datos.')
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Formatear moneda para mostrar
   */
  const formatearMoneda = (monto) => {
    if (!monto) return 'S/ 0.00'
    return `S/ ${parseFloat(monto).toFixed(2)}`
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <ReceiptIcon sx={{ mr: 2 }} />
          {pagoEditar ? 'Editar Pago' : 'Registrar Nuevo Pago'}
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Selección de Orden */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!validationErrors.idOrden}>
              <InputLabel>Orden de Trabajo</InputLabel>
              <Select
                value={formData.idOrden}
                onChange={handleChange('idOrden')}
                label="Orden de Trabajo"
                disabled={!!ordenPreseleccionada || !!pagoEditar}
              >
                {ordenesCompletadas.map((orden) => (
                  <MenuItem key={orden.idOrden} value={orden.idOrden}>
                    #{orden.numeroOrden} - {orden.cliente?.nombres} {orden.cliente?.apellidos}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.idOrden && (
                <Typography variant="caption" color="error">
                  {validationErrors.idOrden}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Información de la orden seleccionada */}
          {ordenSeleccionada && (
            <Grid item xs={12} md={6}>
              <Box p={2} bgcolor="background.paper" border={1} borderColor="divider" borderRadius={1}>
                <Typography variant="subtitle2" gutterBottom>
                  Información de la Orden
                </Typography>
                <Typography variant="body2">
                  Total: <strong>{formatearMoneda(ordenSeleccionada.totalOrden)}</strong>
                </Typography>
                <Typography variant="body2">
                  Cliente: {ordenSeleccionada.cliente?.nombres} {ordenSeleccionada.cliente?.apellidos}
                </Typography>
                <Typography variant="body2">
                  Moto: {ordenSeleccionada.moto?.marca} {ordenSeleccionada.moto?.modelo}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Monto */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Monto"
              type="number"
              value={formData.monto}
              onChange={handleChange('monto')}
              error={!!validationErrors.monto}
              helperText={validationErrors.monto}
              InputProps={{
                startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>

          {/* Método de Pago */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!validationErrors.metodo}>
              <InputLabel>Método de Pago</InputLabel>
              <Select
                value={formData.metodo}
                onChange={handleChange('metodo')}
                label="Método de Pago"
              >
                {metodosPago.map((metodo) => (
                  <MenuItem key={metodo.value} value={metodo.value}>
                    <Box display="flex" alignItems="center">
                      {metodo.label}
                      <Chip
                        label={metodo.value}
                        size="small"
                        color={metodo.color}
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.metodo && (
                <Typography variant="caption" color="error">
                  {validationErrors.metodo}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Fecha de Pago */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha de Pago"
              type="datetime-local"
              value={formData.fechaPago}
              onChange={handleChange('fechaPago')}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>

          {/* Referencia */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Referencia"
              value={formData.referencia}
              onChange={handleChange('referencia')}
              error={!!validationErrors.referencia}
              helperText={validationErrors.referencia || 'Número de operación, voucher, etc.'}
              placeholder="Ej: OP-123456789"
            />
          </Grid>

          {/* Observaciones */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observaciones"
              value={formData.observaciones}
              onChange={handleChange('observaciones')}
              multiline
              rows={3}
              placeholder="Observaciones adicionales sobre el pago..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />}>
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loading}
        >
          {loading ? 'Guardando...' : (pagoEditar ? 'Actualizar' : 'Registrar')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PagoForm
