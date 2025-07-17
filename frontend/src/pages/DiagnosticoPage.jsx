import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  PlayArrow as PlayIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon
} from '@mui/icons-material'

import diagnosticoBackend from '../utils/diagnosticoBackend'
import { useAuth } from '../hooks/useAuth'

/**
 * Página de diagnóstico del sistema
 * Permite verificar el estado de los endpoints y permisos
 */
const DiagnosticoPage = () => {
  const [loading, setLoading] = useState(false)
  const [reporte, setReporte] = useState(null)
  const [error, setError] = useState(null)
  const { usuario } = useAuth()

  const ejecutarDiagnostico = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const reporteCompleto = await diagnosticoBackend.generarReporteDiagnostico()
      setReporte(reporteCompleto)
      
    } catch (err) {
      console.error('Error en diagnóstico:', err)
      setError('Error al ejecutar el diagnóstico: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const probarEndpointsParaRol = async () => {
    if (!usuario?.rol) {
      setError('No se puede determinar el rol del usuario')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const resultados = await diagnosticoBackend.probarEndpointsParaRol(usuario.rol)
      console.log('Resultados para rol:', resultados)
      
      // Mostrar información específica del rol
      const infoPermisos = diagnosticoBackend.obtenerInfoPermisos()
      console.log('Información de permisos para ' + usuario.rol + ':', infoPermisos[usuario.rol])
      
    } catch (err) {
      console.error('Error en prueba de rol:', err)
      setError('Error al probar endpoints para el rol: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (tipo) => {
    switch (tipo) {
      case 'success': return 'success'
      case 'warning': return 'warning'
      case 'error': return 'error'
      default: return 'info'
    }
  }

  const getStatusIcon = (status) => {
    if (status >= 200 && status < 300) return <CheckIcon color="success" />
    if (status === 403) return <WarningIcon color="warning" />
    return <ErrorIcon color="error" />
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Diagnóstico del Sistema
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Herramientas para verificar el estado de los endpoints y permisos del sistema.
      </Typography>

      {/* Información del usuario */}
      {usuario && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Información del Usuario
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Nombre: <strong>{usuario.nombreCompleto}</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Rol: <Chip label={usuario.rol} color="primary" size="small" />
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Usuario: <strong>{usuario.username}</strong>
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Botones de acción */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<PlayIcon />}
          onClick={ejecutarDiagnostico}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          Ejecutar Diagnóstico Completo
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<InfoIcon />}
          onClick={probarEndpointsParaRol}
          disabled={loading || !usuario?.rol}
        >
          Probar Endpoints para Mi Rol
        </Button>
      </Box>

      {/* Indicador de carga */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Ejecutando diagnóstico...
          </Typography>
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Resultados del diagnóstico */}
      {reporte && (
        <Box>
          {/* Resumen */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen del Diagnóstico
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {reporte.resumen.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Endpoints
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {reporte.resumen.exitosos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Exitosos
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {reporte.resumen.sin_permisos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sin Permisos
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">
                      {reporte.resumen.fallidos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fallidos
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Recomendaciones */}
          {reporte.recomendaciones && reporte.recomendaciones.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recomendaciones
                </Typography>
                {reporte.recomendaciones.map((rec, index) => (
                  <Alert
                    key={index}
                    severity={getSeverityColor(rec.tipo)}
                    sx={{ mb: 1 }}
                  >
                    {rec.mensaje}
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Endpoints exitosos */}
          {reporte.endpoints_exitosos && reporte.endpoints_exitosos.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  Endpoints Exitosos ({reporte.endpoints_exitosos.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {reporte.endpoints_exitosos.map((endpoint, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {getStatusIcon(endpoint.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={endpoint.endpoint}
                        secondary={`Status: ${endpoint.status} | Datos: ${endpoint.datos}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Endpoints sin permisos */}
          {reporte.endpoints_sin_permisos && reporte.endpoints_sin_permisos.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  Endpoints Sin Permisos ({reporte.endpoints_sin_permisos.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {reporte.endpoints_sin_permisos.map((endpoint, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {getStatusIcon(endpoint.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={endpoint.endpoint}
                        secondary={`Status: ${endpoint.status} | Error: ${endpoint.detalle || endpoint.error}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Endpoints fallidos */}
          {reporte.endpoints_fallidos && reporte.endpoints_fallidos.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  Endpoints Fallidos ({reporte.endpoints_fallidos.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {reporte.endpoints_fallidos.map((endpoint, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {getStatusIcon(endpoint.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={endpoint.endpoint}
                        secondary={`Status: ${endpoint.status} | Error: ${endpoint.detalle || endpoint.error}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      )}
    </Box>
  )
}

export default DiagnosticoPage
