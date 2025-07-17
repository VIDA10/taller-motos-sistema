import { Box, Typography, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SearchOffIcon from '@mui/icons-material/SearchOff'

const NotFoundPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  const handleGoBack = () => {
    navigate(-1)
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
        <SearchOffIcon 
          sx={{ 
            fontSize: 80, 
            color: 'warning.main' 
          }} 
        />
        
        <Typography variant="h4" color="warning.main" gutterBottom>
          Página No Encontrada
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Error 404
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          La página que estás buscando no existe o ha sido movida. 
          Verifica la URL o regresa al área principal del sistema.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleGoBack}
          >
            Volver Atrás
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleGoHome}
          >
            {isAuthenticated ? 'Ir al Dashboard' : 'Ir al Login'}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default NotFoundPage
