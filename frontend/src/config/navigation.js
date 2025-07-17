import { 
  Dashboard, 
  People, 
  PersonAdd, 
  DirectionsBike,
  Assignment,
  Build,
  Inventory,
  Payment,
  Assessment,
  Settings 
} from '@mui/icons-material';
import { ROLES, canAccessModule } from '../utils/permissions';

// Configuración completa de navegación con permisos por rol
export const navigationConfig = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    icon: Dashboard,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.MECANICO]
  },
  {
    key: 'usuarios',
    title: 'Usuarios',
    path: '/usuarios',
    icon: People,
    allowedRoles: [ROLES.ADMIN], // Solo ADMIN puede gestionar usuarios
    module: 'usuarios'
  },
  {
    key: 'clientes',
    title: 'Clientes',
    path: '/clientes',
    icon: PersonAdd,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPCIONISTA],
    module: 'clientes'
  },
  {
    key: 'motos',
    title: 'Motos',
    path: '/motos',
    icon: DirectionsBike,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.MECANICO],
    module: 'motos'
  },
  {
    key: 'ordenes',
    title: 'Órdenes de Trabajo',
    path: '/ordenes',
    icon: Assignment,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPCIONISTA],
    module: 'ordenes'
  },
  {
    key: 'mecanico',
    title: 'Mis Órdenes',
    path: '/mecanico',
    icon: Build,
    allowedRoles: [ROLES.MECANICO],
    module: 'ordenes'
  },
  {
    key: 'servicios',
    title: 'Servicios',
    path: '/servicios',
    icon: Build,
    allowedRoles: [ROLES.ADMIN, ROLES.MECANICO],
    module: 'servicios'
  },
  {
    key: 'repuestos',
    title: 'Repuestos',
    path: '/repuestos',
    icon: Inventory,
    allowedRoles: [ROLES.ADMIN, ROLES.MECANICO],
    module: 'repuestos'
  },
  {
    key: 'pagos',
    title: 'Pagos',
    path: '/pagos',
    icon: Payment,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPCIONISTA],
    module: 'pagos'
  },
  {
    key: 'reportes',
    title: 'Reportes',
    path: '/reportes',
    icon: Assessment,
    allowedRoles: [ROLES.ADMIN, ROLES.RECEPCIONISTA],
    module: 'reportes'
  },
  {
    key: 'diagnostico',
    title: 'Diagnóstico',
    path: '/diagnostico',
    icon: Settings,
    allowedRoles: [ROLES.ADMIN], // Solo ADMIN puede acceder al diagnóstico
    module: 'diagnostico'
  }
];

// Función para obtener elementos de navegación permitidos para un usuario
export const getNavigationForUser = (user) => {
  if (!user || !user.rol) return [];

  return navigationConfig.filter(item => {
    // Verificar si el usuario tiene el rol permitido
    const hasRole = item.allowedRoles.includes(user.rol);
    
    // Si tiene módulo específico, verificar permisos
    if (item.module) {
      return hasRole && canAccessModule(user, item.module);
    }
    
    return hasRole;
  });
};

// Función para obtener elementos de navegación por rol
export const getNavigationByRole = (role) => {
  return navigationConfig[role] || []
}
