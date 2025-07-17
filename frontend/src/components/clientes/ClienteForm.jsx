import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { Save, Cancel, Person, Phone, Email, Badge, LocationOn } from '@mui/icons-material';
import clienteService from '../../services/clienteService';

/**
 * Formulario para crear/editar clientes
 * Basado 100% en DTOs del backend:
 * - CreateClienteDTO: nombre*, telefono*, email, dni, direccion
 * - UpdateClienteDTO: nombre*, telefono*, email, dni, direccion, activo
 * 
 * Validaciones según entidad Cliente.java:
 * - nombre: @NotBlank, max 100 caracteres
 * - telefono: @NotBlank, max 20 caracteres, único
 * - email: @Email, max 100 caracteres, único
 * - dni: max 20 caracteres, único
 * - direccion: TEXT sin límite
 * - activo: Boolean (solo en modo edición)
 */
const ClienteForm = ({
  open,
  onClose,
  onSave,
  cliente = null, // null para crear, objeto para editar
  loading = false
}) => {
  // Determinar si es modo edición o creación
  const isEditing = Boolean(cliente);
  
  // Estado del formulario basado en DTOs
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    dni: '',
    direccion: '',
    activo: true // Solo relevante para UpdateClienteDTO
  });
  
  // Estado de validaciones
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [validatingUniqueness, setValidatingUniqueness] = useState({
    telefono: false,
    email: false,
    dni: false
  });
  
  // Inicializar formulario cuando se abre
  useEffect(() => {
    if (open) {
      if (isEditing && cliente) {
        // Modo edición: cargar datos del cliente (ClienteResponseDTO)
        setFormData({
          nombre: cliente.nombre || '',
          telefono: cliente.telefono || '',
          email: cliente.email || '',
          dni: cliente.dni || '',
          direccion: cliente.direccion || '',
          activo: cliente.activo !== undefined ? cliente.activo : true
        });
      } else {
        // Modo creación: valores por defecto (CreateClienteDTO)
        setFormData({
          nombre: '',
          telefono: '',
          email: '',
          dni: '',
          direccion: '',
          activo: true
        });
      }
      // Limpiar errores y campos tocados
      setErrors({});
      setTouched({});
    }
  }, [open, isEditing, cliente]);

  /**
   * Validar unicidad de campos en tiempo real
   * CORREGIDO: Usando endpoints reales del backend /existe/
   */
  const validateUniqueness = async (field, value) => {
    if (!value || value.trim() === '') return;

    try {
      setValidatingUniqueness(prev => ({ ...prev, [field]: true }));

      let exists = false;
      
      switch (field) {
        case 'telefono':
          if (isEditing && cliente) {
            exists = await clienteService.checkPhoneExistsExcluding(value, cliente.idCliente);
          } else {
            exists = await clienteService.checkPhoneExists(value);
          }
          break;
          
        case 'email':
          if (isEditing && cliente) {
            exists = await clienteService.checkEmailExistsExcluding(value, cliente.idCliente);
          } else {
            exists = await clienteService.checkEmailExists(value);
          }
          break;
          
        case 'dni':
          if (isEditing && cliente) {
            exists = await clienteService.checkDniExistsExcluding(value, cliente.idCliente);
          } else {
            exists = await clienteService.checkDniExists(value);
          }
          break;
      }

      if (exists) {
        setErrors(prev => ({
          ...prev,
          [field]: `Este ${field === 'telefono' ? 'teléfono' : field === 'email' ? 'email' : 'DNI'} ya está registrado`
        }));
      } else {
        // Limpiar error de unicidad si no existe
        setErrors(prev => {
          const newErrors = { ...prev };
          if (newErrors[field] && newErrors[field].includes('ya está registrado')) {
            delete newErrors[field];
          }
          return newErrors;
        });
      }
    } catch (error) {
      console.error(`Error validando unicidad de ${field}:`, error);
    } finally {
      setValidatingUniqueness(prev => ({ ...prev, [field]: false }));
    }
  };

  /**
   * Validaciones del frontend basadas en validaciones del backend + reglas específicas
   * Siguiendo exactamente las constraints de Cliente.java + validaciones en tiempo real
   */
  const validateField = (name, value) => {
    const fieldErrors = {};

    switch (name) {
      case 'nombre':
        // @NotBlank + @Size(max = 100) + Solo letras y espacios
        if (!value || value.trim() === '') {
          fieldErrors.nombre = 'El nombre es obligatorio';
        } else if (value.length > 100) {
          fieldErrors.nombre = 'El nombre no puede exceder 100 caracteres';
        } else {
          const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
          if (!nombreRegex.test(value)) {
            fieldErrors.nombre = 'El nombre solo puede contener letras y espacios';
          }
        }
        break;

      case 'telefono':
        // @NotBlank + @Size(max = 20) + exactamente 9 dígitos + empezar con 9
        if (!value || value.trim() === '') {
          fieldErrors.telefono = 'El teléfono es obligatorio';
        } else if (!/^[0-9]+$/.test(value)) {
          fieldErrors.telefono = 'El teléfono solo puede contener números';
        } else if (value.length !== 9) {
          fieldErrors.telefono = 'El teléfono debe tener exactamente 9 dígitos';
        } else if (!value.startsWith('9')) {
          fieldErrors.telefono = 'El teléfono debe empezar con 9';
        }
        break;

      case 'email':
        // @Email + @Size(max = 100) - email es opcional
        if (value && value.trim() !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            fieldErrors.email = 'El email debe tener un formato válido';
          } else if (value.length > 100) {
            fieldErrors.email = 'El email no puede exceder 100 caracteres';
          }
        }
        break;

      case 'dni':
        // @Size(max = 20) + exactamente 8 dígitos + solo números - dni es OBLIGATORIO
        if (!value || value.trim() === '') {
          fieldErrors.dni = 'El DNI es obligatorio';
        } else if (!/^[0-9]+$/.test(value)) {
          fieldErrors.dni = 'El DNI solo puede contener números';
        } else if (value.length !== 8) {
          fieldErrors.dni = 'El DNI debe tener exactamente 8 dígitos';
        }
        break;

      case 'direccion':
        // Sin validaciones específicas (TEXT sin límite)
        break;

      default:
        break;
    }

    return fieldErrors;
  };

  /**
   * Validar todo el formulario
   */
  const validateForm = () => {
    const allErrors = {};
    Object.keys(formData).forEach(field => {
      if (field !== 'activo') { // activo no necesita validación
        const fieldErrors = validateField(field, formData[field]);
        Object.assign(allErrors, fieldErrors);
      }
    });
    return allErrors;
  };

  /**
   * Manejar cambios en los campos del formulario con validaciones en tiempo real
   */
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    let fieldValue = type === 'checkbox' ? checked : value;
    
    // Validaciones en tiempo real - prevenir entrada incorrecta
    if (name === 'nombre') {
      // Solo permitir letras, espacios y acentos
      const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!nombreRegex.test(fieldValue)) {
        return; // No actualizar si contiene caracteres no válidos
      }
    } else if (name === 'telefono') {
      // Solo permitir números, máximo 9 dígitos, debe empezar con 9
      const telefonoRegex = /^[0-9]*$/;
      if (!telefonoRegex.test(fieldValue)) {
        return; // No actualizar si contiene caracteres no válidos
      }
      // Limitar a 9 dígitos
      if (fieldValue.length > 9) {
        return; // No permitir más de 9 dígitos
      }
      // Si no está vacío y no empieza con 9, no permitir
      if (fieldValue.length > 0 && !fieldValue.startsWith('9')) {
        return; // No permitir si no empieza con 9
      }
    } else if (name === 'dni') {
      // Solo permitir números, máximo 8 dígitos
      const dniRegex = /^[0-9]*$/;
      if (!dniRegex.test(fieldValue)) {
        return; // No actualizar si contiene caracteres no válidos
      }
      // Limitar a 8 dígitos
      if (fieldValue.length > 8) {
        return; // No permitir más de 8 dígitos
      }
    }
    
    // Actualizar valor solo si pasa las validaciones
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Marcar campo como tocado
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar campo si ya fue tocado
    if (touched[name] || fieldValue) {
      const fieldErrors = validateField(name, fieldValue);
      setErrors(prev => {
        const newErrors = { ...prev };
        // Eliminar errores previos del campo
        delete newErrors[name];
        // Agregar nuevos errores si existen
        Object.assign(newErrors, fieldErrors);
        return newErrors;
      });
    }

    // Validar unicidad en tiempo real para campos únicos
    if (['telefono', 'email', 'dni'].includes(name) && fieldValue && fieldValue.trim() !== '') {
      validateUniqueness(name, fieldValue);
    }
  };

  /**
   * Manejar blur en los campos
   */
  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar el campo al perder el foco
    const fieldErrors = validateField(name, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      Object.assign(newErrors, fieldErrors);
      return newErrors;
    });

    // Validar unicidad para campos únicos
    if (['telefono', 'email', 'dni'].includes(name) && value && value.trim() !== '') {
      validateUniqueness(name, value);
    }
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = () => {
    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(formData).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Validar formulario completo
    const formErrors = validateForm();
    setErrors(formErrors);

    // Si no hay errores, enviar datos
    if (Object.keys(formErrors).length === 0) {
      // Preparar datos según el DTO correspondiente
      let dataToSend;
      
      if (isEditing) {
        // UpdateClienteDTO: incluir todos los campos incluyendo 'activo'
        dataToSend = {
          nombre: formData.nombre.trim(),
          telefono: formData.telefono.trim(),
          email: formData.email.trim() || null, // Enviar null si está vacío
          dni: formData.dni.trim(), // DNI es obligatorio, no enviar null
          direccion: formData.direccion.trim() || null, // Enviar null si está vacío
          activo: formData.activo
        };
      } else {
        // CreateClienteDTO: excluir campo 'activo'
        dataToSend = {
          nombre: formData.nombre.trim(),
          telefono: formData.telefono.trim(),
          email: formData.email.trim() || null,
          dni: formData.dni.trim(), // DNI es obligatorio, no enviar null
          direccion: formData.direccion.trim() || null
        };
      }

      onSave(dataToSend);
    }
  };

  /**
   * Manejar cancelación
   */
  const handleCancel = () => {
    onClose();
  };

  // Verificar si el formulario es válido - todos los campos obligatorios deben estar completos
  const isFormValid = Object.keys(errors).length === 0 && 
                       formData.nombre.trim() && 
                       formData.telefono.trim() && 
                       formData.dni.trim() &&
                       !validatingUniqueness.telefono &&
                       !validatingUniqueness.email &&
                       !validatingUniqueness.dni;

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Person color="primary" />
          <Typography variant="h6">
            {isEditing ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
          </Typography>
        </Box>
        {isEditing && cliente && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            ID: {cliente.idCliente} - Creado: {new Date(cliente.createdAt).toLocaleDateString('es-ES')}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {/* Información de campos obligatorios */}
          <Alert severity="info" sx={{ mb: 2 }}>
            Los campos marcados con (*) son obligatorios
          </Alert>

          <Grid container spacing={3}>
            {/* Nombre - Campo obligatorio */}
            <Grid item xs={12} md={6}>
              <TextField
                name="nombre"
                label="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={Boolean(errors.nombre)}
                helperText={errors.nombre || 'Solo letras y espacios - Máximo 100 caracteres'}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            {/* Teléfono - Campo obligatorio */}
            <Grid item xs={12} md={6}>
              <TextField
                name="telefono"
                label="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={Boolean(errors.telefono)}
                helperText={errors.telefono || 'Exactamente 9 números - Debe empezar con 9 - Campo único'}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: validatingUniqueness.telefono && (
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                  )
                }}
                inputProps={{ 
                  maxLength: 9,
                  pattern: "[9][0-9]{8}",
                  placeholder: "9XXXXXXXX"
                }}
              />
            </Grid>

            {/* Email - Campo opcional con validación */}
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email || 'Opcional - Máximo 100 caracteres - Campo único'}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: validatingUniqueness.email && (
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                  )
                }}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            {/* DNI - Campo obligatorio */}
            <Grid item xs={12} md={6}>
              <TextField
                name="dni"
                label="DNI"
                value={formData.dni}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={Boolean(errors.dni)}
                helperText={errors.dni || 'Exactamente 8 números - Campo único'}
                InputProps={{
                  startAdornment: <Badge sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: validatingUniqueness.dni && (
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                  )
                }}
                inputProps={{ 
                  maxLength: 8,
                  pattern: "[0-9]{8}",
                  placeholder: "12345678"
                }}
              />
            </Grid>

            {/* Dirección - Campo opcional sin límite */}
            <Grid item xs={12}>
              <TextField
                name="direccion"
                label="Dirección"
                value={formData.direccion}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                multiline
                rows={2}
                error={Boolean(errors.direccion)}
                helperText={errors.direccion || 'Opcional - Sin límite de caracteres'}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                }}
              />
            </Grid>

            {/* Campo activo - Solo en modo edición según UpdateClienteDTO */}
            {isEditing && (
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <FormControlLabel
                  control={
                    <Switch
                      name="activo"
                      checked={formData.activo}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">
                        Estado del Cliente
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formData.activo ? 'Cliente activo' : 'Cliente inactivo'}
                      </Typography>
                    </Box>
                  }
                />
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Este campo permite reactivar clientes inactivos. Solo disponible en modo edición.
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          disabled={loading}
          startIcon={<Cancel />}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !isFormValid}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
        >
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClienteForm;
