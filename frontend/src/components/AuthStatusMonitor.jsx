import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

/**
 * Monitor del estado de autenticación
 * Maneja la limpieza automática de tokens expirados
 */
const AuthStatusMonitor = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    // Verificar token cada 30 segundos
    const interval = setInterval(() => {
      try {
        // Decodificar payload del JWT de forma segura
        const parts = token.split('.');
        if (parts.length !== 3) {
          console.error('Token JWT malformado');
          dispatch(logout());
          return;
        }

        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        const now = Math.floor(Date.now() / 1000);
        
        // Si el token expiró, hacer logout
        if (payload.exp && payload.exp < now) {
          console.log('Token expirado, cerrando sesión');
          dispatch(logout());
        }
      } catch (error) {
        console.error('Error al verificar token:', error);
        dispatch(logout());
      }
    }, 30000); // Verificar cada 30 segundos

    return () => clearInterval(interval);
  }, [token, isAuthenticated, dispatch]);

  return null; // Este componente no renderiza nada
};

export default AuthStatusMonitor;

