import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useMediaQuery,
  useTheme,
  Tooltip,
  Avatar
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Login as LoginIcon
} from '@mui/icons-material'
import { hasPermission } from '../../utils/permissions'

/**
 * Componente lista de usuarios responsive
 * Basado en estructura de UsuarioResponseDTO
 * 
 * Campos mostrados según UsuarioResponseDTO:
 * - idUsuario (Long) - ID único
 * - username (String, max 50, único) - Nombre de usuario
 * - email (String, max 100, único) - Email
 * - nombreCompleto (String, max 100) - Nombre completo
 * - rol (String: ADMIN, RECEPCIONISTA, MECANICO) - Rol del usuario
 * - activo (Boolean) - Estado activo/inactivo
 * - ultimoLogin (LocalDateTime) - Último login
 * - createdAt (LocalDateTime) - Fecha de creación
 * - updatedAt (LocalDateTime) - Última actualización
 */
const UsuariosList = ({ 
  usuarios = [], 
  loading = false, 
  error = null,
  onEdit,
  onView,
  onDelete,
  onToggleEstado,
  onRefresh
}) => {
  const { user } = useSelector((state) => state.auth)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // Estado para paginación
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Resetear página cuando cambien los datos
  useEffect(() => {
    setPage(0)
  }, [usuarios])

  // Datos paginados
  const paginatedUsuarios = useMemo(() => {
    const startIndex = page * rowsPerPage
    return usuarios.slice(startIndex, startIndex + rowsPerPage)
  }, [usuarios, page, rowsPerPage])

  // Formatear fecha según formato del backend
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A'
    try {
      const date = new Date(fecha)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  // Obtener tiempo desde último login
  const getTiempoUltimoLogin = (ultimoLogin) => {
    if (!ultimoLogin) return 'Nunca'
    
    try {
      const fecha = new Date(ultimoLogin)
      const ahora = new Date()
      const diffMs = ahora - fecha
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDias === 0) return 'Hoy'
      if (diffDias === 1) return 'Ayer'
      if (diffDias < 7) return `Hace ${diffDias} días`
      if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semanas`
      return formatearFecha(ultimoLogin)
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  // Obtener color del chip según rol
  const getRolColor = (rol) => {
    switch (rol) {
      case 'ADMIN':
        return 'error'
      case 'RECEPCIONISTA':
        return 'primary'
      case 'MECANICO':
        return 'secondary'
      default:
        return 'default'
    }
  }

  // Obtener color del estado (igual que en clientes)
  const getEstadoColor = (activo) => {
    return activo ? 'success' : 'error'
  }

  // Obtener initial para avatar
  const getInitials = (nombreCompleto) => {
    if (!nombreCompleto) return 'U'
    const names = nombreCompleto.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return names[0][0].toUpperCase()
  }

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Verificar permisos para cada acción
  const canEdit = (usuario) => {
    // Solo ADMIN puede editar cualquier usuario
    // Un usuario no puede editarse a sí mismo para evitar auto-bloqueo
    return hasPermission(user, 'usuarios', 'update') && usuario.idUsuario !== user?.idUsuario
  }

  const canDelete = (usuario) => {
    // Solo ADMIN puede eliminar usuarios
    // Un usuario no puede eliminarse a sí mismo
    return hasPermission(user, 'usuarios', 'delete') && usuario.idUsuario !== user?.idUsuario
  }

  const canToggleStatus = (usuario) => {
    // Solo ADMIN puede cambiar estados
    // Un usuario no puede desactivarse a sí mismo
    return hasPermission(user, 'usuarios', 'update') && usuario.idUsuario !== user?.idUsuario
  }

  // Mostrar loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Cargando usuarios...
        </Typography>
      </Box>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          onRefresh && (
            <Button color="inherit" size="small" onClick={onRefresh}>
              Reintentar
            </Button>
          )
        }
      >
        <Typography variant="body2">
          Error al cargar usuarios: {error.message || 'Error desconocido'}
        </Typography>
      </Alert>
    )
  }

  // Mostrar cuando no hay usuarios
  if (!usuarios || usuarios.length === 0) {
    return (
      <Alert severity="info">
        <Typography variant="body2">
          No se encontraron usuarios que coincidan con los criterios de búsqueda.
        </Typography>
      </Alert>
    )
  }

  // Vista móvil - Cards
  if (isMobile) {
    return (
      <Box>
        <Grid container spacing={2}>
          {paginatedUsuarios.map((usuario) => (
            <Grid item xs={12} key={usuario.idUsuario}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      {getInitials(usuario.nombreCompleto)}
                    </Avatar>
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {usuario.nombreCompleto}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        @{usuario.username}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        <Chip 
                          label={usuario.rol}
                          size="small"
                          color={getRolColor(usuario.rol)}
                        />
                        <Tooltip title={
                          canToggleStatus(usuario)
                            ? (usuario.activo ? "Click para desactivar" : "Click para activar")
                            : "Solo ADMIN puede cambiar el estado de usuarios"
                        }>
                          <Chip 
                            label={usuario.activo ? 'Activo' : 'Inactivo'}
                            size="small"
                            color={getEstadoColor(usuario.activo)}
                            clickable={canToggleStatus(usuario)}
                            onClick={canToggleStatus(usuario) && onToggleEstado ? () => onToggleEstado(usuario) : undefined}
                            sx={{ 
                              cursor: canToggleStatus(usuario) ? 'pointer' : 'default',
                              '&:hover': canToggleStatus(usuario) ? { opacity: 0.8 } : {},
                              opacity: usuario.activo ? 1 : 0.7
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {usuario.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LoginIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Último login: {getTiempoUltimoLogin(usuario.ultimoLogin)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Creado: {formatearFecha(usuario.createdAt)}
                    </Typography>
                  </Box>

                  {/* Acciones */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {onView && (
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small" 
                          onClick={() => onView(usuario)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {onEdit && canEdit(usuario) && (
                      <Tooltip title="Editar usuario">
                        <IconButton 
                          size="small" 
                          onClick={() => onEdit(usuario)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {onDelete && canDelete(usuario) && (
                      <Tooltip title="Eliminar usuario">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => onDelete(usuario)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Paginación móvil */}
        <Box sx={{ mt: 2 }}>
          <TablePagination
            component="div"
            count={usuarios.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Box>
      </Box>
    )
  }

  // Vista desktop - Tabla
  return (
    <Paper elevation={0}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Último Login</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsuarios.map((usuario) => (
              <TableRow key={usuario.idUsuario} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2, width: 32, height: 32 }}>
                      {getInitials(usuario.nombreCompleto)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {usuario.nombreCompleto}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{usuario.username}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {usuario.email}
                  </Typography>
                </TableCell>
                
                <TableCell>                  <Chip
                    label={usuario.rol}
                    size="small"
                    color={getRolColor(usuario.rol)}
                  />
                </TableCell>
                
                <TableCell>
                  <Tooltip title={
                    canToggleStatus(usuario)
                      ? (usuario.activo ? "Click para desactivar" : "Click para activar")
                      : "Solo ADMIN puede cambiar el estado de usuarios"
                  }>
                    <Chip 
                      label={usuario.activo ? 'Activo' : 'Inactivo'}
                      size="small"
                      color={getEstadoColor(usuario.activo)}
                      clickable={canToggleStatus(usuario)}
                      onClick={canToggleStatus(usuario) && onToggleEstado ? () => onToggleEstado(usuario) : undefined}
                      sx={{ 
                        cursor: canToggleStatus(usuario) ? 'pointer' : 'default',
                        '&:hover': canToggleStatus(usuario) ? { opacity: 0.8 } : {},
                        opacity: usuario.activo ? 1 : 0.7
                      }}
                    />
                  </Tooltip>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {getTiempoUltimoLogin(usuario.ultimoLogin)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {formatearFecha(usuario.createdAt)}
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    {onView && (
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small" 
                          onClick={() => onView(usuario)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {onEdit && canEdit(usuario) && (
                      <Tooltip title="Editar usuario">
                        <IconButton 
                          size="small" 
                          onClick={() => onEdit(usuario)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {onDelete && canDelete(usuario) && (
                      <Tooltip title="Eliminar usuario">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => onDelete(usuario)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        component="div"
        count={usuarios.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  )
}

UsuariosList.propTypes = {
  usuarios: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.object,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  onToggleEstado: PropTypes.func,
  onRefresh: PropTypes.func
}

export default UsuariosList
