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
  Stack,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Build as BuildIcon,
  DirectionsBike as BikeIcon,
  Assignment as OrderIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as TimeIcon,
  PriorityHigh as PriorityIcon,
  Engineering as MechanicIcon,
  Error as ErrorIcon
} from '@mui/icons-material'

// Servicio
import dashboardMecanicoService from '../services/dashboardMecanicoService'

/**
 * Dashboard Específico para Perfil MECÁNICO
 * Muestra información relevante para el trabajo técnico diario
 * SIN BOTONES NI ACCIONES - Solo información
 */
const DashboardMecanico = ({ usuario }) => {
  // Estados para los datos del dashboard
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataDashboard, setDataDashboard] = useState({
    ordenesAsignadas: {},
    estadisticasOrdenes: {},
    alertasRepuestos: {},
    motosRecientes: [],
    serviciosReferencia: [],
    resumenProductividad: {}
  })

  useEffect(() => {
    cargarDatosDelDashboard()
  }, [])

  const cargarDatosDelDashboard = async () => {
    try {
      setLoading(true)
      setError(null)

      const datos = await dashboardMecanicoService.obtenerResumenMecanico(usuario.idUsuario)
      setDataDashboard(datos)
    } catch (error) {
      console.error('Error al cargar dashboard del mecánico:', error)
      setError('No se pudieron cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Determinar color de prioridad
  const getColorPrioridad = (prioridad) => {
    switch (prioridad) {
      case 'URGENTE': return 'error'
      case 'ALTA': return 'warning'
      case 'NORMAL': return 'info'
      case 'BAJA': return 'default'
      default: return 'default'
    }
  }

  // Determinar color de estado
  const getColorEstado = (estado) => {
    switch (estado) {
      case 'EN_PROCESO': return 'primary'
      case 'DIAGNOSTICADA': return 'info'
      case 'RECIBIDA': return 'warning'
      case 'COMPLETADA': return 'success'
      default: return 'default'
    }
  }

  // Extraer solo el primer nombre del nombreCompleto
  const obtenerPrimerNombre = (nombreCompleto) => {
    if (!nombreCompleto) return 'Usuario'
    return nombreCompleto.split(' ')[0]
  }

  if (loading) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          ¡Bienvenido, {obtenerPrimerNombre(usuario?.nombreCompleto)}!
        </Typography>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando información del taller...
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
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box p={3}>
      {/* Encabezado del Dashboard */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          ¡Bienvenido, {obtenerPrimerNombre(usuario?.nombreCompleto)}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Panel de control técnico para {usuario?.nombreCompleto || 'Usuario'} - Mecánico
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Estadísticas Personales */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MechanicIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  📊 Resumen de Trabajo
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <Typography variant="h3" color="primary">
                      {dataDashboard.ordenesAsignadas.totalAsignadas || 0}
                    </Typography>
                    <Typography variant="body2">Órdenes Asignadas</Typography>
                  </div>
                </Grid>
                <Grid item xs={12} md={3}>
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <Typography variant="h3" color="warning.main">
                      {dataDashboard.ordenesAsignadas.pendientes?.length || 0}
                    </Typography>
                    <Typography variant="body2">Pendientes</Typography>
                  </div>
                </Grid>
                <Grid item xs={12} md={3}>
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <Typography variant="h3" color="info.main">
                      {dataDashboard.ordenesAsignadas.enProceso?.length || 0}
                    </Typography>
                    <Typography variant="body2">En Proceso</Typography>
                  </div>
                </Grid>
                <Grid item xs={12} md={3}>
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <Typography variant="h3" color="success.main">
                      {dataDashboard.estadisticasOrdenes.completadasDelMes || 0}
                    </Typography>
                    <Typography variant="body2">Completadas (Mes)</Typography>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Órdenes Asignadas */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <OrderIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  🔧 Mis Órdenes de Trabajo
                </Typography>
              </Box>
              
              {(!dataDashboard.ordenesAsignadas.pendientes || dataDashboard.ordenesAsignadas.pendientes.length === 0) && 
               (!dataDashboard.ordenesAsignadas.enProceso || dataDashboard.ordenesAsignadas.enProceso.length === 0) ? (
                <Alert severity="info">
                  No tienes órdenes de trabajo asignadas actualmente.
                </Alert>
              ) : (
                <List>
                  {/* Órdenes Pendientes */}
                  {dataDashboard.ordenesAsignadas.pendientes?.slice(0, 3).map((orden, index) => (
                    <React.Fragment key={`pendiente-${orden.id || orden.numeroOrden || index}`}>
                      <ListItem>
                        <ListItemIcon>
                          <OrderIcon color={getColorEstado(orden.estado)} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Typography variant="body1" fontWeight="bold">
                                {orden.numeroOrden}
                              </Typography>
                              <Chip 
                                label={orden.estado} 
                                size="small" 
                                color={getColorEstado(orden.estado)}
                              />
                              <Chip 
                                label={orden.prioridad} 
                                size="small" 
                                color={getColorPrioridad(orden.prioridad)}
                                variant="outlined"
                              />
                            </div>
                          }
                          primaryTypographyProps={{ component: 'div' }}
                          secondary={
                            <div>
                              <Typography variant="body2">
                                🏍️ {orden.moto?.marca} {orden.moto?.modelo} - {orden.moto?.placa}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                📅 Ingreso: {new Date(orden.fechaIngreso).toLocaleDateString('es-ES')}
                                {orden.fechaEstimadaEntrega && (
                                  <> | 🎯 Entrega: {new Date(orden.fechaEstimadaEntrega).toLocaleDateString('es-ES')}</>
                                )}
                              </Typography>
                            </div>
                          }
                        />
                      </ListItem>
                      {index < Math.min(3, dataDashboard.ordenesAsignadas.pendientes.length) - 1 && <Divider key={`div-pendiente-${orden.id || orden.numeroOrden || index}`} />}
                    </React.Fragment>
                  ))}
                  
                  {/* Órdenes En Proceso */}
                  {dataDashboard.ordenesAsignadas.enProceso?.slice(0, 2).map((orden, index) => (
                    <React.Fragment key={`enproceso-${orden.id || orden.numeroOrden || index}`}>
                      <ListItem>
                        <ListItemIcon>
                          <OrderIcon color={getColorEstado(orden.estado)} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Typography variant="body1" fontWeight="bold">
                                {orden.numeroOrden}
                              </Typography>
                              <Chip 
                                label={orden.estado} 
                                size="small" 
                                color={getColorEstado(orden.estado)}
                              />
                              <Chip 
                                label={orden.prioridad} 
                                size="small" 
                                color={getColorPrioridad(orden.prioridad)}
                                variant="outlined"
                              />
                            </div>
                          }
                          primaryTypographyProps={{ component: 'div' }}
                          secondary={
                            <div>
                              <Typography variant="body2">
                                🏍️ {orden.moto?.marca} {orden.moto?.modelo} - {orden.moto?.placa}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                📅 Ingreso: {new Date(orden.fechaIngreso).toLocaleDateString('es-ES')}
                                {orden.fechaEstimadaEntrega && (
                                  <> | 🎯 Entrega: {new Date(orden.fechaEstimadaEntrega).toLocaleDateString('es-ES')}</>
                                )}
                              </Typography>
                            </div>
                          }
                        />
                      </ListItem>
                      {index < Math.min(2, dataDashboard.ordenesAsignadas.enProceso.length) - 1 && <Divider key={`div-enproceso-${orden.id || orden.numeroOrden || index}`} />}
                    </React.Fragment>
                  ))}
                </List>
              )}
              
              {dataDashboard.ordenesAsignadas.totalAsignadas > 5 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  ... y {dataDashboard.ordenesAsignadas.totalAsignadas - 5} órdenes más
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Repuestos y Alertas */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            {/* Repuestos Necesarios */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <InventoryIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    📦 Repuestos Requeridos
                  </Typography>
                </Box>
                
                {(!dataDashboard.alertasRepuestos.stockBajo || dataDashboard.alertasRepuestos.stockBajo.length === 0) && 
                 (!dataDashboard.alertasRepuestos.sinStock || dataDashboard.alertasRepuestos.sinStock.length === 0) ? (
                  <Typography variant="body2" color="text.secondary">
                    No hay alertas de repuestos
                  </Typography>
                ) : (
                  <List dense>
                    {/* Repuestos sin stock */}
                    {dataDashboard.alertasRepuestos.sinStock?.slice(0, 2).map((repuesto, index) => (
                      <ListItem key={`sinstock-${repuesto.id || repuesto.codigo || index}`} disablePadding>
                        <ListItemIcon>
                          <ErrorIcon 
                            color="error" 
                            fontSize="small"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={repuesto.nombre}
                          secondary={`⚠️ SIN STOCK (Mín: ${repuesto.stockMinimo})`}
                        />
                      </ListItem>
                    ))}
                    
                    {/* Repuestos con stock bajo */}
                    {dataDashboard.alertasRepuestos.stockBajo?.slice(0, 2).map((repuesto, index) => (
                      <ListItem key={`stockbajo-${repuesto.id || repuesto.codigo || index}`} disablePadding>
                        <ListItemIcon>
                          <WarningIcon 
                            color="warning" 
                            fontSize="small"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={repuesto.nombre}
                          secondary={`Stock: ${repuesto.stockActual} (Mín: ${repuesto.stockMinimo})`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Motos Bajo Responsabilidad */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <BikeIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    🏍️ Motos en Servicio
                  </Typography>
                </Box>
                
                <Typography variant="h4" color="info.main" textAlign="center">
                  {dataDashboard.motosRecientes.length}
                </Typography>
                <Typography variant="body2" textAlign="center" color="text.secondary">
                  Motos modificadas esta semana
                </Typography>
                
                {dataDashboard.motosRecientes.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <Typography variant="caption" color="text.secondary">
                      Más reciente:
                    </Typography>
                    <Typography variant="body2">
                      {dataDashboard.motosRecientes[0]?.marca} {dataDashboard.motosRecientes[0]?.modelo}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hace {dataDashboard.motosRecientes[0]?.diasDesdeModificacion} días
                    </Typography>
                  </div>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Servicios Técnicos de Referencia */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BuildIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  🔧 Servicios Técnicos Disponibles
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                {dataDashboard.serviciosReferencia.slice(0, 6).map((servicio, index) => (
                  <Grid item xs={12} md={4} key={`servicio-${servicio.id || servicio.codigo || index}`}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <Typography variant="body1" fontWeight="bold" gutterBottom>
                        {servicio.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {servicio.descripcion}
                      </Typography>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={servicio.categoria} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Typography variant="caption">
                          💰 ${servicio.precioBase}
                        </Typography>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              {dataDashboard.serviciosReferencia.length > 6 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  Total de servicios disponibles: {dataDashboard.serviciosReferencia.length}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Productividad Personal */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TimeIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  📈 Mi Productividad
                </Typography>
              </Box>
              
              <Stack spacing={2}>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Órdenes (últimos 30 días)
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {dataDashboard.resumenProductividad.ordenes30Dias || 0}
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Completadas (últimos 30 días)
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {dataDashboard.resumenProductividad.completadas30Dias || 0}
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="body2" color="text.secondary">
                    Cumplimiento de tiempos
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {dataDashboard.resumenProductividad.porcentajeCumplimiento || 0}%
                  </Typography>
                </div>
                
                {dataDashboard.resumenProductividad.tendencia && (
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      Tendencia
                    </Typography>
                    <Chip 
                      label={
                        dataDashboard.resumenProductividad.tendencia.tipo === 'positiva' 
                          ? `↗️ +${dataDashboard.resumenProductividad.tendencia.cambio}%`
                          : dataDashboard.resumenProductividad.tendencia.tipo === 'negativa'
                          ? `↘️ -${dataDashboard.resumenProductividad.tendencia.cambio}%`
                          : '➡️ Sin cambios'
                      }
                      size="small"
                      color={
                        dataDashboard.resumenProductividad.tendencia.tipo === 'positiva' 
                          ? 'success'
                          : dataDashboard.resumenProductividad.tendencia.tipo === 'negativa'
                          ? 'error'
                          : 'default'
                      }
                    />
                  </div>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Alertas Críticas */}
        {(dataDashboard.ordenesAsignadas.urgentes?.length > 0 || dataDashboard.ordenesAsignadas.vencidas?.length > 0) && (
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                ⚠️ Alertas Críticas
              </Typography>
              <Grid container spacing={2}>
                {dataDashboard.ordenesAsignadas.urgentes?.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" fontWeight="bold" component="div">
                      🚨 Órdenes Urgentes ({dataDashboard.ordenesAsignadas.urgentes.length})
                    </Typography>
                    <List dense>
                      {dataDashboard.ordenesAsignadas.urgentes.slice(0, 3).map((orden, index) => (
                        <ListItem key={`urgente-${orden.id || orden.numeroOrden || index}`} disablePadding>
                          <ListItemText
                            primary={orden.numeroOrden}
                            secondary={`${orden.moto?.marca} ${orden.moto?.modelo} - ${orden.moto?.placa}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
                
                {dataDashboard.ordenesAsignadas.vencidas?.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" fontWeight="bold" component="div">
                      ⏰ Órdenes Vencidas ({dataDashboard.ordenesAsignadas.vencidas.length})
                    </Typography>
                    <List dense>
                      {dataDashboard.ordenesAsignadas.vencidas.slice(0, 3).map((orden, index) => (
                        <ListItem key={`vencida-${orden.id || orden.numeroOrden || index}`} disablePadding>
                          <ListItemText
                            primary={orden.numeroOrden}
                            secondary={`${orden.moto?.marca} ${orden.moto?.modelo} - Vencida: ${new Date(orden.fechaEstimadaEntrega).toLocaleDateString('es-ES')}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </Alert>
          </Grid>
        )}

        {/* Información Adicional */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mt: 2 }}>
            💡 <strong>Tip del día:</strong> Revisa las órdenes urgentes primero y verifica siempre el stock de repuestos antes de iniciar un trabajo.
          </Alert>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardMecanico
