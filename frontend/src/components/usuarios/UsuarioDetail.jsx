import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  Divider,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Login as LoginIcon
} from '@mui/icons-material';

/**
 * Componente para mostrar detalles de usuario en modo solo lectura
 */
const UsuarioDetail = ({ open, onClose, usuario }) => {
  if (!usuario) return null;

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Nunca';
    return new Date(fecha).toLocaleString('es-ES');
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case 'ADMIN':
        return 'error';
      case 'RECEPCIONISTA':
        return 'primary';
      case 'MECANICO':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getInitials = (nombreCompleto) => {
    return nombreCompleto
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              {getInitials(usuario.nombreCompleto)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {usuario.nombreCompleto}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{usuario.username}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Información básica */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Información Personal
              </Typography>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Nombre completo
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {usuario.nombreCompleto}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Username
                </Typography>
                <Typography variant="body1" gutterBottom>
                  @{usuario.username}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Información de contacto */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="primary" />
                Contacto
              </Typography>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {usuario.email}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Rol y estado */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BadgeIcon color="primary" />
                Rol y Estado
              </Typography>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rol
                </Typography>
                <Chip 
                  label={usuario.rol}
                  color={getRolColor(usuario.rol)}
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Estado
                </Typography>
                <Chip 
                  label={usuario.activo ? 'Activo' : 'Inactivo'}
                  color={usuario.activo ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </Box>
          </Grid>

          {/* Fechas */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon color="primary" />
                Fechas Importantes
              </Typography>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Último login
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LoginIcon fontSize="small" />
                  {formatearFecha(usuario.ultimoLogin)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Fecha de creación
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatearFecha(usuario.createdAt)}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Última actualización
                </Typography>
                <Typography variant="body1">
                  {formatearFecha(usuario.updatedAt)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioDetail;
