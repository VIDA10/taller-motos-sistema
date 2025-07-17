import { Box, Typography, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LockIcon from '@mui/icons-material/Lock'

const UnauthorizedPage = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleGoBack = () => {
    navigate('/dashboard')
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
        <LockIcon 
          sx={{ 
            fontSize: 80, 
            color: 'error.main' 
          }} 
        />
        
        <Typography variant="h4" color="error.main" gutterBottom>
          Acceso Denegado
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No tienes permisos para acceder a esta página
        </Typography>
        
        {user && (
          <Typography variant="body1" color="text.secondary">
            Tu rol actual: <strong>{user.rol}</strong>
          </Typography>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          Los permisos están configurados según tu rol en el sistema. 
          Contacta al administrador si necesitas acceso adicional.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleGoBack}
          sx={{ mt: 2 }}
        >
          Volver al Dashboard
        </Button>
      </Box>
    </Container>
  )
}

export default UnauthorizedPage
