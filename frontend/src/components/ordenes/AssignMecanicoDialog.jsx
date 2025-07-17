import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  CircularProgress,
  Chip
} from '@mui/material'
import {
  Build as BuildIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import usuarioService from '../../services/usuarioService'

/**
 * Componente para asignar mecánico a una orden de trabajo
 */
const AssignMecanicoDialog = ({ 
  open, 
  onClose, 
  orden,
  onAssign,
  loading = false
}) => {
  const [mecanicos, setMecanicos] = useState([])
  const [selectedMecanico, setSelectedMecanico] = useState('')
  const [loadingMecanicos, setLoadingMecanicos] = useState(false)
  const [error, setError] = useState(null)

  // Cargar mecánicos disponibles
  useEffect(() => {
    if (open) {
      cargarMecanicos()
    }
  }, [open])

  const cargarMecanicos = async () => {
    setLoadingMecanicos(true)
    setError(null)
    
    try {
      // Usar función específica para obtener usuarios activos por rol
      const result = await usuarioService.obtenerUsuariosActivosPorRol('MECANICO')
      
      if (result && Array.isArray(result)) {
        setMecanicos(result)
        
        // Si la orden ya tiene mecánico asignado, seleccionarlo
        if (orden?.mecanicoAsignado) {
          setSelectedMecanico(orden.mecanicoAsignado.idUsuario)
        }
      } else {
        setError('Error al cargar mecánicos')
      }
    } catch (err) {
      console.error('Error al cargar mecánicos:', err)
      setError('Error al cargar la lista de mecánicos')
    } finally {
      setLoadingMecanicos(false)
    }
  }

  const handleAssign = () => {
    if (!selectedMecanico) {
      setError('Debe seleccionar un mecánico')
      return
    }

    const mecanicoSeleccionado = mecanicos.find(m => m.idUsuario === selectedMecanico)
    onAssign(orden, mecanicoSeleccionado)
  }

  const handleClose = () => {
    setSelectedMecanico('')
    setError(null)
    onClose()
  }

  if (!orden) return null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center',
        pb: 1
      }}>
        <BuildIcon sx={{ mr: 1 }} />
        Asignar Mecánico
      </DialogTitle>

      <DialogContent dividers>
        {/* Información de la orden */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Orden #{orden.numeroOrden}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Cliente: {orden.moto?.cliente?.nombre || 'No especificado'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Moto: {orden.moto?.placa || 'Sin placa'} - {orden.moto?.marca} {orden.moto?.modelo}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Estado:
            </Typography>
            <Chip label={orden.estado} size="small" />
          </Box>
        </Box>

        {/* Mecánico actual */}
        {orden.mecanicoAsignado && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              <PersonIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
              Mecánico Actual
            </Typography>
            <Typography variant="body2">
              {orden.mecanicoAsignado.nombreCompleto}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {orden.mecanicoAsignado.email}
            </Typography>
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Selector de mecánico */}
        {loadingMecanicos ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <FormControl fullWidth>
            <InputLabel id="mecanico-select-label">
              {orden.mecanicoAsignado ? 'Cambiar Mecánico' : 'Seleccionar Mecánico'}
            </InputLabel>
            <Select
              labelId="mecanico-select-label"
              value={selectedMecanico}
              onChange={(e) => setSelectedMecanico(e.target.value)}
              label={orden.mecanicoAsignado ? 'Cambiar Mecánico' : 'Seleccionar Mecánico'}
            >
              {mecanicos.length === 0 ? (
                <MenuItem disabled>
                  No hay mecánicos disponibles
                </MenuItem>
              ) : (
                mecanicos.map((mecanico) => (
                  <MenuItem key={mecanico.idUsuario} value={mecanico.idUsuario}>
                    <Box>
                      <Typography variant="body1">
                        {mecanico.nombreCompleto}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {mecanico.email} • {mecanico.especialidad || 'General'}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        )}

        {/* Información adicional */}
        {mecanicos.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Se mostrarán solo mecánicos activos disponibles
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={loading || !selectedMecanico || loadingMecanicos}
          startIcon={loading ? <CircularProgress size={20} /> : <BuildIcon />}
        >
          {loading 
            ? 'Asignando...' 
            : orden.mecanicoAsignado 
              ? 'Cambiar Mecánico' 
              : 'Asignar Mecánico'
          }
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssignMecanicoDialog
