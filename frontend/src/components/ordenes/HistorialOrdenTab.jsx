import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material'
import {
  History as HistoryIcon,
  Person as PersonIcon,
  PlayArrow as IniciarIcon,
  Assignment as DiagnosticarIcon,
  Build as TrabajarIcon,
  CheckCircle as CompletarIcon,
  LocalShipping as EntregarIcon,
  Cancel as CancelarIcon,
  Add as AddIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'

// Importar servicio
import ordenHistorialService from '../../services/ordenHistorialService'

/**
 * Tab para visualización del historial de cambios de una orden (Tarea 6.8)
 * Muestra cronológicamente todos los cambios de estado y comentarios
 */
const HistorialOrdenTab = ({ 
  orden, 
  historialCambios = [],
  onHistorialActualizado 
}) => {
  const { user } = useSelector((state) => state.auth)
  
  // Estados del componente
  const [dialogOpen, setDialogOpen] = useState(false)
  const [comentario, setComentario] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Obtener icono según el estado
   */
  const getIconoEstado = (estado) => {
    const iconos = {
      RECIBIDA: <IniciarIcon />,
      DIAGNOSTICADA: <DiagnosticarIcon />,
      EN_PROCESO: <TrabajarIcon />,
      COMPLETADA: <CompletarIcon />,
      ENTREGADA: <EntregarIcon />,
      CANCELADA: <CancelarIcon />
    }
    return iconos[estado] || <HistoryIcon />
  }

  /**
   * Obtener color según el estado
   */
  const getColorEstado = (estado) => {
    const colores = {
      RECIBIDA: 'info',
      DIAGNOSTICADA: 'warning',
      EN_PROCESO: 'primary',
      COMPLETADA: 'success',
      ENTREGADA: 'success',
      CANCELADA: 'error'
    }
    return colores[estado] || 'default'
  }

  /**
   * Formatear fecha para mostrar
   */
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible'
    
    try {
      const fechaObj = new Date(fecha)
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  /**
   * Agregar comentario al historial
   */
  const handleAgregarComentario = async () => {
    if (!comentario.trim()) {
      setError('Debe ingresar un comentario')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await ordenHistorialService.registrarCambioEstado(
        orden.idOrden,
        orden.estado, // Estado anterior (mismo estado actual)
        orden.estado, // Estado nuevo (mismo estado actual)
        comentario.trim(),
        user.idUsuario
      )

      if (result.success) {
        setDialogOpen(false)
        setComentario('')
        if (onHistorialActualizado) {
          onHistorialActualizado()
        }
      } else {
        setError(result.message || 'Error al agregar comentario')
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error)
      setError('Error inesperado al agregar comentario')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cerrar diálogo
   */
  const handleCerrarDialog = () => {
    setDialogOpen(false)
    setComentario('')
    setError(null)
  }

  // Ordenar historial por fecha (más reciente primero)
  const historialOrdenado = [...historialCambios].sort((a, b) => 
    new Date(b.fechaCambio) - new Date(a.fechaCambio)
  )

  return (
    <Box>
      {/* Header con botón agregar comentario */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon />
          Historial de Cambios ({historialCambios.length})
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          disabled={loading}
        >
          Agregar Comentario
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Lista del historial */}
      {historialOrdenado.length === 0 ? (
        <Alert severity="info">
          No hay registros de cambios para esta orden. El historial se genera automáticamente 
          cuando se realizan cambios de estado.
        </Alert>
      ) : (
        <List>
          {historialOrdenado.map((cambio, index) => (
            <React.Fragment key={cambio.idHistorial || index}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${getColorEstado(cambio.estadoNuevo)}.main` }}>
                    {getIconoEstado(cambio.estadoNuevo)}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  sx={{ ml: 1 }}
                  primary={
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2,
                        border: `1px solid`,
                        borderColor: `${getColorEstado(cambio.estadoNuevo)}.light`
                      }}
                    >
                      {/* Header del cambio */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          {/* Cambio de estado */}
                          {cambio.estadoAnterior && cambio.estadoAnterior !== cambio.estadoNuevo ? (
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip 
                                label={cambio.estadoAnterior}
                                size="small"
                                variant="outlined"
                              />
                              <ArrowIcon fontSize="small" />
                              <Chip 
                                label={cambio.estadoNuevo}
                                size="small"
                                color={getColorEstado(cambio.estadoNuevo)}
                              />
                            </Box>
                          ) : (
                            <Chip 
                              label={cambio.estadoNuevo}
                              size="small"
                              color={getColorEstado(cambio.estadoNuevo)}
                            />
                          )}
                        </Box>
                        
                        {/* Fecha */}
                        <Typography variant="caption" color="text.secondary">
                          {formatearFecha(cambio.fechaCambio)}
                        </Typography>
                      </Box>

                      {/* Usuario que realizó el cambio */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {cambio.usuarioCambio?.nombreCompleto || 'Usuario desconocido'}
                          {cambio.usuarioCambio?.rol && ` (${cambio.usuarioCambio.rol})`}
                        </Typography>
                      </Box>

                      {/* Comentario */}
                      {cambio.comentario && (
                        <Typography variant="body2" sx={{ mt: 1, pl: 1, borderLeft: 2, borderColor: 'divider' }}>
                          {cambio.comentario}
                        </Typography>
                      )}
                    </Paper>
                  }
                />
              </ListItem>
              {index < historialOrdenado.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Diálogo para agregar comentario */}
      <Dialog open={dialogOpen} onClose={handleCerrarDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Agregar Comentario al Historial
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
            El comentario se agregará al historial con el estado actual de la orden: 
            <strong> {orden.estado}</strong>
          </Alert>

          <TextField
            fullWidth
            label="Comentario"
            multiline
            rows={4}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Ingrese observaciones, notas técnicas, problemas encontrados, etc..."
            required
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarDialog} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleAgregarComentario}
            variant="contained"
            disabled={loading || !comentario.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {loading ? 'Agregando...' : 'Agregar Comentario'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

HistorialOrdenTab.propTypes = {
  orden: PropTypes.object.isRequired,
  historialCambios: PropTypes.array,
  onHistorialActualizado: PropTypes.func
}

export default HistorialOrdenTab
