import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent
} from '@mui/material'
import {
  Close as CloseIcon,
  Person as PersonIcon,
  DirectionsBike as BikeIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Money as MoneyIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'

/**
 * Componente para mostrar detalles completos de una orden de trabajo
 * con información específica según el contexto del estado
 */
const OrdenDetail = ({ 
  open = true, 
  onClose, 
  orden,
  onEdit,
  onAssignMecanico,
  canEdit = false,
  canAssignMecanico = false,
  estadoContext = null, // Contexto específico del estado para mostrar info relevante
  mecanicoView = false, // Vista específica del mecánico
  inline = false // Si es true, renderiza solo el contenido sin Dialog
}) => {
  if (!orden) return null

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada'
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatearMoneda = (cantidad) => {
    if (!cantidad) return 'S/ 0.00'
    return `S/ ${parseFloat(cantidad).toFixed(2)}`
  }

  const obtenerColorEstado = (estado) => {
    const colores = {
      'RECIBIDA': '#1976d2',
      'DIAGNOSTICADA': '#ed6c02',
      'EN_PROCESO': '#2e7d32',
      'COMPLETADA': '#9c27b0',
      'ENTREGADA': '#388e3c',
      'CANCELADA': '#d32f2f'
    }
    return colores[estado] || '#757575'
  }

  const obtenerColorPrioridad = (prioridad) => {
    const colores = {
      'BAJA': '#4caf50',
      'NORMAL': '#2196f3',
      'ALTA': '#ff9800',
      'URGENTE': '#f44336'
    }
    return colores[prioridad] || '#757575'
  }

  /**
   * Obtener información específica del estado según el contexto
   */
  const obtenerInfoPorEstado = (estadoContext, orden) => {
    const infoEstados = {
      'NUEVA': {
        titulo: 'Orden Nueva - Pendiente de Asignación',
        descripcion: 'Esta orden acaba de ser creada y está esperando ser asignada a un mecánico.',
        enfoque: ['cliente', 'moto', 'problema'],
        acciones: ['Revisar información del cliente', 'Verificar datos de la moto', 'Asignar mecánico']
      },
      'DIAGNOSTICADA': {
        titulo: 'Orden Diagnosticada - Lista para Iniciar Trabajo',
        descripcion: 'El diagnóstico ha sido completado. La orden está lista para que el mecánico inicie el trabajo.',
        enfoque: ['diagnostico', 'estimacion', 'servicios'],
        acciones: ['Revisar diagnóstico', 'Confirmar servicios necesarios', 'Iniciar trabajo']
      },
      'EN_PROCESO': {
        titulo: 'Orden en Proceso - Trabajo en Ejecución',
        descripcion: 'El mecánico está trabajando activamente en esta orden. Se pueden registrar servicios y repuestos.',
        enfoque: ['progreso', 'servicios', 'repuestos', 'tiempo'],
        acciones: ['Registrar servicios aplicados', 'Agregar repuestos utilizados', 'Actualizar progreso']
      },
      'COMPLETADA': {
        titulo: 'Orden Completada - Trabajo Finalizado',
        descripcion: 'El trabajo ha sido completado exitosamente. La orden está lista para entrega.',
        enfoque: ['resumen', 'costos', 'tiempo_total', 'calidad'],
        acciones: ['Revisar trabajo realizado', 'Verificar costos finales', 'Preparar para entrega']
      }
    }
    
    return infoEstados[estadoContext] || {
      titulo: 'Detalles de la Orden',
      descripcion: 'Información general de la orden de trabajo.',
      enfoque: ['general'],
      acciones: ['Ver información completa']
    }
  }

  const infoEstado = obtenerInfoPorEstado(estadoContext, orden)

  // Contenido principal que se puede usar con o sin Dialog
  const contenidoPrincipal = (
    <>
      {/* Título contextual solo cuando es inline */}
      {inline && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="div" gutterBottom>
            Orden de Trabajo #{orden.numeroOrden}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            {infoEstado.titulo}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Contexto específico del estado */}
        {estadoContext && (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'inherit' }}>
                  📋 {infoEstado.titulo}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'inherit', opacity: 0.9 }}>
                  {infoEstado.descripcion}
                </Typography>
                
                {infoEstado.acciones.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'inherit' }}>
                      Acciones recomendadas:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {infoEstado.acciones.map((accion, index) => (
                        <Chip
                          key={index}
                          label={accion}
                          size="small"
                          sx={{ 
                            bgcolor: 'primary.dark',
                            color: 'primary.contrastText',
                            '&:hover': { bgcolor: 'primary.main' }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
          
          {/* Información básica */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Información General
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Estado
                      </Typography>
                      <Chip
                        label={orden.estado || 'Sin estado'}
                        size="small"
                        sx={{ 
                          bgcolor: obtenerColorEstado(orden.estado),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Prioridad
                      </Typography>
                      <Chip
                        label={orden.prioridad || 'Sin prioridad'}
                        size="small"
                        sx={{ 
                          bgcolor: obtenerColorPrioridad(orden.prioridad),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <CalendarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        Fecha de Ingreso
                      </Typography>
                      <Typography variant="body1">
                        {formatearFecha(orden.fechaIngreso)}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        Fecha Estimada de Entrega
                      </Typography>
                      <Typography variant="body1">
                        {formatearFecha(orden.fechaEstimadaEntrega)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Cliente y Moto */}
          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Cliente
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Nombre:</strong> {orden.moto?.cliente?.nombre || 'No especificado'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Teléfono:</strong> {orden.moto?.cliente?.telefono || 'No especificado'}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {orden.moto?.cliente?.email || 'No especificado'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  <BikeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Motocicleta
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Placa:</strong> {orden.moto?.placa || 'Sin placa'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Marca:</strong> {orden.moto?.marca || 'No especificada'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Modelo:</strong> {orden.moto?.modelo || 'No especificado'}
                </Typography>
                <Typography variant="body1">
                  <strong>Año:</strong> {orden.moto?.anio || 'No especificado'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Mecánico */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  <BuildIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Mecánico Asignado
                </Typography>
                
                {orden.mecanicoAsignado ? (
                  <Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Nombre:</strong> {orden.mecanicoAsignado.nombreCompleto}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {orden.mecanicoAsignado.email || 'No especificado'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Especialidad:</strong> {orden.mecanicoAsignado.especialidad || 'General'}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      Sin mecánico asignado
                    </Typography>
                    {canAssignMecanico && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onAssignMecanico(orden)}
                        startIcon={<BuildIcon />}
                      >
                        Asignar Mecánico
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Descripción del problema */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Descripción del Problema
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {orden.descripcionProblema || 'No especificada'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Diagnóstico */}
          {orden.diagnostico && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Diagnóstico
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {orden.diagnostico}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Observaciones */}
          {orden.observaciones && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Observaciones
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {orden.observaciones}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Información financiera */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Información Financiera
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total Servicios
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatearMoneda(orden.totalServicios)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total Repuestos
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatearMoneda(orden.totalRepuestos)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total Orden
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      {formatearMoneda(orden.totalOrden)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Estado de Pago
                    </Typography>
                    <Chip
                      label={orden.estadoPago || 'Pendiente'}
                      size="small"
                      color={orden.estadoPago === 'PAGADO' ? 'success' : 'warning'}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    )

  // Si es modo inline, devolver solo el contenido
  if (inline) {
    return contenidoPrincipal
  }

  // Si no es inline, envolver en Dialog
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box>
          <Typography variant="h6" component="div">
            Orden de Trabajo #{orden.numeroOrden}
          </Typography>
          <Typography variant="subtitle2" color="primary" sx={{ mt: 0.5 }}>
            {infoEstado.titulo}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="cerrar"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {contenidoPrincipal}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onEdit(orden)}
            startIcon={<AssignmentIcon />}
          >
            Editar Orden
          </Button>
        )}
        
        {canAssignMecanico && !orden.mecanicoAsignado && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onAssignMecanico(orden)}
            startIcon={<BuildIcon />}
          >
            Asignar Mecánico
          </Button>
        )}
        
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrdenDetail
