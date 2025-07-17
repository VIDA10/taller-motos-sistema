import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Tabs,
  Tab,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material'
import {
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material'

// Importar componentes de pagos
import PagosList from '../components/pagos/PagosList'
import PagoForm from '../components/pagos/PagoForm'
import PagoDetail from '../components/pagos/PagoDetail'
import PagoFilters from '../components/pagos/PagoFilters'
import FacturacionDialog from '../components/pagos/FacturacionDialog'

// Importar servicios
import pagoService from '../services/pagoService'
import ordenService from '../services/ordenService'

/**
 * Página principal de gestión de pagos
 * 
 * FUNCIONALIDADES IMPLEMENTADAS:
 * - Lista de pagos con filtros
 * - Crear/editar pagos
 * - Vista detallada de pagos
 * - Facturación de órdenes completadas
 * 
 * PERMISOS: Solo ADMIN y RECEPCIONISTA
 */
const PagosPage = () => {
  const { user } = useSelector((state) => state.auth)

  // Estados principales
  const [tabValue, setTabValue] = useState(0)
  const [filtrosActivos, setFiltrosActivos] = useState({})
  const [refreshPagos, setRefreshPagos] = useState(false)

  // Estados de diálogos
  const [pagoFormDialog, setPagoFormDialog] = useState({
    open: false,
    pago: null,
    orden: null
  })
  
  const [pagoDetailDialog, setPagoDetailDialog] = useState({
    open: false,
    pago: null
  })
  
  const [facturacionDialog, setFacturacionDialog] = useState({
    open: false,
    orden: null
  })

  // Estados de datos
  const [ordenesCompletadas, setOrdenesCompletadas] = useState([])
  const [estadisticasGenerales, setEstadisticasGenerales] = useState({
    totalPagos: 0,
    montoTotal: 0,
    ordenesPendientes: 0
  })

  // Estados de control
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  })

  // Verificar permisos
  const tienePermisos = user?.rol === 'ADMIN' || user?.rol === 'RECEPCIONISTA'

  /**
   * Cargar datos iniciales
   */
  useEffect(() => {
    if (tienePermisos) {
      cargarDatosIniciales()
    }
  }, [tienePermisos])

  /**
   * Cargar todos los datos necesarios en orden
   */
  const cargarDatosIniciales = async () => {
    await cargarOrdenesCompletadas()
    await cargarEstadisticasGenerales()
  }

  /**
   * Cargar órdenes completadas disponibles para facturación
   * NUEVA LÓGICA: Calcular total basándose en servicios y repuestos
   */
  const cargarOrdenesCompletadas = async () => {
    try {
      console.log('🔄 Cargando órdenes completadas...')
      const response = await ordenService.buscarPorEstado('COMPLETADA')
      
      console.log('📦 Respuesta de órdenes completadas:', response)
      
      if (response.data && response.data.length > 0) {
        console.log(`📋 Total órdenes completadas encontradas: ${response.data.length}`)
        
        // Filtrar órdenes con servicios/repuestos pendientes de facturación
        const ordenesPendientes = []
        
        for (const orden of response.data) {
          try {
            console.log(`🔍 Analizando orden ${orden.numeroOrden}...`)
            
            // Obtener pagos existentes
            const pagosResponse = await pagoService.buscarPorOrdenSafe(orden.idOrden)
            const pagos = pagosResponse.data || []
            const totalPagado = pagos.reduce((total, pago) => 
              total + parseFloat(pago.monto || 0), 0
            )
            
            // Calcular total real basándose en servicios y repuestos
            let totalCalculado = 0
            let tieneServicios = false
            let tieneRepuestos = false
            
            try {
              // Cargar servicios usando el mismo servicio que usa FacturacionDialog
              const { default: detalleOrdenService } = await import('../services/detalleOrdenService')
              const serviciosResponse = await detalleOrdenService.buscarPorOrden(orden.idOrden)
              if (serviciosResponse.success && serviciosResponse.data) {
                const servicios = serviciosResponse.data
                const totalServicios = servicios.reduce((total, servicio) => {
                  const precio = parseFloat(servicio.precioAplicado || servicio.precio || 0)
                  const cantidad = parseInt(servicio.cantidad || 1)
                  return total + (precio * cantidad)
                }, 0)
                totalCalculado += totalServicios
                tieneServicios = servicios.length > 0
                console.log(`   💼 Servicios: ${servicios.length}, Total: S/ ${totalServicios}`)
              }
            } catch (error) {
              console.warn(`   ⚠️ Error al cargar servicios:`, error)
            }
            
            try {
              // Cargar repuestos
              const { default: usoRepuestoService } = await import('../services/usoRepuestoService')
              const repuestosResponse = await usoRepuestoService.buscarPorOrden(orden.idOrden)
              if (repuestosResponse.success && repuestosResponse.data) {
                const repuestos = repuestosResponse.data
                const totalRepuestos = repuestos.reduce((total, repuesto) => {
                  const precio = parseFloat(repuesto.precioUnitario || repuesto.precio || 0)
                  const cantidad = parseInt(repuesto.cantidad || 1)
                  return total + (precio * cantidad)
                }, 0)
                totalCalculado += totalRepuestos
                tieneRepuestos = repuestos.length > 0
                console.log(`   🔧 Repuestos: ${repuestos.length}, Total: S/ ${totalRepuestos}`)
              }
            } catch (error) {
              console.warn(`   ⚠️ Error al cargar repuestos:`, error)
            }
            
            // Usar el mayor entre totalOrden y totalCalculado
            const totalOrden = parseFloat(orden.totalOrden || 0)
            const totalFinal = Math.max(totalOrden, totalCalculado)
            const montoPendiente = totalFinal - totalPagado
            
            console.log(`   � Orden ${orden.numeroOrden} - Análisis:`, {
              totalOrden,
              totalCalculado,
              totalFinal,
              totalPagado,
              montoPendiente,
              tieneServicios,
              tieneRepuestos
            })
            
            // LÓGICA CORREGIDA: Solo incluir órdenes con saldo pendiente real
            if (montoPendiente > 0.01) {
              ordenesPendientes.push({
                ...orden,
                totalPagado,
                montoPendiente,
                totalCalculado: totalFinal,
                tieneServicios,
                tieneRepuestos
              })
              console.log(`   ✅ Orden ${orden.numeroOrden} INCLUIDA - Pendiente: S/ ${montoPendiente.toFixed(2)}`)
            } else {
              console.log(`   ❌ Orden ${orden.numeroOrden} EXCLUIDA - Completamente pagada (Total: S/ ${totalFinal.toFixed(2)}, Pagado: S/ ${totalPagado.toFixed(2)})`)
            }
            
          } catch (error) {
            console.warn(`⚠️ Error al procesar orden ${orden.numeroOrden}:`, error)
            // En caso de error, incluir la orden si tiene totalOrden > 0
            const totalOrden = parseFloat(orden.totalOrden || 0)
            if (totalOrden > 0) {
              ordenesPendientes.push({
                ...orden,
                totalPagado: 0,
                montoPendiente: totalOrden,
                totalCalculado: totalOrden
              })
            }
          }
        }
        
        console.log(`📋 RESULTADO: ${ordenesPendientes.length} órdenes pendientes de facturación`)
        setOrdenesCompletadas(ordenesPendientes)
      } else {
        console.log('📭 No se encontraron órdenes completadas')
        setOrdenesCompletadas([])
      }
    } catch (error) {
      console.error('❌ Error al cargar órdenes completadas:', error)
      setOrdenesCompletadas([])
      showSnackbar('Error al cargar órdenes completadas', 'warning')
    }
  }

  /**
   * Cargar estadísticas generales
   */
  const cargarEstadisticasGenerales = async () => {
    try {
      console.log('📊 Cargando estadísticas básicas...')
      
      const stats = await pagoService.calcularEstadisticasManual()
      
      const estadisticasFinales = {
        totalPagos: stats.totalPagos || 0,
        montoTotal: stats.montoTotal || 0,
        ordenesPendientes: ordenesCompletadas.length || 0
      }

      console.log('✅ Estadísticas cargadas:', estadisticasFinales)
      setEstadisticasGenerales(estadisticasFinales)
    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error)
      showSnackbar('Error al cargar estadísticas', 'warning')
    }
  }

  /**
   * Manejo de cambio de pestañas
   */
  const handleTabChange = (event, newValue) => {
    // Asegurar que solo se puedan seleccionar las pestañas disponibles (0: Pagos, 1: Órdenes)
    if (newValue >= 0 && newValue <= 1) {
      setTabValue(newValue)
    }
  }

  /**
   * Aplicar filtros
   */
  const handleFiltrosAplicados = (filtros) => {
    setFiltrosActivos(filtros)
  }

  /**
   * Abrir vista detallada de pago
   */
  const handleVerDetalle = (pago) => {
    setPagoDetailDialog({
      open: true,
      pago
    })
  }

  /**
   * Abrir selector de orden para facturación
   */
  const handleAbrirSelectorOrden = () => {
    if (ordenesCompletadas.length === 0) {
      showSnackbar('No hay órdenes completadas disponibles para facturar', 'warning')
      return
    }

    if (ordenesCompletadas.length === 1) {
      setFacturacionDialog({
        open: true,
        orden: ordenesCompletadas[0]
      })
    } else {
      setTabValue(1)
      showSnackbar('Ve a la pestaña "ÓRDENES POR FACTURAR" para seleccionar una orden', 'info')
    }
  }

  /**
   * Abrir facturación para una orden
   */
  const handleFacturarOrden = (orden) => {
    setFacturacionDialog({
      open: true,
      orden
    })
  }

  /**
   * Callback cuando se guarda un pago
   */
  const handlePagoGuardado = (pago) => {
    showSnackbar(
      pagoFormDialog.pago ? 'Pago actualizado correctamente' : 'Pago registrado correctamente',
      'success'
    )
    setPagoFormDialog({ open: false, pago: null, orden: null })
    setRefreshPagos(prev => !prev)
    cargarDatosIniciales()
  }

  /**
   * Callback cuando se completa la facturación
   */
  const handleFacturacionCompleta = (resultado) => {
    showSnackbar('Facturación completada correctamente', 'success')
    setFacturacionDialog({ open: false, orden: null })
    setRefreshPagos(prev => !prev)
    cargarDatosIniciales()
  }

  /**
   * Mostrar snackbar
   */
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity })
  }

  /**
   * Formatear moneda
   */
  const formatearMoneda = (monto) => {
    if (!monto) return 'S/ 0.00'
    return `S/ ${parseFloat(monto).toFixed(2)}`
  }

  // Si no tiene permisos, mostrar mensaje de acceso denegado
  if (!tienePermisos) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          💰 Gestión de Pagos
        </Typography>
        
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="h6">
            Acceso Denegado
          </Typography>
          <Typography>
            Tu rol {user?.rol} no tiene permisos para acceder al módulo de pagos.
            Solo ADMIN y RECEPCIONISTA pueden gestionar pagos según la configuración de seguridad.
          </Typography>
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Encabezado */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          💰 Gestión de Pagos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Usuario: {user?.nombreCompleto} ({user?.rol})
        </Typography>
      </Box>

      {/* Estadísticas generales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ReceiptIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Pagos
                  </Typography>
                  <Typography variant="h4">
                    {estadisticasGenerales.totalPagos}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Monto Total
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {formatearMoneda(estadisticasGenerales.montoTotal)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssignmentIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Órdenes por Facturar
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {ordenesCompletadas.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<ReceiptIcon />}
                  onClick={handleAbrirSelectorOrden}
                  fullWidth
                  disabled={ordenesCompletadas.length === 0}
                >
                  Facturar Orden
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pestañas principales */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Pagos Registrados" />
          <Tab label="Órdenes por Facturar" />
        </Tabs>
      </Box>

      {/* Contenido de pestañas */}
      {tabValue === 0 && (
        <Box>
          <Box mb={3}>
            <PagoFilters onFiltrosAplicados={handleFiltrosAplicados} />
          </Box>
          
          <PagosList
            onVerDetalle={handleVerDetalle}
            filtros={filtrosActivos}
            refresh={refreshPagos}
          />
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Órdenes Completadas Pendientes de Facturación
          </Typography>
          
          <Grid container spacing={2}>
            {ordenesCompletadas.map((orden) => (
              <Grid item xs={12} sm={6} md={4} key={orden.idOrden}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      #{orden.numeroOrden}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cliente: {orden.cliente?.nombres || 'Sin cliente'} {orden.cliente?.apellidos || ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Moto: {orden.moto?.marca} {orden.moto?.modelo}
                    </Typography>
                    <Typography variant="body1" color="primary.main" fontWeight="bold">
                      Total: {formatearMoneda(orden.totalCalculado || orden.montoPendiente || orden.totalOrden)}
                    </Typography>
                    
                    {/* Indicador de contenido */}
                    {(orden.tieneServicios || orden.tieneRepuestos) && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {orden.tieneServicios && orden.tieneRepuestos ? '📋 Con servicios y repuestos' :
                         orden.tieneServicios ? '📋 Con servicios' : '🔧 Con repuestos'}
                      </Typography>
                    )}
                    
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ReceiptIcon />}
                      onClick={() => handleFacturarOrden(orden)}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Facturar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            
            {ordenesCompletadas.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="info">
                  No hay órdenes completadas pendientes de facturación.
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Diálogos */}
      <PagoForm
        open={pagoFormDialog.open}
        onClose={() => setPagoFormDialog({ open: false, pago: null, orden: null })}
        onPagoGuardado={handlePagoGuardado}
        pagoEditar={pagoFormDialog.pago}
        ordenPreseleccionada={pagoFormDialog.orden}
      />

      <PagoDetail
        open={pagoDetailDialog.open}
        onClose={() => setPagoDetailDialog({ open: false, pago: null })}
        pago={pagoDetailDialog.pago}
      />

      <FacturacionDialog
        open={facturacionDialog.open}
        onClose={() => setFacturacionDialog({ open: false, orden: null })}
        onFacturacionCompleta={handleFacturacionCompleta}
        ordenPreseleccionada={facturacionDialog.orden}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  )
}

export default PagosPage
