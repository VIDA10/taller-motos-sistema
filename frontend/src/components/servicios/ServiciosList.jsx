import { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Tooltip,
  Avatar,
  Divider
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  Code as CodeIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { hasPermission } from '../../utils/permissions'
import servicioService from '../../services/servicioService'

/**
 * Componente de lista de servicios
 * Muestra los servicios en tarjetas con acciones disponibles
 */
const ServiciosList = ({ 
  servicios = [], 
  loading = false,
  onView,
  onEdit, 
  onDelete,
  onToggleActive
}) => {
  const { user } = useSelector((state) => state.auth)
  const [processingId, setProcessingId] = useState(null)

  // Verificar permisos
  const canEdit = hasPermission(user, 'servicios', 'update')
  const canDelete = hasPermission(user, 'servicios', 'delete')

  // Manejar toggle de estado activo
  const handleToggleActive = async (servicio) => {
    if (processingId === servicio.idServicio) return
    
    setProcessingId(servicio.idServicio)
    try {
      await onToggleActive(servicio.idServicio, !servicio.activo)
    } finally {
      setProcessingId(null)
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Card sx={{ height: '300px', backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography color="text.secondary">
                    Cargando...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  // Empty state
  if (servicios.length === 0) {
    return (
      <Card sx={{ textAlign: 'center', py: 8 }}>
        <CardContent>
          <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron servicios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta ajustar los filtros o agregar nuevos servicios
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={3}>
      {servicios.map((servicio) => (
        <Grid item xs={12} sm={6} md={4} key={servicio.idServicio}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              },
              opacity: servicio.activo ? 1 : 0.7,
              borderLeft: `4px solid ${servicioService.getCategoryColor(servicio.categoria)}`
            }}
          >
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
              {/* Header con código y estado */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CodeIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {servicio.codigo}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={servicio.activo ? 'Activo' : 'Inactivo'}
                  color={servicio.activo ? 'success' : 'default'}
                  sx={{
                    backgroundColor: servicio.activo ? '#E8F5E8' : '#FFEBEE',
                    color: servicio.activo ? '#2E7D32' : '#C62828',
                    fontWeight: 'medium'
                  }}
                />
              </Box>

              {/* Nombre del servicio */}
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {servicio.nombre}
              </Typography>

              {/* Categoría */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: servicioService.getCategoryColor(servicio.categoria),
                    fontSize: '12px'
                  }}
                >
                  <CategoryIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {servicio.categoria.replace('_', ' ')}
                </Typography>
              </Box>

              {/* Descripción */}
              {servicio.descripcion && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '60px'
                  }}
                >
                  {servicio.descripcion}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Información de precio y tiempo */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={0.5}>
                  <MoneyIcon color="primary" fontSize="small" />
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {servicioService.formatPrice(servicio.precioBase)}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <TimeIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {servicioService.formatTime(servicio.tiempoEstimadoMinutos)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            {/* Acciones */}
            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
              <Box display="flex" justifyContent="space-between" width="100%">
                {/* Acciones principales */}
                <Box display="flex" gap={1}>
                  <Tooltip title="Ver detalles">
                    <IconButton
                      size="small"
                      onClick={() => onView(servicio)}
                      sx={{ color: '#1976d2' }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {onEdit && canEdit && (
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(servicio)}
                        sx={{ color: '#ed6c02' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {onDelete && canDelete && (
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(servicio)}
                        sx={{ color: '#d32f2f' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {/* Toggle estado activo */}
                {onToggleActive && canEdit && (
                  <Tooltip title={servicio.activo ? 'Desactivar servicio' : 'Activar servicio'}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleActive(servicio)}
                      disabled={processingId === servicio.idServicio}
                      sx={{ 
                        color: servicio.activo ? '#4caf50' : '#757575'
                      }}
                    >
                      {servicio.activo ? <ToggleOnIcon /> : <ToggleOffIcon />}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ServiciosList
