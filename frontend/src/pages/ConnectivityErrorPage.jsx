import { Box, Typography, Button, Container, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import WifiOffIcon from '@mui/icons-material/WifiOff'
import RefreshIcon from '@mui/icons-material/Refresh'

const ConnectivityErrorPage = () => {
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

  const handleCheckConnection = () => {
    // Intentar conexión básica
    fetch('/api/auth/validate', { method: 'HEAD' })
      .then(() => {
        window.location.reload()
      })
      .catch(() => {
        alert('El servidor sigue sin responder. Verifica tu conexión a internet.')
      })
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
        <WifiOffIcon 
          sx={{ 
            fontSize: 80, 
            color: 'warning.main' 
          }} 
        />
        
        <Typography variant="h4" color="warning.main" gutterBottom>
          Sin Conexión
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Error de Conectividad
        </Typography>
        
        <Alert severity="warning" sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="body2">
            No se puede conectar con el servidor del taller. 
            Verifica tu conexión a internet.
          </Typography>
        </Alert>
        
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          • Verifica tu conexión a internet<br/>
          • El servidor puede estar en mantenimiento<br/>
          • Contacta al administrador si el problema persiste
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={handleCheckConnection}
              startIcon={<RefreshIcon />}
            >
              Verificar Conexión
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary"
              onClick={handleRetry}
            >
              Reintentar
            </Button>
          </Box>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleGoHome}
          >
            {isAuthenticated ? 'Ir al Dashboard' : 'Ir al Login'}
          </Button>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Estado del servidor: Verificando...
        </Typography>
      </Box>
    </Container>
  )
}

export default ConnectivityErrorPage
