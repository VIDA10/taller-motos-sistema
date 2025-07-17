import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Stack,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  People as PeopleIcon,
  Engineering as EngineeringIcon,
  MonetizationOn as MoneyIcon,
  Dashboard as DashboardIcon,
  DateRange as DateIcon,
  Visibility as ViewIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'

// Servicios
import reporteService from '../services/reporteService'
import { hasPermission } from '../utils/permissions'

/**
 * Página de Reportes y Auditoría
 * Implementa las 6 tareas específicas de la Fase 9 usando SOLO endpoints existentes
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * - 9.1 Reportes por fechas de creación
 * - 9.2 Auditoría de modificaciones  
 * - 9.3 Monitoreo de actividad de usuarios
 * - 9.4 Estadísticas de servicios y repuestos
 * - 9.5 Análisis de ingresos por período
 * - 9.6 Dashboard ejecutivo
 * 
 * PERMISOS:
 * - ADMIN: Acceso completo a todos los reportes
 * - RECEPCIONISTA: Reportes operativos + auditoría básica
 * - MECANICO: Sin acceso
 */
const ReportesPage = () => {
  const { user } = useSelector((state) => state.auth)

  // Estados principales
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Estados para filtros de fechas
  const [fechaDesde, setFechaDesde] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [fechaHasta, setFechaHasta] = useState(new Date())

  // Estados de datos para cada pestaña
  const [reportesCreacion, setReportesCreacion] = useState({})
  const [auditoriaModificaciones, setAuditoriaModificaciones] = useState([])
  const [actividadUsuarios, setActividadUsuarios] = useState([])
  const [estadisticasServicios, setEstadisticasServicios] = useState(null)
  const [estadisticasRepuestos, setEstadisticasRepuestos] = useState(null)
  const [analisisIngresos, setAnalisisIngresos] = useState(null)
  const [metricasDashboard, setMetricasDashboard] = useState(null)

  // Verificar permisos
  const canViewReports = hasPermission(user, 'reportes', 'read') || user?.rol === 'ADMIN' || user?.rol === 'RECEPCIONISTA'
  const canViewFullAudit = user?.rol === 'ADMIN'

  useEffect(() => {
    if (canViewReports) {
      cargarDatosIniciales()
    }
  }, [canViewReports, tabValue])

  const cargarDatosIniciales = async () => {
    setLoading(true)
    setError(null)

    try {
      switch (tabValue) {
        case 0: // Dashboard Ejecutivo
          await cargarDashboardEjecutivo()
          break
        case 1: // Reportes por fechas
          await cargarReportesCreacion()
          break
        case 2: // Auditoría
          await cargarAuditoria()
          break
        case 3: // Actividad usuarios
          await cargarActividadUsuarios()
          break
        case 4: // Estadísticas
          await cargarEstadisticas()
          break
        case 5: // Ingresos
          await cargarAnalisisIngresos()
          break
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // 9.6 DASHBOARD EJECUTIVO
  // ===============================
  const cargarDashboardEjecutivo = async () => {
    const metricas = await reporteService.obtenerMetricasDashboardEjecutivo()
    setMetricasDashboard(metricas)
  }

  const renderDashboardEjecutivo = () => (
    <Grid container spacing={3}>
      {/* Resumen General */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="📊 Resumen General del Sistema" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box textAlign="center" p={2}>
                  <PeopleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{metricasDashboard?.resumenGeneral?.totalUsuarios || 0}</Typography>
                  <Typography variant="body2">Total Usuarios</Typography>
                  <Typography variant="caption" color="success.main">
                    {metricasDashboard?.resumenGeneral?.usuariosActivos || 0} activos
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center" p={2}>
                  <PeopleIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{metricasDashboard?.resumenGeneral?.totalClientes || 0}</Typography>
                  <Typography variant="body2">Total Clientes</Typography>
                  <Typography variant="caption" color="success.main">
                    {metricasDashboard?.resumenGeneral?.clientesActivos || 0} activos
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center" p={2}>
                  <EngineeringIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">{metricasDashboard?.resumenGeneral?.totalMotos || 0}</Typography>
                  <Typography variant="body2">Total Motos</Typography>
                  <Typography variant="caption" color="success.main">
                    {metricasDashboard?.resumenGeneral?.motosActivas || 0} activas
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Operaciones del Mes */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="🔧 Operaciones del Mes Actual" />
          <CardContent>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Total Órdenes:</Typography>
                <Chip label={metricasDashboard?.operacionesDelMes?.totalOrdenes || 0} color="primary" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Completadas:</Typography>
                <Chip label={metricasDashboard?.operacionesDelMes?.ordenesCompletadas || 0} color="success" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Pendientes:</Typography>
                <Chip label={metricasDashboard?.operacionesDelMes?.ordenesPendientes || 0} color="warning" />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Financiero */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="💰 Resumen Financiero" />
          <CardContent>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Ingresos del Mes:</Typography>
                <Typography variant="h6" color="success.main">
                  S/ {metricasDashboard?.financiero?.ingresosMes?.toFixed(2) || '0.00'}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Pagos Procesados:</Typography>
                <Chip label={metricasDashboard?.financiero?.totalPagosMes || 0} color="info" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Servicios Disponibles:</Typography>
                <Chip label={metricasDashboard?.financiero?.serviciosDisponibles || 0} color="primary" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Repuestos Stock Bajo:</Typography>
                <Chip 
                  label={metricasDashboard?.financiero?.repuestosStockBajo || 0} 
                  color={metricasDashboard?.financiero?.repuestosStockBajo > 0 ? "error" : "success"} 
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  // ===============================
  // 9.1 REPORTES POR FECHAS
  // ===============================
  const cargarReportesCreacion = async () => {
    const fechaDesdeStr = fechaDesde.toISOString().split('T')[0]
    const fechaHastaStr = fechaHasta.toISOString().split('T')[0]
    
    const estadisticas = await reporteService.obtenerEstadisticasCreacionGeneral(fechaDesdeStr, fechaHastaStr)
    setReportesCreacion(estadisticas)
  }

  const renderReportesCreacion = () => (
    <Box>
      {/* Filtros de fecha */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha Desde"
                  value={fechaDesde}
                  onChange={setFechaDesde}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha Hasta"
                  value={fechaHasta}
                  onChange={setFechaHasta}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={cargarReportesCreacion}
                fullWidth
              >
                Generar Reporte
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Resumen de creaciones por módulo */}
      <Grid container spacing={2}>
        {Object.entries(reportesCreacion).map(([modulo, datos]) => (
          <Grid item xs={12} md={6} lg={4} key={modulo}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {modulo.charAt(0).toUpperCase() + modulo.slice(1)}
                </Typography>
                <Typography variant="h3" color="primary.main">
                  {datos.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registros creados en el período
                </Typography>
                {datos.error && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    {datos.error}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )

  // ===============================
  // 9.2 AUDITORÍA DE MODIFICACIONES
  // ===============================
  const cargarAuditoria = async () => {
    if (!canViewFullAudit) {
      setError('No tienes permisos para ver la auditoría completa')
      return
    }

    const modulos = ['usuarios', 'clientes', 'motos', 'servicios', 'repuestos', 'ordenes-trabajo', 'pagos']
    const fechaDesdeStr = fechaDesde.toISOString().split('T')[0]
    const fechaHastaStr = fechaHasta.toISOString().split('T')[0]
    
    const todasModificaciones = []
    
    for (const modulo of modulos) {
      try {
        const modificaciones = await reporteService.obtenerAuditoriaModificaciones(modulo, fechaDesdeStr, fechaHastaStr)
        todasModificaciones.push(...modificaciones)
      } catch (error) {
        console.warn(`Error cargando auditoría de ${modulo}:`, error.message)
      }
    }
    
    // Ordenar por fecha de modificación más reciente
    todasModificaciones.sort((a, b) => new Date(b.fechaModificacion) - new Date(a.fechaModificacion))
    setAuditoriaModificaciones(todasModificaciones)
  }

  const renderAuditoria = () => (
    <Box>
      {!canViewFullAudit ? (
        <Alert severity="warning">
          Solo los administradores pueden acceder a la auditoría completa del sistema.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Módulo</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Fecha Creación</TableCell>
                <TableCell>Fecha Modificación</TableCell>
                <TableCell>Tiempo Transcurrido</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditoriaModificaciones.map((modificacion, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip label={modificacion.modulo} size="small" />
                  </TableCell>
                  <TableCell>{modificacion.descripcion}</TableCell>
                  <TableCell>
                    {new Date(modificacion.fechaCreacion).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>
                    {new Date(modificacion.fechaModificacion).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>{modificacion.tiempoTranscurrido}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )

  // ===============================
  // 9.3 MONITOREO DE ACTIVIDAD
  // ===============================
  const cargarActividadUsuarios = async () => {
    const actividad = await reporteService.obtenerActividadUsuarios()
    setActividadUsuarios(actividad)
  }

  const renderActividadUsuarios = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Último Login</TableCell>
            <TableCell>Días Sin Actividad</TableCell>
            <TableCell>Estado Actividad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {actividadUsuarios.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {usuario.nombreCompleto}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{usuario.username}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip label={usuario.rol} size="small" color="primary" />
              </TableCell>
              <TableCell>
                <Chip 
                  label={usuario.activo ? 'Activo' : 'Inactivo'} 
                  size="small" 
                  color={usuario.activo ? 'success' : 'error'} 
                />
              </TableCell>
              <TableCell>
                {usuario.ultimoLogin 
                  ? new Date(usuario.ultimoLogin).toLocaleString('es-ES')
                  : 'Nunca'
                }
              </TableCell>
              <TableCell>
                {usuario.diasSinActividad !== null ? usuario.diasSinActividad : 'N/A'}
              </TableCell>
              <TableCell>
                <Chip 
                  label={usuario.estadoActividad} 
                  size="small"
                  color={
                    usuario.estadoActividad === 'Activo hoy' ? 'success' :
                    usuario.estadoActividad === 'Activo reciente' ? 'info' :
                    usuario.estadoActividad === 'Actividad moderada' ? 'warning' : 'error'
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  // ===============================
  // 9.4 ESTADÍSTICAS SERVICIOS Y REPUESTOS
  // ===============================
  const cargarEstadisticas = async () => {
    const [servicios, repuestos] = await Promise.all([
      reporteService.obtenerEstadisticasServicios(),
      reporteService.obtenerEstadisticasRepuestos()
    ])
    
    setEstadisticasServicios(servicios)
    setEstadisticasRepuestos(repuestos)
  }

  const renderEstadisticas = () => (
    <Grid container spacing={3}>
      {/* Estadísticas de Servicios */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="🔧 Estadísticas de Servicios" />
          <CardContent>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Total Servicios:</Typography>
                <Typography fontWeight="bold">{estadisticasServicios?.totalServicios || 0}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Servicios Activos:</Typography>
                <Typography fontWeight="bold">{estadisticasServicios?.serviciosActivos || 0}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Servicio Más Utilizado:</Typography>
                <Typography fontWeight="bold">
                  {estadisticasServicios?.servicioMasUtilizado?.nombre || 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Estadísticas de Repuestos */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="📦 Estadísticas de Repuestos" />
          <CardContent>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Total Repuestos:</Typography>
                <Typography fontWeight="bold">{estadisticasRepuestos?.totalRepuestos || 0}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Stock Bajo:</Typography>
                <Typography 
                  fontWeight="bold" 
                  color={estadisticasRepuestos?.repuestosStockBajo > 0 ? 'error.main' : 'success.main'}
                >
                  {estadisticasRepuestos?.repuestosStockBajo || 0}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Repuesto Más Utilizado:</Typography>
                <Typography fontWeight="bold">
                  {estadisticasRepuestos?.repuestoMasUtilizado?.nombre || 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  // ===============================
  // 9.5 ANÁLISIS DE INGRESOS
  // ===============================
  const cargarAnalisisIngresos = async () => {
    const fechaDesdeStr = fechaDesde.toISOString().split('T')[0]
    const fechaHastaStr = fechaHasta.toISOString().split('T')[0]
    
    const analisis = await reporteService.obtenerAnalisisIngresos(fechaDesdeStr, fechaHastaStr)
    setAnalisisIngresos(analisis)
  }

  const renderAnalisisIngresos = () => (
    <Box>
      {/* Resumen de ingresos */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success.main">
                S/ {analisisIngresos?.ingresoTotal?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="body2">Ingreso Total</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssessmentIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary.main">
                {analisisIngresos?.totalPagos || 0}
              </Typography>
              <Typography variant="body2">Total Pagos</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="💳 Ingresos por Método de Pago" />
            <CardContent>
              <Stack spacing={1}>
                {Object.entries(analisisIngresos?.ingresosPorMetodo || {}).map(([metodo, monto]) => (
                  <Box key={metodo} display="flex" justifyContent="space-between">
                    <Typography>{metodo}:</Typography>
                    <Typography fontWeight="bold">S/ {monto.toFixed(2)}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Verificación de acceso
  if (!canViewReports) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          No tienes permisos para acceder a los reportes del sistema.
          Solo los administradores y recepcionistas pueden ver esta información.
        </Alert>
      </Box>
    )
  }

  return (
    <Box p={3}>
      {/* Encabezado */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          📊 Reportes y Auditoría
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sistema completo de reportes basado en datos reales del backend
        </Typography>
      </Box>

      {/* Pestañas principales */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Dashboard Ejecutivo" icon={<DashboardIcon />} />
          <Tab label="Reportes por Fechas" icon={<DateIcon />} />
          <Tab label="Auditoría" icon={<AssessmentIcon />} />
          <Tab label="Actividad Usuarios" icon={<PeopleIcon />} />
          <Tab label="Estadísticas" icon={<TimelineIcon />} />
          <Tab label="Análisis Ingresos" icon={<MoneyIcon />} />
        </Tabs>
      </Box>

      {/* Loading y errores */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Contenido de pestañas */}
      {tabValue === 0 && metricasDashboard && renderDashboardEjecutivo()}
      {tabValue === 1 && renderReportesCreacion()}
      {tabValue === 2 && renderAuditoria()}
      {tabValue === 3 && renderActividadUsuarios()}
      {tabValue === 4 && renderEstadisticas()}
      {tabValue === 5 && renderAnalisisIngresos()}
    </Box>
  )
}

export default ReportesPage
