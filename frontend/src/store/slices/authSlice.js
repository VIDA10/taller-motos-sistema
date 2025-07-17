import { createSlice } from '@reduxjs/toolkit'

// Estado inicial basado en LoginResponseDTO del backend
const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = {
        idUsuario: action.payload.idUsuario,
        username: action.payload.username,
        email: action.payload.email,
        nombreCompleto: action.payload.nombreCompleto,
        rol: action.payload.rol,
      }
      state.error = null
      
      // Persistir en localStorage
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.isAuthenticated = false
      state.token = null
      state.user = null
      state.error = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.user = null
      state.loading = false
      state.error = null
      
      // Limpiar localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    loadFromStorage: (state) => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        state.isAuthenticated = true
        state.token = token
        state.user = JSON.parse(user)
      }
    },
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.user
      
      // Persistir en localStorage
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token)
      }
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  loadFromStorage,
  clearError,
  setUser,
} = authSlice.actions

export default authSlice.reducer
