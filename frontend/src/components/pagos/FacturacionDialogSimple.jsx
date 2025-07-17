import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material'
import {
  Receipt as ReceiptIcon,
  DirectionsBike as BikeIcon,
  Person as PersonIcon,
  Money as MoneyIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material'

// Importar servicios
import pagoService from '../../services/pagoService'

/**
 * Diálogo de facturación SIMPLIFICADO
 * 
 * FUNCIONALIDAD RESTAURADA:
 * - Facturación directa de órdenes completadas
 * - Solo pago total
 * - Sin lógica compleja de diagnóstico
 */
const FacturacionDialogSimple = ({
  open,
  onClose,
  onFacturacionCompleta,
  ordenPreseleccionada = null
}) => {
  const { user } = useSelector((state) => state.auth)

  // Estados básicos
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Estados del pago
  const [datosPago, setDatosPago] = useState({
    monto: '',
    metodo: 'EFECTIVO',
    referencia: '',
    observaciones: ''
  })

  // Métodos de pago
  const metodosPago = [
    { value: 'EFECTIVO', label: '💵 Efectivo' },
    { value: 'TARJETA', label: '💳 Tarjeta' },
    { value: 'TRANSFERENCIA', label: '🏦 Transferencia' }
  ]

  /**
   * Inicializar con orden preseleccionada
   */
  useEffect(() => {
    if (open && ordenPreseleccionada) {
      inicializarDatos()
    }
  }, [open, ordenPreseleccionada])

  /**
   * Inicializar datos básicos
   */
  const inicializarDatos = () => {
    setError(null)
    setSuccess(null)
    setLoading(false)
    
    // Establecer monto igual al total de la orden
    const totalOrden = parseFloat(ordenPreseleccionada.totalOrden || 0)
    const totalPagado = parseFloat(ordenPreseleccionada.totalPagado || 0)
    const montoPendiente = Math.max(0, totalOrden - totalPagado)
    
    setDatosPago({
      monto: montoPendiente.toFixed(2),
      metodo: 'EFECTIVO',
      referencia: '',
      observaciones: `Facturación orden #${ordenPreseleccionada.numeroOrden}`
    })
  }

  /**
   * Procesar pago
   */
  const procesarPago = async () => {
    try {
      setLoading(true)
      setError(null)

      // Validar datos
      const monto = parseFloat(datosPago.monto)
      if (!monto || monto <= 0) {
        setError('El monto debe ser mayor a 0')
        return
      }

      if (!datosPago.metodo) {
        setError('Debe seleccionar un método de pago')
        return
      }

      // Crear objeto pago
      const pagoData = {
        ordenTrabajo: {
          idOrden: ordenPreseleccionada.idOrden
        },
        monto: monto,
        fechaPago: new Date().toISOString(),
        metodo: datosPago.metodo,
        referencia: datosPago.referencia || null,
        observaciones: datosPago.observaciones || null
      }

      console.log('💰 Creando pago:', pagoData)

      // Crear el pago
      const response = await pagoService.crear(pagoData)
      
      if (response.data) {
        setSuccess('Pago registrado exitosamente')
        setTimeout(() => {
          onFacturacionCompleta({
            pago: response.data,
            orden: ordenPreseleccionada
          })
          handleCerrar()
        }, 1500)
      }
    } catch (error) {
      console.error('Error al procesar pago:', error)
      setError(`Error al registrar el pago: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cerrar diálogo
   */
  const handleCerrar = () => {
    setDatosPago({
      monto: '',
      metodo: 'EFECTIVO',
      referencia: '',
      observaciones: ''
    })
    setError(null)
    setSuccess(null)
    setLoading(false)
    onClose()
  }

  /**
   * Formatear moneda
   */
  const formatearMoneda = (monto) => {
    if (!monto) return 'S/ 0.00'
    return `S/ ${parseFloat(monto).toFixed(2)}`
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleCerrar}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <ReceiptIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6">
            Facturar Orden #{ordenPreseleccionada?.numeroOrden}
          </Typography>
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

        {ordenPreseleccionada && (
          <Grid container spacing={3}>
            {/* Información de la orden */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <BikeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Información de la Orden
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Número:</strong> #{ordenPreseleccionada.numeroOrden}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Estado:</strong> {ordenPreseleccionada.estado}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Cliente:</strong> {ordenPreseleccionada.cliente?.nombres} {ordenPreseleccionada.cliente?.apellidos}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Moto:</strong> {ordenPreseleccionada.moto?.marca} {ordenPreseleccionada.moto?.modelo}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Total:</strong> {formatearMoneda(ordenPreseleccionada.totalOrden)}
                  </Typography>
                  {ordenPreseleccionada.totalPagado > 0 && (
                    <Typography variant="body2" gutterBottom color="success.main">
                      <strong>Ya pagado:</strong> {formatearMoneda(ordenPreseleccionada.totalPagado)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Formulario de pago */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Registrar Pago
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Monto a Pagar"
                        type="number"
                        value={datosPago.monto}
                        onChange={(e) => setDatosPago(prev => ({ ...prev, monto: e.target.value }))}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">S/</InputAdornment>
                        }}
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Método de Pago</InputLabel>
                        <Select
                          value={datosPago.metodo}
                          onChange={(e) => setDatosPago(prev => ({ ...prev, metodo: e.target.value }))}
                          disabled={loading}
                        >
                          {metodosPago.map(metodo => (
                            <MenuItem key={metodo.value} value={metodo.value}>
                              {metodo.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Referencia (Opcional)"
                        value={datosPago.referencia}
                        onChange={(e) => setDatosPago(prev => ({ ...prev, referencia: e.target.value }))}
                        placeholder="Número de voucher, operación, etc."
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Observaciones (Opcional)"
                        multiline
                        rows={2}
                        value={datosPago.observaciones}
                        onChange={(e) => setDatosPago(prev => ({ ...prev, observaciones: e.target.value }))}
                        disabled={loading}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={handleCerrar}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={procesarPago}
          disabled={loading || !datosPago.monto || !datosPago.metodo}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
        >
          {loading ? 'Procesando...' : 'Registrar Pago'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FacturacionDialogSimple
