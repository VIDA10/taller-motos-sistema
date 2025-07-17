import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Alert
} from '@mui/material'
import {
  DirectionsCar,
  Person,
  Badge,
  Assignment,
  Palette,
  Speed,
  CalendarToday,
  Engineering,
  LocalHospital,
  History,
  Build,
  Close,
  Edit,
  Info
} from '@mui/icons-material'

/**
 * Modal de detalle adaptativo para motos según perfil
 * 
 * ADMIN: Información completa + historial + auditoría
 * RECEPCIONISTA: Información básica + información técnica (solo lectura)
 * MECANICO: Información técnica + historial de mantenimientos
 * TODOS: Pueden ver información técnica y diagnósticos
 */
const MotoDetail = ({
  open = false,
  onClose,
  moto = null,
  onEdit = null,
  loading = false
}) => {
  const { user } = useSelector((state) => state.auth)

  // Determinar capacidades según perfil
  const isAdmin = user?.rol === 'ADMIN'
  const isRecepcionista = user?.rol === 'RECEPCIONISTA'
  const isMecanico = user?.rol === 'MECANICO'

  if (!moto) return null

  /**
   * Formatear fecha para mostrar
   */
  const formatDate = (fecha) => {
    if (!fecha) return 'No especificada'
    try {
      return new Date(fecha).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  /**
   * Obtener color del estado técnico
   */
  const getEstadoTecnicoColor = (estado) => {
    switch (estado) {
      case 'OPERATIVA': return 'success'
      case 'EN_REPARACION': return 'warning'
      case 'FUERA_SERVICIO': return 'error'
      default: return 'default'
    }
  }

  /**
   * Obtener iniciales para avatar
   */
  const getInitials = (marca, modelo) => {
    const m1 = marca ? marca.charAt(0).toUpperCase() : 'M'
    const m2 = modelo ? modelo.charAt(0).toUpperCase() : 'M'
    return `${m1}${m2}`
  }

  /**
   * Mock de historial para ADMIN (TODO: implementar desde backend)
   */
  const mockHistorial = [
    { fecha: '2025-06-20T10:30:00', accion: 'Actualización de kilometraje', usuario: 'mecanico1', detalle: '15,500 km → 16,200 km' },
    { fecha: '2025-06-15T14:20:00', accion: 'Cambio de color', usuario: 'recepcionista1', detalle: 'Azul → Rojo' },
    { fecha: '2025-06-01T09:00:00', accion: 'Registro inicial', usuario: 'recepcionista1', detalle: 'Moto registrada en el sistema' }
  ]

  /**
   * Mock de mantenimientos para MECANICO (TODO: implementar desde backend)
   */
  const mockMantenimientos = [
    { fecha: '2025-06-20', tipo: 'Cambio de aceite', tecnico: 'Juan Mecánico', estado: 'Completado' },
    { fecha: '2025-05-15', tipo: 'Revisión frenos', tecnico: 'Pedro Técnico', estado: 'Completado' },
    { fecha: '2025-04-10', tipo: 'Mantenimiento general', tecnico: 'Juan Mecánico', estado: 'Completado' }
  ]

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              {getInitials(moto.marca, moto.modelo)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {moto.marca} {moto.modelo} {moto.anio && `(${moto.anio})`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: #{moto.idMoto} • Placa: {moto.placa}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Chip 
              label={`Perfil: ${user?.rol}`}
              size="small"
              color={isAdmin ? 'error' : isRecepcionista ? 'warning' : 'success'}
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* INFORMACIÓN BÁSICA - Todos los perfiles */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Info />
                  Información Básica
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText 
                      primary="Cliente" 
                      secondary={moto.cliente?.nombre || 'No especificado'} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><DirectionsCar /></ListItemIcon>
                    <ListItemText 
                      primary="Marca" 
                      secondary={moto.marca} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><Build /></ListItemIcon>
                    <ListItemText 
                      primary="Modelo" 
                      secondary={moto.modelo} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><CalendarToday /></ListItemIcon>
                    <ListItemText 
                      primary="Año" 
                      secondary={moto.anio || 'No especificado'} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><Badge /></ListItemIcon>
                    <ListItemText 
                      primary="Placa" 
                      secondary={moto.placa} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><Assignment /></ListItemIcon>
                    <ListItemText 
                      primary="VIN" 
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {moto.vin || 'No registrado'}
                          </Typography>
                          {isRecepcionista && (
                            <Chip label="Solo lectura" size="small" variant="outlined" />
                          )}
                        </Box>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><Palette /></ListItemIcon>
                    <ListItemText 
                      primary="Color" 
                      secondary={moto.color || 'No especificado'} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><Speed /></ListItemIcon>
                    <ListItemText 
                      primary="Kilometraje" 
                      secondary={`${moto.kilometraje?.toLocaleString() || 0} km`} 
                    />
                  </ListItem>
                </List>

                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={moto.activo ? 'Activa' : 'Inactiva'}
                    color={moto.activo ? 'success' : 'error'}
                    variant="filled"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* INFORMACIÓN TÉCNICA - Visible para TODOS los perfiles */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Engineering />
                  Información Técnica
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon><LocalHospital /></ListItemIcon>
                    <ListItemText 
                      primary="Estado Técnico" 
                      secondary={
                        <Chip 
                          label={moto.estadoTecnico || 'OPERATIVA'}
                          color={getEstadoTecnicoColor(moto.estadoTecnico)}
                          size="small"
                        />
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><CalendarToday /></ListItemIcon>
                    <ListItemText 
                      primary="Última Revisión" 
                      secondary={moto.ultimaRevision ? formatDate(moto.ultimaRevision) : 'No registrada'} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon><CalendarToday /></ListItemIcon>
                    <ListItemText 
                      primary="Próximo Mantenimiento" 
                      secondary={moto.proximoMantenimiento ? formatDate(moto.proximoMantenimiento) : 'No programado'} 
                    />
                  </ListItem>
                </List>

                {moto.diagnosticoActual && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Diagnóstico Actual:
                    </Typography>
                    <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                      {moto.diagnosticoActual}
                    </Alert>
                  </Box>
                )}

                {moto.observacionesTecnicas && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Observaciones Técnicas:
                    </Typography>
                    <Typography variant="body2">
                      {moto.observacionesTecnicas}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* ESTADÍSTICAS E INFO ADICIONAL - ADMIN y RECEPCIONISTA */}
          {(isAdmin || isRecepcionista) && (
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Assignment />
                    Información Adicional
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Fecha de Registro" 
                        secondary={formatDate(moto.createdAt)} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="Última Actualización" 
                        secondary={formatDate(moto.updatedAt)} 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="Órdenes de Trabajo" 
                        secondary="8 registradas" // TODO: obtener del backend
                      />
                    </ListItem>
                  </List>

                  {/* Observaciones Admin solo para ADMIN */}
                  {isAdmin && moto.observacionesAdmin && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Observaciones Administrativas:
                      </Typography>
                      <Typography variant="body2">
                        {moto.observacionesAdmin}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* HISTORIAL DE CAMBIOS - Solo ADMIN */}
          {isAdmin && (
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <History />
                    Historial de Cambios
                  </Typography>
                  
                  <List>
                    {mockHistorial.map((item, index) => (
                      <ListItem key={index} divider={index < mockHistorial.length - 1}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1">
                                {item.accion}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(item.fecha)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {item.detalle}
                              </Typography>
                              <Typography variant="caption">
                                Usuario: {item.usuario}
                              </Typography>
                            </Box>
                          }
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* HISTORIAL DE MANTENIMIENTOS - Solo MECANICO */}
          {isMecanico && (
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Build />
                    Historial de Mantenimientos
                  </Typography>
                  
                  <List>
                    {mockMantenimientos.map((item, index) => (
                      <ListItem key={index} divider={index < mockMantenimientos.length - 1}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1">
                                {item.tipo}
                              </Typography>
                              <Chip 
                                label={item.estado} 
                                size="small" 
                                color="success" 
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Fecha: {formatDate(item.fecha)}
                              </Typography>
                              <Typography variant="caption">
                                Técnico: {item.tecnico}
                              </Typography>
                            </Box>
                          }
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          startIcon={<Close />}
        >
          Cerrar
        </Button>
        
        {onEdit && (
          <Button 
            onClick={() => onEdit(moto)} 
            variant="contained" 
            color="primary"
            startIcon={<Edit />}
            disabled={loading}
          >
            Editar Moto
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

MotoDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  moto: PropTypes.object,
  onEdit: PropTypes.func,
  loading: PropTypes.bool
}

export default MotoDetail
