import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material'
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material'
import { logout } from '../store/slices/authSlice'
import { getRoleDisplayName, getRoleColor } from '../utils/permissions'

const AppHeader = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  
  const [anchorEl, setAnchorEl] = useState(null)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogoutClick = async () => {
    try {
      setLogoutLoading(true)
      handleMenuClose()
      
      // Logout simple - solo limpiar estado y navegar
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      dispatch(logout())
      navigate('/login')
    } catch (error) {
      console.error('Error inesperado en logout:', error)
      navigate('/login')
    } finally {
      setLogoutLoading(false)
    }
  }

  const handleDashboard = () => {
    handleMenuClose()
    navigate('/dashboard')
  }

  if (!isAuthenticated || !user) return null

  return (
    <AppBar 
      position="fixed" 
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'primary.main'
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Taller de Motos - Sistema de Gestión
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ color: 'white' }}>
              {user?.nombreCompleto || 'Usuario'}
            </Typography>
            <Chip 
              label={getRoleDisplayName(user?.rol)} 
              color={getRoleColor(user?.rol)}
              size="small"
            />
          </Box>
          
          <Button
            onClick={handleMenuOpen}
            sx={{ 
              color: 'white',
              minWidth: 'auto',
              p: 1
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.dark', width: 32, height: 32 }}>
              {user?.nombreCompleto?.charAt(0) || 'U'}
            </Avatar>
          </Button>
        </Box>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {/* Información del usuario */}
          <MenuItem disabled>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2">
                {user?.nombreCompleto || 'Usuario'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Rol: {getRoleDisplayName(user.rol)}
              </Typography>
              {user?.rol === 'ADMIN' && (
                <Typography variant="caption" color="primary.main" sx={{ display: 'block' }}>
                  Acceso Admin Habilitado
                </Typography>
              )}
            </ListItemText>
          </MenuItem>

          <Divider />

          {/* Dashboard */}
          <MenuItem onClick={handleDashboard}>
            <ListItemIcon>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </MenuItem>
          
          <Divider />
          
          {/* Logout */}
          <MenuItem onClick={handleLogoutClick} disabled={logoutLoading}>
            <ListItemIcon>
              {logoutLoading ? (
                <CircularProgress size={16} />
              ) : (
                <LogoutIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText primary={logoutLoading ? "Cerrando sesión..." : "Cerrar Sesión"} />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default AppHeader