import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography,
  Chip,
  Divider,
  Container
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppHeader from './AppHeader';
import { getNavigationForUser } from '../config/navigation';
import { getRoleDisplayName, getRoleColor } from '../utils/permissions';
import PropTypes from 'prop-types';

const drawerWidth = 280;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Si no está autenticado, mostrar solo el contenido (login)
  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Container maxWidth="sm" sx={{ flex: 1, py: 3 }}>
          {children}
        </Container>
      </Box>
    );
  }

  // Obtener elementos de navegación permitidos para el usuario actual
  const navigationItems = getNavigationForUser(user);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      bgcolor: 'white',
      minHeight: '100vh',
      width: '100%'
    }}>
      <AppHeader />
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'white',
            color: 'text.primary',
            borderRight: '1px solid',
            borderColor: 'divider',
            zIndex: 1000
          },
        }}
      >
        <Toolbar />
        
        {/* Información del usuario */}
        <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'white' }}>
          <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            {user?.nombreCompleto || 'Usuario'}
          </Typography>
          <Chip 
            label={getRoleDisplayName(user?.rol)} 
            color={getRoleColor(user?.rol)}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>
        
        <Divider />
        
        <List sx={{ bgcolor: 'white' }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: 'text.primary',
                    bgcolor: 'white',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'white'
                    },
                    ...(isActive && {
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRight: '3px solid',
                      borderColor: 'primary.dark'
                    })
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive ? 'white' : 'text.secondary',
                    '&:hover': { color: 'white' }
                  }}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 'bold' : 'normal'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'white',
          p: 3,
          pt: 10, // Más padding top para evitar superposición con el header
          minHeight: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
