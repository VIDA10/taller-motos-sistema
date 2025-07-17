import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  DirectionsBike as BikeIcon,
  Money as MoneyIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon
} from '@mui/icons-material'

// Importar servicios
import pagoService from '../../services/pagoService'
import ordenService from '../../services/ordenService'
import clienteService from '../../services/clienteService'

/**
 * Componente para mostrar detalles completos de un pago (solo lectura)
 * 
 * FUNCIONALIDADES:
 * - Vista detallada del pago actual
 * - Información de la orden asociada (con datos del cliente)
 * - Historial de pagos de la orden específica (no todos los pagos)
 * - Estado de pago de la orden
 * 
 * NOTA: Los pagos completados no pueden editarse
 * por razones de integridad de datos contables.
 * 
 * PERMISOS: Solo ADMIN y RECEPCIONISTA
 */
const PagoDetail = ({
  open,
  onClose,
  pago
}) => {
  // Estados del componente
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ordenCompleta, setOrdenCompleta] = useState(null)
  const [clienteInfo, setClienteInfo] = useState(null)
  const [pagosTotales, setPagosTotales] = useState([])
  const [totalPagado, setTotalPagado] = useState(0)

  /**
   * Cargar información completa cuando se abre el diálogo
   */
  useEffect(() => {
    if (open && pago) {
      cargarInformacionCompleta()
    }
  }, [open, pago])

  /**
   * Cargar información completa del pago y orden
   */
  const cargarInformacionCompleta = async () => {
    try {
      setLoading(true)
      setError(null)

      // Cargar información completa de la orden
      if (pago.ordenTrabajo?.idOrden) {
        const ordenResponse = await ordenService.obtenerPorId(pago.ordenTrabajo.idOrden)
        if (ordenResponse.success && ordenResponse.data) {
          console.log('📋 Orden cargada:', ordenResponse.data)
          console.log('👤 Cliente en la orden:', ordenResponse.data.cliente)
          setOrdenCompleta(ordenResponse.data)
          
          // Determinar si necesitamos cargar información del cliente por separado
          const clienteOrden = ordenResponse.data.cliente;
          const tieneNombreCompleto = clienteOrden?.nombres && clienteOrden?.apellidos;
          const tieneNombreCompuesto = clienteOrden?.nombreCompleto;
          
          if (!tieneNombreCompleto && !tieneNombreCompuesto) {
            console.log('🔍 Cargando información del cliente por separado...')
            const idClienteBuscar = ordenResponse.data.idCliente || clienteOrden?.idCliente;
            
            if (idClienteBuscar) {
              try {
                const clienteData = await clienteService.getById(idClienteBuscar)
                if (clienteData) {
                  console.log('👤 Cliente cargado separadamente:', clienteData)
                  setClienteInfo(clienteData)
                } else {
                  console.error('❌ No se encontró el cliente')
                }
              } catch (clienteError) {
                console.error('❌ Error al cargar cliente:', clienteError)
              }
            } else {
              console.warn('⚠️ No se encontró ID de cliente para cargar')
            }
          } else {
            console.log('✅ Información del cliente ya disponible en la orden')
          }
        } else {
          console.error('❌ Error al cargar orden:', ordenResponse)
        }

        // Cargar todos los pagos de esta orden específica
        const pagosResponse = await pagoService.buscarPorOrdenSafe(pago.ordenTrabajo.idOrden)
        if (pagosResponse.data && Array.isArray(pagosResponse.data)) {
          console.log('💳 Pagos de la orden cargados:', pagosResponse.data.length)
          setPagosTotales(pagosResponse.data)
          
          // Calcular total pagado a partir de los pagos obtenidos
          const totalCalculado = pagosResponse.data.reduce((sum, p) => sum + parseFloat(p.monto || 0), 0)
          setTotalPagado(totalCalculado)
        } else {
          console.log('⚠️ No se encontraron pagos para la orden')
          setPagosTotales([])
          setTotalPagado(0)
        }
      }
    } catch (error) {
      console.error('Error al cargar información completa:', error)
      setError('Error al cargar la información del pago')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Formatear fecha para mostrar
   */
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada'
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Formatear moneda
   */
  const formatearMoneda = (monto) => {
    if (!monto) return 'S/ 0.00'
    return `S/ ${parseFloat(monto).toFixed(2)}`
  }

  /**
   * Obtener color del chip según método de pago
   */
  const obtenerColorMetodo = (metodo) => {
    const colores = {
      'EFECTIVO': 'success',
      'TARJETA': 'primary',
      'TRANSFERENCIA': 'secondary'
    }
    return colores[metodo] || 'default'
  }

  /**
   * Obtener icono según método de pago
   */
  const obtenerIconoMetodo = (metodo) => {
    switch (metodo) {
      case 'EFECTIVO':
        return '💵'
      case 'TARJETA':
        return '💳'
      case 'TRANSFERENCIA':
        return '🏦'
      default:
        return '💰'
    }
  }

  /**
   * Calcular estado de pago de la orden
   */
  const calcularEstadoPago = () => {
    if (!ordenCompleta) return { estado: 'DESCONOCIDO', color: 'default' }

    const totalOrden = parseFloat(ordenCompleta.totalOrden || 0)
    const diferencia = totalOrden - totalPagado

    if (diferencia <= 0) {
      return { estado: 'PAGADO', color: 'success' }
    } else if (totalPagado > 0) {
      return { estado: 'PARCIAL', color: 'warning' }
    } else {
      return { estado: 'PENDIENTE', color: 'error' }
    }
  }

  const estadoPago = calcularEstadoPago()

  if (!pago) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <ReceiptIcon sx={{ mr: 2 }} />
            Detalle del Pago #{pago.idPago}
          </Box>
          <Chip
            label={`${obtenerIconoMetodo(pago.metodo)} ${pago.metodo}`}
            color={obtenerColorMetodo(pago.metodo)}
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Grid container spacing={3}>
            {/* Información del Pago */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Información del Pago
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        ID Pago
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        #{pago.idPago}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Monto
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatearMoneda(pago.monto)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de Pago
                      </Typography>
                      <Typography variant="body1">
                        {formatearFecha(pago.fechaPago)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Método
                      </Typography>
                      <Typography variant="body1">
                        {obtenerIconoMetodo(pago.metodo)} {pago.metodo}
                      </Typography>
                    </Grid>
                    
                    {pago.referencia && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Referencia
                        </Typography>
                        <Typography variant="body1">
                          {pago.referencia}
                        </Typography>
                      </Grid>
                    )}
                    
                    {pago.observaciones && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Observaciones
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {pago.observaciones}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Información de la Orden */}
            {ordenCompleta && (
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Orden de Trabajo
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Número
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          #{ordenCompleta.numeroOrden}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Estado
                        </Typography>
                        <Chip
                          label={ordenCompleta.estado}
                          size="small"
                          color="primary"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Cliente
                        </Typography>
                        <Typography variant="body1">
                          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                          {(() => {
                            // Priorizar información del cliente desde la orden
                            const clienteOrden = ordenCompleta.cliente;
                            if (clienteOrden?.nombres && clienteOrden?.apellidos) {
                              return `${clienteOrden.nombres} ${clienteOrden.apellidos}`;
                            }
                            if (clienteOrden?.nombreCompleto) {
                              return clienteOrden.nombreCompleto;
                            }
                            
                            // Usar información del cliente cargada por separado
                            if (clienteInfo?.nombres && clienteInfo?.apellidos) {
                              return `${clienteInfo.nombres} ${clienteInfo.apellidos}`;
                            }
                            if (clienteInfo?.nombreCompleto) {
                              return clienteInfo.nombreCompleto;
                            }
                            
                            return 'Cliente no especificado';
                          })()}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Moto
                        </Typography>
                        <Typography variant="body1">
                          <BikeIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                          {ordenCompleta.moto?.marca} {ordenCompleta.moto?.modelo} - {ordenCompleta.moto?.placa}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Total Orden
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {formatearMoneda(ordenCompleta.totalOrden)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Estado de Pago
                        </Typography>
                        <Chip
                          label={estadoPago.estado}
                          color={estadoPago.color}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Resumen de Pagos de la Orden */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Historial de Pagos de la Orden
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box textAlign="center" p={2} bgcolor="background.default" borderRadius={1}>
                        <Typography variant="body2" color="text.secondary">
                          Total de la Orden
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {formatearMoneda(ordenCompleta?.totalOrden)}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box textAlign="center" p={2} bgcolor="background.default" borderRadius={1}>
                        <Typography variant="body2" color="text.secondary">
                          Total Pagado
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {formatearMoneda(totalPagado)}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box textAlign="center" p={2} bgcolor="background.default" borderRadius={1}>
                        <Typography variant="body2" color="text.secondary">
                          Saldo Pendiente
                        </Typography>
                        <Typography variant="h6" color={estadoPago.estado === 'PAGADO' ? 'success.main' : 'error.main'}>
                          {formatearMoneda(Math.max(0, (ordenCompleta?.totalOrden || 0) - totalPagado))}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {pagosTotales.length > 0 && (
                    <Box mt={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Detalle de Pagos ({pagosTotales.length})
                      </Typography>
                      {pagosTotales.map((pagoItem, index) => (
                        <Box key={pagoItem.idPago} mb={1}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" p={1}
                               bgcolor={pagoItem.idPago === pago.idPago ? 'primary.light' : 'background.paper'}
                               borderRadius={1}
                               border={pagoItem.idPago === pago.idPago ? 2 : 1}
                               borderColor={pagoItem.idPago === pago.idPago ? 'primary.main' : 'divider'}>
                            <Box>
                              <Typography variant="body2">
                                {pagoItem.idPago === pago.idPago ? '➤ ' : ''}
                                Pago #{pagoItem.idPago} - {obtenerIconoMetodo(pagoItem.metodo)} {pagoItem.metodo}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatearFecha(pagoItem.fechaPago)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {formatearMoneda(pagoItem.monto)}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PagoDetail
