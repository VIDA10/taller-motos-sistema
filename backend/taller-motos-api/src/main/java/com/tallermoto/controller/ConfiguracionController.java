package com.tallermoto.controller;

import com.tallermoto.entity.Configuracion;
import com.tallermoto.service.ConfiguracionService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para la gestión de configuraciones del sistema
 * Mapea exactamente los métodos del ConfiguracionService sin agregar lógica adicional
 */
@RestController
@RequestMapping("/api/configuraciones")
@Tag(name = "Configuraciones", description = "API para gestión de las configuraciones del sistema")
public class ConfiguracionController {

    @Autowired
    private ConfiguracionService configuracionService;

    // ===============================
    // OPERACIONES CRUD BÁSICAS
    // ===============================

    /**
     * Crear una nueva configuración
     */
    @PostMapping
    public ResponseEntity<Configuracion> crearConfiguracion(@Valid @RequestBody Configuracion configuracion) {
        Configuracion nuevaConfiguracion = configuracionService.crearConfiguracion(configuracion);
        return new ResponseEntity<>(nuevaConfiguracion, HttpStatus.CREATED);
    }

    /**
     * Obtener configuración por clave (ID)
     */
    @GetMapping("/{clave}")
    public ResponseEntity<Configuracion> obtenerConfiguracionPorClave(@PathVariable String clave) {
        Optional<Configuracion> configuracion = configuracionService.obtenerConfiguracionPorClave(clave);
        return configuracion.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtener todas las configuraciones
     */
    @GetMapping
    public ResponseEntity<List<Configuracion>> obtenerTodasLasConfiguraciones() {
        List<Configuracion> configuraciones = configuracionService.obtenerTodasLasConfiguraciones();
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Obtener configuraciones con paginación
     */
    @GetMapping("/paginadas")
    public ResponseEntity<Page<Configuracion>> obtenerConfiguracionesPaginadas(Pageable pageable) {
        Page<Configuracion> configuraciones = configuracionService.obtenerConfiguracionesPaginadas(pageable);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Actualizar configuración
     */
    @PutMapping("/{clave}")
    public ResponseEntity<Configuracion> actualizarConfiguracion(@PathVariable String clave, @Valid @RequestBody Configuracion configuracionActualizada) {
        Configuracion configuracion = configuracionService.actualizarConfiguracion(clave, configuracionActualizada);
        return ResponseEntity.ok(configuracion);
    }

    /**
     * Eliminar configuración permanentemente
     */
    @DeleteMapping("/{clave}")
    public ResponseEntity<Void> eliminarConfiguracion(@PathVariable String clave) {
        configuracionService.eliminarConfiguracion(clave);
        return ResponseEntity.noContent().build();
    }

    // ===============================
    // CONSULTAS POR TIPO DE DATO
    // ===============================

    /**
     * Buscar configuraciones por tipo de dato
     */
    @GetMapping("/tipo-dato/{tipoDato}")
    public ResponseEntity<List<Configuracion>> buscarPorTipoDato(@PathVariable String tipoDato) {
        List<Configuracion> configuraciones = configuracionService.buscarPorTipoDato(tipoDato);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones por tipo de dato ordenadas por clave
     */
    @GetMapping("/tipo-dato/{tipoDato}/ordenadas")
    public ResponseEntity<List<Configuracion>> buscarPorTipoDatoOrdenadas(@PathVariable String tipoDato) {
        List<Configuracion> configuraciones = configuracionService.buscarPorTipoDatoOrdenadas(tipoDato);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Obtener todos los tipos de datos disponibles
     */
    @GetMapping("/tipos-datos")
    public ResponseEntity<List<String>> obtenerTiposDatos() {
        List<String> tiposDatos = configuracionService.obtenerTiposDatos();
        return ResponseEntity.ok(tiposDatos);
    }

    /**
     * Buscar configuraciones por tipo de dato (nativo)
     */
    @GetMapping("/tipo-dato/{tipoDato}/nativo")
    public ResponseEntity<List<Configuracion>> buscarPorTipoDatoNativo(@PathVariable String tipoDato) {
        List<Configuracion> configuraciones = configuracionService.buscarPorTipoDatoNativo(tipoDato);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones STRING
     */
    @GetMapping("/string")
    public ResponseEntity<List<Configuracion>> buscarConfiguracionesString() {
        List<Configuracion> configuraciones = configuracionService.buscarConfiguracionesString();
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones INTEGER
     */
    @GetMapping("/integer")
    public ResponseEntity<List<Configuracion>> buscarConfiguracionesInteger() {
        List<Configuracion> configuraciones = configuracionService.buscarConfiguracionesInteger();
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones DECIMAL
     */
    @GetMapping("/decimal")
    public ResponseEntity<List<Configuracion>> buscarConfiguracionesDecimal() {
        List<Configuracion> configuraciones = configuracionService.buscarConfiguracionesDecimal();
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones BOOLEAN
     */
    @GetMapping("/boolean")
    public ResponseEntity<List<Configuracion>> buscarConfiguracionesBoolean() {
        List<Configuracion> configuraciones = configuracionService.buscarConfiguracionesBoolean();
        return ResponseEntity.ok(configuraciones);
    }

    // ===============================
    // CONSULTAS POR CLAVE
    // ===============================

    /**
     * Buscar configuraciones por clave (contiene, ignora mayúsculas)
     */
    @GetMapping("/clave/{clave}")
    public ResponseEntity<List<Configuracion>> buscarPorClave(@PathVariable String clave) {
        List<Configuracion> configuraciones = configuracionService.buscarPorClave(clave);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones que empiecen con prefijo
     */
    @GetMapping("/prefijo/{prefijo}")
    public ResponseEntity<List<Configuracion>> buscarPorPrefijo(@PathVariable String prefijo) {
        List<Configuracion> configuraciones = configuracionService.buscarPorPrefijo(prefijo);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones que terminen con sufijo
     */
    @GetMapping("/sufijo/{sufijo}")
    public ResponseEntity<List<Configuracion>> buscarPorSufijo(@PathVariable String sufijo) {
        List<Configuracion> configuraciones = configuracionService.buscarPorSufijo(sufijo);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuración por clave (nativo)
     */
    @GetMapping("/clave/{clave}/nativo")
    public ResponseEntity<Configuracion> buscarPorClaveNativo(@PathVariable String clave) {
        Optional<Configuracion> configuracion = configuracionService.buscarPorClaveNativo(clave);
        return configuracion.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Verificar si existe una clave
     */
    @GetMapping("/clave/{clave}/existe")
    public ResponseEntity<Boolean> existeClave(@PathVariable String clave) {
        boolean existe = configuracionService.existeClave(clave);
        return ResponseEntity.ok(existe);
    }

    // ===============================
    // CONSULTAS POR VALOR
    // ===============================

    /**
     * Buscar configuraciones por valor exacto
     */
    @GetMapping("/valor/{valor}")
    public ResponseEntity<List<Configuracion>> buscarPorValor(@PathVariable String valor) {
        List<Configuracion> configuraciones = configuracionService.buscarPorValor(valor);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones por valor (contiene, ignora mayúsculas)
     */
    @GetMapping("/valor/{valor}/contiene")
    public ResponseEntity<List<Configuracion>> buscarPorValorContiene(@PathVariable String valor) {
        List<Configuracion> configuraciones = configuracionService.buscarPorValorContiene(valor);
        return ResponseEntity.ok(configuraciones);
    }

    // ===============================
    // CONSULTAS POR DESCRIPCIÓN
    // ===============================

    /**
     * Buscar configuraciones por descripción (contiene, ignora mayúsculas)
     */
    @GetMapping("/descripcion/{descripcion}")
    public ResponseEntity<List<Configuracion>> buscarPorDescripcion(@PathVariable String descripcion) {
        List<Configuracion> configuraciones = configuracionService.buscarPorDescripcion(descripcion);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones sin descripción
     */
    @GetMapping("/sin-descripcion")
    public ResponseEntity<List<Configuracion>> buscarSinDescripcion() {
        List<Configuracion> configuraciones = configuracionService.buscarSinDescripcion();
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones con descripción
     */
    @GetMapping("/con-descripcion")
    public ResponseEntity<List<Configuracion>> buscarConDescripcion() {
        List<Configuracion> configuraciones = configuracionService.buscarConDescripcion();
        return ResponseEntity.ok(configuraciones);
    }

    // ===============================
    // CONSULTAS COMBINADAS
    // ===============================

    /**
     * Buscar configuraciones por clave o descripción
     */
    @GetMapping("/clave-descripcion/{clave}/{descripcion}")
    public ResponseEntity<List<Configuracion>> buscarPorClaveODescripcion(@PathVariable String clave, @PathVariable String descripcion) {
        List<Configuracion> configuraciones = configuracionService.buscarPorClaveODescripcion(clave, descripcion);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones por tipo de dato y valor
     */
    @GetMapping("/tipo-dato/{tipoDato}/valor/{valor}")
    public ResponseEntity<List<Configuracion>> buscarPorTipoDatoYValor(@PathVariable String tipoDato, @PathVariable String valor) {
        List<Configuracion> configuraciones = configuracionService.buscarPorTipoDatoYValor(tipoDato, valor);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Búsqueda general de configuraciones
     */
    @GetMapping("/buscar/{busqueda}")
    public ResponseEntity<List<Configuracion>> buscarConfiguraciones(@PathVariable String busqueda) {
        List<Configuracion> configuraciones = configuracionService.buscarConfiguraciones(busqueda);
        return ResponseEntity.ok(configuraciones);
    }

    // ===============================
    // CONTADORES
    // ===============================

    /**
     * Contar configuraciones por tipo de dato
     */
    @GetMapping("/contar/tipo-dato/{tipoDato}")
    public ResponseEntity<Long> contarPorTipoDato(@PathVariable String tipoDato) {
        long contador = configuracionService.contarPorTipoDato(tipoDato);
        return ResponseEntity.ok(contador);
    }

    /**
     * Contar configuraciones con descripción
     */
    @GetMapping("/contar/con-descripcion")
    public ResponseEntity<Long> contarConDescripcion() {
        long contador = configuracionService.contarConDescripcion();
        return ResponseEntity.ok(contador);
    }

    // ===============================
    // CONSULTAS POR FECHAS
    // ===============================

    /**
     * Buscar configuraciones actualizadas después de fecha
     */
    @GetMapping("/actualizadas-despues/{fechaDesde}")
    public ResponseEntity<List<Configuracion>> buscarActualizadasDespuesDe(@PathVariable LocalDateTime fechaDesde) {
        List<Configuracion> configuraciones = configuracionService.buscarActualizadasDespuesDe(fechaDesde);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones actualizadas en rango de fechas
     */
    @GetMapping("/actualizadas-rango/{fechaDesde}/{fechaHasta}")
    public ResponseEntity<List<Configuracion>> buscarActualizadasEnRango(@PathVariable LocalDateTime fechaDesde, @PathVariable LocalDateTime fechaHasta) {
        List<Configuracion> configuraciones = configuracionService.buscarActualizadasEnRango(fechaDesde, fechaHasta);
        return ResponseEntity.ok(configuraciones);
    }

    /**
     * Buscar configuraciones actualizadas después de fecha ordenadas por fecha desc
     */
    @GetMapping("/actualizadas-despues/{fechaDesde}/ordenadas")
    public ResponseEntity<List<Configuracion>> buscarActualizadasDespuesDeOrdenadaPorFecha(@PathVariable LocalDateTime fechaDesde) {
        List<Configuracion> configuraciones = configuracionService.buscarActualizadasDespuesDeOrdenadaPorFecha(fechaDesde);
        return ResponseEntity.ok(configuraciones);
    }

    // ===============================
    // CONSULTAS ESPECIALES
    // ===============================

    /**
     * Obtener todas las configuraciones ordenadas por clave (nativo)
     */
    @GetMapping("/todas-ordenadas")
    public ResponseEntity<List<Configuracion>> obtenerTodasOrdenadas() {
        List<Configuracion> configuraciones = configuracionService.obtenerTodasOrdenadas();
        return ResponseEntity.ok(configuraciones);
    }

    // ===============================
    // MÉTODOS UTILITARIOS PARA CONFIGURACIONES
    // ===============================

    /**
     * Obtener valor de configuración como String
     */
    @GetMapping("/{clave}/valor-string")
    public ResponseEntity<String> obtenerValorString(@PathVariable String clave) {
        String valor = configuracionService.obtenerValorString(clave);
        if (valor != null) {
            return ResponseEntity.ok(valor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener valor de configuración como String con valor por defecto
     */
    @GetMapping("/{clave}/valor-string/{valorPorDefecto}")
    public ResponseEntity<String> obtenerValorString(@PathVariable String clave, @PathVariable String valorPorDefecto) {
        String valor = configuracionService.obtenerValorString(clave, valorPorDefecto);
        return ResponseEntity.ok(valor);
    }

    /**
     * Obtener valor de configuración como Integer
     */
    @GetMapping("/{clave}/valor-integer")
    public ResponseEntity<Integer> obtenerValorInteger(@PathVariable String clave) {
        Integer valor = configuracionService.obtenerValorInteger(clave);
        if (valor != null) {
            return ResponseEntity.ok(valor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener valor de configuración como Integer con valor por defecto
     */
    @GetMapping("/{clave}/valor-integer/{valorPorDefecto}")
    public ResponseEntity<Integer> obtenerValorInteger(@PathVariable String clave, @PathVariable Integer valorPorDefecto) {
        Integer valor = configuracionService.obtenerValorInteger(clave, valorPorDefecto);
        return ResponseEntity.ok(valor);
    }

    /**
     * Obtener valor de configuración como BigDecimal
     */
    @GetMapping("/{clave}/valor-decimal")
    public ResponseEntity<BigDecimal> obtenerValorDecimal(@PathVariable String clave) {
        BigDecimal valor = configuracionService.obtenerValorDecimal(clave);
        if (valor != null) {
            return ResponseEntity.ok(valor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener valor de configuración como BigDecimal con valor por defecto
     */
    @GetMapping("/{clave}/valor-decimal/{valorPorDefecto}")
    public ResponseEntity<BigDecimal> obtenerValorDecimal(@PathVariable String clave, @PathVariable BigDecimal valorPorDefecto) {
        BigDecimal valor = configuracionService.obtenerValorDecimal(clave, valorPorDefecto);
        return ResponseEntity.ok(valor);
    }

    /**
     * Obtener valor de configuración como Boolean
     */
    @GetMapping("/{clave}/valor-boolean")
    public ResponseEntity<Boolean> obtenerValorBoolean(@PathVariable String clave) {
        Boolean valor = configuracionService.obtenerValorBoolean(clave);
        if (valor != null) {
            return ResponseEntity.ok(valor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener valor de configuración como Boolean con valor por defecto
     */
    @GetMapping("/{clave}/valor-boolean/{valorPorDefecto}")
    public ResponseEntity<Boolean> obtenerValorBoolean(@PathVariable String clave, @PathVariable Boolean valorPorDefecto) {
        Boolean valor = configuracionService.obtenerValorBoolean(clave, valorPorDefecto);
        return ResponseEntity.ok(valor);
    }

    /**
     * Actualizar solo el valor de una configuración
     */
    @PutMapping("/{clave}/valor/{nuevoValor}")
    public ResponseEntity<Configuracion> actualizarValor(@PathVariable String clave, @PathVariable String nuevoValor) {
        Configuracion configuracion = configuracionService.actualizarValor(clave, nuevoValor);
        return ResponseEntity.ok(configuracion);
    }

    /**
     * Crear o actualizar configuración
     */
    @PutMapping("/{clave}/crear-actualizar")
    public ResponseEntity<Configuracion> crearOActualizarConfiguracion(
            @PathVariable String clave, 
            @RequestParam String valor, 
            @RequestParam String descripcion, 
            @RequestParam String tipoDato) {
        Configuracion configuracion = configuracionService.crearOActualizarConfiguracion(clave, valor, descripcion, tipoDato);
        return ResponseEntity.ok(configuracion);
    }

    /**
     * Crear o actualizar configuración con valor String
     */
    @PutMapping("/{clave}/crear-actualizar-string")
    public ResponseEntity<Configuracion> crearOActualizarConfiguracion(
            @PathVariable String clave, 
            @RequestParam String valor, 
            @RequestParam String descripcion) {
        Configuracion configuracion = configuracionService.crearOActualizarConfiguracion(clave, valor, descripcion);
        return ResponseEntity.ok(configuracion);
    }

    /**
     * Crear o actualizar configuración con valor Integer
     */
    @PutMapping("/{clave}/crear-actualizar-integer")
    public ResponseEntity<Configuracion> crearOActualizarConfiguracionInteger(
            @PathVariable String clave, 
            @RequestParam Integer valor, 
            @RequestParam String descripcion) {
        Configuracion configuracion = configuracionService.crearOActualizarConfiguracionInteger(clave, valor, descripcion);
        return ResponseEntity.ok(configuracion);
    }

    /**
     * Crear o actualizar configuración con valor Decimal
     */
    @PutMapping("/{clave}/crear-actualizar-decimal")
    public ResponseEntity<Configuracion> crearOActualizarConfiguracionDecimal(
            @PathVariable String clave, 
            @RequestParam BigDecimal valor, 
            @RequestParam String descripcion) {
        Configuracion configuracion = configuracionService.crearOActualizarConfiguracionDecimal(clave, valor, descripcion);
        return ResponseEntity.ok(configuracion);
    }

    /**
     * Crear o actualizar configuración con valor Boolean
     */
    @PutMapping("/{clave}/crear-actualizar-boolean")
    public ResponseEntity<Configuracion> crearOActualizarConfiguracionBoolean(
            @PathVariable String clave, 
            @RequestParam Boolean valor, 
            @RequestParam String descripcion) {
        Configuracion configuracion = configuracionService.crearOActualizarConfiguracionBoolean(clave, valor, descripcion);
        return ResponseEntity.ok(configuracion);
    }
}
