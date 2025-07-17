/**
 * Página de Configuraciones del Sistema - NUEVA VERSIÓN AMIGABLE
 * Diseñada con simplicidad y usabilidad para el administrador
 * Sigue el patrón de los módulos ya implementados
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Box,
    Alert,
    Snackbar,
    Paper,
    IconButton,
    Tooltip,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    Settings,
    Save,
    Edit,
    Check,
    Close,
    Refresh,
    Schedule,
    AttachMoney,
    Inventory,
    Computer,
    Info
} from '@mui/icons-material';

import configuracionService from '../services/configuracionService';
import { hasPermission } from '../utils/permissions';

const ConfiguracionesPage = () => {
    const { user } = useSelector((state) => state.auth);
    
    // Estados principales
    const [configuraciones, setConfiguraciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState({});
    const [valoresTemporales, setValoresTemporales] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Verificar permisos
    const canManageConfigurations = hasPermission(user, 'configuraciones', 'read');

    useEffect(() => {
        if (canManageConfigurations) {
            cargarConfiguraciones();
        }
    }, [canManageConfigurations]);

    const cargarConfiguraciones = async () => {
        try {
            setLoading(true);
            const datos = await configuracionService.obtenerConfiguraciones();
            setConfiguraciones(datos);
        } catch (error) {
            console.error('Error al cargar configuraciones:', error);
            mostrarMensaje('Error al cargar las configuraciones', 'error');
        } finally {
            setLoading(false);
        }
    };

    const mostrarMensaje = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const iniciarEdicion = (clave, valor) => {
        setEditando(prev => ({ ...prev, [clave]: true }));
        setValoresTemporales(prev => ({ ...prev, [clave]: valor }));
    };

    const cancelarEdicion = (clave) => {
        setEditando(prev => ({ ...prev, [clave]: false }));
        setValoresTemporales(prev => {
            const nueva = { ...prev };
            delete nueva[clave];
            return nueva;
        });
    };

    const guardarConfiguracion = async (clave) => {
        try {
            const nuevoValor = valoresTemporales[clave];
            
            // Validaciones básicas
            if (nuevoValor === undefined || nuevoValor === '') {
                mostrarMensaje('El valor no puede estar vacío', 'error');
                return;
            }

            await configuracionService.actualizarConfiguracion(clave, nuevoValor);
            
            // Actualizar estado local
            setConfiguraciones(prev => prev.map(config => 
                config.clave === clave 
                    ? { ...config, valor: nuevoValor.toString() }
                    : config
            ));
            
            setEditando(prev => ({ ...prev, [clave]: false }));
            setValoresTemporales(prev => {
                const nueva = { ...prev };
                delete nueva[clave];
                return nueva;
            });
            
            mostrarMensaje('Configuración actualizada correctamente', 'success');
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            mostrarMensaje('Error al guardar la configuración', 'error');
        }
    };

    const manejarCambioBoolean = async (clave, valor) => {
        try {
            const nuevoValor = valor ? 'true' : 'false';
            await configuracionService.actualizarConfiguracion(clave, nuevoValor);
            
            setConfiguraciones(prev => prev.map(config => 
                config.clave === clave 
                    ? { ...config, valor: nuevoValor }
                    : config
            ));
            
            mostrarMensaje('Configuración actualizada correctamente', 'success');
        } catch (error) {
            console.error('Error al actualizar configuración:', error);
            mostrarMensaje('Error al actualizar la configuración', 'error');
        }
    };

    const obtenerIconoCategoria = (clave) => {
        if (clave.includes('HORA') || clave.includes('DIAS')) return <Schedule color="primary" />;
        if (clave.includes('IVA') || clave.includes('MONEDA')) return <AttachMoney color="primary" />;
        if (clave.includes('STOCK')) return <Inventory color="primary" />;
        return <Computer color="primary" />;
    };

    const obtenerEtiquetaAmigable = (config) => {
        const etiquetas = {
            'STOCK_MINIMO_GLOBAL': 'Stock Mínimo Global',
            'DIAS_GARANTIA_SERVICIO': 'Días de Garantía de Servicios',
            'PREFIJO_ORDEN': 'Prefijo de Órdenes de Trabajo',
            'EMAIL_NOTIFICACIONES': 'Notificaciones por Email',
            'MONEDA_LOCAL': 'Moneda del Sistema',
            'IVA_PORCENTAJE': 'Porcentaje de IGV/IVA',
            'HORA_APERTURA': 'Hora de Apertura',
            'HORA_CIERRE': 'Hora de Cierre'
        };
        return etiquetas[config.clave] || config.clave.replace(/_/g, ' ');
    };

    const renderizarCampoConfiguracion = (config) => {
        const estaEditando = editando[config.clave];
        const valorActual = estaEditando ? valoresTemporales[config.clave] : config.valor;

        // Campo para boolean (switch)
        if (config.tipoDato === 'BOOLEAN') {
            return (
                <FormControlLabel
                    control={
                        <Switch
                            checked={config.valor === 'true'}
                            onChange={(e) => manejarCambioBoolean(config.clave, e.target.checked)}
                            color="primary"
                        />
                    }
                    label={config.valor === 'true' ? 'Activado' : 'Desactivado'}
                />
            );
        }

        // Campo para editar otros tipos
        if (estaEditando) {
            return (
                <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                        value={valorActual}
                        onChange={(e) => setValoresTemporales(prev => ({
                            ...prev, 
                            [config.clave]: e.target.value
                        }))}
                        size="small"
                        type={config.tipoDato === 'INTEGER' || config.tipoDato === 'DECIMAL' ? 'number' : 'text'}
                        inputProps={{
                            step: config.tipoDato === 'DECIMAL' ? '0.01' : undefined,
                            min: config.tipoDato !== 'STRING' ? '0' : undefined
                        }}
                        sx={{ flexGrow: 1 }}
                    />
                    <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => guardarConfiguracion(config.clave)}
                    >
                        <Check />
                    </IconButton>
                    <IconButton 
                        color="secondary" 
                        size="small"
                        onClick={() => cancelarEdicion(config.clave)}
                    >
                        <Close />
                    </IconButton>
                </Box>
            );
        }

        // Campo en modo solo lectura
        return (
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    {config.valor}
                    {config.tipoDato === 'DECIMAL' && config.clave.includes('IVA') && '%'}
                </Typography>
                <IconButton 
                    size="small" 
                    onClick={() => iniciarEdicion(config.clave, config.valor)}
                    disabled={!hasPermission(user, 'configuraciones', 'update')}
                >
                    <Edit />
                </IconButton>
            </Box>
        );
    };

    // Verificación de acceso
    if (!canManageConfigurations) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    <Typography variant="h6">Acceso Restringido</Typography>
                    <Typography>Solo los administradores pueden acceder a las configuraciones del sistema.</Typography>
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Encabezado */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Settings sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Configuraciones del Sistema
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Administra los parámetros básicos del taller de motos
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={cargarConfiguraciones}
                    disabled={loading}
                >
                    Actualizar
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {configuraciones.map((config) => (
                        <Grid item xs={12} md={6} key={config.clave}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                                        {obtenerIconoCategoria(config.clave)}
                                        <Box flexGrow={1}>
                                            <Typography variant="h6" gutterBottom>
                                                {obtenerEtiquetaAmigable(config)}
                                            </Typography>
                                            <Chip 
                                                label={config.tipoDato} 
                                                size="small" 
                                                variant="outlined"
                                                color={config.tipoDato === 'BOOLEAN' ? 'primary' : 'default'}
                                            />
                                        </Box>
                                    </Box>
                                    
                                    {config.descripcion && (
                                        <Typography variant="body2" color="text.secondary" mb={2}>
                                            {config.descripcion}
                                        </Typography>
                                    )}
                                    
                                    <Box mt={2}>
                                        {renderizarCampoConfiguracion(config)}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Información adicional */}
            {!loading && configuraciones.length > 0 && (
                <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
                    <Box display="flex" alignItems="start" gap={2}>
                        <Computer color="primary" />
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Información sobre las Configuraciones
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                • Los switches (activado/desactivado) se guardan automáticamente al cambiar
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                • Para editar otros valores, haz clic en el ícono de edición
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Los cambios se aplican inmediatamente en todo el sistema
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ConfiguracionesPage;
