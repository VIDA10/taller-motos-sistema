import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Container
} from '@mui/material'

import { loginValidationSchema } from '../utils/validations'
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice'
import authService from '../services/authService'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error } = useSelector((state) => state.auth)
  
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      dispatch(loginStart())
      
      // Llamar al servicio de autenticación basado en AuthController
      const response = await authService.login(data.usernameOrEmail, data.password)
      
      if (!response.success) {
        dispatch(loginFailure(response.error))
        return
      }
      
      // Estructura exacta de LoginResponseDTO
      const loginData = {
        token: response.data.token,
        idUsuario: response.data.idUsuario,
        username: response.data.username,
        email: response.data.email,
        nombreCompleto: response.data.nombreCompleto,
        rol: response.data.rol
      }
      
      dispatch(loginSuccess(loginData))
      
      // Redirigir a la página anterior o dashboard
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
      
    } catch (error) {
      let errorMessage = 'Error de conexión'
      
      if (error.response?.status === 401) {
        errorMessage = 'Usuario o contraseña inválidos'
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos de entrada inválidos'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      dispatch(loginFailure(errorMessage))
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3
        }}
      >
        <Card 
          sx={{ 
            width: '100%',
            maxWidth: 400,
            boxShadow: 3
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Título basado en mockup */}
            <Typography 
              variant="h4" 
              component="h1" 
              align="center" 
              gutterBottom
              sx={{ mb: 1, fontWeight: 500 }}
            >
              Ingreso al Sistema
            </Typography>
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              de Taller de Motos
            </Typography>

            {/* Error message */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Formulario basado en LoginRequestDTO */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('usernameOrEmail')}
                fullWidth
                label="Nombre de usuario"
                placeholder="Nombre de usuario"
                variant="outlined"
                margin="normal"
                error={!!errors.usernameOrEmail}
                helperText={errors.usernameOrEmail?.message}
                disabled={loading}
                sx={{ mb: 2 }}
              />

              <TextField
                {...register('password')}
                fullWidth
                label="Contraseña"
                placeholder="Contraseña"
                type="password"
                variant="outlined"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={loading}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="Recordarme"
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  mt: 1, 
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default LoginForm
