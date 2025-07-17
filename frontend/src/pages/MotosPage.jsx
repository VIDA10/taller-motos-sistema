import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Fab,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  Add,
  DirectionsCar,
  Refresh,
  TrendingUp,
  ToggleOff,
  Warning,
  Build
} from '@mui/icons-material'
import { hasPermission } from '../utils/permissions'
import motoService from '../services/motoService'
import clienteService from '../services/clienteService'
import MotosList from '../components/motos/MotosList'
import MotoFilters from '../components/motos/MotoFilters'
import MotoForm from '../components/motos/MotoForm'
import MotoDetail from '../components/motos/MotoDetail'

/**
 * Página principal de gestión de motos
 * Implementa CRUD completo basado en endpoints reales del backend
 * 
 * Funcionalidades por rol según permisos configurados:
 * - ADMIN: CRUD completo + historial + gestión de VIN
 * - RECEPCIONISTA: CRUD completo + información VIN
 * - MECANICO: Ver, editar, eliminar (NO crear) + gestión VIN + diagnósticos
 * 
 * Basado en entidad Moto.java y endpoints de MotoController.java
 */
const MotosPage = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // Estados principales
  const [motos, setMotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  
  // Estados de UI
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, moto: null })
  const [toggleDialog, setToggleDialog] = useState({ open: false, moto: null })
  
  // Estados para modales CRUD
  const [formModal, setFormModal] = useState({ open: false, moto: null, mode: 'create' }) // create/edit
  const [detailModal, setDetailModal] = useState({ open: false, moto: null })
  const [formLoading, setFormLoading] = useState(false)
  
  // Clientes reales cargados desde el backend
  const [clientes, setClientes] = useState([])
  const [clientesLoading, setClientesLoading] = useState(false)

  // Verificar permisos según SecurityConfig: hasAnyRole("ADMIN", "RECEPCIONISTA", "MECANICO")
  const canCreate = hasPermission(user, 'motos', 'create')
  const canRead = hasPermission(user, 'motos', 'read')
  const canUpdate = hasPermission(user, 'motos', 'update')
  const canDelete = hasPermission(user, 'motos', 'delete')
  const isAdmin = user?.rol === 'ADMIN'

  /**
   * Cargar motos desde el backend
   * Usa endpoint principal GET /api/motos y aplica filtros localmente
   */
  const cargarMotos = useCallback(async () => {
    if (!canRead) {
      setError('No tiene permisos para ver las motos')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      console.log('🔄 Cargando motos desde el backend...')
      const data = await motoService.obtenerTodas()
      setMotos(data || [])
      console.log('✅ Motos cargadas exitosamente:', data?.length || 0)
    } catch (err) {
      console.error('❌ Error al cargar motos:', err)
      setError(err.message || 'Error al cargar las motos')
      setMotos([])
    } finally {
      setLoading(false)
    }
  }, [canRead])

  /**
   * Cargar clientes desde el backend para el formulario de motos
   */
  const cargarClientes = useCallback(async () => {
    setClientesLoading(true)
    
    try {
      console.log('🔄 Cargando clientes activos desde el backend...')
      const data = await clienteService.getActive()
      
      // Ordenar clientes por fecha de creación (más recientes primero)
      const clientesOrdenados = (data || []).sort((a, b) => {
        const fechaA = new Date(a.createdAt || a.created_at || 0)
        const fechaB = new Date(b.createdAt || b.created_at || 0)
        return fechaB - fechaA // Descendente: más recientes primero
      })
      
      setClientes(clientesOrdenados)
      console.log('✅ Clientes activos cargados y ordenados exitosamente:', clientesOrdenados?.length || 0)
    } catch (err) {
      console.error('❌ Error al cargar clientes activos:', err)
      // No mostrar error de clientes como error principal ya que las motos se pueden ver sin esto
      setClientes([])
    } finally {
      setClientesLoading(false)
    }
  }, [])

  // Cargar motos y clientes al montar el componente
  useEffect(() => {
    cargarMotos()
    cargarClientes()
  }, [cargarMotos, cargarClientes])

  // Aplicar filtros localmente a las motos cargadas
  const motosFiltradas = useMemo(() => {
    if (!motos.length) return []

    return motos.filter(moto => {
      // Filtro por marca
      if (filters.marca) {
        const marca = moto.marca?.toLowerCase() || ''
        const filtroMarca = filters.marca.toLowerCase()
        if (!marca.includes(filtroMarca)) return false
      }

      // Filtro por modelo
      if (filters.modelo) {
        const modelo = moto.modelo?.toLowerCase() || ''
        const filtroModelo = filters.modelo.toLowerCase()
        if (!modelo.includes(filtroModelo)) return false
      }

      // Filtro por placa
      if (filters.placa) {
        const placa = moto.placa?.toLowerCase() || ''
        const filtroPlaca = filters.placa.toLowerCase()
        if (!placa.includes(filtroPlaca)) return false
      }

      // Filtro por VIN
      if (filters.vin) {
        const vin = moto.vin?.toLowerCase() || ''
        const filtroVin = filters.vin.toLowerCase()
        if (!vin.includes(filtroVin)) return false
      }

      // Filtro por color
      if (filters.color) {
        const color = moto.color?.toLowerCase() || ''
        const filtroColor = filters.color.toLowerCase()
        if (!color.includes(filtroColor)) return false
      }

      // Filtro por año
      if (filters.anio) {
        const anio = moto.anio ? moto.anio.toString() : ''
        if (!anio.includes(filters.anio)) return false
      }

      // Filtro por cliente
      if (filters.cliente) {
        const cliente = moto.cliente?.nombre?.toLowerCase() || ''
        const filtroCliente = filters.cliente.toLowerCase()
        if (!cliente.includes(filtroCliente)) return false
      }

      // Filtro por estado
      if (filters.estado === 'activos') {
        if (!moto.activo) return false
      } else if (filters.estado === 'inactivos') {
        if (moto.activo) return false
      }

      // Filtro por fechas
      if (filters.fechaDesde || filters.fechaHasta) {
        const fechaCreacion = new Date(moto.createdAt)
        
        if (filters.fechaDesde) {
          const fechaDesde = new Date(filters.fechaDesde)
          if (fechaCreacion < fechaDesde) return false
        }
        
        if (filters.fechaHasta) {
          const fechaHasta = new Date(filters.fechaHasta)
          fechaHasta.setHours(23, 59, 59) // Incluir todo el día
          if (fechaCreacion > fechaHasta) return false
        }
      }

      return true
    })
  }, [motos, filters])

  /**
   * Manejar cambios de filtros
   */
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  /**
   * Manejar creación de moto
   * Abre modal de formulario en modo creación
   */
  const handleCreateMoto = () => {
    if (!canCreate) {
      setSnackbar({
        open: true,
        message: 'No tiene permisos para crear motos',
        severity: 'warning'
      })
      return
    }

    setFormModal({ open: true, moto: null, mode: 'create' })
  }

  /**
   * Manejar edición de moto
   * Abre modal de formulario en modo edición
   */
  const handleEditMoto = (moto) => {
    if (!canUpdate) {
      setSnackbar({
        open: true,
        message: 'No tiene permisos para editar motos',
        severity: 'warning'
      })
      return
    }

    setFormModal({ open: true, moto, mode: 'edit' })
  }

  /**
   * Manejar vista de detalle de moto
   * Abre modal de detalle adaptativo según perfil
   */
  const handleViewMoto = (moto) => {
    if (!canRead) {
      setSnackbar({
        open: true,
        message: 'No tiene permisos para ver detalles de motos',
        severity: 'warning'
      })
      return
    }

    setDetailModal({ open: true, moto })
  }

  /**
   * Manejar envío del formulario (crear/editar)
   */
  const handleFormSubmit = async (formData) => {
    setFormLoading(true)
    
    try {
      if (formModal.mode === 'create') {
        // Crear nueva moto
        console.log('🔄 Creando moto:', formData)
        
        // Preparar datos para el backend: encontrar el cliente completo
        const clienteSeleccionado = clientes.find(c => c.idCliente === parseInt(formData.clienteId))
        if (!clienteSeleccionado) {
          throw new Error('Debe seleccionar un cliente válido')
        }

        // Crear objeto moto con cliente completo según espera el backend
        const motoData = {
          marca: formData.marca,
          modelo: formData.modelo,
          anio: parseInt(formData.anio) || null,
          placa: formData.placa,
          vin: formData.vin || null,
          color: formData.color || null,
          kilometraje: parseInt(formData.kilometraje) || 0,
          cliente: clienteSeleccionado // Objeto cliente completo
        }

        await motoService.crear(motoData)
        
        setSnackbar({
          open: true,
          message: 'Moto creada exitosamente',
          severity: 'success'
        })
      } else {
        // Editar moto existente
        console.log('✏️ Editando moto:', formData)
        
        // Preparar datos para actualización
        const clienteSeleccionado = clientes.find(c => c.idCliente === parseInt(formData.clienteId))
        if (!clienteSeleccionado) {
          throw new Error('Debe seleccionar un cliente válido')
        }

        const motoData = {
          marca: formData.marca,
          modelo: formData.modelo,
          anio: parseInt(formData.anio) || null,
          placa: formData.placa,
          vin: formData.vin || null,
          color: formData.color || null,
          kilometraje: parseInt(formData.kilometraje) || 0,
          cliente: clienteSeleccionado
        }

        await motoService.actualizar(formModal.moto.idMoto, motoData)
        
        setSnackbar({
          open: true,
          message: 'Moto actualizada exitosamente',
          severity: 'success'
        })
      }

      // Cerrar modal y recargar datos
      setFormModal({ open: false, moto: null, mode: 'create' })
      cargarMotos() // Recargar lista de motos
      cargarClientes() // Recargar clientes para mantener orden actualizado
      
    } catch (error) {
      console.error('Error al guardar moto:', error)
      setSnackbar({
        open: true,
        message: `Error al ${formModal.mode === 'create' ? 'crear' : 'actualizar'} la moto: ${error.message}`,
        severity: 'error'
      })
    } finally {
      setFormLoading(false)
    }
  }

  /**
   * Manejar cierre de modales
   */
  const handleCloseFormModal = () => {
    setFormModal({ open: false, moto: null, mode: 'create' })
  }

  const handleCloseDetailModal = () => {
    setDetailModal({ open: false, moto: null })
  }

  /**
   * Manejar edición desde el modal de detalle
   */
  const handleEditFromDetail = (moto) => {
    setDetailModal({ open: false, moto: null })
    setFormModal({ open: true, moto, mode: 'edit' })
  }

  /**
   * Confirmar eliminación de moto
   */
  const handleDeleteMoto = (moto) => {
    if (!canDelete) {
      setSnackbar({
        open: true,
        message: 'No tiene permisos para eliminar motos',
        severity: 'warning'
      })
      return
    }

    setDeleteDialog({ open: true, moto })
  }

  /**
   * Ejecutar eliminación de moto (soft delete)
   * Usa endpoint DELETE /api/motos/{id}
   */
  const confirmDeleteMoto = async () => {
    if (!deleteDialog.moto) return

    try {
      console.log('🗑️ Eliminando moto:', deleteDialog.moto.idMoto)
      await motoService.eliminar(deleteDialog.moto.idMoto)
      
      setSnackbar({
        open: true,
        message: `Moto ${deleteDialog.moto.marca} ${deleteDialog.moto.modelo} eliminada exitosamente`,
        severity: 'success'
      })
      
      // Recargar motos
      cargarMotos()
    } catch (error) {
      console.error('❌ Error al eliminar moto:', error)
      setSnackbar({
        open: true,
        message: `Error al eliminar la moto: ${error.message}`,
        severity: 'error'
      })
    } finally {
      setDeleteDialog({ open: false, moto: null })
    }
  }

  // Cancelar eliminación
  const cancelDeleteMoto = () => {
    setDeleteDialog({ open: false, moto: null })
  }

  /**
   * Manejar toggle de estado de motos (activar/desactivar)
   * Solo disponible para ADMIN - permite desactivar Y reactivar
   */
  const handleToggleEstado = (moto) => {
    if (!isAdmin) {
      setSnackbar({
        open: true,
        message: 'Solo los administradores pueden cambiar el estado de las motos',
        severity: 'warning'
      })
      return
    }

    setToggleDialog({ open: true, moto })
  }

  /**
   * Ejecutar toggle de estado (activar/desactivar)
   */
  const confirmToggleEstado = async () => {
    if (!toggleDialog.moto) return

    try {
      const moto = toggleDialog.moto
      const nuevoEstado = !moto.activo
      
      console.log(`🔄 ${nuevoEstado ? 'Reactivando' : 'Desactivando'} moto:`, moto.idMoto)
      
      if (nuevoEstado) {
        // Reactivar moto
        await motoService.reactivar(moto.idMoto)
      } else {
        // Desactivar moto (soft delete)
        await motoService.eliminar(moto.idMoto)
      }
      
      setSnackbar({
        open: true,
        message: `Moto ${moto.marca} ${moto.modelo} ${nuevoEstado ? 'reactivada' : 'desactivada'} exitosamente`,
        severity: 'success'
      })
      
      // Recargar motos
      cargarMotos()
    } catch (error) {
      console.error('❌ Error al cambiar estado de moto:', error)
      setSnackbar({
        open: true,
        message: `Error al cambiar el estado: ${error.message}`,
        severity: 'error'
      })
    } finally {
      setToggleDialog({ open: false, moto: null })
    }
  }

  // Cancelar toggle de estado
  const cancelToggleEstado = () => {
    setToggleDialog({ open: false, moto: null })
  }

  // Cerrar snackbar
  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  // Información estadística incluyendo marcas y modelos únicos
  const estadisticas = useMemo(() => {
    const total = motosFiltradas.length
    const activas = motosFiltradas.filter(m => m.activo).length
    const inactivas = total - activas
    
    // Contar marcas únicas
    const marcasUnicas = new Set(motosFiltradas.map(m => m.marca?.toLowerCase()).filter(Boolean))
    const marcas = marcasUnicas.size
    
    // Contar modelos únicos (marca + modelo para evitar duplicados entre marcas)
    const modelosUnicos = new Set(
      motosFiltradas
        .filter(m => m.marca && m.modelo)
        .map(m => `${m.marca.toLowerCase()}-${m.modelo.toLowerCase()}`)
    )
    const modelos = modelosUnicos.size
    
    return { total, activas, inactivas, marcas, modelos }
  }, [motosFiltradas])

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header simple como en la imagen */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 3
      }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 500, color: 'text.primary' }}>
            Gestión de Motos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sistema completo de gestión de motocicletas del taller
          </Typography>
        </Box>
        
        {/* Botones de acción como en la imagen */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={cargarMotos}
            disabled={loading}
            size="small"
          >
            Actualizar
          </Button>
          {canCreate && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateMoto}
              disabled={loading}
              size="small"
            >
              Nueva Moto
            </Button>
          )}
        </Box>
      </Box>

      {/* Estadísticas con cards como en la imagen */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <DirectionsCar sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h4" component="div" color="primary.main">
                {estadisticas.total}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h4" component="div" color="success.main">
                {estadisticas.activas}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Activas
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <ToggleOff sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h4" component="div" color="warning.main">
                {estadisticas.inactivas}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Inactivas
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <DirectionsCar sx={{ color: 'info.main', mr: 1 }} />
              <Typography variant="h4" component="div" color="info.main">
                {estadisticas.marcas}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Marcas
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <Build sx={{ color: 'secondary.main', mr: 1 }} />
              <Typography variant="h4" component="div" color="secondary.main">
                {estadisticas.modelos}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Modelos
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filtros simplificados como en la imagen */}
      <MotoFilters 
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Lista de motos */}
      <MotosList
        motos={motosFiltradas}
        loading={loading}
        error={error}
        onEdit={handleEditMoto}
        onView={handleViewMoto}
        onDelete={handleDeleteMoto}
        onToggleEstado={handleToggleEstado}
        onRefresh={cargarMotos}
      />

      {/* FAB para móvil */}
      {isMobile && canCreate && (
        <Fab
          color="primary"
          aria-label="Crear moto"
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
          onClick={handleCreateMoto}
          disabled={loading}
        >
          <Add />
        </Fab>
      )}

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={cancelDeleteMoto}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar la moto{' '}
            <strong>
              {deleteDialog.moto?.marca} {deleteDialog.moto?.modelo}
            </strong>{' '}
            con placa <strong>{deleteDialog.moto?.placa}</strong>?
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
            Nota: Esta acción realizará una eliminación suave (soft delete). 
            La moto se marcará como inactiva pero permanecerá en el sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteMoto} color="inherit">
            Cancelar
          </Button>
          <Button onClick={confirmDeleteMoto} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación de toggle de estado */}
      <Dialog
        open={toggleDialog.open}
        onClose={cancelToggleEstado}
        aria-labelledby="toggle-dialog-title"
      >
        <DialogTitle id="toggle-dialog-title">
          {toggleDialog.moto?.activo ? 'Desactivar' : 'Reactivar'} Moto
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea{' '}
            <strong>{toggleDialog.moto?.activo ? 'desactivar' : 'reactivar'}</strong>{' '}
            la moto{' '}
            <strong>
              {toggleDialog.moto?.marca} {toggleDialog.moto?.modelo}
            </strong>{' '}
            con placa <strong>{toggleDialog.moto?.placa}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelToggleEstado} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={confirmToggleEstado} 
            color={toggleDialog.moto?.activo ? 'warning' : 'success'}
            variant="contained"
          >
            {toggleDialog.moto?.activo ? 'Desactivar' : 'Reactivar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Formulario (Crear/Editar) */}
      <MotoForm
        open={formModal.open}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        moto={formModal.moto}
        loading={formLoading}
        clientes={clientes}
        clientesLoading={clientesLoading}
      />

      {/* Modal de Detalle */}
      <MotoDetail
        open={detailModal.open}
        onClose={handleCloseDetailModal}
        moto={detailModal.moto}
        onEdit={handleEditFromDetail}
        loading={loading}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MotosPage
