import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Box,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { formatCurrency } from '../../utils/validations';

const RepuestoDetail = ({ repuesto, onClose, onEdit }) => {
  if (!repuesto) return null;

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo': return 'success';
      case 'inactivo': return 'error';
      case 'descontinuado': return 'warning';
      default: return 'default';
    }
  };

  const getStockStatusColor = (stockActual, stockMinimo) => {
    if (stockActual <= 0) return 'error';
    if (stockActual <= stockMinimo) return 'warning';
    return 'success';
  };

  const getStockStatusText = (stockActual, stockMinimo) => {
    if (stockActual <= 0) return 'Sin Stock';
    if (stockActual <= stockMinimo) return 'Stock Bajo';
    return 'Stock Normal';
  };

  return (
    <Dialog open={Boolean(repuesto)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Detalle del Repuesto
          </Typography>
          <Chip
            label={repuesto.estado || 'N/A'}
            color={getStatusColor(repuesto.estado)}
            size="small"
            variant="outlined"
          />
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Información General */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Información General
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Código
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {repuesto.codigo || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Nombre
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {repuesto.nombre || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Descripción
                    </Typography>
                    <Typography variant="body1">
                      {repuesto.descripcion || 'Sin descripción'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Marca
                    </Typography>
                    <Typography variant="body1">
                      {repuesto.marca || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Modelo Compatible
                    </Typography>
                    <Typography variant="body1">
                      {repuesto.modeloCompatible || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Información de Precios */}
          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Precios
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Precio de Compra
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      {formatCurrency(repuesto.precioCompra)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Precio de Venta
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {formatCurrency(repuesto.precioVenta)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Margen de Ganancia
                    </Typography>
                    <Typography variant="body1" color="info.main">
                      {repuesto.precioCompra && repuesto.precioVenta 
                        ? `${(((repuesto.precioVenta - repuesto.precioCompra) / repuesto.precioCompra) * 100).toFixed(1)}%`
                        : 'N/A'
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Información de Stock */}
          <Grid item xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Inventario
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="textSecondary">
                        Stock Actual
                      </Typography>
                      <Chip
                        label={getStockStatusText(repuesto.stockActual, repuesto.stockMinimo)}
                        color={getStockStatusColor(repuesto.stockActual, repuesto.stockMinimo)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="h5" color="text.primary">
                      {repuesto.stockActual || 0} unidades
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Stock Mínimo
                    </Typography>
                    <Typography variant="body1">
                      {repuesto.stockMinimo || 0} unidades
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Ubicación
                    </Typography>
                    <Typography variant="body1">
                      {repuesto.ubicacion || 'No especificada'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Información de Fechas */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Información de Registro
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Fecha de Creación
                    </Typography>
                    <Typography variant="body1">
                      {repuesto.fechaCreacion 
                        ? new Date(repuesto.fechaCreacion).toLocaleDateString()
                        : 'N/A'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Última Actualización
                    </Typography>
                    <Typography variant="body1">
                      {repuesto.fechaActualizacion 
                        ? new Date(repuesto.fechaActualizacion).toLocaleDateString()
                        : 'N/A'
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cerrar
        </Button>
        {onEdit && (
          <Button onClick={() => onEdit(repuesto)} color="primary" variant="contained">
            Editar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RepuestoDetail;
