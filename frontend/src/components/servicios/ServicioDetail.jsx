import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Card,
  CardContent,
  Avatar
} from '@mui/material'
import {
  Close as CloseIcon,
  Code as CodeIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  DateRange as DateIcon,
  Update as UpdateIcon
} from '@mui/icons-material'
import servicioService from '../../services/servicioService'

/**
 * Componente para mostrar detalles completos de un servicio
 * Vista de solo lectura con información detallada
 */
const ServicioDetail = ({
  open = false,
  servicio = null,
  onClose
}) => {
  if (!servicio) return null

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                backgroundColor: servicioService.getCategoryColor(servicio.categoria),
                width: 40,
                height: 40
              }}
            >
              <CategoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">
                Detalles del Servicio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {servicio.codigo}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={servicio.activo ? 'Activo' : 'Inactivo'}
            color={servicio.activo ? 'success' : 'default'}
            sx={{
              backgroundColor: servicio.activo ? '#E8F5E8' : '#FFEBEE',
              color: servicio.activo ? '#2E7D32' : '#C62828',
              fontWeight: 'medium'
            }}
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Información básica */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Información Básica
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CodeIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Código
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {servicio.codigo}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CategoryIcon color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Categoría
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: servicioService.getCategoryColor(servicio.categoria)
                            }}
                          />
                          <Typography variant="body1" fontWeight="medium">
                            {servicio.categoria.replace('_', ' ')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre del Servicio
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {servicio.nombre}
                    </Typography>
                  </Grid>

                  {servicio.descripcion && (
                    <Grid item xs={12}>
                      <Box display="flex" gap={1} mb={1}>
                        <DescriptionIcon color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Descripción
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ pl: 4 }}>
                        {servicio.descripcion}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Información comercial */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Información Comercial
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <MoneyIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Precio Base
                    </Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {servicioService.formatPrice(servicio.precioBase)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" alignItems="center" gap={1}>
                  <TimeIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tiempo Estimado
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {servicioService.formatTime(servicio.tiempoEstimadoMinutos)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({servicio.tiempoEstimadoMinutos} minutos)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Información de auditoría */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Información del Sistema
                </Typography>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ID del Servicio
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    #{servicio.idServicio}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <DateIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Creación
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(servicio.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <UpdateIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Última Actualización
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(servicio.updatedAt)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Resumen visual */}
          <Grid item xs={12}>
            <Card 
              variant="outlined" 
              sx={{ 
                backgroundColor: servicio.activo ? '#f8f9fa' : '#ffeaa7',
                borderColor: servicio.activo ? 'success.main' : 'warning.main'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen del Servicio
                </Typography>
                
                <Typography variant="body1">
                  <strong>{servicio.nombre}</strong> es un servicio de{' '}
                  <strong>{servicio.categoria.replace('_', ' ').toLowerCase()}</strong>{' '}
                  con un precio base de{' '}
                  <strong>{servicioService.formatPrice(servicio.precioBase)}</strong>{' '}
                  y un tiempo estimado de ejecución de{' '}
                  <strong>{servicioService.formatTime(servicio.tiempoEstimadoMinutos)}</strong>.
                </Typography>

                {servicio.descripcion && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    "{servicio.descripcion}"
                  </Typography>
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Estado actual: {servicio.activo ? 'Disponible para órdenes de trabajo' : 'No disponible'}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" color="text.secondary">
                      Código:
                    </Typography>
                    <Chip 
                      label={servicio.codigo} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontFamily: 'monospace' }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          variant="contained"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ServicioDetail
