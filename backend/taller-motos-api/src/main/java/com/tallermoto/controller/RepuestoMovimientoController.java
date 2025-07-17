package com.tallermoto.controller;

import com.tallermoto.entity.Repuesto;
import com.tallermoto.entity.RepuestoMovimiento;
import com.tallermoto.entity.Usuario;
import com.tallermoto.service.RepuestoMovimientoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para gestión de movimientos de repuestos
 */
@RestController
@RequestMapping("/api/repuesto-movimientos")
@Tag(name = "Repuesto Movimiento", description = "API para gestión de movimientos de repuestos del taller")
@CrossOrigin(origins = "*")
public class RepuestoMovimientoController {

    @Autowired
    private RepuestoMovimientoService repuestoMovimientoService;

    // ========== OPERACIONES CRUD ==========

    @PostMapping
    public ResponseEntity<RepuestoMovimiento> guardarMovimiento(@RequestBody RepuestoMovimiento repuestoMovimiento) {
        RepuestoMovimiento nuevoMovimiento = repuestoMovimientoService.guardarMovimiento(repuestoMovimiento);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoMovimiento);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepuestoMovimiento> buscarPorId(@PathVariable Long id) {
        Optional<RepuestoMovimiento> movimiento = repuestoMovimientoService.buscarPorId(id);
        return movimiento.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<RepuestoMovimiento>> obtenerTodos() {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.obtenerTodos();
        return ResponseEntity.ok(movimientos);
    }

    @PutMapping
    public ResponseEntity<RepuestoMovimiento> actualizarMovimiento(@RequestBody RepuestoMovimiento repuestoMovimiento) {
        RepuestoMovimiento movimientoActualizado = repuestoMovimientoService.actualizarMovimiento(repuestoMovimiento);
        return ResponseEntity.ok(movimientoActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMovimiento(@PathVariable Long id) {
        repuestoMovimientoService.eliminarMovimiento(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/existe/{id}")
    public ResponseEntity<Boolean> existeMovimiento(@PathVariable Long id) {
        boolean existe = repuestoMovimientoService.existeMovimiento(id);
        return ResponseEntity.ok(existe);
    }

    // ========== CONSULTAS POR REPUESTO ==========

    @PostMapping("/buscar-por-repuesto")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorRepuesto(@RequestBody Repuesto repuesto) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorRepuesto(repuesto);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-por-repuesto-fecha-desc")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorRepuestoOrdenadosPorFechaDesc(@RequestBody Repuesto repuesto) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorRepuestoOrdenadosPorFechaDesc(repuesto);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-por-repuesto-fecha-asc")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorRepuestoOrdenadosPorFechaAsc(@RequestBody Repuesto repuesto) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorRepuestoOrdenadosPorFechaAsc(repuesto);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-por-repuesto-tipo/{tipoMovimiento}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorRepuestoYTipo(@RequestBody Repuesto repuesto, @PathVariable String tipoMovimiento) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorRepuestoYTipo(repuesto, tipoMovimiento);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-por-repuesto-usuario")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorRepuestoYUsuario(@RequestBody Repuesto repuesto, @RequestBody Usuario usuarioMovimiento) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorRepuestoYUsuario(repuesto, usuarioMovimiento);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-por-repuesto-entre-fechas")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorRepuestoEntreFechas(@RequestBody Repuesto repuesto, @RequestParam LocalDateTime fechaDesde, @RequestParam LocalDateTime fechaHasta) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorRepuestoEntreFechas(repuesto, fechaDesde, fechaHasta);
        return ResponseEntity.ok(movimientos);
    }

    // ========== CONSULTAS POR TIPO DE MOVIMIENTO ==========

    @GetMapping("/buscar-por-tipo/{tipoMovimiento}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorTipoMovimiento(@PathVariable String tipoMovimiento) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorTipoMovimiento(tipoMovimiento);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-por-tipo-ordenados-fecha/{tipoMovimiento}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorTipoOrdenadosPorFecha(@PathVariable String tipoMovimiento) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorTipoOrdenadosPorFecha(tipoMovimiento);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-por-tipos")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorTiposMovimiento(@RequestBody List<String> tiposMovimiento) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorTiposMovimiento(tiposMovimiento);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-por-tipo-entre-fechas/{tipoMovimiento}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorTipoEntreFechas(@PathVariable String tipoMovimiento, @RequestParam LocalDateTime fechaDesde, @RequestParam LocalDateTime fechaHasta) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorTipoEntreFechas(tipoMovimiento, fechaDesde, fechaHasta);
        return ResponseEntity.ok(movimientos);
    }

    // ========== CONSULTAS POR CANTIDAD ==========

    @GetMapping("/buscar-cantidad-mayor/{cantidad}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorCantidadMayorA(@PathVariable Integer cantidad) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorCantidadMayorA(cantidad);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-cantidad-menor/{cantidad}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorCantidadMenorA(@PathVariable Integer cantidad) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorCantidadMenorA(cantidad);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-rango-cantidad/{cantidadMin}/{cantidadMax}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorRangoCantidad(@PathVariable Integer cantidadMin, @PathVariable Integer cantidadMax) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorRangoCantidad(cantidadMin, cantidadMax);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-cantidad-mayor-igual-ordenados/{cantidad}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorCantidadMayorIgualOrdenados(@PathVariable Integer cantidad) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorCantidadMayorIgualOrdenados(cantidad);
        return ResponseEntity.ok(movimientos);
    }

    // ========== CONSULTAS POR STOCK ANTERIOR ==========

    @GetMapping("/buscar-stock-anterior-mayor/{stockAnterior}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorStockAnteriorMayorA(@PathVariable Integer stockAnterior) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorStockAnteriorMayorA(stockAnterior);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-stock-anterior-menor/{stockAnterior}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorStockAnteriorMenorA(@PathVariable Integer stockAnterior) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorStockAnteriorMenorA(stockAnterior);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-rango-stock-anterior/{stockMin}/{stockMax}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorRangoStockAnterior(@PathVariable Integer stockMin, @PathVariable Integer stockMax) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorRangoStockAnterior(stockMin, stockMax);
        return ResponseEntity.ok(movimientos);
    }

    // ========== CONSULTAS POR STOCK NUEVO ==========

    @GetMapping("/buscar-stock-nuevo-mayor/{stockNuevo}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorStockNuevoMayorA(@PathVariable Integer stockNuevo) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorStockNuevoMayorA(stockNuevo);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-stock-nuevo-menor/{stockNuevo}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorStockNuevoMenorA(@PathVariable Integer stockNuevo) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorStockNuevoMenorA(stockNuevo);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-rango-stock-nuevo/{stockMin}/{stockMax}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorRangoStockNuevo(@PathVariable Integer stockMin, @PathVariable Integer stockMax) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorRangoStockNuevo(stockMin, stockMax);
        return ResponseEntity.ok(movimientos);
    }

    // ========== CONSULTAS POR REFERENCIA ==========

    @GetMapping("/buscar-por-referencia/{referencia}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorReferencia(@PathVariable String referencia) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorReferencia(referencia);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-referencia-contiene/{referencia}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorReferenciaContiene(@PathVariable String referencia) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorReferenciaContiene(referencia);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-sin-referencia")
    public ResponseEntity<List<RepuestoMovimiento>> buscarSinReferencia() {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarSinReferencia();
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-con-referencia")
    public ResponseEntity<List<RepuestoMovimiento>> buscarConReferencia() {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarConReferencia();
        return ResponseEntity.ok(movimientos);
    }

    // ========== CONSULTAS POR USUARIO DE MOVIMIENTO ==========

    @PostMapping("/buscar-por-usuario")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorUsuarioMovimiento(@RequestBody Usuario usuarioMovimiento) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorUsuarioMovimiento(usuarioMovimiento);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-por-usuario-ordenados-fecha")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorUsuarioOrdenadosPorFecha(@RequestBody Usuario usuarioMovimiento) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorUsuarioOrdenadosPorFecha(usuarioMovimiento);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-por-usuario-entre-fechas")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorUsuarioEntreFechas(@RequestBody Usuario usuarioMovimiento, @RequestParam LocalDateTime fechaDesde, @RequestParam LocalDateTime fechaHasta) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorUsuarioEntreFechas(usuarioMovimiento, fechaDesde, fechaHasta);
        return ResponseEntity.ok(movimientos);
    }

