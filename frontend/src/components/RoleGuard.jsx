import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { canAccessRoute, hasPermission } from '../utils/permissions';
import PropTypes from 'prop-types';
import { Box, Typography, Alert } from '@mui/material';

/**
 * RoleGuard - Protección de rutas por roles y permisos
 * 
 * 🚧 MODO DEBUG: Redirecciones automáticas DESACTIVADAS temporalmente
 * Para facilitar debugging sin ventanas emergentes molestas
 */
const RoleGuard = ({ 
  children, 
  allowedRoles, 
  module, 
  action, 
  fallbackPath = '/unauthorized',
  showMessage = true // 🚧 Cambiado a true para mostrar mensajes en lugar de redirigir
}) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Si no está autenticado, mostrar mensaje en lugar de redirigir
  if (!isAuthenticated) {
    console.warn('🚧 [DEBUG MODE] Usuario no autenticado - mostrando mensaje en lugar de redirigir a /login')
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          <Typography variant="h6">🚧 Modo Debug</Typography>
          <Typography>
            Usuario no autenticado. En producción sería redirigido a /login
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Si no hay usuario, mostrar mensaje
  if (!user) {
    console.warn('🚧 [DEBUG MODE] Sin datos de usuario - mostrando mensaje en lugar de redirigir')
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          <Typography variant="h6">🚧 Modo Debug</Typography>
          <Typography>
            Sin datos de usuario. En producción sería redirigido a /login
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Verificar acceso por roles específicos
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.rol)) {
      console.warn('🚧 [DEBUG MODE] Rol no permitido:', user.rol, 'Requeridos:', allowedRoles)
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            <Typography variant="h6">🚧 Acceso Denegado (Debug Mode)</Typography>
            <Typography>
              No tienes permisos para acceder a esta sección. 
              Tu rol actual: <strong>{user.rol}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Roles permitidos: {allowedRoles.join(', ')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              En producción serías redirigido a {fallbackPath}
            </Typography>
          </Alert>
        </Box>
      );
    }
  }

  // Verificar acceso por módulo y acción específicos
  if (module && action) {
    if (!hasPermission(user, module, action)) {
      console.warn('🚧 [DEBUG MODE] Permisos insuficientes para:', module, action)
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">
            <Typography variant="h6">🚧 Permisos Insuficientes (Debug Mode)</Typography>
            <Typography>
              No tienes permisos para realizar esta acción (<strong>{action}</strong>) en el módulo <strong>{module}</strong>.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Tu rol: <strong>{user.rol}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              En producción serías redirigido a {fallbackPath}
            </Typography>
          </Alert>
        </Box>
      );
    }
  }

  // Verificar acceso por ruta
  if (!canAccessRoute(user, location.pathname)) {
    console.warn('🚧 [DEBUG MODE] Ruta no permitida:', location.pathname)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6">🚧 Ruta No Permitida (Debug Mode)</Typography>
          <Typography>
            No tienes permisos para acceder a esta ruta: <strong>{location.pathname}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Tu rol: <strong>{user.rol}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            En producción serías redirigido a {fallbackPath}
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Si pasa todas las validaciones, mostrar el contenido
  return children;
};

RoleGuard.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  module: PropTypes.string,
  action: PropTypes.string,
  fallbackPath: PropTypes.string,
  showMessage: PropTypes.bool
};

export default RoleGuard;
