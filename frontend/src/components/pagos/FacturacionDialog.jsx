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
  InputAdornment,
  Chip
} from '@mui/material'
import {
  Receipt as ReceiptIcon,
  DirectionsBike as BikeIcon,
  Person as PersonIcon,
  Money as MoneyIcon
} from '@mui/icons-material'

// Importar servicios
import pagoService from '../../services/pagoService'
import detalleOrdenService from '../../services/detalleOrdenService'
import usoRepuestoService from '../../services/usoRepuestoService'

/**
 * Diálogo de facturación simplificado para órdenes completadas
 * 
 * FUNCIONALIDADES:
 * - Facturación de órdenes COMPLETADAS
 * - Uso del total de orden directamente 
 * - Registro de pago TOTAL únicamente
 * - Validación de montos
 */
const FacturacionDialog = ({
  open,
  onClose,
  onFacturacionCompleta,
  ordenPreseleccionada = null
}) => {
  const { user } = useSelector((state) => state.auth)

  // Estados del proceso
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Estados de la orden
  const [ordenCompleta, setOrdenCompleta] = useState(null)
  const [pagosExistentes, setPagosExistentes] = useState([])
  const [totalPagado, setTotalPagado] = useState(0)
  const [servicios, setServicios] = useState([])
  const [repuestos, setRepuestos] = useState([])
  const [totalesCalculados, setTotalesCalculados] = useState({
    servicios: 0,
    repuestos: 0,
    total: 0
  })

  // Estados del pago
  const [datosPago, setDatosPago] = useState({
    monto: '',
    metodo: 'EFECTIVO',
    referencia: '',
    observaciones: ''
  })

  // Métodos de pago disponibles
  const metodosPago = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TARJETA', label: 'Tarjeta de Crédito/Débito' },
    { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
    { value: 'YAPE', label: 'Yape' },
    { value: 'PLIN', label: 'Plin' }
  ]

  /**
   * Efecto para cargar datos cuando se abre el diálogo
   */
  useEffect(() => {
    if (open && ordenPreseleccionada) {
      inicializarFacturacion(ordenPreseleccionada)
    }
  }, [open, ordenPreseleccionada])

  /**
   * Efecto para limpiar estados cuando se cierra
   */
  useEffect(() => {
    if (!open) {
      limpiarEstados()
    }
  }, [open])

  /**
   * Efecto para actualizar automáticamente el monto cuando cambien los totales
   */
  useEffect(() => {
    if (ordenCompleta) {
      // Usar el total calculado de servicios + repuestos, o como fallback el totalOrden
      const totalOrden = totalesCalculados.total > 0 ? 
        totalesCalculados.total : 
        parseFloat(ordenCompleta.totalOrden || 0)
        
      const montoPendiente = totalOrden - totalPagado
      
      setDatosPago(prev => ({
        ...prev,
        monto: montoPendiente > 0 ? montoPendiente.toFixed(2) : '0.00'
      }))
    }
  }, [totalesCalculados, totalPagado, ordenCompleta])

  /**
   * Inicializar proceso de facturación
   */
  const inicializarFacturacion = async (orden) => {
    try {
      setLoading(true)
      setError(null)
      setOrdenCompleta(orden)

      console.log('🔄 Inicializando facturación para orden:', orden.numeroOrden)

      // Cargar datos en paralelo
      await Promise.all([
        cargarPagosExistentes(orden.idOrden),
        cargarServiciosYRepuestos(orden.idOrden)
      ])

    } catch (error) {
      console.error('❌ Error al inicializar facturación:', error)
      setError('Error al cargar los datos de la orden')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cargar servicios y repuestos de la orden
   */
  const cargarServiciosYRepuestos = async (idOrden) => {
    try {
      console.log('🔄 Cargando servicios y repuestos para orden:', idOrden)
      
      // Cargar servicios
      let serviciosCargados = []
      try {
        const serviciosResponse = await detalleOrdenService.buscarPorOrden(idOrden)
        if (serviciosResponse.success && serviciosResponse.data) {
          serviciosCargados = serviciosResponse.data
        }
        console.log('✅ Servicios cargados:', serviciosCargados.length)
      } catch (error) {
        console.warn('⚠️ Error al cargar servicios:', error)
      }
      
      // Cargar repuestos
      let repuestosCargados = []
      try {
        const repuestosResponse = await usoRepuestoService.buscarPorOrden(idOrden)
        if (repuestosResponse.success && repuestosResponse.data) {
          repuestosCargados = repuestosResponse.data
        }
        console.log('✅ Repuestos cargados:', repuestosCargados.length)
      } catch (error) {
        console.warn('⚠️ Error al cargar repuestos:', error)
      }

      // Actualizar estados
      setServicios(serviciosCargados)
      setRepuestos(repuestosCargados)

      // Calcular totales
      const totalServicios = serviciosCargados.reduce((total, servicio) => {
        const precio = parseFloat(servicio.precioAplicado || servicio.precio || 0)
        const cantidad = parseInt(servicio.cantidad || 1)
        return total + (precio * cantidad)
      }, 0)

      const totalRepuestos = repuestosCargados.reduce((total, repuesto) => {
        const precio = parseFloat(repuesto.precioUnitario || repuesto.precio || 0)
        const cantidad = parseInt(repuesto.cantidad || 1)
        return total + (precio * cantidad)
      }, 0)

      const totalCalculado = totalServicios + totalRepuestos

      setTotalesCalculados({
        servicios: totalServicios,
        repuestos: totalRepuestos,
        total: totalCalculado
      })

      console.log('💰 Totales calculados')

    } catch (error) {
      console.error('❌ Error al cargar servicios y repuestos:', error)
    }
  }

  /**
   * Cargar pagos existentes de la orden
   */
  const cargarPagosExistentes = async (idOrden) => {
    try {
      const response = await pagoService.buscarPorOrdenSafe(idOrden)
      const pagos = response.data || []
      setPagosExistentes(pagos)

      const totalPagadoCalculado = pagos.reduce((total, pago) => 
        total + parseFloat(pago.monto || 0), 0
      )
      setTotalPagado(totalPagadoCalculado)

      console.log(`💳 Pagos existentes: ${pagos.length}, Total pagado: S/ ${totalPagadoCalculado}`)

    } catch (error) {
      console.error('❌ Error al cargar pagos existentes:', error)
      setPagosExistentes([])
      setTotalPagado(0)
    }
  }

  /**
   * Limpiar estados del diálogo
   */
  const limpiarEstados = () => {
    setOrdenCompleta(null)
    setPagosExistentes([])
    setTotalPagado(0)
    setServicios([])
    setRepuestos([])
    setTotalesCalculados({
      servicios: 0,
      repuestos: 0,
      total: 0
    })
    setDatosPago({
      monto: '',
      metodo: 'EFECTIVO',
      referencia: '',
      observaciones: ''
    })
    setError(null)
    setSuccess(false)
    setSuccessMessage('')
    setLoading(false)
  }

  /**
   * Procesar pago
   */
  const procesarPago = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 Iniciando procesamiento de pago...')

      // Validaciones
      const monto = parseFloat(datosPago.monto || 0)
      if (monto <= 0) {
        throw new Error('El monto debe ser mayor a 0')
      }

      if (!datosPago.metodo) {
        throw new Error('Debe seleccionar un método de pago')
      }

      // Usar la misma lógica de cálculo que en la interfaz
      const totalOrden = totalesCalculados.total > 0 ? 
        totalesCalculados.total : 
        parseFloat(ordenCompleta.totalOrden || 0)
      const montoPendiente = totalOrden - totalPagado

      console.log('🔍 Validando montos')

      // Validación adicional: verificar que los totales sean consistentes
      if (totalOrden <= 0) {
        throw new Error('El total de la orden debe ser mayor a 0. Verifique que la orden tenga servicios o repuestos.')
      }

      if (montoPendiente <= 0) {
        throw new Error('No hay monto pendiente para esta orden.')
      }

      if (monto > montoPendiente) {
        throw new Error(`El monto no puede ser mayor al pendiente (S/ ${montoPendiente.toFixed(2)})`)
      }

      if (Math.abs(monto - montoPendiente) > 0.01) {
        throw new Error(`El monto debe ser exactamente el pendiente (S/ ${montoPendiente.toFixed(2)})`)
      }

      // Crear objeto de pago
      const nuevoPago = {
        ordenTrabajo: {
          idOrden: ordenCompleta.idOrden
        },
        monto: monto,
        metodo: datosPago.metodo,
        referencia: datosPago.referencia || null,
        observaciones: datosPago.observaciones || null,
        fechaPago: new Date().toISOString(),
        usuario: {
          idUsuario: user.idUsuario
        }
      }

      console.log('💳 Creando pago con método:', datosPago.metodo)

      // Crear el pago
      const response = await pagoService.crear(nuevoPago)
      
      if (response.success || response.data) {
        console.log('✅ Pago creado exitosamente')
        setSuccess(true)
        setSuccessMessage('Pago registrado correctamente')
        
        // Notificar al componente padre
        setTimeout(() => {
          onFacturacionCompleta({
            pago: response.data,
            orden: ordenCompleta
          })
          onClose()
        }, 1500)
      } else {
        throw new Error('Error al crear el pago')
      }

    } catch (error) {
      console.error('❌ Error al procesar pago:', error)
      setError(error.message || 'Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calcular datos financieros
   */
  const calcularDatosFinancieros = () => {
    // Usar el total calculado de servicios + repuestos, o como fallback el totalOrden
    const totalOrden = totalesCalculados.total > 0 ? 
      totalesCalculados.total : 
      parseFloat(ordenCompleta?.totalOrden || 0)
      
    const pendiente = totalOrden - totalPagado
    const montoAPagar = parseFloat(datosPago.monto || 0)
    
    return {
      totalOrden,
      totalPagado,
      pendiente,
      montoAPagar,
      nuevoSaldo: pendiente - montoAPagar,
      totalServicios: totalesCalculados.servicios,
      totalRepuestos: totalesCalculados.repuestos
    }
  }

  // Si no hay orden, no mostrar nada
  if (!open || !ordenCompleta) {
    return null
  }

  const datosFinancieros = calcularDatosFinancieros()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <ReceiptIcon sx={{ mr: 2 }} />
          Facturación de Orden #{ordenCompleta.numeroOrden}
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {!loading && (
          <Grid container spacing={3}>
            {/* Información de la orden */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <BikeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Información de la Orden
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Cliente:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                    {ordenCompleta.cliente?.nombres} {ordenCompleta.cliente?.apellidos}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Moto:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {ordenCompleta.moto?.marca} {ordenCompleta.moto?.modelo}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Estado:
                  </Typography>
                  <Chip 
                    label={ordenCompleta.estado} 
                    color="success" 
                    size="small"
                    sx={{ mb: 2 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Resumen financiero */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Resumen Financiero
                  </Typography>

                  {/* Detalle de servicios */}
                  <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                    Servicios ({servicios.length})
                  </Typography>
                  {servicios.length > 0 ? (
                    servicios.map((servicio, index) => (
                      <Box key={index} display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {servicio.servicio?.nombre || `Servicio ${index + 1}`} x{servicio.cantidad}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          S/ {((servicio.precioAplicado || servicio.precio || 0) * (servicio.cantidad || 1)).toFixed(2)}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      No hay servicios registrados
                    </Typography>
                  )}

                  {/* Detalle de repuestos */}
                  <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                    Repuestos ({repuestos.length})
                  </Typography>
                  {repuestos.length > 0 ? (
                    repuestos.map((repuesto, index) => (
                      <Box key={index} display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {repuesto.repuesto?.nombre || `Repuesto ${index + 1}`} x{repuesto.cantidad}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          S/ {((repuesto.precioUnitario || repuesto.precio || 0) * (repuesto.cantidad || 1)).toFixed(2)}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      No hay repuestos registrados
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Totales */}
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Servicios:</Typography>
                    <Typography variant="body1">
                      S/ {datosFinancieros.totalServicios.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Repuestos:</Typography>
                    <Typography variant="body1">
                      S/ {datosFinancieros.totalRepuestos.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1" fontWeight="bold">Total Orden:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      S/ {datosFinancieros.totalOrden.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Ya Pagado:</Typography>
                    <Typography variant="body1" color="success.main">
                      S/ {datosFinancieros.totalPagado.toFixed(2)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body1" fontWeight="bold">Pendiente:</Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold"
                      color={datosFinancieros.pendiente > 0 ? "warning.main" : "success.main"}
                    >
                      S/ {datosFinancieros.pendiente.toFixed(2)}
                    </Typography>
                  </Box>

                  {/* Pagos registrados */}
                  {pagosExistentes.length > 0 && (
                    <>
                      <Typography variant="subtitle2" color="success.main" gutterBottom>
                        Pagos Registrados ({pagosExistentes.length})
                      </Typography>
                      {pagosExistentes.map((pago, index) => (
                        <Box key={index} display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                            {pago.metodo} - {new Date(pago.fechaPago).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }} color="success.main">
                            S/ {parseFloat(pago.monto || 0).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Formulario de pago */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Registrar Pago
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Monto a Pagar"
                        type="number"
                        value={datosPago.monto}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                          readOnly: true
                        }}
                        helperText="Pago total completo (no se permiten pagos parciales)"
                        sx={{
                          '& .MuiInputBase-input': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            fontWeight: 'bold',
                            color: 'warning.main'
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Método de Pago</InputLabel>
                        <Select
                          value={datosPago.metodo}
                          label="Método de Pago"
                          onChange={(e) => setDatosPago(prev => ({
                            ...prev,
                            metodo: e.target.value
                          }))}
                        >
                          {metodosPago.map((metodo) => (
                            <MenuItem key={metodo.value} value={metodo.value}>
                              {metodo.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Referencia (Opcional)"
                        value={datosPago.referencia}
                        onChange={(e) => setDatosPago(prev => ({
                          ...prev,
                          referencia: e.target.value
                        }))}
                        helperText="Número de operación, voucher, etc."
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Observaciones (Opcional)"
                        value={datosPago.observaciones}
                        onChange={(e) => setDatosPago(prev => ({
                          ...prev,
                          observaciones: e.target.value
                        }))}
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
        <Button onClick={onClose} disabled={Boolean(loading)}>
          Cancelar
        </Button>
        <Button 
          onClick={procesarPago} 
          variant="contained" 
          disabled={Boolean(loading) || Boolean(success) || (datosFinancieros.pendiente <= 0)}
          startIcon={loading ? <CircularProgress size={20} /> : <MoneyIcon />}
        >
          {success ? 'Completado' : 
           datosFinancieros.pendiente <= 0 ? 'Sin Monto Pendiente' :
           `Registrar Pago Total (S/ ${datosFinancieros.pendiente.toFixed(2)})`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FacturacionDialog
