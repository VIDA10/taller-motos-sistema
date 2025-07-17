import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadFromStorage } from './store/slices/authSlice'
import { ROLES } from './utils/permissions'

// Layout
import MainLayout from './components/MainLayout'
import ErrorBoundary from './components/ErrorBoundary'

// Componentes
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import NotFoundPage from './pages/NotFoundPage'
import ServerErrorPage from './pages/ServerErrorPage'
import ConnectivityErrorPage from './pages/ConnectivityErrorPage'
import ProtectedRoute from './components/ProtectedRoute'
import RoleGuard from './components/RoleGuard'

// Páginas placeholder para módulos (se implementarán en siguientes fases)
import ClientesPage from './pages/ClientesPage'
import ClienteDetail from './components/clientes/ClienteDetail'
import MotosPage from './pages/MotosPage'
import OrdenesPage from './pages/OrdenesPage'
import RepuestosPage from './pages/RepuestosPage'
import ServiciosPage from './pages/ServiciosPage'
import UsuariosPage from './pages/UsuariosPage'
import PagosPage from './pages/PagosPage'
import MecanicoPage from './pages/MecanicoPage'
import ConfiguracionesPage from './pages/ConfiguracionesPage'
import ReportesPage from './pages/ReportesPage'
import DiagnosticoPage from './pages/DiagnosticoPage'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Cargar datos del usuario desde localStorage al iniciar
    dispatch(loadFromStorage())
  }, [dispatch])

  return (
    <ErrorBoundary>
      <Routes>
        {/* Rutas públicas - sin layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="/server-error" element={<ServerErrorPage />} />
        <Route path="/connectivity-error" element={<ConnectivityErrorPage />} />
        
        {/* Rutas protegidas - con MainLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Rutas para roles específicos */}
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.MECANICO]}>
                <MainLayout>
                  <ClientesPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes/:id"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.MECANICO]}>
                <MainLayout>
                  <ClienteDetail />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/motos"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.MECANICO]}>
                <MainLayout>
                  <MotosPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ordenes"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.MECANICO]}>
                <MainLayout>
                  <OrdenesPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/repuestos"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.MECANICO]}>
                <MainLayout>
                  <RepuestosPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        
        {/* Rutas solo para ADMIN */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                <MainLayout>
                  <UsuariosPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        
        {/* Rutas para ADMIN y MECANICO */}
        <Route
          path="/servicios"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.MECANICO]}>
                <MainLayout>
                  <ServiciosPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        
        {/* Ruta específica para MECANICO - Sus órdenes asignadas */}
        <Route
          path="/mecanico"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.MECANICO]}>
                <MainLayout>
                  <MecanicoPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        
        {/* Rutas para ADMIN y RECEPCIONISTA */}
        <Route
          path="/pagos"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA]}>
                <MainLayout>
                  <PagosPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuraciones"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                <MainLayout>
                  <ConfiguracionesPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA]}>
                <MainLayout>
                  <ReportesPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnostico"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                <MainLayout>
                  <DiagnosticoPage />
                </MainLayout>
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Ruta 404 - Mejorada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
