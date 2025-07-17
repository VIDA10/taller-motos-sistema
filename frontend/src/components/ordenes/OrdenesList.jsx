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
  Avatar,
  Badge
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Build as BuildIcon,
  TwoWheeler as TwoWheelerIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material'
import { hasPermission } from '../../utils/permissions'
import { 
  obtenerColorEstado, 
  obtenerColorPrioridad, 
  formatearFecha, 
  formatearMoneda,
  ESTADOS_ORDEN
} from '../../services/ordenService'

/**
 * Componente lista de órdenes de trabajo responsive
 * Basado en estructura de entidad OrdenTrabajo.java y OrdenTrabajoResponseDTO.java
 * 
 * Campos mostrados según estructura real del backend:
 * - idOrden (Long) - ID único
 * - numeroOrden (String) - Número único de orden
 * - moto (objeto) - Información de la moto con cliente anidado
 *   - placa, marca, modelo
 *   - cliente (objeto) - nombre, email, telefono, etc.
 * - mecanicoAsignado (objeto) - Mecánico asignado con nombreCompleto
 * - fechaIngreso (LocalDateTime) - Fecha de ingreso
 * - fechaEstimadaEntrega (LocalDate) - Fecha estimada de entrega
 * - estado (String) - Estado actual de la orden
 * - prioridad (String) - Prioridad de la orden
 * - descripcionProblema (String) - Descripción del problema
 * - totalOrden (BigDecimal) - Total de la orden
 * - estadoPago (String) - Estado del pago
 * - createdAt/updatedAt - Fechas de auditoría
 */
