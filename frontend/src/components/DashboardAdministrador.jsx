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
  AdminPanelSettings as AdminIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Assignment as OrderIcon,
  Inventory as InventoryIcon,
  DirectionsBike as BikeIcon,
  Security as SecurityIcon,
  Assessment as ReportIcon,
  BuildCircle as ServiceIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material'

// Servicio
import dashboardAdministradorService from '../services/dashboardAdministradorService'

/**
 * Dashboard Específico para Perfil ADMINISTRADOR
 * Muestra resumen global del sistema y métricas de negocio
 * SIN BOTONES NI ACCIONES - Solo información ejecutiva
 */
const DashboardAdministrador = ({ usuario }) => {
  // Estados para los datos del dashboard
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataDashboard, setDataDashboard] = useState({
    estadisticasGenerales: {},
    resumenFinanciero: {},
    resumenUsuarios: {},
    estadoInventario: {},
    productividadTaller: {},
    serviciosPopulares: [],
    tendenciasOperativas: {}
  })

  // Extraer solo el primer nombre del nombreCompleto
  const obtenerPrimerNombre = (nombreCompleto) => {
    if (!nombreCompleto) return 'Administrador'
    return nombreCompleto.split(' ')[0]
  }

  useEffect(() => {
    cargarDatosDelDashboard()
  }, [])

  const cargarDatosDelDashboard = async () => {
    try {
      setLoading(true)
      setError(null)

      const datos = await dashboardAdministradorService.obtenerResumenAdministrador()
      setDataDashboard(datos)
    } catch (error) {
      console.error('Error al cargar dashboard de administrador:', error)
      
      let mensajeError = 'No se pudieron cargar algunos datos del dashboard.'
      
      if (error.response?.status === 403) {
        mensajeError = 'Algunos datos no están disponibles debido a permisos.'
      } else if (error.response?.status >= 500) {
        mensajeError = 'Error del servidor. Intente nuevamente en unos momentos.'
      }
      
      setError(mensajeError)
      
      // Mantener datos básicos en caso de error
      setDataDashboard({
        estadisticasGenerales: { totalOrdenes: 0, totalClientes: 0, totalMotos: 0, totalUsuarios: 0, nuevasHoy: 0 },
        resumenFinanciero: { totalRecaudado: 0, recaudadoMes: 0, pagosPendientes: 0, promedioFactura: 0 },
        resumenUsuarios: { totalUsuarios: 0, admins: 0, recepcionistas: 0, mecanicos: 0, usuariosActivos: 0 },
        estadoInventario: { totalRepuestos: 0, stockBajo: 0, valorInventario: 0, categorias: [] },
        productividadTaller: { ordenesCompletadas: 0, tiempoPromedio: 0, eficienciaMecanicos: 0 },
        serviciosPopulares: [],
        tendenciasOperativas: { crecimientoMensual: 0 }
      })
    } finally {
      setLoading(false)
    }
  }

  // Determinar color para métricas
  const getColorMetrica = (valor, tipo) => {
    switch (tipo) {
      case 'crecimiento':
        return valor > 0 ? 'success.main' : valor < 0 ? 'error.main' : 'text.secondary'
      case 'stock':
        return valor > 0 ? 'warning.main' : 'success.main'
      case 'financiero':
        return 'success.main'
      default:
        return 'primary.main'
    }
  }

  if (loading) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          ¡Bienvenido, {obtenerPrimerNombre(usuario?.nombreCompleto)}!
        </Typography>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando resumen ejecutivo del sistema...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          ¡Bienvenido, {obtenerPrimerNombre(usuario?.nombreCompleto)}!
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Dashboard Administrativo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Algunos datos no están disponibles temporalmente.
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
      {/* Header con saludo personalizado */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <AdminIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                ¡Bienvenido, {obtenerPrimerNombre(usuario?.nombreCompleto)}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Panel de control administrativo para {usuario?.nombreCompleto || 'Usuario'} - Administrador
              </Typography>
            </Box>
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
        {/* Resumen Ejecutivo */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DashboardIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  📊 Resumen Ejecutivo del Sistema
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h3" color="primary">
                      {dataDashboard.estadisticasGenerales.totalOrdenes || 0}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Órdenes Activas
                    </Typography>
                    <Chip 
                      label={`${dataDashboard.estadisticasGenerales.nuevasHoy || 0} hoy`}
                      size="small"
                      color="info"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h3" color="success.main">
                      {dataDashboard.estadisticasGenerales.totalClientes || 0}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Clientes Registrados
                    </Typography>
                    <Chip 
                      label={`${dataDashboard.estadisticasGenerales.clientesNuevosMes || 0} este mes`}
                      size="small"
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h3" color="info.main">
                      {dataDashboard.estadisticasGenerales.totalMotos || 0}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Motos Registradas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h3" color="warning.main">
                      {dataDashboard.estadisticasGenerales.totalUsuarios || 0}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Usuarios del Sistema
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen Financiero */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MoneyIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  💰 Resumen Financiero
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="success.main">
                      ${(dataDashboard.resumenFinanciero.totalRecaudado || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Recaudado
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="primary">
                      ${(dataDashboard.resumenFinanciero.recaudadoMes || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recaudado Este Mes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="warning.main">
                      {dataDashboard.resumenFinanciero.pagosPendientes || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pagos Pendientes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="info.main">
                      ${(dataDashboard.resumenFinanciero.promedioFactura || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Promedio por Factura
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Gestión de Usuarios */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  👥 Gestión de Usuarios
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="error.main">
                      {dataDashboard.resumenUsuarios.admins || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Administradores
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="info.main">
                      {dataDashboard.resumenUsuarios.recepcionistas || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recepcionistas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="warning.main">
                      {dataDashboard.resumenUsuarios.mecanicos || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mecánicos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="success.main">
                      {dataDashboard.resumenUsuarios.usuariosActivos || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Usuarios Activos
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Estado del Inventario */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <InventoryIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  📦 Estado del Inventario
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="primary">
                      {dataDashboard.estadoInventario.totalRepuestos || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Repuestos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="error.main">
                      {dataDashboard.estadoInventario.stockBajo || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock Bajo
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="success.main">
                      ${(dataDashboard.estadoInventario.valorInventario || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valor Total del Inventario
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Productividad del Taller */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  🔧 Productividad del Taller
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="success.main">
                      {dataDashboard.productividadTaller.ordenesCompletadas || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Órdenes Completadas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="info.main">
                      {dataDashboard.productividadTaller.tiempoPromedio || 0} días
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tiempo Promedio
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="warning.main">
                      {dataDashboard.productividadTaller.ordenesEnProceso || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En Proceso
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={1}>
                    <Typography variant="h4" color="primary">
                      {dataDashboard.productividadTaller.totalMecanicos || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mecánicos Activos
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tendencias Operativas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ReportIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  📈 Tendencias Operativas
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box textAlign="center" p={2}>
                    <Typography 
                      variant="h3" 
                      color={getColorMetrica(dataDashboard.tendenciasOperativas.crecimientoMensual, 'crecimiento')}
                    >
                      {dataDashboard.tendenciasOperativas.crecimientoMensual > 0 ? '+' : ''}
                      {dataDashboard.tendenciasOperativas.crecimientoMensual || 0}%
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Crecimiento Mensual
                    </Typography>
                    <Chip 
                      label={dataDashboard.tendenciasOperativas.tendenciaPositiva ? '📈 Positivo' : '📉 Negativo'}
                      color={dataDashboard.tendenciasOperativas.tendenciaPositiva ? 'success' : 'error'}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h3" color="primary">
                      {dataDashboard.tendenciasOperativas.ordenesMesActual || 0}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Órdenes Este Mes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h3" color="text.secondary">
                      {dataDashboard.tendenciasOperativas.ordenesMesAnterior || 0}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Órdenes Mes Anterior
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Servicios Populares */}
        {dataDashboard.serviciosPopulares.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ServiceIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    🔝 Servicios Más Demandados
                  </Typography>
                </Box>
                <List>
                  {dataDashboard.serviciosPopulares.slice(0, 5).map((servicio, index) => (
                    <ListItem key={index} divider>
                      <ListItemIcon>
                        <Chip 
                          label={`#${index + 1}`} 
                          size="small" 
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={servicio.nombre}
                        secondary={`$${servicio.precio?.toLocaleString()} - Demanda: ${servicio.demanda || 0}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default DashboardAdministrador
