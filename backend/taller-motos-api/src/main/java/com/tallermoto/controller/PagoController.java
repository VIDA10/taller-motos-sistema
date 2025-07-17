package com.tallermoto.controller;

import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Pago;
import com.tallermoto.service.PagoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para gestión de pagos
 */
@RestController
@RequestMapping("/api/pagos")
@Tag(name = "Pagos", description = "API para gestión de pagos del taller")
@CrossOrigin(origins = "*")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    // ========== OPERACIONES CRUD ==========

    @PostMapping
    public ResponseEntity<Pago> guardarPago(@RequestBody Pago pago) {
        Pago nuevoPago = pagoService.guardarPago(pago);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPago);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pago> buscarPorId(@PathVariable Long id) {
        Optional<Pago> pago = pagoService.buscarPorId(id);
        return pago.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Pago>> obtenerTodos() {
        List<Pago> pagos = pagoService.obtenerTodos();
        return ResponseEntity.ok(pagos);
    }

    @PutMapping
    public ResponseEntity<Pago> actualizarPago(@RequestBody Pago pago) {
        Pago pagoActualizado = pagoService.actualizarPago(pago);
        return ResponseEntity.ok(pagoActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPago(@PathVariable Long id) {
        pagoService.eliminarPago(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/existe/{id}")
    public ResponseEntity<Boolean> existePago(@PathVariable Long id) {
        boolean existe = pagoService.existePago(id);
        return ResponseEntity.ok(existe);
    }

    // ========== CONSULTAS POR ORDEN DE TRABAJO ==========

    @PostMapping("/buscar-por-orden")
    public ResponseEntity<List<Pago>> buscarPorOrdenTrabajo(@RequestBody OrdenTrabajo ordenTrabajo) {
        List<Pago> pagos = pagoService.buscarPorOrdenTrabajo(ordenTrabajo);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/buscar-por-orden-ordenados-fecha")
    public ResponseEntity<List<Pago>> buscarPorOrdenTrabajoOrdenadosPorFecha(@RequestBody OrdenTrabajo ordenTrabajo) {
        List<Pago> pagos = pagoService.buscarPorOrdenTrabajoOrdenadosPorFecha(ordenTrabajo);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/buscar-por-orden-metodo/{metodo}")
    public ResponseEntity<List<Pago>> buscarPorOrdenYMetodo(@RequestBody OrdenTrabajo ordenTrabajo, @PathVariable String metodo) {
        List<Pago> pagos = pagoService.buscarPorOrdenYMetodo(ordenTrabajo, metodo);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/buscar-por-orden-entre-fechas")
    public ResponseEntity<List<Pago>> buscarPorOrdenEntreFechas(@RequestBody OrdenTrabajo ordenTrabajo, @RequestParam LocalDateTime fechaDesde, @RequestParam LocalDateTime fechaHasta) {
        List<Pago> pagos = pagoService.buscarPorOrdenEntreFechas(ordenTrabajo, fechaDesde, fechaHasta);
        return ResponseEntity.ok(pagos);
    }

    // ========== CONSULTAS POR MONTO ==========

    @GetMapping("/buscar-monto-mayor/{monto}")
    public ResponseEntity<List<Pago>> buscarPorMontoMayorA(@PathVariable BigDecimal monto) {
        List<Pago> pagos = pagoService.buscarPorMontoMayorA(monto);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-monto-menor/{monto}")
    public ResponseEntity<List<Pago>> buscarPorMontoMenorA(@PathVariable BigDecimal monto) {
        List<Pago> pagos = pagoService.buscarPorMontoMenorA(monto);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-rango-monto/{montoMin}/{montoMax}")
    public ResponseEntity<List<Pago>> buscarPorRangoMonto(@PathVariable BigDecimal montoMin, @PathVariable BigDecimal montoMax) {
        List<Pago> pagos = pagoService.buscarPorRangoMonto(montoMin, montoMax);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-monto-mayor-igual-ordenados/{monto}")
    public ResponseEntity<List<Pago>> buscarPorMontoMayorIgualOrdenados(@PathVariable BigDecimal monto) {
        List<Pago> pagos = pagoService.buscarPorMontoMayorIgualOrdenados(monto);
        return ResponseEntity.ok(pagos);
    }

    // ========== CONSULTAS POR FECHA DE PAGO ==========

    @PostMapping("/buscar-fecha-posterior")
    public ResponseEntity<List<Pago>> buscarPorFechaPosteriorA(@RequestBody LocalDateTime fechaDesde) {
        List<Pago> pagos = pagoService.buscarPorFechaPosteriorA(fechaDesde);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/buscar-fecha-anterior")
    public ResponseEntity<List<Pago>> buscarPorFechaAnteriorA(@RequestBody LocalDateTime fechaHasta) {
        List<Pago> pagos = pagoService.buscarPorFechaAnteriorA(fechaHasta);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/buscar-rango-fechas")
    public ResponseEntity<List<Pago>> buscarPorRangoFechas(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<Pago> pagos = pagoService.buscarPorRangoFechas(fechaDesde, fechaHasta);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/buscar-fecha-posterior-ordenados")
    public ResponseEntity<List<Pago>> buscarPorFechaPosteriorOrdenados(@RequestBody LocalDateTime fechaDesde) {
        List<Pago> pagos = pagoService.buscarPorFechaPosteriorOrdenados(fechaDesde);
        return ResponseEntity.ok(pagos);
    }

    // ========== CONSULTAS POR MÉTODO DE PAGO ==========

    @GetMapping("/buscar-por-metodo/{metodo}")
    public ResponseEntity<List<Pago>> buscarPorMetodo(@PathVariable String metodo) {
        List<Pago> pagos = pagoService.buscarPorMetodo(metodo);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-por-metodo-ordenados-fecha/{metodo}")
    public ResponseEntity<List<Pago>> buscarPorMetodoOrdenadosPorFecha(@PathVariable String metodo) {
        List<Pago> pagos = pagoService.buscarPorMetodoOrdenadosPorFecha(metodo);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/buscar-por-metodos")
    public ResponseEntity<List<Pago>> buscarPorMetodos(@RequestBody List<String> metodos) {
        List<Pago> pagos = pagoService.buscarPorMetodos(metodos);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-metodo-contiene/{metodo}")
    public ResponseEntity<List<Pago>> buscarPorMetodoContiene(@PathVariable String metodo) {
        List<Pago> pagos = pagoService.buscarPorMetodoContiene(metodo);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-metodo-entre-fechas/{metodo}")
    public ResponseEntity<List<Pago>> buscarPorMetodoEntreFechas(@PathVariable String metodo, @RequestParam LocalDateTime fechaDesde, @RequestParam LocalDateTime fechaHasta) {
        List<Pago> pagos = pagoService.buscarPorMetodoEntreFechas(metodo, fechaDesde, fechaHasta);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-monto-mayor-metodo/{monto}/{metodo}")
    public ResponseEntity<List<Pago>> buscarPorMontoMayorYMetodo(@PathVariable BigDecimal monto, @PathVariable String metodo) {
        List<Pago> pagos = pagoService.buscarPorMontoMayorYMetodo(monto, metodo);
        return ResponseEntity.ok(pagos);
    }

    // ========== CONSULTAS POR REFERENCIA ==========

    @GetMapping("/buscar-por-referencia/{referencia}")
    public ResponseEntity<List<Pago>> buscarPorReferencia(@PathVariable String referencia) {
        List<Pago> pagos = pagoService.buscarPorReferencia(referencia);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-referencia-contiene/{referencia}")
    public ResponseEntity<List<Pago>> buscarPorReferenciaContiene(@PathVariable String referencia) {
        List<Pago> pagos = pagoService.buscarPorReferenciaContiene(referencia);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-sin-referencia")
    public ResponseEntity<List<Pago>> buscarSinReferencia() {
        List<Pago> pagos = pagoService.buscarSinReferencia();
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-con-referencia")
    public ResponseEntity<List<Pago>> buscarConReferencia() {
        List<Pago> pagos = pagoService.buscarConReferencia();
        return ResponseEntity.ok(pagos);
    }

    // ========== CONSULTAS POR OBSERVACIONES ==========

    @GetMapping("/buscar-observaciones-contiene/{observaciones}")
    public ResponseEntity<List<Pago>> buscarPorObservacionesContiene(@PathVariable String observaciones) {
        List<Pago> pagos = pagoService.buscarPorObservacionesContiene(observaciones);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-sin-observaciones")
    public ResponseEntity<List<Pago>> buscarSinObservaciones() {
        List<Pago> pagos = pagoService.buscarSinObservaciones();
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-con-observaciones")
    public ResponseEntity<List<Pago>> buscarConObservaciones() {
        List<Pago> pagos = pagoService.buscarConObservaciones();
        return ResponseEntity.ok(pagos);
    }

    // ========== CONSULTAS POR FECHA DE CREACIÓN ==========

    @PostMapping("/buscar-creados-despues")
    public ResponseEntity<List<Pago>> buscarCreadosDespuesDe(@RequestBody LocalDateTime fechaDesde) {
        List<Pago> pagos = pagoService.buscarCreadosDespuesDe(fechaDesde);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/buscar-creados-entre")
    public ResponseEntity<List<Pago>> buscarCreadosEntre(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<Pago> pagos = pagoService.buscarCreadosEntre(fechaDesde, fechaHasta);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/buscar-creados-despues-ordenados")
    public ResponseEntity<List<Pago>> buscarCreadosDespuesOrdenados(@RequestBody LocalDateTime fechaDesde) {
        List<Pago> pagos = pagoService.buscarCreadosDespuesOrdenados(fechaDesde);
        return ResponseEntity.ok(pagos);
    }

    // ========== MÉTODOS DE CONTEO ==========

    @PostMapping("/contar-por-orden")
    public ResponseEntity<Long> contarPorOrdenTrabajo(@RequestBody OrdenTrabajo ordenTrabajo) {
        long count = pagoService.contarPorOrdenTrabajo(ordenTrabajo);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/contar-por-metodo/{metodo}")
    public ResponseEntity<Long> contarPorMetodo(@PathVariable String metodo) {
        long count = pagoService.contarPorMetodo(metodo);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/contar-entre-fechas")
    public ResponseEntity<Long> contarEntreFechas(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        long count = pagoService.contarEntreFechas(fechaDesde, fechaHasta);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/contar-monto-mayor/{monto}")
    public ResponseEntity<Long> contarPorMontoMayorA(@PathVariable BigDecimal monto) {
        long count = pagoService.contarPorMontoMayorA(monto);
        return ResponseEntity.ok(count);
    }

    // ========== CONSULTAS NATIVAS ==========

    @GetMapping("/buscar-por-orden-nativo/{idOrden}")
    public ResponseEntity<List<Pago>> buscarPorOrdenNativo(@PathVariable Long idOrden) {
        List<Pago> pagos = pagoService.buscarPorOrdenNativo(idOrden);
        return ResponseEntity.ok(pagos);
    }

    @PostMapping("/buscar-fecha-posterior-nativo")
    public ResponseEntity<List<Pago>> buscarPorFechaPosteriorNativo(@RequestBody LocalDateTime fechaDesde) {
        List<Pago> pagos = pagoService.buscarPorFechaPosteriorNativo(fechaDesde);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-por-metodo-nativo/{metodo}")
    public ResponseEntity<List<Pago>> buscarPorMetodoNativo(@PathVariable String metodo) {
        List<Pago> pagos = pagoService.buscarPorMetodoNativo(metodo);
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/buscar-rango-monto-nativo/{montoMin}/{montoMax}")
    public ResponseEntity<List<Pago>> buscarPorRangoMontoNativo(@PathVariable BigDecimal montoMin, @PathVariable BigDecimal montoMax) {
        List<Pago> pagos = pagoService.buscarPorRangoMontoNativo(montoMin, montoMax);
        return ResponseEntity.ok(pagos);
    }

    // ========== CONSULTAS ESPECÍFICAS DEL DOMINIO ==========

    @GetMapping("/calcular-total-pagado/{idOrden}")
    public ResponseEntity<BigDecimal> calcularTotalPagadoPorOrden(@PathVariable Long idOrden) {
        BigDecimal total = pagoService.calcularTotalPagadoPorOrden(idOrden);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/contar-pagos-orden/{idOrden}")
    public ResponseEntity<Long> contarPagosPorOrden(@PathVariable Long idOrden) {
        long count = pagoService.contarPagosPorOrden(idOrden);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/obtener-pagos-con-orden-entre-fechas")
    public ResponseEntity<List<Object[]>> obtenerPagosConOrdenEntreFechas(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<Object[]> pagosConOrden = pagoService.obtenerPagosConOrdenEntreFechas(fechaDesde, fechaHasta);
        return ResponseEntity.ok(pagosConOrden);
    }

    @PostMapping("/obtener-resumen-metodo-pago")
    public ResponseEntity<List<Object[]>> obtenerResumenPorMetodoPago(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<Object[]> resumen = pagoService.obtenerResumenPorMetodoPago(fechaDesde, fechaHasta);
        return ResponseEntity.ok(resumen);
    }

    @PostMapping("/obtener-resumen-diario")
    public ResponseEntity<List<Object[]>> obtenerResumenDiarioPagos(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<Object[]> resumen = pagoService.obtenerResumenDiarioPagos(fechaDesde, fechaHasta);
        return ResponseEntity.ok(resumen);
    }

    @GetMapping("/obtener-todos-metodos")
    public ResponseEntity<List<String>> obtenerTodosLosMetodosPago() {
        List<String> metodos = pagoService.obtenerTodosLosMetodosPago();
        return ResponseEntity.ok(metodos);
    }

    @PostMapping("/buscar-mayor-monto-desde/{limite}")
    public ResponseEntity<List<Pago>> buscarPagosMayorMontoDesde(@RequestBody LocalDateTime fechaDesde, @PathVariable Integer limite) {
        List<Pago> pagos = pagoService.buscarPagosMayorMontoDesde(fechaDesde, limite);
        return ResponseEntity.ok(pagos);
    }

    // ========== MÉTODOS DE VALIDACIÓN Y UTILIDAD ==========

    @PostMapping("/orden-tiene-pagos")
    public ResponseEntity<Boolean> ordenTienePagos(@RequestBody OrdenTrabajo ordenTrabajo) {
        boolean tienePagos = pagoService.ordenTienePagos(ordenTrabajo);
        return ResponseEntity.ok(tienePagos);
    }

    @GetMapping("/existe-metodo-pago/{metodo}")
    public ResponseEntity<Boolean> existeMetodoPago(@PathVariable String metodo) {
        boolean existe = pagoService.existeMetodoPago(metodo);
        return ResponseEntity.ok(existe);
    }

    @GetMapping("/contar-total-pagos")
    public ResponseEntity<Long> contarTotalPagos() {
        long total = pagoService.contarTotalPagos();
        return ResponseEntity.ok(total);
    }
}
