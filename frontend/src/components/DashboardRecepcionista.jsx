import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  LinearProgress,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Button
} from '@mui/material'
import {
  DirectionsBike as BikeIcon,
  Assignment as OrderIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  Schedule as TimeIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  BuildCircle as ServiceIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'

// Servicio
import dashboardRecepcionistaService from '../services/dashboardRecepcionistaService'

/**
 * Dashboard Específico para Perfil RECEPCIONISTA
 * Muestra información relevante para la gestión de recepción
 * SIN BOTONES NI ACCIONES - Solo información
 */
const DashboardRecepcionista = ({ usuario }) => {
  // Estados para los datos del dashboard
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataDashboard, setDataDashboard] = useState({
    estadisticasOrdenes: {},
    ordenesRecientes: [],
    resumenClientes: {},
    motosRecientes: [],
    resumenPagos: {},
    serviciosPopulares: [],
    resumenProductividad: {}
  })

  // Extraer solo el primer nombre del nombreCompleto
  const obtenerPrimerNombre = (nombreCompleto) => {
    if (!nombreCompleto) return 'Usuario'
    return nombreCompleto.split(' ')[0]
  }

  useEffect(() => {
    cargarDatosDelDashboard()
  }, [])

  const cargarDatosDelDashboard = async () => {
    try {
      setLoading(true)
      setError(null)

      const datos = await dashboardRecepcionistaService.obtenerResumenRecepcionista()
      setDataDashboard(datos)
    } catch (error) {
      console.error('Error al cargar dashboard de recepcionista:', error)
      
      // Determinar el tipo de error y mostrar mensaje apropiado
      let mensajeError = 'No se pudieron cargar algunos datos del dashboard.'
      
      if (error.message?.includes('token') || error.message?.includes('autenticado')) {
        mensajeError = 'Sesión expirada. Por favor, inicie sesión nuevamente.'
      } else if (error.response?.status === 403) {
        mensajeError = 'Algunos datos no están disponibles debido a permisos. Contacte al administrador.'
      } else if (error.response?.status >= 500) {
        mensajeError = 'Error del servidor. Intente nuevamente en unos momentos.'
      }
      
      setError(mensajeError)
      
      // Mantener datos básicos en caso de error
      setDataDashboard({
        estadisticasOrdenes: { total: 0, nuevasHoy: 0, estaSemana: 0, esteMes: 0, porEstado: {}, facturadas: 0, porFacturar: 0 },
        ordenesRecientes: [],
        resumenClientes: { total: 0, nuevosEsteMes: 0, clientesFrecuentes: [], clientesRecientes: [] },
        motosRecientes: [],
        resumenPagos: { totalPagos: 0, pagosEsteMes: 0, pagosEstaSemana: 0, montoTotalMes: 0, montoTotalSemana: 0, pagosPendientes: 0, metodoPagoMasUsado: 'EFECTIVO', pagosRecientes: [] },
        serviciosPopulares: [],
        resumenProductividad: { ordenesRegistradas: 0, clientesRegistrados: 0, pagosRecaudados: 0, promedioOrdenesXDia: 0, tiempoPromedioAtencion: 0 }
      })
    } finally {
      setLoading(false)
    }
  }

  // Determinar color de estado de orden
  const getColorEstado = (estado) => {
    switch (estado) {
      case 'RECIBIDA': return 'info'
      case 'EN_PROCESO': return 'warning'
      case 'DIAGNOSTICADA': return 'primary'
      case 'COMPLETADA': return 'success'
      case 'ENTREGADA': return 'success'
      default: return 'default'
    }
  }

  // Formatear moneda
  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(monto || 0)
  }

  if (loading) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          ¡Bienvenida, {obtenerPrimerNombre(usuario?.nombreCompleto)}!
        </Typography>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando información de recepción...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          ¡Bienvenida, {obtenerPrimerNombre(usuario?.nombreCompleto)}!
        </Typography>
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={cargarDatosDelDashboard}
              startIcon={<RefreshIcon />}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
        {/* Mostrar dashboard básico incluso con errores */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Dashboard de Recepcionista
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Algunos datos no están disponibles temporalmente. 
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Esto puede deberse a permisos o problemas de conexión. 
                  Haga clic en "Reintentar" para intentar cargar los datos nuevamente.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box p={3}>
      {/* Encabezado del Dashboard */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" gutterBottom>
              ¡Bienvenida, {obtenerPrimerNombre(usuario?.nombreCompleto)}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Panel de control de recepción para {usuario?.nombreCompleto || 'Usuario'} - Recepcionista
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Actualizar datos">
              <IconButton onClick={cargarDatosDelDashboard} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Resumen Ejecutivo del Día */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  📊 Resumen de Trabajo del Mes
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h3" color="primary.main">
                      {dataDashboard.estadisticasOrdenes.esteMes || 0}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Órdenes Registradas
                    </Typography>
                    <Chip 
                      label={`${dataDashboard.estadisticasOrdenes.nuevasHoy || 0} hoy`}
                      size="small"
                      color="info"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h3" color="success.main">
                      {dataDashboard.resumenClientes.nuevosEsteMes || 0}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Clientes Nuevos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h3" color="info.main">
                      {dataDashboard.resumenPagos.pagosEsteMes || 0}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Pagos Recaudados
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h3" color="warning.main">
                      {Math.round((dataDashboard.estadisticasOrdenes.esteMes || 0) / 30 * 10) / 10}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Órdenes/Día (Promedio)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Fila 1: Órdenes y Pagos */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <OrderIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  📋 Órdenes de Trabajo
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="primary.main">
                      {dataDashboard.estadisticasOrdenes.nuevasHoy || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hoy
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="success.main">
                      {dataDashboard.estadisticasOrdenes.estaSemana || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Esta Semana
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Por Estado:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(dataDashboard.estadisticasOrdenes?.porEstado || {})
                  .filter(([estado]) => estado !== 'CANCELADA')
                  .map(([estado, cantidad]) => (
                  <Box key={estado} display="flex" justifyContent="space-between" alignItems="center">
                    <Chip 
                      label={estado} 
                      color={getColorEstado(estado)}
                      size="small"
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {cantidad || 0}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PaymentIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  💰 Resumen de Pagos
                </Typography>
              </Box>
              <Box textAlign="center" sx={{ mb: 2 }}>
                <Typography variant="h4" color="success.main">
                  {formatearMoneda(dataDashboard.resumenPagos.montoTotalMes)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recaudado Este Mes
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h5" color="info.main">
                      {dataDashboard.resumenPagos.pagosEsteMes || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pagos del Mes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h5" color="warning.main">
                      {dataDashboard.resumenPagos.pagosPendientes || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pendientes
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary" align="center">
                Método más usado: <strong>{dataDashboard.resumenPagos?.metodoPagoMasUsado || 'N/A'}</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Fila 2: Clientes y Facturación */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  👥 Clientes
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="info.main">
                      {dataDashboard.resumenClientes.total || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="success.main">
                      {dataDashboard.resumenClientes.nuevosEsteMes || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nuevos (Mes)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Clientes Frecuentes:
              </Typography>
              <List dense>
                {(dataDashboard.resumenClientes?.clientesFrecuentes || []).slice(0, 3).map((cliente, index) => (
                  <ListItem key={cliente.idCliente || cliente.id || index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {(cliente.nombreCompleto || cliente.nombre)?.[0] || 'C'}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={cliente.nombreCompleto || cliente.nombre || 'Cliente'}
                      secondary={`${cliente.totalOrdenes || 0} órdenes`}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
                {(!dataDashboard.resumenClientes?.clientesFrecuentes || dataDashboard.resumenClientes.clientesFrecuentes.length === 0) && (
                  <ListItem>
                    <ListItemText
                      primary="No hay clientes disponibles"
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontStyle: 'italic' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MoneyIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  🧾 Estado de Facturación
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="success.main">
                      {dataDashboard.estadisticasOrdenes.facturadas || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Órdenes Facturadas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="warning.main">
                      {dataDashboard.estadisticasOrdenes.porFacturar || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Listas para Facturar
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Servicios Populares:
              </Typography>
              <List dense>
                {(dataDashboard.serviciosPopulares || []).slice(0, 3).map((servicio, index) => (
                  <ListItem key={servicio.idServicio || servicio.id || index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Chip 
                        label={servicio.frecuencia || 0} 
                        color="primary" 
                        size="small"
                        sx={{ width: 40, height: 20 }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={servicio.nombre || 'Servicio'}
                      secondary={formatearMoneda(servicio.precio || 0)}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
                {(!dataDashboard.serviciosPopulares || dataDashboard.serviciosPopulares.length === 0) && (
                  <ListItem>
                    <ListItemText
                      primary="No hay servicios disponibles"
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontStyle: 'italic' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Fila 3: Información Detallada */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TimeIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  🕐 Órdenes Recientes
                </Typography>
              </Box>
              <List dense>
                {(dataDashboard.ordenesRecientes || []).slice(0, 6).map((orden, index) => (
                  <ListItem key={orden.id || orden.numeroOrden || index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Chip 
                        label={orden.estado || 'N/A'} 
                        color={getColorEstado(orden.estado)}
                        size="small"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Orden #${orden.numeroOrden || orden.id || 'N/A'} - ${orden.descripcion || orden.observaciones || 'Sin descripción'}`}
                      secondary={`${orden.diasTranscurridos || 0} días transcurridos`}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
                {(!dataDashboard.ordenesRecientes || dataDashboard.ordenesRecientes.length === 0) && (
                  <ListItem>
                    <ListItemText
                      primary="No hay órdenes recientes disponibles"
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontStyle: 'italic' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BikeIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  🏍️ Motos Recientes
                </Typography>
              </Box>
              <List dense>
                {(dataDashboard.motosRecientes || []).slice(0, 5).map((moto, index) => (
                  <ListItem key={moto.id || moto.idMoto || index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                        {moto.marca?.[0] || 'M'}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={`${moto.marca || 'Marca'} ${moto.modelo || 'Modelo'}`}
                      secondary={`Placa: ${moto.placa || 'N/A'} - ${moto.diasRegistrada || 0} días`}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
                {(!dataDashboard.motosRecientes || dataDashboard.motosRecientes.length === 0) && (
                  <ListItem>
                    <ListItemText
                      primary="No hay motos recientes disponibles"
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontStyle: 'italic' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardRecepcionista
