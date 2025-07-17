package com.tallermoto.service;

import com.tallermoto.entity.Configuracion;
import com.tallermoto.repository.ConfiguracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de configuraciones del sistema
 * Proporciona operaciones CRUD y lógica de negocio para las configuraciones
 */
@Service
@Transactional
public class ConfiguracionService {

    @Autowired
    private ConfiguracionRepository configuracionRepository;

    // ===============================
    // OPERACIONES CRUD BÁSICAS
    // ===============================

    /**
     * Crear una nueva configuración
     */
    public Configuracion crearConfiguracion(Configuracion configuracion) {
        // Validar que la clave no exista
        if (configuracionRepository.existsByClave(configuracion.getClave())) {
            throw new IllegalArgumentException("Ya existe una configuración con la clave: " + configuracion.getClave());
        }
        
        // Establecer tipo de dato por defecto si no está definido
        if (configuracion.getTipoDato() == null || configuracion.getTipoDato().isEmpty()) {
            configuracion.setTipoDato("STRING");
        }
        
        return configuracionRepository.save(configuracion);
    }

    /**
     * Obtener configuración por clave (ID)
     */
    @Transactional(readOnly = true)
    public Optional<Configuracion> obtenerConfiguracionPorClave(String clave) {
        return configuracionRepository.findById(clave);
    }

    /**
     * Obtener todas las configuraciones
     */
    @Transactional(readOnly = true)
    public List<Configuracion> obtenerTodasLasConfiguraciones() {
        return configuracionRepository.findAll();
    }

    /**
     * Obtener configuraciones con paginación
     */
    @Transactional(readOnly = true)
    public Page<Configuracion> obtenerConfiguracionesPaginadas(Pageable pageable) {
        return configuracionRepository.findAll(pageable);
    }

    /**
     * Actualizar configuración
     */
    public Configuracion actualizarConfiguracion(String clave, Configuracion configuracionActualizada) {
        Optional<Configuracion> configuracionExistente = configuracionRepository.findById(clave);
        if (configuracionExistente.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la configuración con clave: " + clave);
        }

        Configuracion configuracion = configuracionExistente.get();
        
        // Actualizar campos (la clave no se puede cambiar por ser PK)
        configuracion.setValor(configuracionActualizada.getValor());
        configuracion.setDescripcion(configuracionActualizada.getDescripcion());
        configuracion.setTipoDato(configuracionActualizada.getTipoDato());

        return configuracionRepository.save(configuracion);
    }

    /**
     * Eliminar configuración permanentemente
     */
    public void eliminarConfiguracion(String clave) {
        if (!configuracionRepository.existsById(clave)) {
            throw new IllegalArgumentException("No se encontró la configuración con clave: " + clave);
        }
        configuracionRepository.deleteById(clave);
    }

    // ===============================
    // CONSULTAS POR TIPO DE DATO
    // ===============================

    /**
     * Buscar configuraciones por tipo de dato
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarPorTipoDato(String tipoDato) {
        return configuracionRepository.findByTipoDato(tipoDato);
    }

    /**
     * Buscar configuraciones por tipo de dato ordenadas por clave
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarPorTipoDatoOrdenadas(String tipoDato) {
        return configuracionRepository.findByTipoDatoOrderByClave(tipoDato);
    }

    /**
     * Obtener todos los tipos de datos disponibles
     */
    @Transactional(readOnly = true)
    public List<String> obtenerTiposDatos() {
        return configuracionRepository.findAllTiposDato();
    }

    /**
     * Buscar configuraciones por tipo de dato (nativo)
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarPorTipoDatoNativo(String tipoDato) {
        return configuracionRepository.findByTipoDatoNative(tipoDato);
    }

    /**
     * Buscar configuraciones STRING
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarConfiguracionesString() {
        return configuracionRepository.findConfiguracionesString();
    }

    /**
     * Buscar configuraciones INTEGER
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarConfiguracionesInteger() {
        return configuracionRepository.findConfiguracionesInteger();
    }

    /**
     * Buscar configuraciones DECIMAL
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarConfiguracionesDecimal() {
        return configuracionRepository.findConfiguracionesDecimal();
    }

    /**
     * Buscar configuraciones BOOLEAN
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarConfiguracionesBoolean() {
        return configuracionRepository.findConfiguracionesBoolean();
    }

    // ===============================
    // CONSULTAS POR CLAVE
    // ===============================

    /**
     * Buscar configuraciones por clave (contiene, ignora mayúsculas)
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarPorClave(String clave) {
        return configuracionRepository.findByClaveContainingIgnoreCase(clave);
    }

    /**
     * Buscar configuraciones que empiecen con prefijo
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarPorPrefijo(String prefijo) {
        return configuracionRepository.findByClaveStartingWith(prefijo);
    }

    /**
     * Buscar configuraciones que terminen con sufijo
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarPorSufijo(String sufijo) {
        return configuracionRepository.findByClaveEndingWith(sufijo);
    }

    /**
     * Buscar configuración por clave (nativo)
     */
    @Transactional(readOnly = true)
    public Optional<Configuracion> buscarPorClaveNativo(String clave) {
        return configuracionRepository.findByClaveNative(clave);
    }

