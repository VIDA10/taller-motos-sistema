package com.tallermoto.controller;

import com.tallermoto.entity.OrdenHistorial;
import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Usuario;
import com.tallermoto.service.OrdenHistorialService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para gestión de historial de órdenes
 */
@RestController
@RequestMapping("/api/orden-historial")
@Tag(name = "Orden Historial", description = "API para gestión del historial de órdenes del taller")
@CrossOrigin(origins = "*")
public class OrdenHistorialController {

    @Autowired
    private OrdenHistorialService ordenHistorialService;

    // ========== OPERACIONES CRUD ==========

    @PostMapping
    public ResponseEntity<OrdenHistorial> guardarHistorial(@RequestBody OrdenHistorial ordenHistorial) {
        OrdenHistorial nuevoHistorial = ordenHistorialService.guardarHistorial(ordenHistorial);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoHistorial);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenHistorial> buscarPorId(@PathVariable Long id) {
        Optional<OrdenHistorial> historial = ordenHistorialService.buscarPorId(id);
        return historial.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<OrdenHistorial>> obtenerTodos() {
        List<OrdenHistorial> historiales = ordenHistorialService.obtenerTodos();
        return ResponseEntity.ok(historiales);
    }

    @PutMapping
    public ResponseEntity<OrdenHistorial> actualizarHistorial(@RequestBody OrdenHistorial ordenHistorial) {
        OrdenHistorial historialActualizado = ordenHistorialService.actualizarHistorial(ordenHistorial);
        return ResponseEntity.ok(historialActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarHistorial(@PathVariable Long id) {
        ordenHistorialService.eliminarHistorial(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/existe/{id}")
    public ResponseEntity<Boolean> existeHistorial(@PathVariable Long id) {
        boolean existe = ordenHistorialService.existeHistorial(id);
        return ResponseEntity.ok(existe);
    }

    // ========== CONSULTAS POR ORDEN DE TRABAJO ==========

    @PostMapping("/buscar-por-orden")
    public ResponseEntity<List<OrdenHistorial>> buscarPorOrdenTrabajo(@RequestBody OrdenTrabajo ordenTrabajo) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorOrdenTrabajo(ordenTrabajo);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-por-orden-fecha-desc")
    public ResponseEntity<List<OrdenHistorial>> buscarPorOrdenOrdenadosPorFechaDesc(@RequestBody OrdenTrabajo ordenTrabajo) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorOrdenOrdenadosPorFechaDesc(ordenTrabajo);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-por-orden-fecha-asc")
    public ResponseEntity<List<OrdenHistorial>> buscarPorOrdenOrdenadosPorFechaAsc(@RequestBody OrdenTrabajo ordenTrabajo) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorOrdenOrdenadosPorFechaAsc(ordenTrabajo);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-por-orden-estado-nuevo/{estadoNuevo}")
    public ResponseEntity<List<OrdenHistorial>> buscarPorOrdenYEstadoNuevo(@RequestBody OrdenTrabajo ordenTrabajo, @PathVariable String estadoNuevo) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorOrdenYEstadoNuevo(ordenTrabajo, estadoNuevo);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-por-orden-usuario")
    public ResponseEntity<List<OrdenHistorial>> buscarPorOrdenYUsuario(@RequestBody OrdenTrabajo ordenTrabajo, @RequestBody Usuario usuarioCambio) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorOrdenYUsuario(ordenTrabajo, usuarioCambio);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-por-orden-entre-fechas")
    public ResponseEntity<List<OrdenHistorial>> buscarPorOrdenEntreFechas(@RequestBody OrdenTrabajo ordenTrabajo, @RequestParam LocalDateTime fechaDesde, @RequestParam LocalDateTime fechaHasta) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorOrdenEntreFechas(ordenTrabajo, fechaDesde, fechaHasta);
        return ResponseEntity.ok(historiales);
    }

    // ========== CONSULTAS POR ESTADO ANTERIOR ==========

    @GetMapping("/buscar-por-estado-anterior/{estadoAnterior}")
    public ResponseEntity<List<OrdenHistorial>> buscarPorEstadoAnterior(@PathVariable String estadoAnterior) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorEstadoAnterior(estadoAnterior);
        return ResponseEntity.ok(historiales);
    }

    @GetMapping("/buscar-por-estado-anterior-ordenados/{estadoAnterior}")
    public ResponseEntity<List<OrdenHistorial>> buscarPorEstadoAnteriorOrdenados(@PathVariable String estadoAnterior) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorEstadoAnteriorOrdenados(estadoAnterior);
        return ResponseEntity.ok(historiales);
    }

    @GetMapping("/buscar-sin-estado-anterior")
    public ResponseEntity<List<OrdenHistorial>> buscarSinEstadoAnterior() {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarSinEstadoAnterior();
        return ResponseEntity.ok(historiales);
    }

    @GetMapping("/buscar-con-estado-anterior")
    public ResponseEntity<List<OrdenHistorial>> buscarConEstadoAnterior() {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarConEstadoAnterior();
        return ResponseEntity.ok(historiales);
    }

    // ========== CONSULTAS POR ESTADO NUEVO ==========

    @GetMapping("/buscar-por-estado-nuevo/{estadoNuevo}")
    public ResponseEntity<List<OrdenHistorial>> buscarPorEstadoNuevo(@PathVariable String estadoNuevo) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorEstadoNuevo(estadoNuevo);
        return ResponseEntity.ok(historiales);
    }

    @GetMapping("/buscar-por-estado-nuevo-ordenados/{estadoNuevo}")
    public ResponseEntity<List<OrdenHistorial>> buscarPorEstadoNuevoOrdenados(@PathVariable String estadoNuevo) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorEstadoNuevoOrdenados(estadoNuevo);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-por-estados-nuevos")
    public ResponseEntity<List<OrdenHistorial>> buscarPorEstadosNuevos(@RequestBody List<String> estadosNuevos) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorEstadosNuevos(estadosNuevos);
        return ResponseEntity.ok(historiales);
    }

