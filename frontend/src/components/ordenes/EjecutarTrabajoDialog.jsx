import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material'
import {
  Build as TrabajarIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material'

// Importar los componentes selectores
import ServiciosSelector from './ServiciosSelector'
import RepuestosSelector from './RepuestosSelector'

/**
 * Diálogo para trabajar en una orden (seleccionar servicios y repuestos)
 * La orden debe estar en estado DIAGNOSTICADA → pasa a EN_PROCESO
 */
const EjecutarTrabajoDialog = ({
  open,
  onClose,
  orden,
  onTrabajoIniciado,
  loading = false
}) => {
  // Estados para servicios y repuestos seleccionados
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([])
  const [repuestosSeleccionados, setRepuestosSeleccionados] = useState([])
  const [comentarioTrabajo, setComentarioTrabajo] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState(0) // 0: servicios, 1: repuestos, 2: resumen

  // Resetear estado cuando cambie la orden
  useEffect(() => {
    if (orden) {
      setServiciosSeleccionados([])
      setRepuestosSeleccionados([])
      setComentarioTrabajo('')
      setError('')
      setStep(0)
    }
  }, [orden])

  // Calcular totales
  const totalServicios = serviciosSeleccionados.reduce((sum, s) => sum + (s.precio * s.cantidad), 0)
  const totalRepuestos = repuestosSeleccionados.reduce((sum, r) => sum + (r.precio * r.cantidad), 0)
  const totalGeneral = totalServicios + totalRepuestos

  const handleSubmit = async () => {
    // Validar que se haya seleccionado al menos un servicio
    if (serviciosSeleccionados.length === 0) {
      setError('Debe seleccionar al menos un servicio')
      setStep(0)
      return
    }

    try {
      // Preparar los datos del trabajo
      const trabajoData = {
        orden: {
          ...orden,
          estado: 'EN_PROCESO'
        },
        servicios: serviciosSeleccionados.map(s => ({
          idServicio: s.idServicio,
          cantidad: s.cantidad,
          precio: s.precio,
          comentario: s.comentario || ''
        })),
        repuestos: repuestosSeleccionados.map(r => ({
          idRepuesto: r.idRepuesto,
          cantidad: r.cantidad,
          precio: r.precio,
          comentario: r.comentario || ''
        })),
        comentarioGeneral: comentarioTrabajo,
        totalCalculado: totalGeneral
      }

      // Llamar al callback
      await onTrabajoIniciado(trabajoData)
      
      // Limpiar y cerrar
      handleClose()
    } catch (error) {
      console.error('Error al iniciar trabajo:', error)
      setError('Error al iniciar el trabajo en la orden')
    }
  }

  const handleClose = () => {
    setServiciosSeleccionados([])
    setRepuestosSeleccionados([])
    setComentarioTrabajo('')
    setError('')
    setStep(0)
    onClose()
  }

  const handleNext = () => {
    if (step === 0 && serviciosSeleccionados.length === 0) {
      setError('Debe seleccionar al menos un servicio antes de continuar')
      return
    }
    setError('')
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(prev => prev - 1)
  }

  if (!orden) return null

  const steps = ['Seleccionar Servicios', 'Seleccionar Repuestos', 'Confirmar Trabajo']

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrabajarIcon color="secondary" />
        Ejecutar Trabajo - Orden #{orden.numeroOrden}
      </DialogTitle>

      <DialogContent>
        {/* Información de la orden */}
        <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Información de la Orden
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip label={`Cliente: ${orden.moto?.cliente?.nombre || 'N/A'}`} variant="outlined" />
              <Chip label={`Moto: ${orden.moto?.marca} ${orden.moto?.modelo}`} variant="outlined" />
              <Chip label={`Placa: ${orden.moto?.placa}`} variant="outlined" />
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Diagnóstico:</strong> {orden.diagnostico || 'Sin diagnóstico'}
            </Typography>
          </CardContent>
        </Card>

        {/* Stepper */}
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Contenido según el step */}
        {step === 0 && (
          <ServiciosSelector
            serviciosSeleccionados={serviciosSeleccionados}
            onServiciosChange={setServiciosSeleccionados}
          />
        )}

        {step === 1 && (
          <RepuestosSelector
            repuestosSeleccionados={repuestosSeleccionados}
            onRepuestosChange={setRepuestosSeleccionados}
          />
        )}

        {step === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resumen del Trabajo
            </Typography>
            
            {/* Servicios seleccionados */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Servicios Seleccionados ({serviciosSeleccionados.length})
                </Typography>
                {serviciosSeleccionados.map((servicio, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {servicio.nombre} x{servicio.cantidad}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ${(servicio.precio * servicio.cantidad).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2">Subtotal Servicios:</Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    ${totalServicios.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Repuestos seleccionados */}
            {repuestosSeleccionados.length > 0 && (
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Repuestos Seleccionados ({repuestosSeleccionados.length})
                  </Typography>
                  {repuestosSeleccionados.map((repuesto, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {repuesto.nombre} x{repuesto.cantidad}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ${(repuesto.precio * repuesto.cantidad).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">Subtotal Repuestos:</Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                      ${totalRepuestos.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Total general */}
            <Card sx={{ bgcolor: 'primary.light' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total General:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ${totalGeneral.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          startIcon={<CancelIcon />}
        >
          Cancelar
        </Button>
        
        {step > 0 && (
          <Button
            onClick={handleBack}
            disabled={loading}
          >
            Anterior
          </Button>
        )}
        
        {step < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={loading}
          >
            Siguiente
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
            disabled={loading || serviciosSeleccionados.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
          >
            {loading ? 'Iniciando...' : 'Iniciar Trabajo'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

EjecutarTrabajoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orden: PropTypes.object,
  onTrabajoIniciado: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default EjecutarTrabajoDialog
