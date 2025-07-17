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
  Tooltip,
  Avatar,
  Divider,
  LinearProgress,
  Alert
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  Code as CodeIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { hasPermission } from '../../utils/permissions'
import repuestoService from '../../services/repuestoService'

/**
 * Componente de lista de repuestos
 * Muestra el inventario de repuestos con stock actual y alertas
 */
const RepuestosList = ({ 
  repuestos = [], 
  loading = false,
  onView,
  onEdit, 
  onDelete,
  onToggleActive
}) => {
  const { user } = useSelector((state) => state.auth)
  const [processingId, setProcessingId] = useState(null)

  // Verificar permisos
  const canEdit = hasPermission(user, 'repuestos', 'update')
  const canDelete = hasPermission(user, 'repuestos', 'delete')

  // Manejar toggle de estado activo
  const handleToggleActive = async (repuesto) => {
    if (!onToggleActive || processingId === repuesto.idRepuesto) return
    
    setProcessingId(repuesto.idRepuesto)
    try {
      await onToggleActive(repuesto.idRepuesto, !repuesto.activo)
    } finally {
      setProcessingId(null)
    }
  }

  // Renderizar indicador de stock
  const renderStockIndicator = (repuesto) => {
    const stockStatus = repuestoService.getStockStatus(repuesto.stockActual, repuesto.stockMinimo)
    const percentage = Math.min((repuesto.stockActual / (repuesto.stockMinimo * 3)) * 100, 100)

    return (
      <Box sx={{ mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Stock Actual
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" fontWeight="bold">
              {repuestoService.formatStock(repuesto.stockActual)}
            </Typography>
            <Chip
              size="small"
              label={stockStatus.label}
              sx={{
                backgroundColor: `${stockStatus.color}20`,
                color: stockStatus.color,
                fontWeight: 'medium'
              }}
            />
          </Box>
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#f5f5f5',
            '& .MuiLinearProgress-bar': {
              backgroundColor: stockStatus.color,
              borderRadius: 4
            }
          }}
        />
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="caption" color="text.secondary">
            Stock Mínimo: {repuesto.stockMinimo}
          </Typography>
          {repuesto.stockActual <= repuesto.stockMinimo && (
            <Box display="flex" alignItems="center" gap={0.5}>
              {repuesto.stockActual === 0 ? (
                <ErrorIcon color="error" fontSize="small" />
              ) : (
                <WarningIcon color="warning" fontSize="small" />
              )}
              <Typography variant="caption" color={stockStatus.color} fontWeight="medium">
                ¡Alerta de Stock!
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  // Loading skeleton
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Card sx={{ height: '400px', backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography color="text.secondary">
                    Cargando inventario...
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
  if (repuestos.length === 0) {
    return (
      <Card sx={{ textAlign: 'center', py: 8 }}>
        <CardContent>
          <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron repuestos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta ajustar los filtros o agregar nuevos repuestos al inventario
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={3}>
      {repuestos.map((repuesto) => {
        const stockStatus = repuestoService.getStockStatus(repuesto.stockActual, repuesto.stockMinimo)
        
        return (
          <Grid item xs={12} sm={6} md={4} key={repuesto.idRepuesto}>
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
                opacity: repuesto.activo ? 1 : 0.7,
                borderLeft: `4px solid ${repuestoService.getCategoryColor(repuesto.categoria)}`,
                ...(repuesto.stockActual <= repuesto.stockMinimo && {
                  borderTop: `2px solid ${stockStatus.color}`
                })
              }}
            >
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {/* Header con código y estado */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CodeIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      {repuesto.codigo}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={repuesto.activo ? 'Activo' : 'Inactivo'}
                    color={repuesto.activo ? 'success' : 'default'}
                    sx={{
                      backgroundColor: repuesto.activo ? '#E8F5E8' : '#FFEBEE',
                      color: repuesto.activo ? '#2E7D32' : '#C62828',
                      fontWeight: 'medium'
                    }}
                  />
                </Box>

                {/* Alerta de stock crítico */}
                {repuesto.stockActual === 0 && (
                  <Alert severity="error" sx={{ mb: 2, py: 0.5 }}>
                    <Typography variant="caption" fontWeight="bold">
                      ¡SIN STOCK DISPONIBLE!
                    </Typography>
                  </Alert>
                )}
                {repuesto.stockActual > 0 && repuesto.stockActual <= repuesto.stockMinimo && (
                  <Alert severity="warning" sx={{ mb: 2, py: 0.5 }}>
                    <Typography variant="caption" fontWeight="bold">
                      ¡Stock por debajo del mínimo!
                    </Typography>
                  </Alert>
                )}

                {/* Nombre del repuesto */}
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
                  {repuesto.nombre}
                </Typography>

                {/* Categoría */}
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: repuestoService.getCategoryColor(repuesto.categoria),
                      fontSize: '12px'
                    }}
                  >
                    <CategoryIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {repuesto.categoria || 'Sin categoría'}
                  </Typography>
                </Box>

                {/* Descripción */}
                {repuesto.descripcion && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '40px'
                    }}
                  >
                    {repuesto.descripcion}
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Indicador de stock */}
                {renderStockIndicator(repuesto)}

                <Divider sx={{ my: 2 }} />

                {/* Información de precio */}
                <Box display="flex" alignItems="center" gap={0.5}>
                  <MoneyIcon color="primary" fontSize="small" />
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {repuestoService.formatPrice(repuesto.precioUnitario)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    /unidad
                  </Typography>
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
                        onClick={() => onView(repuesto)}
                        sx={{ color: '#1976d2' }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {onEdit && canEdit && (
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(repuesto)}
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
                          onClick={() => onDelete(repuesto)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>

                  {/* Toggle estado activo */}
                  {onToggleActive && canEdit && (
                    <Tooltip title={repuesto.activo ? 'Desactivar repuesto' : 'Activar repuesto'}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleActive(repuesto)}
                        disabled={processingId === repuesto.idRepuesto}
                        sx={{ 
                          color: repuesto.activo ? '#4caf50' : '#757575'
                        }}
                      >
                        {repuesto.activo ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </CardActions>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default RepuestosList