    @GetMapping("/buscar-transicion-estados/{estadoAnterior}/{estadoNuevo}")
    public ResponseEntity<List<OrdenHistorial>> buscarPorTransicionEstados(@PathVariable String estadoAnterior, @PathVariable String estadoNuevo) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorTransicionEstados(estadoAnterior, estadoNuevo);
        return ResponseEntity.ok(historiales);
    }

    // ========== CONSULTAS POR COMENTARIO ==========

    @GetMapping("/buscar-comentario-contiene/{comentario}")
    public ResponseEntity<List<OrdenHistorial>> buscarPorComentarioContiene(@PathVariable String comentario) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorComentarioContiene(comentario);
        return ResponseEntity.ok(historiales);
    }

    @GetMapping("/buscar-sin-comentario")
    public ResponseEntity<List<OrdenHistorial>> buscarSinComentario() {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarSinComentario();
        return ResponseEntity.ok(historiales);
    }

    @GetMapping("/buscar-con-comentario")
    public ResponseEntity<List<OrdenHistorial>> buscarConComentario() {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarConComentario();
        return ResponseEntity.ok(historiales);
    }

    // ========== CONSULTAS POR USUARIO DE CAMBIO ==========

    @PostMapping("/buscar-por-usuario")
    public ResponseEntity<List<OrdenHistorial>> buscarPorUsuarioCambio(@RequestBody Usuario usuarioCambio) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorUsuarioCambio(usuarioCambio);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-por-usuario-ordenados-fecha")
    public ResponseEntity<List<OrdenHistorial>> buscarPorUsuarioOrdenadosPorFecha(@RequestBody Usuario usuarioCambio) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorUsuarioOrdenadosPorFecha(usuarioCambio);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-por-usuario-entre-fechas")
    public ResponseEntity<List<OrdenHistorial>> buscarPorUsuarioEntreFechas(@RequestBody Usuario usuarioCambio, @RequestParam LocalDateTime fechaDesde, @RequestParam LocalDateTime fechaHasta) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorUsuarioEntreFechas(usuarioCambio, fechaDesde, fechaHasta);
        return ResponseEntity.ok(historiales);
    }

    // ========== CONSULTAS POR FECHA DE CAMBIO ==========

    @PostMapping("/buscar-fecha-posterior")
    public ResponseEntity<List<OrdenHistorial>> buscarPorFechaPosteriorA(@RequestBody LocalDateTime fechaDesde) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorFechaPosteriorA(fechaDesde);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-fecha-anterior")
    public ResponseEntity<List<OrdenHistorial>> buscarPorFechaAnteriorA(@RequestBody LocalDateTime fechaHasta) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorFechaAnteriorA(fechaHasta);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-rango-fechas")
    public ResponseEntity<List<OrdenHistorial>> buscarPorRangoFechas(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorRangoFechas(fechaDesde, fechaHasta);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-fecha-posterior-ordenados")
    public ResponseEntity<List<OrdenHistorial>> buscarPorFechaPosteriorOrdenados(@RequestBody LocalDateTime fechaDesde) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorFechaPosteriorOrdenados(fechaDesde);
        return ResponseEntity.ok(historiales);
    }

    // ========== MÉTODOS DE CONTEO ==========

    @PostMapping("/contar-por-orden")
    public ResponseEntity<Long> contarPorOrdenTrabajo(@RequestBody OrdenTrabajo ordenTrabajo) {
        long count = ordenHistorialService.contarPorOrdenTrabajo(ordenTrabajo);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/contar-por-usuario")
    public ResponseEntity<Long> contarPorUsuarioCambio(@RequestBody Usuario usuarioCambio) {
        long count = ordenHistorialService.contarPorUsuarioCambio(usuarioCambio);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/contar-por-estado-nuevo/{estadoNuevo}")
    public ResponseEntity<Long> contarPorEstadoNuevo(@PathVariable String estadoNuevo) {
        long count = ordenHistorialService.contarPorEstadoNuevo(estadoNuevo);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/contar-entre-fechas")
    public ResponseEntity<Long> contarEntreFechas(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        long count = ordenHistorialService.contarEntreFechas(fechaDesde, fechaHasta);
        return ResponseEntity.ok(count);
    }

    // ========== CONSULTAS NATIVAS ==========

    @GetMapping("/buscar-por-orden-nativo/{idOrden}")
    public ResponseEntity<List<OrdenHistorial>> buscarPorOrdenNativo(@PathVariable Long idOrden) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorOrdenNativo(idOrden);
        return ResponseEntity.ok(historiales);
    }

    @PostMapping("/buscar-fecha-posterior-nativo")
    public ResponseEntity<List<OrdenHistorial>> buscarPorFechaPosteriorNativo(@RequestBody LocalDateTime fechaDesde) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorFechaPosteriorNativo(fechaDesde);
        return ResponseEntity.ok(historiales);
    }

    @GetMapping("/buscar-por-usuario-nativo/{idUsuario}")
    public ResponseEntity<List<OrdenHistorial>> buscarPorUsuarioNativo(@PathVariable Long idUsuario) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarPorUsuarioNativo(idUsuario);
        return ResponseEntity.ok(historiales);
    }

    // ========== CONSULTAS ESPECÍFICAS DEL DOMINIO ==========

    @GetMapping("/obtener-historial-completo/{idOrden}")
    public ResponseEntity<List<Object[]>> obtenerHistorialCompletoByOrden(@PathVariable Long idOrden) {
        List<Object[]> historialCompleto = ordenHistorialService.obtenerHistorialCompletoByOrden(idOrden);
        return ResponseEntity.ok(historialCompleto);
    }

    @GetMapping("/contar-cambios-orden/{idOrden}")
    public ResponseEntity<Long> contarCambiosPorOrden(@PathVariable Long idOrden) {
        long count = ordenHistorialService.contarCambiosPorOrden(idOrden);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/buscar-cambios-estado-entre-fechas/{estadoNuevo}")
    public ResponseEntity<List<OrdenHistorial>> buscarCambiosAEstadoEntreFechas(@PathVariable String estadoNuevo, @RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarCambiosAEstadoEntreFechas(estadoNuevo, fechaDesde, fechaHasta);
        return ResponseEntity.ok(historiales);
    }

    @GetMapping("/obtener-todos-estados-nuevos")
    public ResponseEntity<List<String>> obtenerTodosLosEstadosNuevos() {
        List<String> estados = ordenHistorialService.obtenerTodosLosEstadosNuevos();
        return ResponseEntity.ok(estados);
    }

    @GetMapping("/obtener-todos-estados-anteriores")
    public ResponseEntity<List<String>> obtenerTodosLosEstadosAnteriores() {
        List<String> estados = ordenHistorialService.obtenerTodosLosEstadosAnteriores();
        return ResponseEntity.ok(estados);
    }

    @GetMapping("/buscar-ultimo-cambio/{idOrden}")
    public ResponseEntity<OrdenHistorial> buscarUltimoCambioPorOrden(@PathVariable Long idOrden) {
        OrdenHistorial ultimoCambio = ordenHistorialService.buscarUltimoCambioPorOrden(idOrden);
        return ultimoCambio != null ? ResponseEntity.ok(ultimoCambio) : ResponseEntity.notFound().build();
    }

    @PostMapping("/obtener-resumen-cambios-estado")
    public ResponseEntity<List<Object[]>> obtenerResumenCambiosEstado(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<Object[]> resumen = ordenHistorialService.obtenerResumenCambiosEstado(fechaDesde, fechaHasta);
        return ResponseEntity.ok(resumen);
    }

    @PostMapping("/obtener-resumen-cambios-usuario")
    public ResponseEntity<List<Object[]>> obtenerResumenCambiosPorUsuario(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<Object[]> resumen = ordenHistorialService.obtenerResumenCambiosPorUsuario(fechaDesde, fechaHasta);
        return ResponseEntity.ok(resumen);
    }

    @PostMapping("/buscar-cambios-con-comentario")
    public ResponseEntity<List<OrdenHistorial>> buscarCambiosConComentarioEntreFechas(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<OrdenHistorial> historiales = ordenHistorialService.buscarCambiosConComentarioEntreFechas(fechaDesde, fechaHasta);
        return ResponseEntity.ok(historiales);
    }

    // ========== MÉTODOS DE VALIDACIÓN Y UTILIDAD ==========

    @PostMapping("/orden-tiene-historial")
    public ResponseEntity<Boolean> ordenTieneHistorial(@RequestBody OrdenTrabajo ordenTrabajo) {
        boolean tieneHistorial = ordenHistorialService.ordenTieneHistorial(ordenTrabajo);
        return ResponseEntity.ok(tieneHistorial);
    }

    @GetMapping("/existe-estado-historial/{estado}")
    public ResponseEntity<Boolean> existeEstadoEnHistorial(@PathVariable String estado) {
        boolean existe = ordenHistorialService.existeEstadoEnHistorial(estado);
        return ResponseEntity.ok(existe);
    }

    @PostMapping("/usuario-ha-realizado-cambios")
    public ResponseEntity<Boolean> usuarioHaRealizadoCambios(@RequestBody Usuario usuarioCambio) {
        boolean haRealizadoCambios = ordenHistorialService.usuarioHaRealizadoCambios(usuarioCambio);
        return ResponseEntity.ok(haRealizadoCambios);
    }

    @GetMapping("/contar-total-cambios")
    public ResponseEntity<Long> contarTotalCambios() {
        long total = ordenHistorialService.contarTotalCambios();
        return ResponseEntity.ok(total);
    }
}
