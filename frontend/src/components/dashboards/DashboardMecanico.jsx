import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  Alert,
  Paper,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  Build,
  DirectionsBike,
  Assignment,
  Inventory,
  Warning,
  CheckCircle,
  Schedule,
  TrendingUp,
  Person,
  CalendarToday
} from '@mui/icons-material';
import dashboardMecanicoService from '../../services/dashboardMecanicoService';
import { useSelector } from 'react-redux';

const DashboardMecanico = () => {
  const { user } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardMecanicoService.getDashboardData(user.id);
        setDashboardData(data);
      } catch (err) {
        setError('Error al cargar el dashboard');
        console.error('Error dashboard mecánico:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      cargarDashboard();
    }
  }, [user?.id]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'warning';
      case 'EN_PROGRESO':
        return 'info';
      case 'COMPLETADO':
        return 'success';
      case 'ENTREGADO':
        return 'success';
      default:
        return 'default';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return <Schedule />;
      case 'EN_PROGRESO':
        return <Build />;
      case 'COMPLETADO':
        return <CheckCircle />;
      case 'ENTREGADO':
        return <CheckCircle />;
      default:
        return <Assignment />;
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard - Mecánico
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="rectangular" width="100%" height={100} />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="h4" gutterBottom>
          Dashboard - Mecánico
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No se pudo cargar la información del dashboard. Por favor, recarga la página.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard - Mecánico
      </Typography>
      
      {/* Saludo personalizado */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">
          ¡Hola {user?.nombre || 'Mecánico'}!
        </Typography>
        <Typography variant="body1">
          Aquí tienes un resumen de tu trabajo actual y actividades pendientes.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Estadísticas principales */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="primary">
                    {dashboardData?.resumen?.totalOrdenes || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Órdenes Asignadas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {dashboardData?.resumen?.pendientes || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Build />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="info.main">
                    {dashboardData?.resumen?.enProgreso || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En Progreso
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {dashboardData?.resumen?.completadas || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completadas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Órdenes pendientes */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Órdenes Pendientes
              </Typography>
              
              {dashboardData?.ordenesPendientes?.length > 0 ? (
                <List>
                  {dashboardData.ordenesPendientes.map((orden, index) => (
                    <React.Fragment key={orden.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 2 }}>
                                Orden #{orden.id}
                              </Typography>
                              <Chip
                                size="small"
                                label={orden.estado}
                                color={getEstadoColor(orden.estado)}
                                icon={getEstadoIcon(orden.estado)}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                <Person sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                Cliente: {orden.cliente?.nombre || 'No especificado'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <DirectionsBike sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                Moto: {orden.moto?.marca} {orden.moto?.modelo} ({orden.moto?.placa})
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <CalendarToday sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                Fecha: {formatearFecha(orden.fechaCreacion)}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Descripción:</strong> {orden.descripcion || 'Sin descripción'}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dashboardData.ordenesPendientes.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No tienes órdenes pendientes en este momento.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Alertas y notificaciones */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                Alertas de Repuestos
              </Typography>
              
              {dashboardData?.alertasRepuestos?.length > 0 ? (
                <List>
                  {dashboardData.alertasRepuestos.map((repuesto, index) => (
                    <React.Fragment key={repuesto.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {repuesto.nombre}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Stock: {repuesto.stock} unidades
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Mínimo: {repuesto.stockMinimo} unidades
                              </Typography>
                              <Chip
                                size="small"
                                label="Stock Bajo"
                                color="warning"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dashboardData.alertasRepuestos.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No hay alertas de repuestos en este momento.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Motos trabajadas recientemente */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <DirectionsBike sx={{ mr: 1, verticalAlign: 'middle' }} />
                Motos Trabajadas Recientemente
              </Typography>
              
              {dashboardData?.motosRecientes?.length > 0 ? (
                <List>
                  {dashboardData.motosRecientes.map((moto, index) => (
                    <React.Fragment key={moto.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {moto.marca} {moto.modelo}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Placa: {moto.placa}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Año: {moto.año}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Última modificación: {formatearFecha(moto.fechaModificacion)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dashboardData.motosRecientes.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No hay motos trabajadas recientemente.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Productividad */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                Productividad del Mes
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Órdenes Completadas: {dashboardData?.productividad?.ordenesCompletadas || 0}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={dashboardData?.productividad?.porcentajeCompletadas || 0}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {dashboardData?.productividad?.porcentajeCompletadas || 0}% de tu objetivo mensual
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Tiempo Promedio por Orden: {dashboardData?.productividad?.tiempoPromedio || 0} días
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (dashboardData?.productividad?.eficiencia || 0) * 100)}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Eficiencia: {Math.round((dashboardData?.productividad?.eficiencia || 0) * 100)}%
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Servicios Más Realizados:
                </Typography>
                {dashboardData?.productividad?.serviciosFreuentes?.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {dashboardData.productividad.serviciosFreuentes.map((servicio, index) => (
                      <Chip
                        key={index}
                        label={`${servicio.nombre} (${servicio.cantidad})`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No hay datos suficientes
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardMecanico;
