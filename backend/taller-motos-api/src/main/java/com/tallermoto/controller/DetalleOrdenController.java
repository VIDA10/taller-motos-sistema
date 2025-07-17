package com.tallermoto.controller;

import com.tallermoto.entity.DetalleOrden;
import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Servicio;
import com.tallermoto.service.DetalleOrdenService;

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
 * Controlador REST para la gestión de detalles de orden
 * Mapea exactamente los métodos del DetalleOrdenService sin agregar lógica adicional
 */
@RestController
@RequestMapping("/api/detalles-orden")
@Tag(name = "Detalles de Orden", description = "API para gestión de la relación orden-servicios")
public class DetalleOrdenController {

    @Autowired
    private DetalleOrdenService detalleOrdenService;

    // ===============================
    // OPERACIONES CRUD BÁSICAS
    // ===============================

    /**
     * Crear un nuevo detalle de orden
     */
    @PostMapping
    public ResponseEntity<DetalleOrden> crearDetalleOrden(@Valid @RequestBody DetalleOrden detalleOrden) {
        DetalleOrden nuevoDetalleOrden = detalleOrdenService.crearDetalleOrden(detalleOrden);
        return new ResponseEntity<>(nuevoDetalleOrden, HttpStatus.CREATED);
    }

    /**
     * Obtener detalle de orden por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<DetalleOrden> obtenerDetalleOrdenPorId(@PathVariable Long id) {
        Optional<DetalleOrden> detalleOrden = detalleOrdenService.obtenerDetalleOrdenPorId(id);
        return detalleOrden.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtener todos los detalles de orden
     */
    @GetMapping
    public ResponseEntity<List<DetalleOrden>> obtenerTodosLosDetallesOrden() {
        List<DetalleOrden> detallesOrden = detalleOrdenService.obtenerTodosLosDetallesOrden();
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Obtener detalles de orden con paginación
     */
    @GetMapping("/paginados")
    public ResponseEntity<Page<DetalleOrden>> obtenerDetallesOrdenPaginados(Pageable pageable) {
        Page<DetalleOrden> detallesOrden = detalleOrdenService.obtenerDetallesOrdenPaginados(pageable);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Actualizar detalle de orden
     */
    @PutMapping("/{id}")
    public ResponseEntity<DetalleOrden> actualizarDetalleOrden(@PathVariable Long id, @Valid @RequestBody DetalleOrden detalleOrdenActualizado) {
        DetalleOrden detalleOrden = detalleOrdenService.actualizarDetalleOrden(id, detalleOrdenActualizado);
        return ResponseEntity.ok(detalleOrden);
    }

    /**
     * Eliminar detalle de orden permanentemente
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDetalleOrden(@PathVariable Long id) {
        detalleOrdenService.eliminarDetalleOrden(id);
        return ResponseEntity.noContent().build();
    }

    // ===============================
    // CONSULTAS POR ORDEN DE TRABAJO
    // ===============================

    /**
     * Buscar detalles de orden por ID de orden
     * Endpoint simple que busca los servicios aplicados a una orden específica
     */
    @GetMapping("/buscar-por-orden/{idOrden}")
    public ResponseEntity<List<DetalleOrden>> buscarPorOrden(@PathVariable Long idOrden) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorOrdenNativo(idOrden);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden por orden de trabajo
     */
    @PostMapping("/buscar-por-orden-trabajo")
    public ResponseEntity<List<DetalleOrden>> buscarPorOrdenTrabajo(@RequestBody OrdenTrabajo ordenTrabajo) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorOrdenTrabajo(ordenTrabajo);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden por orden de trabajo ordenados por fecha de creación
     */
    @PostMapping("/buscar-por-orden-trabajo-ordenados")
    public ResponseEntity<List<DetalleOrden>> buscarPorOrdenTrabajoOrdenados(@RequestBody OrdenTrabajo ordenTrabajo) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorOrdenTrabajoOrdenados(ordenTrabajo);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden por ID de orden (nativo)
     */
    @GetMapping("/buscar-por-orden/{idOrden}/nativo")
    public ResponseEntity<List<DetalleOrden>> buscarPorOrdenNativo(@PathVariable Long idOrden) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorOrdenNativo(idOrden);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden con servicios activos por orden
     */
    @GetMapping("/buscar-por-orden/{idOrden}/servicios-activos")
    public ResponseEntity<List<DetalleOrden>> buscarPorOrdenConServiciosActivos(@PathVariable Long idOrden) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorOrdenConServiciosActivos(idOrden);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles con información de servicios por orden
     */
    @GetMapping("/buscar-detalles-servicios/{idOrden}")
    public ResponseEntity<List<Object[]>> buscarDetallesConServiciosPorOrden(@PathVariable Long idOrden) {
        List<Object[]> detalles = detalleOrdenService.buscarDetallesConServiciosPorOrden(idOrden);
        return ResponseEntity.ok(detalles);
    }

    /**
     * Contar detalles de orden por orden de trabajo
     */
    @PostMapping("/contar-por-orden-trabajo")
    public ResponseEntity<Long> contarPorOrdenTrabajo(@RequestBody OrdenTrabajo ordenTrabajo) {
        long contador = detalleOrdenService.contarPorOrdenTrabajo(ordenTrabajo);
        return ResponseEntity.ok(contador);
    }

    /**
     * Contar servicios por orden (nativo)
     */
    @GetMapping("/contar-servicios/{idOrden}")
    public ResponseEntity<Long> contarServiciosPorOrden(@PathVariable Long idOrden) {
        long contador = detalleOrdenService.contarServiciosPorOrden(idOrden);
        return ResponseEntity.ok(contador);
    }

    // ===============================
    // CONSULTAS POR SERVICIO
    // ===============================

    /**
     * Buscar detalles de orden por servicio
     */
    @PostMapping("/buscar-por-servicio")
    public ResponseEntity<List<DetalleOrden>> buscarPorServicio(@RequestBody Servicio servicio) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorServicio(servicio);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden por servicio ordenados por fecha de creación
     */
    @PostMapping("/buscar-por-servicio-ordenados")
    public ResponseEntity<List<DetalleOrden>> buscarPorServicioOrdenados(@RequestBody Servicio servicio) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorServicioOrdenados(servicio);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden por ID de servicio (nativo)
     */
    @GetMapping("/buscar-por-servicio/{idServicio}/nativo")
    public ResponseEntity<List<DetalleOrden>> buscarPorServicioNativo(@PathVariable Long idServicio) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorServicioNativo(idServicio);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Contar detalles de orden por servicio
     */
    @PostMapping("/contar-por-servicio")
    public ResponseEntity<Long> contarPorServicio(@RequestBody Servicio servicio) {
        long contador = detalleOrdenService.contarPorServicio(servicio);
        return ResponseEntity.ok(contador);
    }

    // ===============================
    // CONSULTA ÚNICA POR ORDEN Y SERVICIO
    // ===============================

    /**
     * Buscar detalle de orden por orden de trabajo y servicio (constraint UNIQUE)
     */
    @PostMapping("/buscar-por-orden-servicio")
    public ResponseEntity<DetalleOrden> buscarPorOrdenTrabajoYServicio(@RequestBody OrdenTrabajo ordenTrabajo, @RequestBody Servicio servicio) {
        Optional<DetalleOrden> detalleOrden = detalleOrdenService.buscarPorOrdenTrabajoYServicio(ordenTrabajo, servicio);
        return detalleOrden.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar detalle de orden por ID de orden y ID de servicio (nativo)
     */
    @GetMapping("/buscar-por-orden/{idOrden}/servicio/{idServicio}/nativo")
    public ResponseEntity<DetalleOrden> buscarPorOrdenYServicioNativo(@PathVariable Long idOrden, @PathVariable Long idServicio) {
        Optional<DetalleOrden> detalleOrden = detalleOrdenService.buscarPorOrdenYServicioNativo(idOrden, idServicio);
        return detalleOrden.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Verificar si existe detalle por orden de trabajo y servicio
     */
    @PostMapping("/existe-por-orden-servicio")
    public ResponseEntity<Boolean> existePorOrdenTrabajoYServicio(@RequestBody OrdenTrabajo ordenTrabajo, @RequestBody Servicio servicio) {
        boolean existe = detalleOrdenService.existePorOrdenTrabajoYServicio(ordenTrabajo, servicio);
        return ResponseEntity.ok(existe);
    }

    // ===============================
    // CONSULTAS POR PRECIO APLICADO
    // ===============================

    /**
     * Buscar detalles de orden con precio aplicado mayor a cantidad
     */
    @GetMapping("/precio-aplicado-mayor/{precioAplicado}")
    public ResponseEntity<List<DetalleOrden>> buscarConPrecioAplicadoMayorA(@PathVariable BigDecimal precioAplicado) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarConPrecioAplicadoMayorA(precioAplicado);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden con precio aplicado menor a cantidad
     */
    @GetMapping("/precio-aplicado-menor/{precioAplicado}")
    public ResponseEntity<List<DetalleOrden>> buscarConPrecioAplicadoMenorA(@PathVariable BigDecimal precioAplicado) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarConPrecioAplicadoMenorA(precioAplicado);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden con precio aplicado en rango
     */
    @GetMapping("/precio-aplicado-rango/{precioMin}/{precioMax}")
    public ResponseEntity<List<DetalleOrden>> buscarConPrecioAplicadoEnRango(@PathVariable BigDecimal precioMin, @PathVariable BigDecimal precioMax) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarConPrecioAplicadoEnRango(precioMin, precioMax);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden con precio aplicado mayor o igual ordenados por precio desc
     */
    @GetMapping("/precio-aplicado-mayor-igual/{precioAplicado}/ordenados")
    public ResponseEntity<List<DetalleOrden>> buscarConPrecioAplicadoMayorIgualOrdenados(@PathVariable BigDecimal precioAplicado) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarConPrecioAplicadoMayorIgualOrdenados(precioAplicado);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden por rango de precio (nativo)
     */
    @GetMapping("/precio-rango/{precioMin}/{precioMax}/nativo")
    public ResponseEntity<List<DetalleOrden>> buscarPorRangoPrecio(@PathVariable BigDecimal precioMin, @PathVariable BigDecimal precioMax) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorRangoPrecio(precioMin, precioMax);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Contar detalles de orden con precio aplicado mayor a cantidad
     */
    @GetMapping("/contar-precio-aplicado-mayor/{precioAplicado}")
    public ResponseEntity<Long> contarConPrecioAplicadoMayorA(@PathVariable BigDecimal precioAplicado) {
        long contador = detalleOrdenService.contarConPrecioAplicadoMayorA(precioAplicado);
        return ResponseEntity.ok(contador);
    }

    // ===============================
    // CONSULTAS POR OBSERVACIONES
    // ===============================

    /**
     * Buscar detalles de orden por observaciones (contiene, ignora mayúsculas)
     */
    @GetMapping("/observaciones/{observaciones}")
    public ResponseEntity<List<DetalleOrden>> buscarPorObservaciones(@PathVariable String observaciones) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorObservaciones(observaciones);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden sin observaciones
     */
    @GetMapping("/sin-observaciones")
    public ResponseEntity<List<DetalleOrden>> buscarSinObservaciones() {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarSinObservaciones();
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden con observaciones
     */
    @GetMapping("/con-observaciones")
    public ResponseEntity<List<DetalleOrden>> buscarConObservaciones() {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarConObservaciones();
        return ResponseEntity.ok(detallesOrden);
    }

    // ===============================
    // CONSULTAS COMBINADAS
    // ===============================

    /**
     * Buscar detalles de orden por orden de trabajo con precio mínimo
     */
    @PostMapping("/buscar-por-orden-precio-minimo/{precioMinimo}")
    public ResponseEntity<List<DetalleOrden>> buscarPorOrdenTrabajoConPrecioMinimo(@RequestBody OrdenTrabajo ordenTrabajo, @PathVariable BigDecimal precioMinimo) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorOrdenTrabajoConPrecioMinimo(ordenTrabajo, precioMinimo);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden por servicio con precio en rango
     */
    @PostMapping("/buscar-por-servicio-precio-rango/{precioMin}/{precioMax}")
    public ResponseEntity<List<DetalleOrden>> buscarPorServicioConPrecioEnRango(@RequestBody Servicio servicio, @PathVariable BigDecimal precioMin, @PathVariable BigDecimal precioMax) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarPorServicioConPrecioEnRango(servicio, precioMin, precioMax);
        return ResponseEntity.ok(detallesOrden);
    }

    // ===============================
    // CONSULTAS POR FECHAS DE CREACIÓN
    // ===============================

    /**
     * Buscar detalles de orden creados después de fecha
     */
    @GetMapping("/creados-despues/{fechaDesde}")
    public ResponseEntity<List<DetalleOrden>> buscarCreadosDespuesDe(@PathVariable LocalDateTime fechaDesde) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarCreadosDespuesDe(fechaDesde);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden creados en rango de fechas
     */
    @GetMapping("/creados-rango/{fechaDesde}/{fechaHasta}")
    public ResponseEntity<List<DetalleOrden>> buscarCreadosEnRango(@PathVariable LocalDateTime fechaDesde, @PathVariable LocalDateTime fechaHasta) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarCreadosEnRango(fechaDesde, fechaHasta);
        return ResponseEntity.ok(detallesOrden);
    }

    /**
     * Buscar detalles de orden creados después de fecha ordenados por fecha desc
     */
    @GetMapping("/creados-despues/{fechaDesde}/ordenados")
    public ResponseEntity<List<DetalleOrden>> buscarCreadosDespuesDeOrdenados(@PathVariable LocalDateTime fechaDesde) {
        List<DetalleOrden> detallesOrden = detalleOrdenService.buscarCreadosDespuesDeOrdenados(fechaDesde);
        return ResponseEntity.ok(detallesOrden);
    }

    // ===============================
    // CÁLCULOS Y OPERACIONES ESPECIALIZADAS
    // ===============================

    /**
     * Calcular total de servicios por orden
     */
    @GetMapping("/calcular-total/{idOrden}")
    public ResponseEntity<BigDecimal> calcularTotalServiciosPorOrden(@PathVariable Long idOrden) {
        BigDecimal total = detalleOrdenService.calcularTotalServiciosPorOrden(idOrden);
        return ResponseEntity.ok(total);
    }

    /**
     * Agregar servicio a orden de trabajo
     */
    @PostMapping("/agregar-servicio")
    public ResponseEntity<DetalleOrden> agregarServicioAOrden(
            @RequestBody OrdenTrabajo ordenTrabajo, 
            @RequestBody Servicio servicio, 
            @RequestParam BigDecimal precioAplicado, 
            @RequestParam(required = false) String observaciones) {
        DetalleOrden detalleOrden = detalleOrdenService.agregarServicioAOrden(ordenTrabajo, servicio, precioAplicado, observaciones);
        return new ResponseEntity<>(detalleOrden, HttpStatus.CREATED);
    }

    /**
     * Remover servicio de orden de trabajo
     */
    @DeleteMapping("/remover-servicio")
    public ResponseEntity<Void> removerServicioDeOrden(@RequestBody OrdenTrabajo ordenTrabajo, @RequestBody Servicio servicio) {
        detalleOrdenService.removerServicioDeOrden(ordenTrabajo, servicio);
        return ResponseEntity.noContent().build();
    }

    /**
     * Actualizar precio aplicado de un servicio en orden
     */
    @PutMapping("/actualizar-precio")
    public ResponseEntity<DetalleOrden> actualizarPrecioAplicado(@RequestBody OrdenTrabajo ordenTrabajo, @RequestBody Servicio servicio, @RequestParam BigDecimal nuevoPrecio) {
        DetalleOrden detalleOrden = detalleOrdenService.actualizarPrecioAplicado(ordenTrabajo, servicio, nuevoPrecio);
        return ResponseEntity.ok(detalleOrden);
    }

    /**
     * Actualizar observaciones de un servicio en orden
     */
    @PutMapping("/actualizar-observaciones")
    public ResponseEntity<DetalleOrden> actualizarObservaciones(@RequestBody OrdenTrabajo ordenTrabajo, @RequestBody Servicio servicio, @RequestParam String observaciones) {
        DetalleOrden detalleOrden = detalleOrdenService.actualizarObservaciones(ordenTrabajo, servicio, observaciones);
        return ResponseEntity.ok(detalleOrden);
    }

    /**
     * Obtener todos los servicios de una orden
     */
    @PostMapping("/servicios-de-orden")
    public ResponseEntity<List<Servicio>> obtenerServiciosDeOrden(@RequestBody OrdenTrabajo ordenTrabajo) {
        List<Servicio> servicios = detalleOrdenService.obtenerServiciosDeOrden(ordenTrabajo);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Eliminar todos los detalles de una orden
     */
    @DeleteMapping("/eliminar-todos-detalles")
    public ResponseEntity<Void> eliminarTodosLosDetallesDeOrden(@RequestBody OrdenTrabajo ordenTrabajo) {
        detalleOrdenService.eliminarTodosLosDetallesDeOrden(ordenTrabajo);
        return ResponseEntity.noContent().build();
    }

    /**
     * Clonar detalles de una orden a otra orden
     */
    @PostMapping("/clonar-detalles")
    public ResponseEntity<List<DetalleOrden>> clonarDetallesAOtraOrden(@RequestBody OrdenTrabajo ordenOrigen, @RequestBody OrdenTrabajo ordenDestino) {
        List<DetalleOrden> detallesClonados = detalleOrdenService.clonarDetallesAOtraOrden(ordenOrigen, ordenDestino);
        return ResponseEntity.ok(detallesClonados);
    }
}
