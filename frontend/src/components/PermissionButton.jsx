import React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { hasPermission } from '../utils/permissions';
import PropTypes from 'prop-types';

// Componente de botón que se muestra solo si el usuario tiene permisos
const PermissionButton = ({ 
  module, 
  action, 
  children, 
  showTooltip = true,
  variant = 'contained',
  color = 'primary',
  disabled = false,
  isIconButton = false,
  tooltipTitle = 'No tienes permisos para esta acción',
  ...props 
}) => {
  const { user } = useSelector((state) => state.auth);
  
  // Verificar si el usuario tiene el permiso necesario
  const hasAccess = hasPermission(user, module, action);
  
  // Si no tiene acceso, no mostrar el botón o mostrar deshabilitado con tooltip
  if (!hasAccess) {
    if (showTooltip) {
      const ButtonComponent = isIconButton ? IconButton : Button;
      return (
        <Tooltip title={tooltipTitle}>
          <span>
            <ButtonComponent
              variant={variant}
              color={color}
              disabled={true}
              {...props}
            >
              {children}
            </ButtonComponent>
          </span>
        </Tooltip>
      );
    }
    return null;
  }
  
  // Si tiene acceso, mostrar el botón normal
  const ButtonComponent = isIconButton ? IconButton : Button;
  return (
    <ButtonComponent
      variant={variant}
      color={color}
      disabled={disabled}
      {...props}
    >
      {children}
    </ButtonComponent>
  );
};

PermissionButton.propTypes = {
  module: PropTypes.string.isRequired,
  action: PropTypes.oneOf(['create', 'read', 'update', 'delete']).isRequired,
  children: PropTypes.node.isRequired,
  showTooltip: PropTypes.bool,
  variant: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  isIconButton: PropTypes.bool,
  tooltipTitle: PropTypes.string
};

export default PermissionButton;
