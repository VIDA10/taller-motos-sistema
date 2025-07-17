import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Button,
  Collapse,
  Badge
} from '@mui/material'
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Inventory as InventoryIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import repuestoService from '../../services/repuestoService'

/**
 * Sistema de alertas de stock mínimo
 * Tarea 5.3: Sistema de alertas de stock mínimo
 */
const StockAlertas = ({ onViewRepuesto, onEditRepuesto }) => {
  const [repuestosSinStock, setRepuestosSinStock] = useState([])
  const [repuestosStockBajo, setRepuestosStockBajo] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({
    sinStock: true,
    stockBajo: true
  })

  // Cargar alertas de stock
  const loadAlertas = async () => {
    try {
      setLoading(true)
      
      // Obtener repuestos sin stock (stock = 0)
      const sinStock = await repuestoService.getWithoutStock()
      setRepuestosSinStock(sinStock.filter(r => r.activo))

      // Obtener repuestos con stock bajo
      const stockBajo = await repuestoService.getLowStock()
      // Filtrar solo los que tienen stock > 0 (los de stock 0 ya están en sinStock)
      setRepuestosStockBajo(stockBajo.filter(r => r.activo && r.stockActual > 0))
      
    } catch (error) {
      console.error('Error al cargar alertas de stock:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar al montar componente
  useEffect(() => {
    loadAlertas()
  }, [])

  // Manejar expansión de secciones
  const handleExpandClick = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Obtener nivel de criticidad del stock
  const getStockLevel = (repuesto) => {
    const { stockActual, stockMinimo } = repuesto
    
    if (stockActual === 0) return 'critical'
    if (stockActual <= stockMinimo * 0.5) return 'danger'
    if (stockActual <= stockMinimo) return 'warning'
    return 'normal'
  }

  // Obtener color según nivel de stock
  const getStockColor = (level) => {
    const colors = {
      critical: '#d32f2f',
      danger: '#f57c00',
      warning: '#ffa000',
      normal: '#388e3c'
    }
    return colors[level] || colors.normal
  }

  // Obtener mensaje de nivel de stock
  const getStockMessage = (level) => {
    const messages = {
      critical: 'SIN STOCK',
      danger: 'CRÍTICO',
      warning: 'BAJO',
      normal: 'NORMAL'
    }
    return messages[level] || messages.normal
  }

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <InventoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Cargando alertas de stock...
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const totalAlertas = repuestosSinStock.length + repuestosStockBajo.length

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Badge badgeContent={totalAlertas} color="error" max={99}>
              <WarningIcon color="warning" />
            </Badge>
            <Typography variant="h6" component="h2">
              Alertas de Stock
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={loadAlertas}
            disabled={loading}
          >
            Actualizar
          </Button>
        </Box>

        {totalAlertas === 0 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              ¡Excelente! No hay alertas de stock críticas. Todos los repuestos activos 
              tienen stock por encima del mínimo establecido.
            </Typography>
          </Alert>
        )}

        {/* Repuestos sin stock */}
        {repuestosSinStock.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="space-between"
              sx={{ cursor: 'pointer' }}
              onClick={() => handleExpandClick('sinStock')}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <ErrorIcon color="error" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Sin Stock
                </Typography>
                <Chip 
                  size="small" 
                  label={repuestosSinStock.length}
                  color="error" 
                />
              </Box>
              <IconButton size="small">
                {expanded.sinStock ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={expanded.sinStock}>
              <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                <Typography variant="body2" component="div">
                  <strong>¡Atención Urgente!</strong> Los siguientes repuestos no tienen stock disponible. 
                  Es necesario reabastecer inmediatamente.
                </Typography>
              </Alert>

              <List dense>
                {repuestosSinStock.map((repuesto, index) => (
                  <ListItem key={repuesto.idRepuesto} divider={index < repuestosSinStock.length - 1}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: repuestoService.getCategoryColor(repuesto.categoria)
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight="bold">
                            {repuesto.codigo}
                          </Typography>
                          <Typography variant="body2">
                            {repuesto.nombre}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            {repuesto.categoria}
                          </Typography>
                          <Chip
                            size="small"
                            label="SIN STOCK"
                            color="error"
                            sx={{ fontSize: '0.65rem', height: 20 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Min: {repuesto.stockMinimo}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box display="flex" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => onViewRepuesto?.(repuesto)}
                          sx={{ color: '#1976d2' }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => onEditRepuesto?.(repuesto)}
                          sx={{ color: '#ed6c02' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        )}

        {/* Separador */}
        {repuestosSinStock.length > 0 && repuestosStockBajo.length > 0 && (
          <Divider sx={{ my: 2 }} />
        )}

        {/* Repuestos con stock bajo */}
        {repuestosStockBajo.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="space-between"
              sx={{ cursor: 'pointer' }}
              onClick={() => handleExpandClick('stockBajo')}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <WarningIcon color="warning" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Stock Bajo
                </Typography>
                <Chip 
                  size="small" 
                  label={repuestosStockBajo.length}
                  color="warning" 
                />
              </Box>
              <IconButton size="small">
                {expanded.stockBajo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={expanded.stockBajo}>
              <Alert severity="warning" sx={{ mt: 1, mb: 2 }}>
                <Typography variant="body2" component="div">
                  <strong>Stock Limitado:</strong> Los siguientes repuestos tienen stock por debajo del mínimo establecido. 
                  Se recomienda reabastecer pronto.
                </Typography>
              </Alert>

              <List dense>
                {repuestosStockBajo.map((repuesto, index) => {
                  const nivel = getStockLevel(repuesto)
                  const porcentaje = Math.round((repuesto.stockActual / repuesto.stockMinimo) * 100)
                  
                  return (
                    <ListItem key={repuesto.idRepuesto} divider={index < repuestosStockBajo.length - 1}>
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: repuestoService.getCategoryColor(repuesto.categoria)
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" fontWeight="bold">
                              {repuesto.codigo}
                            </Typography>
                            <Typography variant="body2">
                              {repuesto.nombre}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              {repuesto.categoria}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="caption">
                                Stock: {repuesto.stockActual}
                              </Typography>
                              <Chip
                                size="small"
                                label={`${porcentaje}%`}
                                sx={{
                                  fontSize: '0.65rem',
                                  height: 20,
                                  backgroundColor: getStockColor(nivel),
                                  color: 'white'
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                Min: {repuesto.stockMinimo}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box display="flex" gap={0.5}>
                          <IconButton
                            size="small"
                            onClick={() => onViewRepuesto?.(repuesto)}
                            sx={{ color: '#1976d2' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => onEditRepuesto?.(repuesto)}
                            sx={{ color: '#ed6c02' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                })}
              </List>
            </Collapse>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default StockAlertas