    // ========== CONSULTAS POR FECHA DE MOVIMIENTO ==========

    @PostMapping("/buscar-fecha-posterior")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorFechaPosteriorA(@RequestBody LocalDateTime fechaDesde) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorFechaPosteriorA(fechaDesde);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-fecha-anterior")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorFechaAnteriorA(@RequestBody LocalDateTime fechaHasta) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorFechaAnteriorA(fechaHasta);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-rango-fechas")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorRangoFechas(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorRangoFechas(fechaDesde, fechaHasta);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-fecha-posterior-ordenados")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorFechaPosteriorOrdenados(@RequestBody LocalDateTime fechaDesde) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorFechaPosteriorOrdenados(fechaDesde);
        return ResponseEntity.ok(movimientos);
    }

    // ========== MÉTODOS DE CONTEO ==========

    @PostMapping("/contar-por-repuesto")
    public ResponseEntity<Long> contarPorRepuesto(@RequestBody Repuesto repuesto) {
        long count = repuestoMovimientoService.contarPorRepuesto(repuesto);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/contar-por-tipo/{tipoMovimiento}")
    public ResponseEntity<Long> contarPorTipoMovimiento(@PathVariable String tipoMovimiento) {
        long count = repuestoMovimientoService.contarPorTipoMovimiento(tipoMovimiento);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/contar-por-usuario")
    public ResponseEntity<Long> contarPorUsuarioMovimiento(@RequestBody Usuario usuarioMovimiento) {
        long count = repuestoMovimientoService.contarPorUsuarioMovimiento(usuarioMovimiento);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/contar-entre-fechas")
    public ResponseEntity<Long> contarEntreFechas(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        long count = repuestoMovimientoService.contarEntreFechas(fechaDesde, fechaHasta);
        return ResponseEntity.ok(count);
    }

    // ========== CONSULTAS NATIVAS ==========

    @GetMapping("/buscar-por-repuesto-nativo/{idRepuesto}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorRepuestoNativo(@PathVariable Long idRepuesto) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorRepuestoNativo(idRepuesto);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-fecha-posterior-nativo")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorFechaPosteriorNativo(@RequestBody LocalDateTime fechaDesde) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorFechaPosteriorNativo(fechaDesde);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-por-tipo-nativo/{tipoMovimiento}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorTipoNativo(@PathVariable String tipoMovimiento) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorTipoNativo(tipoMovimiento);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/buscar-por-usuario-nativo/{idUsuario}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarPorUsuarioNativo(@PathVariable Long idUsuario) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarPorUsuarioNativo(idUsuario);
        return ResponseEntity.ok(movimientos);
    }

    // ========== CONSULTAS ESPECÍFICAS DEL DOMINIO ==========

    @GetMapping("/obtener-movimientos-completos/{idRepuesto}")
    public ResponseEntity<List<Object[]>> obtenerMovimientosCompletosPorRepuesto(@PathVariable Long idRepuesto) {
        List<Object[]> movimientosCompletos = repuestoMovimientoService.obtenerMovimientosCompletosPorRepuesto(idRepuesto);
        return ResponseEntity.ok(movimientosCompletos);
    }

    @GetMapping("/contar-movimientos-repuesto/{idRepuesto}")
    public ResponseEntity<Long> contarMovimientosPorRepuesto(@PathVariable Long idRepuesto) {
        long count = repuestoMovimientoService.contarMovimientosPorRepuesto(idRepuesto);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/buscar-ultimo-movimiento/{idRepuesto}")
    public ResponseEntity<RepuestoMovimiento> buscarUltimoMovimientoPorRepuesto(@PathVariable Long idRepuesto) {
        RepuestoMovimiento ultimoMovimiento = repuestoMovimientoService.buscarUltimoMovimientoPorRepuesto(idRepuesto);
        return ultimoMovimiento != null ? ResponseEntity.ok(ultimoMovimiento) : ResponseEntity.notFound().build();
    }

    @PostMapping("/obtener-resumen-tipo-movimiento")
    public ResponseEntity<List<Object[]>> obtenerResumenPorTipoMovimiento(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<Object[]> resumen = repuestoMovimientoService.obtenerResumenPorTipoMovimiento(fechaDesde, fechaHasta);
        return ResponseEntity.ok(resumen);
    }

    @PostMapping("/obtener-resumen-usuario")
    public ResponseEntity<List<Object[]>> obtenerResumenPorUsuario(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<Object[]> resumen = repuestoMovimientoService.obtenerResumenPorUsuario(fechaDesde, fechaHasta);
        return ResponseEntity.ok(resumen);
    }

    @GetMapping("/obtener-todos-tipos")
    public ResponseEntity<List<String>> obtenerTodosTiposMovimiento() {
        List<String> tipos = repuestoMovimientoService.obtenerTodosTiposMovimiento();
        return ResponseEntity.ok(tipos);
    }

    @PostMapping("/obtener-resumen-diario")
    public ResponseEntity<List<Object[]>> obtenerResumenDiarioMovimientos(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<Object[]> resumen = repuestoMovimientoService.obtenerResumenDiarioMovimientos(fechaDesde, fechaHasta);
        return ResponseEntity.ok(resumen);
    }

    @PostMapping("/buscar-categoria-entre-fechas/{categoria}")
    public ResponseEntity<List<RepuestoMovimiento>> buscarMovimientosPorCategoriaEntreFechas(@PathVariable String categoria, @RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarMovimientosPorCategoriaEntreFechas(categoria, fechaDesde, fechaHasta);
        return ResponseEntity.ok(movimientos);
    }

    @PostMapping("/buscar-con-referencia-entre-fechas")
    public ResponseEntity<List<RepuestoMovimiento>> buscarMovimientosConReferenciaEntreFechas(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<RepuestoMovimiento> movimientos = repuestoMovimientoService.buscarMovimientosConReferenciaEntreFechas(fechaDesde, fechaHasta);
        return ResponseEntity.ok(movimientos);
    }

    // ========== MÉTODOS DE VALIDACIÓN Y UTILIDAD ==========

    @PostMapping("/repuesto-tiene-movimientos")
    public ResponseEntity<Boolean> repuestoTieneMovimientos(@RequestBody Repuesto repuesto) {
        boolean tieneMovimientos = repuestoMovimientoService.repuestoTieneMovimientos(repuesto);
        return ResponseEntity.ok(tieneMovimientos);
    }

    @GetMapping("/existe-tipo-movimiento/{tipoMovimiento}")
    public ResponseEntity<Boolean> existeTipoMovimiento(@PathVariable String tipoMovimiento) {
        boolean existe = repuestoMovimientoService.existeTipoMovimiento(tipoMovimiento);
        return ResponseEntity.ok(existe);
    }

    @PostMapping("/usuario-ha-realizado-movimientos")
    public ResponseEntity<Boolean> usuarioHaRealizadoMovimientos(@RequestBody Usuario usuarioMovimiento) {
        boolean haRealizadoMovimientos = repuestoMovimientoService.usuarioHaRealizadoMovimientos(usuarioMovimiento);
        return ResponseEntity.ok(haRealizadoMovimientos);
    }

    @GetMapping("/contar-total-movimientos")
    public ResponseEntity<Long> contarTotalMovimientos() {
        long total = repuestoMovimientoService.contarTotalMovimientos();
        return ResponseEntity.ok(total);
    }
}
