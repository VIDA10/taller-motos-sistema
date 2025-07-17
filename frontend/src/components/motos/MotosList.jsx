import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Divider
} from '@mui/material'
import {
  Visibility,
  Edit,
  Delete,
  Refresh,
  DirectionsCar,
  Build,
  Badge,
  Person,
  Speed,
  Palette,
  CalendarToday,
  Engineering // Agregar icono para mecánico
} from '@mui/icons-material'
import { hasPermission } from '../../utils/permissions'

/**
 * Componente lista de motos responsive
 * Basado en estructura de entidad Moto.java
 * 
 * Campos mostrados según Moto entity:
 * - idMoto (Long) - ID único
 * - cliente (Cliente) - Relación con cliente
 * - marca (String, max 50) - Marca obligatoria
 * - modelo (String, max 50) - Modelo obligatorio
 * - anio (Integer) - Año opcional
 * - placa (String, max 20) - Placa única obligatoria
 * - vin (String, max 50) - VIN opcional
 * - color (String, max 30) - Color opcional
 * - kilometraje (Integer) - Kilometraje default 0
 * - activo (Boolean) - Estado de la moto
 * - createdAt (LocalDateTime) - Fecha de creación
 * - updatedAt (LocalDateTime) - Última actualización
 */
const MotosList = ({ 
  motos = [], 
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
  }, [motos])

  // Datos paginados
  const paginatedMotos = useMemo(() => {
    const startIndex = page * rowsPerPage
    return motos.slice(startIndex, startIndex + rowsPerPage)
  }, [motos, page, rowsPerPage])

  /**
   * Formatear fecha según formato del backend (LocalDateTime)
   */
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada'
    
    try {
      const date = new Date(fecha)
      return date.toLocaleString('es-ES', {
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

  /**
   * Obtener iniciales para avatar (basado en marca + modelo)
   */
  const getIniciales = (marca, modelo) => {
    const marcaInicial = marca ? marca.charAt(0).toUpperCase() : 'M'
    const modeloInicial = modelo ? modelo.charAt(0).toUpperCase() : 'M'
    return `${marcaInicial}${modeloInicial}`
  }

  /**
   * Formatear kilometraje con separador de miles
   */
  const formatearKilometraje = (km) => {
    if (km === null || km === undefined) return '0 km'
    return `${km.toLocaleString('es-ES')} km`
  }

  /**
   * Obtener color del avatar basado en marca
   */
  const getAvatarColor = (marca) => {
    if (!marca) return theme.palette.grey[500]
    
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main
    ]
    
    const hash = marca.toLowerCase().charCodeAt(0) % colors.length
    return colors[hash]
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

  // Verificar permisos según SecurityConfig: hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")
  const canEdit = hasPermission(user, 'motos', 'update')
  const canDelete = hasPermission(user, 'motos', 'delete')
  const canView = hasPermission(user, 'motos', 'read')
  
  // Capacidades específicas por perfil
  const isAdmin = user?.rol === 'ADMIN'
  const isRecepcionista = user?.rol === 'RECEPCIONISTA'
  const isMecanico = user?.rol === 'MECANICO'
  
  // Definir qué botones mostrar según perfil
  const showDeleteButton = isAdmin || isMecanico // Solo ADMIN y MECANICO pueden eliminar

  // Mostrar loading
  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando motos...
        </Typography>
      </Paper>
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
              <Refresh sx={{ mr: 1 }} />
              Reintentar
            </Button>
          )
        }
      >
        <Typography variant="body1">
          Error al cargar las motos: {error}
        </Typography>
      </Alert>
    )
  }

  // Lista vacía
  if (!motos || motos.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <DirectionsCar sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No hay motos registradas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Las motos aparecerán aquí una vez que se registren en el sistema
        </Typography>
      </Paper>
    )
  }

  // Vista móvil - Cards
  if (isMobile) {
    return (
      <Box>
        <Grid container spacing={2}>
          {paginatedMotos.map((moto) => (
            <Grid item xs={12} key={moto.idMoto}>
              <Card elevation={2}>
                <CardContent>
                  {/* Header del card con avatar y info principal */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getAvatarColor(moto.marca),
                        mr: 2,
                        width: 48,
                        height: 48
                      }}
                    >
                      {getIniciales(moto.marca, moto.modelo)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        {moto.marca} {moto.modelo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: #{moto.idMoto} • Placa: {moto.placa}
                      </Typography>
                    </Box>
                    <Tooltip title={
                      (canEdit || canDelete) 
                        ? (moto.activo ? "Click para desactivar" : "Click para reactivar")
                        : "No tienes permisos para cambiar el estado de motos"
                    }>
                      <Chip
                        label={moto.activo ? 'Activa' : 'Inactiva'}
                        color={moto.activo ? 'success' : 'error'}
                        size="small"
                        clickable={canEdit || canDelete}
                        onClick={(canEdit || canDelete) && onToggleEstado ? () => onToggleEstado(moto) : undefined}
                        sx={{ 
                          cursor: (canEdit || canDelete) ? 'pointer' : 'default',
                          '&:hover': (canEdit || canDelete) ? { opacity: 0.8 } : {},
                          opacity: moto.activo ? 1 : 0.7
                        }}
                      />
                    </Tooltip>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Información de la moto */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          <strong>Cliente:</strong> {moto.cliente?.nombre || 'No especificado'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          <strong>Año:</strong> {moto.anio || 'No especificado'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Speed fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          <strong>Kilometraje:</strong> {formatearKilometraje(moto.kilometraje)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {moto.vin && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Badge fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            <strong>VIN:</strong> {moto.vin}
                          </Typography>
                        </Box>
                      )}

                      {moto.color && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Palette fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            <strong>Color:</strong> {moto.color}
                          </Typography>
                        </Box>
                      )}

                      {/* Fechas */}
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          <CalendarToday sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                          Creado: {formatearFecha(moto.createdAt)}
                        </Typography>
                        {moto.updatedAt && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Actualizado: {formatearFecha(moto.updatedAt)}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>

                {/* Acciones del card */}
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                  {canView && (
                    <Tooltip title={`Ver detalle ${isMecanico ? '(técnico)' : isAdmin ? '(completo)' : '(básico)'}`}>
                      <IconButton 
                        size="small" 
                        onClick={() => onView && onView(moto)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  )}

                  {canEdit && (
                    <Tooltip title={`Editar ${isMecanico ? '(técnico)' : isAdmin ? '(completo)' : '(básico)'}`}>
                      <IconButton 
                        size="small" 
                        onClick={() => onEdit && onEdit(moto)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Botón Eliminar - Solo ADMIN y MECANICO */}
                  {showDeleteButton && canDelete && (
                    <Tooltip title={`Eliminar ${isAdmin ? '(soft/permanente)' : '(soft delete)'}`}>
                      <IconButton 
                        size="small" 
                        onClick={() => onDelete && onDelete(moto)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Paginación móvil */}
        <TablePagination
          component="div"
          count={motos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Motos por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Box>
    )
  }

  // Vista desktop - Tabla
  return (
    <Paper elevation={2}>
      <TableContainer>
        <Table stickyHeader aria-label="tabla de motos">
          <TableHead>
            <TableRow>
              <TableCell>Moto</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>VIN</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Kilometraje</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fechas</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMotos.map((moto) => (
              <TableRow 
                key={moto.idMoto}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* Columna Moto (Marca + Modelo) */}
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {moto.marca} {moto.modelo}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: #{moto.idMoto}
                  </Typography>
                </TableCell>

                {/* Columna Cliente */}
                <TableCell>
                  <Typography variant="body2">
                    {moto.cliente?.nombre || 'No especificado'}
                  </Typography>
                </TableCell>

                {/* Columna Placa */}
                <TableCell>
                  <Chip
                    label={moto.placa}
                    variant="outlined"
                    size="small"
                    icon={<Badge />}
                  />
                </TableCell>

                {/* Columna Año */}
                <TableCell>
                  <Typography variant="body2">
                    {moto.anio || '-'}
                  </Typography>
                </TableCell>

                {/* Columna VIN */}
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {moto.vin || '-'}
                  </Typography>
                </TableCell>

                {/* Columna Color */}
                <TableCell>
                  <Typography variant="body2">
                    {moto.color || '-'}
                  </Typography>
                </TableCell>

                {/* Columna Kilometraje */}
                <TableCell>
                  <Typography variant="body2">
                    {formatearKilometraje(moto.kilometraje)}
                  </Typography>
                </TableCell>

                {/* Columna Estado */}
                <TableCell>
                  <Tooltip title={
                    (canEdit || canDelete) 
                      ? (moto.activo ? "Click para desactivar" : "Click para reactivar")
                      : "No tienes permisos para cambiar el estado de motos"
                  }>
                    <Chip
                      label={moto.activo ? 'Activa' : 'Inactiva'}
                      color={moto.activo ? 'success' : 'error'}
                      size="small"
                      clickable={canEdit || canDelete}
                      onClick={(canEdit || canDelete) && onToggleEstado ? () => onToggleEstado(moto) : undefined}
                      sx={{ 
                        cursor: (canEdit || canDelete) ? 'pointer' : 'default',
                        '&:hover': (canEdit || canDelete) ? { opacity: 0.8 } : {},
                        opacity: moto.activo ? 1 : 0.7
                      }}
                    />
                  </Tooltip>
                </TableCell>

                {/* Columna Fechas */}
                <TableCell>
                  <Typography variant="caption" display="block">
                    Creado: {formatearFecha(moto.createdAt)}
                  </Typography>
                  {moto.updatedAt && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Actualizado: {formatearFecha(moto.updatedAt)}
                    </Typography>
                  )}
                </TableCell>

                {/* Columna Acciones */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {canView && (
                      <Tooltip title={`Ver detalle ${isMecanico ? '(info técnica)' : isAdmin ? '(completo + historial)' : '(información básica)'}`}>
                        <IconButton 
                          size="small" 
                          onClick={() => onView && onView(moto)}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    )}

                    {canEdit && (
                      <Tooltip title={`Editar moto ${isMecanico ? '(técnico)' : isAdmin ? '(completo)' : '(básico)'}`}>
                        <IconButton 
                          size="small" 
                          onClick={() => onEdit && onEdit(moto)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Botón Eliminar - Solo ADMIN y MECANICO */}
                    {showDeleteButton && canDelete && (
                      <Tooltip title={`Eliminar moto ${isAdmin ? '(soft/permanente)' : '(soft delete)'}`}>
                        <IconButton 
                          size="small" 
                          onClick={() => onDelete && onDelete(moto)}
                          color="error"
                        >
                          <Delete />
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
        count={motos.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Motos por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </Paper>
  )
}

MotosList.propTypes = {
  motos: PropTypes.arrayOf(PropTypes.shape({
    idMoto: PropTypes.number.isRequired,
    cliente: PropTypes.shape({
      idCliente: PropTypes.number,
      nombre: PropTypes.string
    }),
    marca: PropTypes.string,
    modelo: PropTypes.string,
    anio: PropTypes.number,
    placa: PropTypes.string,
    vin: PropTypes.string,
    color: PropTypes.string,
    kilometraje: PropTypes.number,
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

export default MotosList
