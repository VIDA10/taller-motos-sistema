import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout, setUser } from '../store/slices/authSlice'
import authService from '../services/authService'

/**
 * Hook personalizado para manejo avanzado de autenticación
 * Basado en la lógica real del backend (JwtUtils.java, AuthController.java)
 */
export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [isValidating, setIsValidating] = useState(false)
  const [tokenStatus, setTokenStatus] = useState(null)

  /**
   * Validar sesión actual con el backend
   * Usa endpoint /auth/validate del AuthController.java
   */
  const validateSession = async () => {
    setIsValidating(true)
    
    try {
      const sessionCheck = await authService.checkSession()
      
      if (sessionCheck.valid) {
        // Si la sesión es válida pero no tenemos usuario en Redux, obtenerlo
        if (!user || !isAuthenticated) {
          const userResponse = await authService.getCurrentUser()
          if (userResponse.success) {
            dispatch(setUser({
              user: userResponse.user,
              token: localStorage.getItem('token')
            }))
          }
        }
        
        setTokenStatus({ valid: true, message: sessionCheck.message })
        return true
      } else {
        // Sesión inválida - limpiar estado
        dispatch(logout())
        setTokenStatus({ valid: false, reason: sessionCheck.reason })
        return false
      }
    } catch (error) {
      console.error('Error al validar sesión:', error)
      dispatch(logout())
      setTokenStatus({ valid: false, reason: 'Error de conexión' })
      return false
    } finally {
      setIsValidating(false)
    }
  }

  /**
   * Obtener información actualizada del usuario
   * Usa endpoint /auth/me del AuthController.java
   */
  const refreshUser = async () => {
    try {
      const userResponse = await authService.getCurrentUser()
      
      if (userResponse.success) {
        dispatch(setUser({
          user: userResponse.user,
          token: localStorage.getItem('token')
        }))
        return userResponse.user
      } else {
        console.warn('No se pudo obtener información del usuario')
        return null
      }
    } catch (error) {
      console.error('Error al refrescar usuario:', error)
      return null
    }
  }

  /**
   * Logout completo usando el endpoint del backend
   */
  const handleLogout = async () => {
    try {
      const logoutResponse = await authService.logout()
      dispatch(logout())
      
      return logoutResponse
    } catch (error) {
      // Forzar logout local aunque falle el servidor
      dispatch(logout())
      return { success: false, error: 'Error en logout', cleaned: true }
    }
  }

  /**
   * Obtener información del token actual
   */
  const getTokenInfo = () => {
    try {
      const tokenInfo = authService.getTokenClaims()
      
      // Si el token es inválido o corrupto, limpiar estado
      if (!tokenInfo) {
        dispatch(logout())
        return null
      }
      
      return tokenInfo
    } catch (error) {
      console.error('Error al obtener información del token:', error)
      dispatch(logout())
      return null
    }
  }

  /**
   * Verificar si el token está próximo a expirar
   * @param {number} minutesThreshold - Minutos antes de expiración para alertar
   */
  const isTokenNearExpiry = (minutesThreshold = 5) => {
    try {
      const tokenInfo = getTokenInfo()
      
      if (!tokenInfo || !tokenInfo.expiresAt) return false
      
      const now = new Date()
      const expiryTime = tokenInfo.expiresAt
      const diffMinutes = (expiryTime - now) / (1000 * 60)
      
      return diffMinutes <= minutesThreshold && diffMinutes > 0
    } catch (error) {
      console.error('Error al verificar expiración del token:', error)
      return false
    }
  }

  /**
   * Verificar permisos específicos del usuario
   */
  const hasPermission = (module, action) => {
    if (!user || !user.rol) return false
    
    // Importar dinámicamente para evitar dependencias circulares
    const { hasPermission: checkPermission } = require('../utils/permissions')
    return checkPermission(user, module, action)
  }

  /**
   * Verificar si el usuario puede acceder a endpoints de admin
   * Basado en SecurityConfig.java que requiere ADMIN para /api/admin/**
   */
  const canAccessAdminEndpoints = () => {
    return user?.rol === 'ADMIN'
  }

  /**
   * Efecto para validar sesión al montar el componente
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      // Validar sesión periódicamente cada 5 minutos
      const interval = setInterval(() => {
        validateSession()
      }, 5 * 60 * 1000)

      return () => clearInterval(interval)
    }
  }, [isAuthenticated, user])

  /**
   * Efecto para alertar sobre tokens próximos a expirar
   */
  useEffect(() => {
    if (isAuthenticated) {
      const checkExpiry = () => {
        if (isTokenNearExpiry(5)) {
          console.warn('El token expirará en menos de 5 minutos')
          // Aquí se podría mostrar una notificación al usuario
        }
      }

      // Verificar cada minuto
      const interval = setInterval(checkExpiry, 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  return {
    // Estado
    user,
    isAuthenticated,
    isValidating,
    tokenStatus,
    
    // Métodos
    validateSession,
    refreshUser,
    handleLogout,
    getTokenInfo,
    isTokenNearExpiry,
    hasPermission,
    canAccessAdminEndpoints
  }
}

export default useAuth
