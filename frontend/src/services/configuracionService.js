/**
 * Servicio simple y amigable para configuraciones del sistema
 * Interfaz simplificada para el usuario final
 */

import api from './api';

class ConfiguracionService {
    constructor() {
        this.baseURL = '/configuraciones';
    }

    // ===============================
    // MÉTODOS PRINCIPALES SIMPLES
    // ===============================

    /**
     * Obtener todas las configuraciones organizadas
     */
    async obtenerConfiguraciones() {
        const response = await api.get(this.baseURL);
        return response.data;
    }

    /**
     * Actualizar una configuración usando el endpoint simplificado
     */
    async actualizarConfiguracion(clave, valor) {
        const response = await api.put(`${this.baseURL}/${clave}/valor/${valor}`);
        return response.data;
    }

    /**
     * Crear nueva configuración
     */
    async crearConfiguracion(configuracion) {
        const response = await api.post(this.baseURL, configuracion);
        return response.data;
    }

    /**
     * Eliminar configuración
     */
    async eliminarConfiguracion(clave) {
        await api.delete(`${this.baseURL}/${clave}`);
        return true;
    }

    // ===============================
    // MÉTODOS DE CONVENIENCIA
    // ===============================

    /**
     * Organizar configuraciones por categorías amigables
     */
    organizarPorCategorias(configuraciones) {
        const categorias = {
            financiero: {
                titulo: '💰 Configuración Financiera',
                descripcion: 'Impuestos, moneda y precios',
                configuraciones: []
            },
            operativo: {
                titulo: '⏰ Configuración Operativa',
                descripcion: 'Horarios y funcionamiento del taller',
                configuraciones: []
            },
            sistema: {
                titulo: '🔧 Configuración del Sistema',
                descripcion: 'Numeración, notificaciones y alertas',
                configuraciones: []
            },
            inventario: {
                titulo: '📦 Configuración de Inventario',
                descripcion: 'Stock y gestión de repuestos',
                configuraciones: []
            }
        };

        configuraciones.forEach(config => {
            const clave = config.clave.toLowerCase();
            
            if (clave.includes('iva') || clave.includes('moneda') || clave.includes('precio')) {
                categorias.financiero.configuraciones.push(config);
            } else if (clave.includes('hora') || clave.includes('tiempo') || clave.includes('dia')) {
                categorias.operativo.configuraciones.push(config);
            } else if (clave.includes('stock') || clave.includes('minimo') || clave.includes('inventario')) {
                categorias.inventario.configuraciones.push(config);
            } else {
                categorias.sistema.configuraciones.push(config);
            }
        });

        return categorias;
    }

    /**
     * Obtener nombre amigable para configuraciones
     */
    obtenerNombreAmigable(clave) {
        const nombres = {
            'IVA_PORCENTAJE': 'Porcentaje de IVA/IGV',
            'MONEDA_LOCAL': 'Moneda del Sistema',
            'HORA_APERTURA': 'Hora de Apertura',
            'HORA_CIERRE': 'Hora de Cierre',
            'DIAS_GARANTIA_SERVICIO': 'Días de Garantía',
            'PREFIJO_ORDEN': 'Prefijo de Órdenes',
            'STOCK_MINIMO_GLOBAL': 'Stock Mínimo Global',
            'EMAIL_NOTIFICACIONES': 'Notificaciones por Email'
        };
        return nombres[clave] || clave.replace(/_/g, ' ').toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Obtener descripción amigable
     */
    obtenerDescripcionAmigable(clave) {
        const descripciones = {
            'IVA_PORCENTAJE': 'Porcentaje de impuesto aplicado a los servicios',
            'MONEDA_LOCAL': 'Moneda utilizada en el sistema (PEN, USD, EUR)',
            'HORA_APERTURA': 'Hora de inicio de atención al público',
            'HORA_CIERRE': 'Hora de fin de atención al público',
            'DIAS_GARANTIA_SERVICIO': 'Días de garantía por defecto para servicios',
            'PREFIJO_ORDEN': 'Prefijo usado en la numeración de órdenes',
            'STOCK_MINIMO_GLOBAL': 'Cantidad mínima de stock para alertas',
            'EMAIL_NOTIFICACIONES': 'Activar o desactivar notificaciones por email'
        };
        return descripciones[clave] || 'Configuración del sistema';
    }

    /**
     * Validar valor según tipo
     */
    validarValor(valor, tipoDato) {
        switch (tipoDato) {
            case 'INTEGER':
                return /^\d+$/.test(valor);
            case 'DECIMAL':
                return /^\d+(\.\d{1,2})?$/.test(valor);
            case 'BOOLEAN':
                return ['true', 'false'].includes(valor.toLowerCase());
            default:
                return valor.length > 0;
        }
    }

    /**
     * Formatear valor para mostrar
     */
    formatearValor(valor, tipoDato) {
        switch (tipoDato) {
            case 'BOOLEAN':
                return valor === 'true' ? 'Activado' : 'Desactivado';
            case 'DECIMAL':
                return parseFloat(valor).toFixed(2) + '%';
            case 'INTEGER':
                return valor;
            default:
                return valor;
        }
    }
}

const configuracionService = new ConfiguracionService();
export default configuracionService;