    /**
     * Verificar si existe una clave
     */
    @Transactional(readOnly = true)
    public boolean existeClave(String clave) {
        return configuracionRepository.existsByClave(clave);
    }

    // ===============================
    // CONSULTAS POR VALOR
    // ===============================

    /**
     * Buscar configuraciones por valor exacto
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarPorValor(String valor) {
        return configuracionRepository.findByValor(valor);
    }

    /**
     * Buscar configuraciones por valor (contiene, ignora mayúsculas)
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarPorValorContiene(String valor) {
        return configuracionRepository.findByValorContainingIgnoreCase(valor);
    }

    // ===============================
    // CONSULTAS POR DESCRIPCIÓN
    // ===============================

    /**
     * Buscar configuraciones por descripción (contiene, ignora mayúsculas)
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarPorDescripcion(String descripcion) {
        return configuracionRepository.findByDescripcionContainingIgnoreCase(descripcion);
    }

    /**
     * Buscar configuraciones sin descripción
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarSinDescripcion() {
        return configuracionRepository.findByDescripcionIsNull();
    }

    /**
     * Buscar configuraciones con descripción
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarConDescripcion() {
        return configuracionRepository.findByDescripcionIsNotNull();
    }

    // ===============================
    // CONSULTAS COMBINADAS
    // ===============================

    /**
     * Buscar configuraciones por clave o descripción
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarPorClaveODescripcion(String clave, String descripcion) {
        return configuracionRepository.findByClaveContainingIgnoreCaseOrDescripcionContainingIgnoreCase(clave, descripcion);
    }

    /**
     * Buscar configuraciones por tipo de dato y valor
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarPorTipoDatoYValor(String tipoDato, String valor) {
        return configuracionRepository.findByTipoDatoAndValorContainingIgnoreCase(tipoDato, valor);
    }

    /**
     * Búsqueda general de configuraciones
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarConfiguraciones(String busqueda) {
        return configuracionRepository.buscarConfiguraciones(busqueda);
    }

    // ===============================
    // CONTADORES
    // ===============================

    /**
     * Contar configuraciones por tipo de dato
     */
    @Transactional(readOnly = true)
    public long contarPorTipoDato(String tipoDato) {
        return configuracionRepository.countByTipoDato(tipoDato);
    }

    /**
     * Contar configuraciones con descripción
     */
    @Transactional(readOnly = true)
    public long contarConDescripcion() {
        return configuracionRepository.countByDescripcionIsNotNull();
    }

    // ===============================
    // CONSULTAS POR FECHAS
    // ===============================

    /**
     * Buscar configuraciones actualizadas después de fecha
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarActualizadasDespuesDe(LocalDateTime fechaDesde) {
        return configuracionRepository.findByUpdatedAtAfter(fechaDesde);
    }

    /**
     * Buscar configuraciones actualizadas en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarActualizadasEnRango(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return configuracionRepository.findByUpdatedAtBetween(fechaDesde, fechaHasta);
    }    /**
     * Buscar configuraciones actualizadas después de fecha ordenadas por fecha desc
     */
    @Transactional(readOnly = true)
    public List<Configuracion> buscarActualizadasDespuesDeOrdenadaPorFecha(LocalDateTime fechaDesde) {
        return configuracionRepository.findByUpdatedAtAfterOrderByUpdatedAtDesc(fechaDesde);
    }

    // ===============================
    // CONSULTAS ESPECIALES
    // ===============================

    /**
     * Obtener todas las configuraciones ordenadas por clave (nativo)
     */
    @Transactional(readOnly = true)
    public List<Configuracion> obtenerTodasOrdenadas() {
        return configuracionRepository.findAllOrderByClaveNative();
    }

    // ===============================
    // MÉTODOS UTILITARIOS PARA CONFIGURACIONES
    // ===============================

    /**
     * Obtener valor de configuración como String
     */
    @Transactional(readOnly = true)
    public String obtenerValorString(String clave) {
        Optional<Configuracion> config = configuracionRepository.findById(clave);
        return config.map(Configuracion::getValor).orElse(null);
    }

    /**
     * Obtener valor de configuración como String con valor por defecto
     */
    @Transactional(readOnly = true)
    public String obtenerValorString(String clave, String valorPorDefecto) {
        Optional<Configuracion> config = configuracionRepository.findById(clave);
        return config.map(Configuracion::getValor).orElse(valorPorDefecto);
    }

