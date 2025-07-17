// Definición de roles (basado en Usuario.java)
export const ROLES = {
  ADMIN: 'ADMIN',
  RECEPCIONISTA: 'RECEPCIONISTA',
  MECANICO: 'MECANICO'
};

// Definición de permisos por rol
// IMPORTANTE: Basado en análisis real del backend (SecurityConfig.java)
// - Solo /api/admin/** requiere rol ADMIN
// - Todos los demás endpoints son accesibles para usuarios autenticados
// - El control granular se implementa en el frontend para UX
export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    // ADMIN tiene acceso completo a todo
    usuarios: { create: true, read: true, update: true, delete: true },
    clientes: { create: true, read: true, update: true, delete: true },
    motos: { create: true, read: true, update: true, delete: true },
    ordenes: { create: true, read: true, update: true, delete: true },
    servicios: { create: true, read: true, update: true, delete: true },
    repuestos: { create: true, read: true, update: true, delete: true },
    pagos: { create: true, read: true, update: true, delete: true },
    reportes: { create: true, read: true, update: true, delete: true },
    reportes: { create: true, read: true, update: true, delete: true },
    configuraciones: { create: true, read: true, update: true, delete: true },
    // Funciones exclusivas de ADMIN
    admin: { create: true, read: true, update: true, delete: true }
  },
  [ROLES.RECEPCIONISTA]: {
    // RECEPCIONISTA - gestión de clientes, órdenes y pagos
    // Basado en docs/Funciones de perfil.md: Registro y gestión + información VIN
    usuarios: { create: true, read: true, update: true, delete: false }, // Puede crear/gestionar usuarios (excepto otros admins)
    clientes: { create: true, read: true, update: true, delete: false },
    motos: { create: true, read: true, update: true, delete: false }, // Registro y gestión según documentación
    ordenes: { create: true, read: true, update: true, delete: false },
    servicios: { create: true, read: true, update: true, delete: false }, // CRUD completo según documentación
    repuestos: { create: false, read: true, update: true, delete: false }, // Consultar disponibilidad, solicitar
    pagos: { create: true, read: true, update: true, delete: false }, // Control total de facturación
    reportes: { create: false, read: true, update: false, delete: false },
    configuraciones: { create: false, read: true, update: false, delete: false },
    admin: { create: false, read: false, update: false, delete: false }
  },
  [ROLES.MECANICO]: {
    // MECANICO - trabajo técnico, servicios y repuestos
    // Basado en docs/Funciones de perfil.md: Ver, editar, eliminar (NO crear) + gestión de VIN
    usuarios: { create: false, read: false, update: false, delete: false },
    clientes: { create: false, read: true, update: true, delete: false }, // Puede actualizar observaciones técnicas
    motos: { create: false, read: true, update: true, delete: true }, // NO puede crear motos - responsabilidad de recepción/admin
    ordenes: { create: false, read: true, update: true, delete: false },
    servicios: { create: false, read: false, update: false, delete: false }, // Sin acceso - gestión desde órdenes de trabajo
    repuestos: { create: false, read: true, update: true, delete: false }, // Consultar y registrar uso
    pagos: { create: false, read: false, update: false, delete: false }, // Sin acceso según documentación
    reportes: { create: false, read: true, update: false, delete: false },
    configuraciones: { create: false, read: false, update: false, delete: false }, // Sin acceso según documentación
    admin: { create: false, read: false, update: false, delete: false }
  }
};

// Función para verificar si un usuario tiene un permiso específico
export const hasPermission = (user, module, action) => {
  if (!user || !user.rol) return false;
  
  const userPermissions = PERMISSIONS[user.rol];
  if (!userPermissions || !userPermissions[module]) return false;
  
  return userPermissions[module][action] || false;
};

// Función para verificar si un usuario puede acceder a un módulo
export const canAccessModule = (user, module) => {
  if (!user || !user.rol) return false;
  
  const userPermissions = PERMISSIONS[user.rol];
  if (!userPermissions || !userPermissions[module]) return false;
  
  // Un usuario puede acceder al módulo si tiene al menos un permiso
  const modulePermissions = userPermissions[module];
  return Object.values(modulePermissions).some(permission => permission === true);
};

// Función para obtener la lista de módulos accesibles para un usuario
export const getAccessibleModules = (user) => {
  if (!user || !user.rol) return [];
  
  const userPermissions = PERMISSIONS[user.rol];
  if (!userPermissions) return [];
  
  return Object.keys(userPermissions).filter(module => canAccessModule(user, module));
};

// Función para verificar si el usuario es ADMIN
export const isAdmin = (user) => {
  return user && user.rol === ROLES.ADMIN;
};

// Función para verificar si el usuario es RECEPCIONISTA
export const isRecepcionista = (user) => {
  return user && user.rol === ROLES.RECEPCIONISTA;
};

// Función para verificar si el usuario es MECANICO
export const isMecanico = (user) => {
  return user && user.rol === ROLES.MECANICO;
};

// Función para verificar si puede acceder a endpoints /api/admin/**
export const canAccessAdminEndpoints = (user) => {
  return isAdmin(user);
};

// Función para obtener el color del rol para UI
export const getRoleColor = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return 'error'; // Rojo para admin
    case ROLES.RECEPCIONISTA:
      return 'primary'; // Azul para recepcionista
    case ROLES.MECANICO:
      return 'success'; // Verde para mecánico
    default:
      return 'default';
  }
};

// Función para obtener el nombre legible del rol
export const getRoleDisplayName = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return 'Administrador';
    case ROLES.RECEPCIONISTA:
      return 'Recepcionista';
    case ROLES.MECANICO:
      return 'Mecánico';
    default:
      return role;
  }
};

// Rutas permitidas por rol (para navegación del sidebar)
export const ALLOWED_ROUTES_BY_ROLE = {
  [ROLES.ADMIN]: [
    '/dashboard',
    '/usuarios',
    '/clientes',
    '/motos',
    '/ordenes',
    '/servicios',
    '/repuestos',
    '/pagos',
    '/reportes',
    '/configuraciones'
  ],
  [ROLES.RECEPCIONISTA]: [
    '/dashboard',
    '/clientes',
    '/motos',
    '/ordenes',
    '/pagos',
    '/reportes'
  ],
  [ROLES.MECANICO]: [
    '/dashboard',
    '/motos',  // CRUD completo según docs/Funciones de perfil.md
    '/mecanico', // Página específica del mecánico para sus órdenes
    '/servicios',
    '/repuestos'
  ]
};

// Función para verificar si un usuario puede acceder a una ruta
export const canAccessRoute = (user, route) => {
  if (!user || !user.rol) return false;
  
  const allowedRoutes = ALLOWED_ROUTES_BY_ROLE[user.rol];
  if (!allowedRoutes) return false;
  
  return allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute));
};
