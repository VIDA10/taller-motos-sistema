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
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { hasPermission } from '../../utils/permissions'

/**
 * Componente lista de clientes responsive
 * Basado en estructura de entidad Cliente.java
 * 
 * Campos mostrados según Cliente entity:
 * - idCliente (Long) - ID único
 * - nombre (String, max 100) - Nombre completo
 * - telefono (String, max 20) - Teléfono principal
 * - email (String, max 100) - Email opcional
 * - dni (String, max 20) - DNI único opcional
 * - direccion (String, TEXT) - Dirección opcional
 * - activo (Boolean) - Estado del cliente
 * - createdAt (LocalDateTime) - Fecha de creación
 * - updatedAt (LocalDateTime) - Última actualización
 */
const ClientesList = ({ 
  clientes = [], 
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
  }, [clientes])

  // Datos paginados
  const paginatedClientes = useMemo(() => {
    const startIndex = page * rowsPerPage
    return clientes.slice(startIndex, startIndex + rowsPerPage)
  }, [clientes, page, rowsPerPage])

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

  // Obtener iniciales para avatar
  const getIniciales = (nombre) => {
    if (!nombre) return 'N/A'
    return nombre
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
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

  // Verificar permisos
  const canEdit = hasPermission(user, 'clientes', 'update')
  const canDelete = hasPermission(user, 'clientes', 'delete')
  const canView = hasPermission(user, 'clientes', 'read')
  const isAdmin = user?.rol === 'ADMIN'

  // Mostrar loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
        action={
          onRefresh && (
            <Button color="inherit" size="small" onClick={onRefresh}>
              Reintentar
            </Button>
          )
        }
      >
        {error}
      </Alert>
    )
  }

  // Lista vacía
  if (!clientes || clientes.length === 0) {
    return (
      <Card sx={{ textAlign: 'center', p: 4 }}>
        <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay clientes para mostrar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Cargando clientes...' : 'No se encontraron clientes con los filtros aplicados.'}
        </Typography>
      </Card>
    )
  }

  // Vista móvil - Cards
  if (isMobile) {
    return (
      <Box>
        <Grid container spacing={2}>
          {paginatedClientes.map((cliente) => (
            <Grid item xs={12} key={cliente.idCliente}>
              <Card 
                sx={{ 
                  '&:hover': { 
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <CardContent>
                  {/* Header del card */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getIniciales(cliente.nombre)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        {cliente.nombre || 'Sin nombre'}
                      </Typography>
                      <Tooltip title={
                        isAdmin 
                          ? (cliente.activo ? "Click para desactivar" : "Click para reactivar")
                          : "Solo ADMIN puede cambiar el estado de clientes"
                      }>
                        <Chip
                          label={cliente.activo ? 'Activo' : 'Inactivo'}
                          color={cliente.activo ? 'success' : 'error'}
                          size="small"
                          clickable={isAdmin}
                          onClick={isAdmin && onToggleEstado ? () => onToggleEstado(cliente) : undefined}
                          sx={{ 
                            cursor: isAdmin ? 'pointer' : 'default',
                            '&:hover': isAdmin ? { opacity: 0.8 } : {},
                            opacity: cliente.activo ? 1 : 0.7
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Información del cliente */}
                  <Box sx={{ mb: 2 }}>
                    {cliente.telefono && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {cliente.telefono}
                        </Typography>
                      </Box>
                    )}
                    
                    {cliente.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {cliente.email}
                        </Typography>
                      </Box>
                    )}
                    
                    {cliente.dni && (
                      <Typography variant="body2" color="text.secondary">
                        DNI: {cliente.dni}
                      </Typography>
                    )}
                    
                    {cliente.direccion && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary', mt: 0.2 }} />
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {cliente.direccion}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Fechas */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      <CalendarIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                      Creado: {formatearFecha(cliente.createdAt)}
                    </Typography>
                    {cliente.updatedAt && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Actualizado: {formatearFecha(cliente.updatedAt)}
                      </Typography>
                    )}
                  </Box>

                  {/* Acciones */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {canView && onView && (
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small" 
                          onClick={() => onView(cliente)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {canEdit && onEdit && (
                      <Tooltip title="Editar cliente">
                        <IconButton 
                          size="small" 
                          onClick={() => onEdit(cliente)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {canDelete && onDelete && (
                      <Tooltip title="Eliminar cliente (soft delete)">
                        <IconButton 
                          size="small" 
                          onClick={() => onDelete(cliente)}
                          color="error"
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

        {/* Paginación para móvil */}
        <TablePagination
          component="div"
          count={clientes.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Box>
    )
  }

  // Vista desktop - Tabla
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell>Fechas</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClientes.map((cliente) => (
              <TableRow 
                key={cliente.idCliente}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* Columna Cliente */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getIniciales(cliente.nombre)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {cliente.nombre || 'Sin nombre'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {cliente.idCliente}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Columna Contacto */}
                <TableCell>
                  <Box>
                    {cliente.telefono && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {cliente.telefono}
                      </Typography>
                    )}
                    {cliente.email && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {cliente.email}
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                {/* Columna DNI */}
                <TableCell>
                  {cliente.dni || 'No especificado'}
                </TableCell>

                {/* Columna Dirección */}
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="body2" sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {cliente.direccion || 'No especificada'}
                  </Typography>
                </TableCell>

                {/* Columna Estado */}
                <TableCell align="center">
                  <Tooltip title={
                    isAdmin 
                      ? (cliente.activo ? "Click para desactivar" : "Click para reactivar")
                      : "Solo ADMIN puede cambiar el estado de clientes"
                  }>
                    <Chip
                      label={cliente.activo ? 'Activo' : 'Inactivo'}
                      color={cliente.activo ? 'success' : 'error'}
                      size="small"
                      clickable={isAdmin}
                      onClick={isAdmin && onToggleEstado ? () => onToggleEstado(cliente) : undefined}
                      sx={{ 
                        cursor: isAdmin ? 'pointer' : 'default',
                        '&:hover': isAdmin ? { opacity: 0.8 } : {},
                        opacity: cliente.activo ? 1 : 0.7
                      }}
                    />
                  </Tooltip>
                </TableCell>

                {/* Columna Fechas */}
                <TableCell>
                  <Typography variant="caption" display="block">
                    Creado: {formatearFecha(cliente.createdAt)}
                  </Typography>
                  {cliente.updatedAt && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Actualizado: {formatearFecha(cliente.updatedAt)}
                    </Typography>
                  )}
                </TableCell>

                {/* Columna Acciones */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    {canView && onView && (
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small" 
                          onClick={() => onView(cliente)}
                          color="primary"
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {canEdit && onEdit && (
                      <Tooltip title="Editar cliente">
                        <IconButton 
                          size="small" 
                          onClick={() => onEdit(cliente)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {canDelete && onDelete && (
                      <Tooltip title="Eliminar cliente (soft delete)">
                        <IconButton 
                          size="small" 
                          onClick={() => onDelete(cliente)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
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

      {/* Paginación para desktop */}
      <TablePagination
        component="div"
        count={clientes.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  )
}

ClientesList.propTypes = {
  clientes: PropTypes.arrayOf(PropTypes.shape({
    idCliente: PropTypes.number.isRequired,
    nombre: PropTypes.string,
    telefono: PropTypes.string,
    email: PropTypes.string,
    dni: PropTypes.string,
    direccion: PropTypes.string,
    activo: PropTypes.bool,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string
  })),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  onToggleEstado: PropTypes.func,
  onRefresh: PropTypes.func
}

export default ClientesList