const OrdenesList = ({ 
  ordenes = [], 
  loading = false, 
  error = null,
  onEdit,
  onView,
  onDelete,
  onChangeEstado,
  onAssignMecanico,
  onRefresh,
  customActions,
  hideCreateButton = false
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
  }, [ordenes])

  // Datos paginados
  const paginatedOrdenes = useMemo(() => {
    const startIndex = page * rowsPerPage
    return ordenes.slice(startIndex, startIndex + rowsPerPage)
  }, [ordenes, page, rowsPerPage])

  // Obtener iniciales para avatar
  const getIniciales = (texto) => {
    if (!texto) return '??'
    return texto
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

  // Verificar permisos según rol del usuario
  const canEdit = hasPermission(user, 'ordenes', 'update')
  const canDelete = hasPermission(user, 'ordenes', 'delete')
  const canView = hasPermission(user, 'ordenes', 'read')
  const canAssignMecanico = user?.rol === 'ADMIN' || user?.rol === 'RECEPCIONISTA'
  const canChangeEstado = user?.rol === 'ADMIN' || user?.rol === 'MECANICO'

  // Obtener icono según estado
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case ESTADOS_ORDEN.PENDIENTE:
        return <ScheduleIcon fontSize="small" />
      case ESTADOS_ORDEN.EN_PROCESO:
        return <BuildIcon fontSize="small" />
      case ESTADOS_ORDEN.COMPLETADA:
        return <CheckCircleIcon fontSize="small" />
      case ESTADOS_ORDEN.ENTREGADA:
        return <CheckCircleIcon fontSize="small" />
      case ESTADOS_ORDEN.CANCELADA:
        return <WarningIcon fontSize="small" />
      default:
        return <AssignmentIcon fontSize="small" />
    }
  }

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

  // Vista móvil - Cards
  if (isMobile) {
    if (!ordenes || ordenes.length === 0) {
      return (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay órdenes de trabajo para mostrar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No se encontraron órdenes con los filtros aplicados.
          </Typography>
        </Card>
      )
    }

    return (
      <Box>
        <Grid container spacing={2}>
          {paginatedOrdenes.map((orden) => (
            <Grid item xs={12} key={orden.idOrden}>
              <Card 
                sx={{ 
                  '&:hover': { 
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  },
                  border: `2px solid ${obtenerColorEstado(orden.estado)}20`,
                  borderLeft: `4px solid ${obtenerColorEstado(orden.estado)}`
                }}
              >
                <CardContent>
                  {/* Header del card */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Badge
                      badgeContent={orden.prioridad?.charAt(0)}
                      color={obtenerColorPrioridad(orden.prioridad) === '#ff9800' ? 'warning' : 
                             obtenerColorPrioridad(orden.prioridad) === '#f44336' ? 'error' : 'primary'}
                    >
                      <Avatar sx={{ mr: 2, bgcolor: obtenerColorEstado(orden.estado) }}>
                        {getEstadoIcon(orden.estado)}
                      </Avatar>
                    </Badge>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        #{orden.numeroOrden}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {orden.idOrden}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={orden.estado || 'Sin estado'}
                        color="primary"
                        size="small"
                        icon={getEstadoIcon(orden.estado)}
                        sx={{ 
                          bgcolor: obtenerColorEstado(orden.estado),
                          color: 'white',
                          mb: 0.5
                        }}
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        {orden.prioridad}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Información principal */}
                  <Box sx={{ mb: 2 }}>
                    {/* Cliente */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <strong>Cliente:</strong> {orden.moto?.cliente?.nombre || 'No especificado'}
                      </Typography>
                    </Box>
                    
                    {/* Moto */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TwoWheelerIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <strong>Moto:</strong> {orden.moto?.placa || 'Sin placa'} - {orden.moto?.marca} {orden.moto?.modelo}
                      </Typography>
                    </Box>
                    
                    {/* Mecánico */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BuildIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      {orden.mecanicoAsignado ? (
                        <Typography variant="body2">
                          <strong>Mecánico:</strong> {orden.mecanicoAsignado.nombreCompleto}
                        </Typography>
                      ) : (
                        <Typography variant="body2">
                          <strong>Mecánico:</strong> <span style={{ color: '#ed6c02', fontStyle: 'italic' }}>Sin asignar</span>
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Total */}
                    {orden.totalOrden && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MoneyIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          <strong>Total:</strong> {formatearMoneda(orden.totalOrden)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Descripción del problema */}
                  {orden.descripcionProblema && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        <strong>Problema:</strong> {orden.descripcionProblema}
                      </Typography>
                    </Box>
                  )}

                  {/* Fechas */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      <CalendarIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                      Ingreso: {formatearFecha(orden.fechaIngreso)}
                    </Typography>
                    {orden.fechaEstimadaEntrega && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Entrega estimada: {formatearFecha(orden.fechaEstimadaEntrega)}
                      </Typography>
                    )}
                  </Box>

                  {/* Acciones */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
                    {/* Si hay customActions, usar esas; si no, usar las estándar */}
                    {customActions ? (
                      // Renderizar acciones personalizadas
                      customActions(orden).map((accion, index) => (
                        <Tooltip key={index} title={accion.label}>
                          <IconButton 
                            size="small" 
                            onClick={accion.onClick}
                            color={accion.color || 'primary'}
                          >
                            {accion.icon}
                          </IconButton>
                        </Tooltip>
                      ))
                    ) : (
                      // Acciones estándar
                      <>
                        {canView && onView && (
                          <Tooltip title="Ver detalles">
                            <IconButton 
                              size="small" 
                              onClick={() => onView(orden)}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {canEdit && onEdit && (
                          <Tooltip title="Editar orden">
                            <IconButton 
                              size="small" 
                              onClick={() => onEdit(orden)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {canAssignMecanico && onAssignMecanico && (
                          <Tooltip title="Asignar mecánico">
                            <IconButton 
                              size="small" 
                              onClick={() => onAssignMecanico(orden)}
                              color="primary"
                            >
                              <BuildIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {canDelete && onDelete && (
                          <Tooltip title="Eliminar orden">
                            <IconButton 
                              size="small" 
                              onClick={() => onDelete(orden)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </>
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
          count={ordenes.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Órdenes por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Box>
    )
  }

  // Vista desktop - Tabla (SIEMPRE se muestra con columnas)
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Orden</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Moto</TableCell>
              <TableCell>Mecánico</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Prioridad</TableCell>
              <TableCell>Fechas</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!ordenes || ordenes.length === 0) ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No hay órdenes de trabajo para mostrar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron órdenes con los filtros aplicados.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrdenes.map((orden) => (
                <TableRow 
                  key={orden.idOrden}
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    borderLeft: `4px solid ${obtenerColorEstado(orden.estado)}`
                  }}
                >
                  {/* Columna Orden */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: obtenerColorEstado(orden.estado) }}>
                        {getEstadoIcon(orden.estado)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          #{orden.numeroOrden}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {orden.idOrden}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Columna Cliente */}
                  <TableCell>
                    <Typography variant="body2">
                      {orden.moto?.cliente?.nombre || 'No especificado'}
                    </Typography>
                  </TableCell>

                  {/* Columna Moto */}
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {orden.moto?.placa || 'Sin placa'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {orden.moto?.marca} {orden.moto?.modelo}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Columna Mecánico */}
                  <TableCell>
                    {orden.mecanicoAsignado ? (
                      <Chip
                        label={orden.mecanicoAsignado.nombreCompleto}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        label="Sin asignar"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                  </TableCell>

                  {/* Columna Estado */}
                  <TableCell align="center">
                    <Tooltip title={`Estado: ${orden.estado}`}>
                      <Chip
                        label={orden.estado || 'Sin estado'}
                        size="small"
                        icon={getEstadoIcon(orden.estado)}
                        sx={{ 
                          bgcolor: obtenerColorEstado(orden.estado),
                          color: 'white',
                          '&:hover': { opacity: 0.8 }
                        }}
                      />
                    </Tooltip>
                  </TableCell>

                  {/* Columna Prioridad */}
                  <TableCell align="center">
                    <Chip
                      label={orden.prioridad || 'Normal'}
                      size="small"
                      sx={{ 
                        bgcolor: obtenerColorPrioridad(orden.prioridad),
                        color: 'white'
                      }}
                    />
                  </TableCell>

                  {/* Columna Fechas */}
                  <TableCell>
                    <Typography variant="caption" display="block">
                      <strong>Ingreso:</strong> {formatearFecha(orden.fechaIngreso)}
                    </Typography>
                    {orden.fechaEstimadaEntrega && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        <strong>Entrega:</strong> {formatearFecha(orden.fechaEstimadaEntrega)}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Columna Total */}
                  <TableCell align="right">
                    {orden.totalOrden ? (
                      <Typography variant="body2" fontWeight="medium">
                        {formatearMoneda(orden.totalOrden)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin calcular
                      </Typography>
                    )}
                  </TableCell>

                  {/* Columna Acciones */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      {/* Si hay customActions, usar esas; si no, usar las estándar */}
                      {customActions ? (
                        // Renderizar acciones personalizadas
                        customActions(orden).map((accion, index) => (
                          <Tooltip key={index} title={accion.label}>
                            <IconButton 
                              size="small" 
                              onClick={accion.onClick}
                              color={accion.color || 'primary'}
                            >
                              {accion.icon}
                            </IconButton>
                          </Tooltip>
                        ))
                      ) : (
                        // Acciones estándar
                        <>
                          {canView && onView && (
                            <Tooltip title="Ver detalles">
                              <IconButton 
                                size="small" 
                                onClick={() => onView(orden)}
                                color="primary"
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {canEdit && onEdit && (
                            <Tooltip title="Editar orden">
                              <IconButton 
                                size="small" 
                                onClick={() => onEdit(orden)}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {canAssignMecanico && onAssignMecanico && (
                            <Tooltip title="Asignar mecánico">
                              <IconButton 
                                size="small" 
                                onClick={() => onAssignMecanico(orden)}
                                color="primary"
                              >
                                <BuildIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {canDelete && onDelete && (
                            <Tooltip title="Eliminar orden">
                              <IconButton 
                                size="small" 
                                onClick={() => onDelete(orden)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación para desktop - SIEMPRE visible */}
      <TablePagination
        component="div"
        count={ordenes ? ordenes.length : 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Órdenes por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  )
}

OrdenesList.propTypes = {
  ordenes: PropTypes.arrayOf(PropTypes.shape({
    idOrden: PropTypes.number.isRequired,
    numeroOrden: PropTypes.string,
    moto: PropTypes.shape({
      idMoto: PropTypes.number,
      placa: PropTypes.string,
      marca: PropTypes.string,
      modelo: PropTypes.string,
      cliente: PropTypes.shape({
        idCliente: PropTypes.number,
        nombre: PropTypes.string,
        email: PropTypes.string,
        telefono: PropTypes.string
      })
    }),
    mecanicoAsignado: PropTypes.shape({
      idUsuario: PropTypes.number,
      nombreCompleto: PropTypes.string,
      email: PropTypes.string
    }),
    fechaIngreso: PropTypes.string,
    fechaEstimadaEntrega: PropTypes.string,
    estado: PropTypes.string,
    prioridad: PropTypes.string,
    descripcionProblema: PropTypes.string,
    diagnostico: PropTypes.string,
    observaciones: PropTypes.string,
    totalServicios: PropTypes.number,
    totalRepuestos: PropTypes.number,
    totalOrden: PropTypes.number,
    estadoPago: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string
  })),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  onDelete: PropTypes.func,
  onChangeEstado: PropTypes.func,
  onAssignMecanico: PropTypes.func,
  onRefresh: PropTypes.func
}

export default OrdenesList
