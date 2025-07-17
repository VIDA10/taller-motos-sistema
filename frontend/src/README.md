# Estructura del proyecto frontend

```
src/
├── components/          # Componentes reutilizables
│   └── ProtectedRoute.jsx
├── pages/               # Páginas principales
│   ├── LoginPage.jsx
│   └── DashboardPage.jsx
├── services/            # Servicios para API
│   ├── api.js
│   └── authService.js
├── store/               # Redux store y slices
│   ├── store.js
│   └── slices/
│       └── authSlice.js
├── theme/               # Configuración de Material-UI
│   └── theme.js
├── App.jsx              # Componente principal
└── main.jsx             # Punto de entrada
```

## Setup completado ✅

- ✅ Estructura de carpetas creada
- ✅ Configuración de Redux con authSlice
- ✅ Configuración de Material-UI con tema personalizado
- ✅ Configuración de Axios con interceptores JWT
- ✅ Configuración de routing con protección de rutas
- ✅ Páginas base creadas (pendientes de implementación)
- ✅ Componente ProtectedRoute funcional

## Próximos pasos

1.2 Configuración de rutas y guards de autenticación
1.3 Implementación de login/logout JWT
1.4 Manejo de roles y permisos
1.5 Interceptores para manejo de tokens
1.6 Páginas de error y redirecciones
