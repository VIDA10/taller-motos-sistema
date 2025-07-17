import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  Breadcrumbs,
  Link,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Person,
  Phone,
  Email,
  Badge,
  LocationOn,
  CalendarToday,
  Update,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { clienteService } from '../../services/clienteService';

const ClienteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar permisos de edición
  const canEdit = user?.rol === 'ADMIN' || user?.rol === 'RECEPCIONISTA';

  useEffect(() => {
    fetchCliente();
  }, [id]);

  const fetchCliente = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clienteService.getById(id);
      setCliente(data);
    } catch (err) {
      console.error('Error al cargar cliente:', err);
      if (err.response?.status === 404) {
        setError('Cliente no encontrado');
      } else {
        setError('Error al cargar la información del cliente');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/clientes/editar/${id}`);
  };

  const handleBack = () => {
    navigate('/clientes');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const DetailField = ({ icon: Icon, label, value, color = 'inherit' }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Icon sx={{ mr: 2, color: 'primary.main' }} />
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" sx={{ color, fontWeight: 500 }}>
          {value || 'No especificado'}
        </Typography>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Volver a la lista
        </Button>
      </Box>
    );
  }

  if (!cliente) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No se encontró información del cliente
        </Alert>
        <Button
          variant="outlined"
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Volver a la lista
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/clientes');
          }}
          sx={{ textDecoration: 'none' }}
        >
          Clientes
        </Link>
        <Typography color="text.primary">
          {cliente.nombre}
        </Typography>
      </Breadcrumbs>

      {/* Encabezado con acciones */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              {cliente.nombre}
            </Typography>
            <Chip
              icon={cliente.activo ? <CheckCircle /> : <Cancel />}
              label={cliente.activo ? 'Cliente Activo' : 'Cliente Inactivo'}
              color={cliente.activo ? 'success' : 'error'}
              variant="outlined"
            />
          </Box>
        </Box>
        
        {canEdit && (
          <Tooltip title="Editar cliente">
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{ ml: 2 }}
            >
              Editar
            </Button>
          </Tooltip>
        )}
      </Paper>

      <Grid container spacing={3}>
        {/* Información Personal */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ mr: 1 }} />
                Información Personal
              </Typography>
              
              <DetailField
                icon={Person}
                label="Nombre completo"
                value={cliente.nombre}
              />
              
              <DetailField
                icon={Badge}
                label="DNI"
                value={cliente.dni}
              />
              
              <DetailField
                icon={Phone}
                label="Teléfono"
                value={cliente.telefono}
              />
              
              <DetailField
                icon={Email}
                label="Email"
                value={cliente.email}
              />
              
              <DetailField
                icon={LocationOn}
                label="Dirección"
                value={cliente.direccion}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Información del Sistema */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CalendarToday sx={{ mr: 1 }} />
                Información del Sistema
              </Typography>
              
              <DetailField
                icon={CalendarToday}
                label="Fecha de registro"
                value={formatDate(cliente.createdAt)}
              />
              
              <DetailField
                icon={Update}
                label="Última actualización"
                value={formatDate(cliente.updatedAt)}
              />

              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {cliente.activo ? <CheckCircle sx={{ mr: 2, color: 'success.main' }} /> : <Cancel sx={{ mr: 2, color: 'error.main' }} />}
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Estado del cliente
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: cliente.activo ? 'success.main' : 'error.main',
                      fontWeight: 500 
                    }}
                  >
                    {cliente.activo ? 'Activo' : 'Inactivo'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    ID del cliente
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    #{cliente.idCliente}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Información adicional para desarrollo futuro */}
      {(user?.rol === 'ADMIN' || user?.rol === 'RECEPCIONISTA') && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Funcionalidades próximas:</strong> En esta sección se mostrará el historial de 
              motos registradas, órdenes de trabajo realizadas y servicios contratados por este cliente.
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default ClienteDetail;
