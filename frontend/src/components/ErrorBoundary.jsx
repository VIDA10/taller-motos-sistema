import React from 'react'
import { Box, Typography, Button, Container, Alert, Paper } from '@mui/material'
import BugReportIcon from '@mui/icons-material/BugReport'
import PropTypes from 'prop-types'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Actualizar el state para mostrar la UI de error
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log del error para debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 3,
              py: 4
            }}
          >
            <BugReportIcon 
              sx={{ 
                fontSize: 80, 
                color: 'error.main' 
              }} 
            />
            
            <Typography variant="h4" color="error.main" gutterBottom>
              ¡Oops! Algo salió mal
            </Typography>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Error Inesperado de la Aplicación
            </Typography>
            
            <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
              <Typography variant="body2">
                Se ha producido un error inesperado en la aplicación. 
                Nuestro equipo de desarrollo ha sido notificado automáticamente.
              </Typography>
            </Alert>

            {/* Mostrar detalles del error solo en desarrollo */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  maxWidth: 600, 
                  width: '100%', 
                  bgcolor: 'grey.100',
                  textAlign: 'left'
                }}
              >
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Detalles del Error (Solo visible en desarrollo):
                </Typography>
                <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </Typography>
              </Paper>
            )}
            
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
              • Intenta recargar la página<br/>
              • Si el problema persiste, contacta al soporte técnico<br/>
              • Asegúrate de que tu navegador esté actualizado
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={this.handleReset}
              >
                Intentar de Nuevo
              </Button>
              
              <Button 
                variant="contained" 
                color="primary"
                onClick={this.handleReload}
              >
                Recargar Página
              </Button>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
              Si necesitas ayuda inmediata, incluye el código de error al contactar soporte
            </Typography>
          </Box>
        </Container>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
