import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Assignment as DiagnosticoIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'

/**
 * Diálogo para realizar diagnóstico de una orden
 * El mecánico ingresa el diagnóstico y la orden pasa de RECIBIDA → DIAGNOSTICADA
 */
const DiagnosticoDialog = ({
  open,
  onClose,
  orden,
  onDiagnosticoCompleto,
  loading = false
}) => {
  const [diagnostico, setDiagnostico] = useState(orden?.diagnostico || '')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    // Validar que se ingrese un diagnóstico
    if (!diagnostico.trim()) {
      setError('El diagnóstico es obligatorio')
      return
    }

    if (diagnostico.trim().length < 10) {
      setError('El diagnóstico debe tener al menos 10 caracteres')
      return
    }

    try {
      // Llamar al callback con el diagnóstico
      await onDiagnosticoCompleto({
        ...orden,
        diagnostico: diagnostico.trim(),
        estado: 'DIAGNOSTICADA'
      })
      
      // Limpiar y cerrar
      setDiagnostico('')
      setError('')
      onClose()
    } catch (error) {
      console.error('Error al guardar diagnóstico:', error)
      setError('Error al guardar el diagnóstico')
    }
  }

  const handleClose = () => {
    setDiagnostico(orden?.diagnostico || '')
    setError('')
    onClose()
  }

  if (!orden) return null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DiagnosticoIcon color="warning" />
        Diagnosticar Orden #{orden.numeroOrden}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Cliente:</strong> {orden.moto?.cliente?.nombre || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Moto:</strong> {orden.moto?.marca} {orden.moto?.modelo} - {orden.moto?.placa}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Problema reportado:</strong> {orden.descripcionProblema}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Diagnóstico Técnico"
          placeholder="Ingrese el diagnóstico detallado del problema encontrado..."
          multiline
          rows={6}
          fullWidth
          value={diagnostico}
          onChange={(e) => {
            setDiagnostico(e.target.value)
            if (error) setError('')
          }}
          disabled={loading}
          required
          helperText={`${diagnostico.length}/500 caracteres (mínimo 10)`}
          inputProps={{ maxLength: 500 }}
        />

        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            💡 <strong>Instrucciones:</strong><br/>
            - Describa detalladamente el problema encontrado<br/>
            - Incluya las posibles causas identificadas<br/>
            - Mencione las acciones recomendadas<br/>
            - Al guardar, la orden pasará al estado "DIAGNOSTICADA"
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          startIcon={<CancelIcon />}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="warning"
          disabled={loading || !diagnostico.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {loading ? 'Guardando...' : 'Guardar Diagnóstico'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DiagnosticoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orden: PropTypes.object,
  onDiagnosticoCompleto: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default DiagnosticoDialog
