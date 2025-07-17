import { Box, Typography, Button, Container, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ErrorIcon from '@mui/icons-material/Error'

const ServerErrorPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 3
        }}
      >
        <ErrorIcon 
          sx={{ 
            fontSize: 80, 
            color: 'error.main' 
          }} 
        />
        
        <Typography variant="h4" color="error.main" gutterBottom>
          Error del Servidor
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Error 500
        </Typography>
        
        <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="body2">
            El servidor está experimentando problemas técnicos. 
            Nuestro equipo ha sido notificado automáticamente.
          </Typography>
        </Alert>
        
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          Puedes intentar recargar la página o regresar más tarde. 
          Si el problema persiste, contacta al administrador del sistema.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleRetry}
          >
            Reintentar
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleGoHome}
          >
            {isAuthenticated ? 'Ir al Dashboard' : 'Ir al Login'}
          </Button>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Si necesitas ayuda inmediata, contacta al soporte técnico
        </Typography>
      </Box>
    </Container>
  )
}

export default ServerErrorPage