    /**
     * Obtener valor de configuración como Integer
     */
    @Transactional(readOnly = true)
    public Integer obtenerValorInteger(String clave) {
        Optional<Configuracion> config = configuracionRepository.findById(clave);
        if (config.isEmpty()) {
            return null;
        }
        
        try {
            return Integer.parseInt(config.get().getValor());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("La configuración '" + clave + "' no tiene un valor entero válido: " + config.get().getValor());
        }
    }

    /**
     * Obtener valor de configuración como Integer con valor por defecto
     */
    @Transactional(readOnly = true)
    public Integer obtenerValorInteger(String clave, Integer valorPorDefecto) {
        try {
            Integer valor = obtenerValorInteger(clave);
            return valor != null ? valor : valorPorDefecto;
        } catch (IllegalArgumentException e) {
            return valorPorDefecto;
        }
    }

    /**
     * Obtener valor de configuración como BigDecimal
     */
    @Transactional(readOnly = true)
    public BigDecimal obtenerValorDecimal(String clave) {
        Optional<Configuracion> config = configuracionRepository.findById(clave);
        if (config.isEmpty()) {
            return null;
        }
        
        try {
            return new BigDecimal(config.get().getValor());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("La configuración '" + clave + "' no tiene un valor decimal válido: " + config.get().getValor());
        }
    }

    /**
     * Obtener valor de configuración como BigDecimal con valor por defecto
     */
    @Transactional(readOnly = true)
    public BigDecimal obtenerValorDecimal(String clave, BigDecimal valorPorDefecto) {
        try {
            BigDecimal valor = obtenerValorDecimal(clave);
            return valor != null ? valor : valorPorDefecto;
        } catch (IllegalArgumentException e) {
            return valorPorDefecto;
        }
    }

    /**
     * Obtener valor de configuración como Boolean
     */
    @Transactional(readOnly = true)
    public Boolean obtenerValorBoolean(String clave) {
        Optional<Configuracion> config = configuracionRepository.findById(clave);
        if (config.isEmpty()) {
            return null;
        }
        
        String valor = config.get().getValor().toLowerCase();
        return "true".equals(valor) || "1".equals(valor) || "yes".equals(valor) || "si".equals(valor);
    }

    /**
     * Obtener valor de configuración como Boolean con valor por defecto
     */
    @Transactional(readOnly = true)
    public Boolean obtenerValorBoolean(String clave, Boolean valorPorDefecto) {
        Boolean valor = obtenerValorBoolean(clave);
        return valor != null ? valor : valorPorDefecto;
    }

    /**
     * Actualizar solo el valor de una configuración
     */
    public Configuracion actualizarValor(String clave, String nuevoValor) {
        Optional<Configuracion> configuracionOpt = configuracionRepository.findById(clave);
        if (configuracionOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la configuración con clave: " + clave);
        }
        
        Configuracion configuracion = configuracionOpt.get();
        configuracion.setValor(nuevoValor);
        return configuracionRepository.save(configuracion);
    }

    /**
     * Crear o actualizar configuración
     */
    public Configuracion crearOActualizarConfiguracion(String clave, String valor, String descripcion, String tipoDato) {
        Optional<Configuracion> configuracionExistente = configuracionRepository.findById(clave);
        
        if (configuracionExistente.isPresent()) {
            // Actualizar existente
            Configuracion config = configuracionExistente.get();
            config.setValor(valor);
            if (descripcion != null) {
                config.setDescripcion(descripcion);
            }
            if (tipoDato != null) {
                config.setTipoDato(tipoDato);
            }
            return configuracionRepository.save(config);
        } else {
            // Crear nueva
            Configuracion nuevaConfig = new Configuracion(clave, valor, descripcion, tipoDato);
            return configuracionRepository.save(nuevaConfig);
        }
    }

    /**
     * Crear o actualizar configuración con valor String
     */
    public Configuracion crearOActualizarConfiguracion(String clave, String valor, String descripcion) {
        return crearOActualizarConfiguracion(clave, valor, descripcion, "STRING");
    }

    /**
     * Crear o actualizar configuración con valor Integer
     */
    public Configuracion crearOActualizarConfiguracionInteger(String clave, Integer valor, String descripcion) {
        return crearOActualizarConfiguracion(clave, valor.toString(), descripcion, "INTEGER");
    }

    /**
     * Crear o actualizar configuración con valor Decimal
     */
    public Configuracion crearOActualizarConfiguracionDecimal(String clave, BigDecimal valor, String descripcion) {
        return crearOActualizarConfiguracion(clave, valor.toString(), descripcion, "DECIMAL");
    }

    /**
     * Crear o actualizar configuración con valor Boolean
     */
    public Configuracion crearOActualizarConfiguracionBoolean(String clave, Boolean valor, String descripcion) {
        return crearOActualizarConfiguracion(clave, valor.toString(), descripcion, "BOOLEAN");
    }
}
