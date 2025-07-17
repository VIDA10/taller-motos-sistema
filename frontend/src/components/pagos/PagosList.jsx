import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Button,
  Stack
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  FilterList as FilterIcon
} from '@mui/icons-material'

// Importar servicios
import pagoService from '../../services/pagoService'

/**
 * Componente lista de pagos (solo lectura)
 * 
 * FUNCIONALIDADES:
 * - Lista paginada de pagos
 * - Filtros avanzados
 * - Vista detallada de pagos
 * 
 * NOTA: Los pagos completados no pueden editarse ni eliminarse
 * por razones de integridad de datos contables.
 * 
 * PERMISOS:
 * - ADMIN: Ver detalles
 * - RECEPCIONISTA: Ver detalles  
 * - MECANICO: Sin acceso
 */
const PagosList = ({ 
  onVerDetalle,
  filtros = {},
  refresh = false
}) => {
  const { user } = useSelector((state) => state.auth)
  
  // Estados del componente
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalPagos, setTotalPagos] = useState(0)

  // Verificar permisos
  const tienePermisos = user?.rol === 'ADMIN' || user?.rol === 'RECEPCIONISTA'

  /**
   * Cargar pagos desde el backend
   */
  const cargarPagos = async () => {
    if (!tienePermisos) {
      setError('No tienes permisos para ver los pagos')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      let response
      
      // Si hay filtros específicos, usar el método correspondiente
      if (filtros.idOrden) {
        response = await pagoService.buscarPorOrden({ idOrden: filtros.idOrden })
      } else if (filtros.metodo) {
        response = await pagoService.buscarPorMetodo(filtros.metodo)
      } else if (filtros.fechaDesde && filtros.fechaHasta) {
        response = await pagoService.buscarRangoFechas(filtros.fechaDesde, filtros.fechaHasta)
      } else {
        response = await pagoService.obtenerTodos()
      }

      if (response.data) {
        setPagos(response.data)
        setTotalPagos(response.data.length)
      }
    } catch (error) {
      console.error('Error al cargar pagos:', error)
      setError('Error al cargar los pagos. Verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  // Efecto para cargar pagos al montar y cuando cambien los filtros
  useEffect(() => {
    cargarPagos()
  }, [JSON.stringify(filtros), refresh, user?.idUsuario]) // Usar JSON.stringify para comparar objetos por contenido

  /**
   * Manejar cambio de página
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  /**
   * Manejar cambio de filas por página
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  /**
   * Formatear fecha para mostrar
   */
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A'
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Formatear moneda
   */
  const formatearMoneda = (monto) => {
    if (!monto) return 'S/ 0.00'
    return `S/ ${parseFloat(monto).toFixed(2)}`
  }

  /**
   * Obtener color del chip según método de pago
   */
  const obtenerColorMetodo = (metodo) => {
    const colores = {
      'EFECTIVO': 'success',
      'TARJETA': 'primary',
      'TRANSFERENCIA': 'secondary'
    }
    return colores[metodo] || 'default'
  }

  /**
   * Obtener icono según método de pago
   */
  const obtenerIconoMetodo = (metodo) => {
    switch (metodo) {
      case 'EFECTIVO':
        return '💵'
      case 'TARJETA':
        return '💳'
      case 'TRANSFERENCIA':
        return '🏦'
      default:
        return '💰'
    }
  }

  // Calcular pagos para la página actual
  const pagosPaginados = pagos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Si no tiene permisos, mostrar mensaje
  if (!tienePermisos) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <Typography variant="h6">
          Acceso Denegado
        </Typography>
        <Typography>
          Tu rol {user?.rol} no tiene permisos para acceder al módulo de pagos.
          Solo ADMIN y RECEPCIONISTA pueden gestionar pagos.
        </Typography>
      </Alert>
    )
  }

  return (
    <Box>
      {/* Encabezado con acciones */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2">
          <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Lista de Pagos
        </Typography>
        
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => {/* Implementar filtros avanzados */}}
          >
            Filtros
          </Button>
        </Stack>
      </Stack>

      {/* Estadísticas rápidas */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total Pagos
            </Typography>
            <Typography variant="h4">
              {totalPagos}
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Monto Total
            </Typography>
            <Typography variant="h4" color="primary">
              {formatearMoneda(pagos.reduce((total, pago) => total + parseFloat(pago.monto || 0), 0))}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Estado de carga */}
      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabla de pagos */}
      {!loading && !error && (
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Referencia</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagosPaginados.length > 0 ? (
                  pagosPaginados.map((pago) => (
                    <TableRow key={pago.idPago} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          #{pago.idPago}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          #{pago.ordenTrabajo?.numeroOrden || pago.ordenTrabajo?.idOrden}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {formatearMoneda(pago.monto)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={`${obtenerIconoMetodo(pago.metodo)} ${pago.metodo}`}
                          size="small"
                          color={obtenerColorMetodo(pago.metodo)}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {formatearFecha(pago.fechaPago)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pago.referencia || 'N/A'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              onClick={() => onVerDetalle && onVerDetalle(pago)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" py={4}>
                        No se encontraron pagos
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <TablePagination
            component="div"
            count={totalPagos}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Card>
      )}
    </Box>
  )
}

export default PagosList
