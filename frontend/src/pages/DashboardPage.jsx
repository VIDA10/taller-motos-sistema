import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Person,
  AdminPanelSettings,
  Build,
  Assignment,
  DirectionsBike,
  PersonAdd,
  Inventory,
  Payment,
  Assessment,
  Settings
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { 
  getRoleDisplayName, 
  getRoleColor, 
  getAccessibleModules,
  ROLES,
  isAdmin,
  isRecepcionista,
  isMecanico
} from '../utils/permissions';
import DashboardMecanico from '../components/DashboardMecanico';
import DashboardRecepcionista from '../components/DashboardRecepcionista';
import DashboardAdministrador from '../components/DashboardAdministrador';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const accessibleModules = getAccessibleModules(user);

  // Si el usuario es administrador, mostrar el dashboard específico
  if (isAdmin(user)) {
    return <DashboardAdministrador usuario={user} />;
  }

  // Si el usuario es mecánico, mostrar el dashboard específico
  if (isMecanico(user)) {
    return <DashboardMecanico usuario={user} />;
  }

  // Si el usuario es recepcionista, mostrar el dashboard específico
  if (isRecepcionista(user)) {
    return <DashboardRecepcionista usuario={user} />;
  }

  // Definir iconos para cada módulo
  const moduleIcons = {
    usuarios: AdminPanelSettings,
    clientes: PersonAdd,
    motos: DirectionsBike,
    ordenes: Assignment,
    servicios: Build,
    repuestos: Inventory,
    pagos: Payment,
    reportes: Assessment,
    configuracion: Settings,
    admin: AdminPanelSettings
  };

  // Mensajes de bienvenida personalizados por rol
  const getWelcomeMessage = () => {
    if (isAdmin(user)) {
      return {
        title: '¡Bienvenido Administrador!',
        message: 'Tienes acceso completo al sistema. Puedes gestionar usuarios, configuraciones y supervisar todas las operaciones del taller.',
        color: 'error'
      };
    } else if (isRecepcionista(user)) {
      return {
        title: '¡Bienvenido Recepcionista!',
        message: 'Tu rol es clave en la atención al cliente. Puedes gestionar clientes, crear órdenes de trabajo y procesar pagos.',
        color: 'primary'
      };
    } else if (isMecanico(user)) {
      return {
        title: '¡Bienvenido Mecánico!',
        message: 'Eres el corazón técnico del taller. Puedes actualizar órdenes de trabajo, gestionar servicios y repuestos.',
        color: 'success'
      };
    }
    return {
      title: '¡Bienvenido!',
      message: 'Accede a las funciones disponibles para tu rol.',
      color: 'default'
    };
  };

  const welcomeInfo = getWelcomeMessage();

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', width: '100%' }}>
      {/* Header con información del usuario */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ bgcolor: `${welcomeInfo.color}.main`, color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
                  <Person sx={{ fontSize: 32 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {welcomeInfo.title}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {user?.nombreCompleto || 'Usuario'}
                  </Typography>
                  <Chip 
                    label={getRoleDisplayName(user?.rol)} 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
                {welcomeInfo.message}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Información importante del sistema */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Sistema de Gestión de Taller de Motos
            </Typography>
            <Typography variant="body2">
              Versión 1.0 - Sistema desarrollado con React + Spring Boot + PostgreSQL
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Módulos accesibles */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment color="primary" />
                Módulos Disponibles
              </Typography>
              <List>
                {accessibleModules.map((module, index) => {
                  const IconComponent = moduleIcons[module] || Assignment;
                  return (
                    <React.Fragment key={module}>
                      <ListItem>
                        <ListItemIcon>
                          <IconComponent color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={module.charAt(0).toUpperCase() + module.slice(1)}
                          secondary={`Tienes acceso al módulo de ${module}`}
                        />
                      </ListItem>
                      {index < accessibleModules.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Settings color="primary" />
                Información del Sistema
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Usuario Actual"
                    secondary={user?.username || 'No disponible'}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <AdminPanelSettings />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Rol Asignado"
                    secondary={getRoleDisplayName(user?.rol)}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Assignment />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Módulos Accesibles"
                    secondary={`${accessibleModules.length} módulos disponibles`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mensaje específico según el backend real */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Alert severity="warning">
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Nota sobre Permisos del Backend
            </Typography>
            <Typography variant="body2">
              El backend actual solo restringe el acceso a <code>/api/admin/**</code> para usuarios ADMIN. 
              Todos los demás endpoints son accesibles para usuarios autenticados. 
              El control granular de funcionalidades se maneja en el frontend para mejorar la experiencia de usuario.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
