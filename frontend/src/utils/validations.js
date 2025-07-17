import * as yup from 'yup'

// Esquema de validación basado en LoginRequestDTO y Usuario entity
export const loginValidationSchema = yup.object({
  usernameOrEmail: yup
    .string()
    .required('El username o email es obligatorio')
    .max(100, 'No puede exceder 100 caracteres')
    .trim(),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .max(50, 'La contraseña no puede exceder 50 caracteres')
    .min(1, 'La contraseña es obligatoria')
})

// Función para formatear moneda
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'S/ 0.00'
  }
  
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(amount))
}
