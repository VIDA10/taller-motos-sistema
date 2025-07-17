import { Box, CircularProgress, Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'

const LoadingPage = ({ message = "Cargando...", showLogo = true }) => {
  const theme = useTheme()

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
        {showLogo && (
          <Typography 
            variant="h4" 
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Taller de Motos
          </Typography>
        )}
        
        <CircularProgress 
          size={60}
          thickness={4}
          sx={{ 
            color: theme.palette.primary.main 
          }}
        />
        
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ opacity: 0.7 }}
        >
          Sistema de Gestión
        </Typography>
      </Box>
    </Container>
  )
}

LoadingPage.propTypes = {
  message: PropTypes.string,
  showLogo: PropTypes.bool,
}

export default LoadingPage
