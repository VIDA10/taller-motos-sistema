package com.tallermoto.controller;

import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Repuesto;
import com.tallermoto.entity.UsoRepuesto;
import com.tallermoto.service.UsoRepuestoService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para gestión de uso de repuestos
 */
@RestController
@RequestMapping("/api/usos-repuesto")
@Tag(name = "Uso de Repuesto", description = "API para gestión del uso de repuestos del taller")
@CrossOrigin(origins = "*")
public class UsoRepuestoController {

    @Autowired
    private UsoRepuestoService usoRepuestoService;

    // ===============================
    // OPERACIONES CRUD BÁSICAS
    // ===============================

    @PostMapping
    public ResponseEntity<UsoRepuesto> crearUsoRepuesto(@RequestBody UsoRepuesto usoRepuesto) {
        System.out.println("🔧 DEBUG: Recibida request POST para crear uso de repuesto");
        System.out.println("🔧 DEBUG: Datos recibidos: " + usoRepuesto);
        UsoRepuesto nuevoUsoRepuesto = usoRepuestoService.crearUsoRepuesto(usoRepuesto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsoRepuesto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsoRepuesto> obtenerUsoRepuestoPorId(@PathVariable Long id) {
        Optional<UsoRepuesto> usoRepuesto = usoRepuestoService.obtenerUsoRepuestoPorId(id);
        return usoRepuesto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<UsoRepuesto>> obtenerTodosLosUsosRepuesto() {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.obtenerTodosLosUsosRepuesto();
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/paginados")
    public ResponseEntity<Page<UsoRepuesto>> obtenerUsosRepuestoPaginados(Pageable pageable) {
        Page<UsoRepuesto> usosRepuesto = usoRepuestoService.obtenerUsosRepuestoPaginados(pageable);
        return ResponseEntity.ok(usosRepuesto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsoRepuesto> actualizarUsoRepuesto(@PathVariable Long id, @RequestBody UsoRepuesto usoRepuesto) {
        try {
            UsoRepuesto usoRepuestoActualizado = usoRepuestoService.actualizarUsoRepuesto(id, usoRepuesto);
            return ResponseEntity.ok(usoRepuestoActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsoRepuesto(@PathVariable Long id) {
        try {
            usoRepuestoService.eliminarUsoRepuesto(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ===============================
    // CONSULTAS POR ORDEN DE TRABAJO
    // ===============================

    @PostMapping("/buscar-por-orden")
    public ResponseEntity<List<UsoRepuesto>> buscarPorOrdenTrabajo(@RequestBody OrdenTrabajo ordenTrabajo) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorOrdenTrabajo(ordenTrabajo);
        return ResponseEntity.ok(usosRepuesto);
    }

    @PostMapping("/buscar-por-orden-ordenados")
    public ResponseEntity<List<UsoRepuesto>> buscarPorOrdenTrabajoOrdenados(@RequestBody OrdenTrabajo ordenTrabajo) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorOrdenTrabajoOrdenados(ordenTrabajo);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-por-orden-nativo/{idOrden}")
    public ResponseEntity<List<UsoRepuesto>> buscarPorOrdenNativo(@PathVariable Long idOrden) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorOrdenNativo(idOrden);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-por-orden-repuestos-activos/{idOrden}")
    public ResponseEntity<List<UsoRepuesto>> buscarPorOrdenConRepuestosActivos(@PathVariable Long idOrden) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorOrdenConRepuestosActivos(idOrden);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-usos-con-repuestos/{idOrden}")
    public ResponseEntity<List<Object[]>> buscarUsosConRepuestosPorOrden(@PathVariable Long idOrden) {
        List<Object[]> usosConRepuestos = usoRepuestoService.buscarUsosConRepuestosPorOrden(idOrden);
        return ResponseEntity.ok(usosConRepuestos);
    }

    @PostMapping("/contar-por-orden")
    public ResponseEntity<Long> contarPorOrdenTrabajo(@RequestBody OrdenTrabajo ordenTrabajo) {
        long count = usoRepuestoService.contarPorOrdenTrabajo(ordenTrabajo);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/contar-repuestos-por-orden/{idOrden}")
    public ResponseEntity<Long> contarRepuestosPorOrden(@PathVariable Long idOrden) {
        long count = usoRepuestoService.contarRepuestosPorOrden(idOrden);
        return ResponseEntity.ok(count);
    }

    // ===============================
    // CONSULTAS POR REPUESTO
    // ===============================

    @PostMapping("/buscar-por-repuesto")
    public ResponseEntity<List<UsoRepuesto>> buscarPorRepuesto(@RequestBody Repuesto repuesto) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorRepuesto(repuesto);
        return ResponseEntity.ok(usosRepuesto);
    }

    @PostMapping("/buscar-por-repuesto-ordenados")
    public ResponseEntity<List<UsoRepuesto>> buscarPorRepuestoOrdenados(@RequestBody Repuesto repuesto) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorRepuestoOrdenados(repuesto);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-por-repuesto-nativo/{idRepuesto}")
    public ResponseEntity<List<UsoRepuesto>> buscarPorRepuestoNativo(@PathVariable Long idRepuesto) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorRepuestoNativo(idRepuesto);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-por-categoria/{categoria}")
    public ResponseEntity<List<UsoRepuesto>> buscarPorRepuestoCategoria(@PathVariable String categoria) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorRepuestoCategoria(categoria);
        return ResponseEntity.ok(usosRepuesto);
    }

    @PostMapping("/contar-por-repuesto")
    public ResponseEntity<Long> contarPorRepuesto(@RequestBody Repuesto repuesto) {
        long count = usoRepuestoService.contarPorRepuesto(repuesto);
        return ResponseEntity.ok(count);
    }

    // ===============================
    // CONSULTAS POR CANTIDAD
    // ===============================

    @GetMapping("/buscar-cantidad-mayor/{cantidad}")
    public ResponseEntity<List<UsoRepuesto>> buscarConCantidadMayorA(@PathVariable Integer cantidad) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConCantidadMayorA(cantidad);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-cantidad-menor/{cantidad}")
    public ResponseEntity<List<UsoRepuesto>> buscarConCantidadMenorA(@PathVariable Integer cantidad) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConCantidadMenorA(cantidad);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-cantidad-rango/{cantidadMin}/{cantidadMax}")
    public ResponseEntity<List<UsoRepuesto>> buscarConCantidadEnRango(@PathVariable Integer cantidadMin, @PathVariable Integer cantidadMax) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConCantidadEnRango(cantidadMin, cantidadMax);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-cantidad-mayor-igual-ordenados/{cantidad}")
    public ResponseEntity<List<UsoRepuesto>> buscarConCantidadMayorIgualOrdenados(@PathVariable Integer cantidad) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConCantidadMayorIgualOrdenados(cantidad);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-rango-cantidad/{cantidadMin}/{cantidadMax}")
    public ResponseEntity<List<UsoRepuesto>> buscarPorRangoCantidad(@PathVariable Integer cantidadMin, @PathVariable Integer cantidadMax) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorRangoCantidad(cantidadMin, cantidadMax);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/contar-cantidad-mayor/{cantidad}")
    public ResponseEntity<Long> contarConCantidadMayorA(@PathVariable Integer cantidad) {
        long count = usoRepuestoService.contarConCantidadMayorA(cantidad);
        return ResponseEntity.ok(count);
    }

    // ===============================
    // CONSULTAS POR PRECIO UNITARIO
    // ===============================

    @GetMapping("/buscar-precio-mayor/{precioUnitario}")
    public ResponseEntity<List<UsoRepuesto>> buscarConPrecioUnitarioMayorA(@PathVariable BigDecimal precioUnitario) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConPrecioUnitarioMayorA(precioUnitario);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-precio-menor/{precioUnitario}")
    public ResponseEntity<List<UsoRepuesto>> buscarConPrecioUnitarioMenorA(@PathVariable BigDecimal precioUnitario) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConPrecioUnitarioMenorA(precioUnitario);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-precio-rango/{precioMin}/{precioMax}")
    public ResponseEntity<List<UsoRepuesto>> buscarConPrecioUnitarioEnRango(@PathVariable BigDecimal precioMin, @PathVariable BigDecimal precioMax) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConPrecioUnitarioEnRango(precioMin, precioMax);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-precio-mayor-igual-ordenados/{precioUnitario}")
    public ResponseEntity<List<UsoRepuesto>> buscarConPrecioUnitarioMayorIgualOrdenados(@PathVariable BigDecimal precioUnitario) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConPrecioUnitarioMayorIgualOrdenados(precioUnitario);
        return ResponseEntity.ok(usosRepuesto);
    }

    // ===============================
    // CONSULTAS POR SUBTOTAL
    // ===============================

    @GetMapping("/buscar-subtotal-mayor/{subtotal}")
    public ResponseEntity<List<UsoRepuesto>> buscarConSubtotalMayorA(@PathVariable BigDecimal subtotal) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConSubtotalMayorA(subtotal);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-subtotal-menor/{subtotal}")
    public ResponseEntity<List<UsoRepuesto>> buscarConSubtotalMenorA(@PathVariable BigDecimal subtotal) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConSubtotalMenorA(subtotal);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-subtotal-rango/{subtotalMin}/{subtotalMax}")
    public ResponseEntity<List<UsoRepuesto>> buscarConSubtotalEnRango(@PathVariable BigDecimal subtotalMin, @PathVariable BigDecimal subtotalMax) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConSubtotalEnRango(subtotalMin, subtotalMax);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-subtotal-mayor-igual-ordenados/{subtotal}")
    public ResponseEntity<List<UsoRepuesto>> buscarConSubtotalMayorIgualOrdenados(@PathVariable BigDecimal subtotal) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarConSubtotalMayorIgualOrdenados(subtotal);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/buscar-subtotal-minimo-nativo/{subtotalMinimo}")
    public ResponseEntity<List<UsoRepuesto>> buscarPorSubtotalMinimoNativo(@PathVariable BigDecimal subtotalMinimo) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorSubtotalMinimoNativo(subtotalMinimo);
        return ResponseEntity.ok(usosRepuesto);
    }

    @PostMapping("/buscar-mayor-subtotal-desde")
    public ResponseEntity<List<UsoRepuesto>> buscarUsosMayorSubtotalDesde(@RequestBody LocalDateTime fechaDesde) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarUsosMayorSubtotalDesde(fechaDesde);
        return ResponseEntity.ok(usosRepuesto);
    }

    @GetMapping("/contar-subtotal-mayor/{subtotal}")
    public ResponseEntity<Long> contarConSubtotalMayorA(@PathVariable BigDecimal subtotal) {
        long count = usoRepuestoService.contarConSubtotalMayorA(subtotal);
        return ResponseEntity.ok(count);
    }

    // ===============================
    // CONSULTAS COMBINADAS
    // ===============================

    @PostMapping("/buscar-orden-cantidad-minima/{cantidad}")
    public ResponseEntity<List<UsoRepuesto>> buscarPorOrdenTrabajoConCantidadMinima(@RequestBody OrdenTrabajo ordenTrabajo, @PathVariable Integer cantidad) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorOrdenTrabajoConCantidadMinima(ordenTrabajo, cantidad);
        return ResponseEntity.ok(usosRepuesto);
    }

    @PostMapping("/buscar-repuesto-cantidad-minima/{cantidad}")
    public ResponseEntity<List<UsoRepuesto>> buscarPorRepuestoConCantidadMinima(@RequestBody Repuesto repuesto, @PathVariable Integer cantidad) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorRepuestoConCantidadMinima(repuesto, cantidad);
        return ResponseEntity.ok(usosRepuesto);
    }

    @PostMapping("/buscar-orden-subtotal-rango/{subtotalMin}/{subtotalMax}")
    public ResponseEntity<List<UsoRepuesto>> buscarPorOrdenTrabajoConSubtotalEnRango(@RequestBody OrdenTrabajo ordenTrabajo, @PathVariable BigDecimal subtotalMin, @PathVariable BigDecimal subtotalMax) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorOrdenTrabajoConSubtotalEnRango(ordenTrabajo, subtotalMin, subtotalMax);
        return ResponseEntity.ok(usosRepuesto);
    }

    @PostMapping("/buscar-repuesto-precio-rango/{precioMin}/{precioMax}")
    public ResponseEntity<List<UsoRepuesto>> buscarPorRepuestoConPrecioUnitarioEnRango(@RequestBody Repuesto repuesto, @PathVariable BigDecimal precioMin, @PathVariable BigDecimal precioMax) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarPorRepuestoConPrecioUnitarioEnRango(repuesto, precioMin, precioMax);
        return ResponseEntity.ok(usosRepuesto);
    }

    // ===============================
    // CONSULTAS POR FECHAS DE CREACIÓN
    // ===============================

    @PostMapping("/buscar-creados-despues")
    public ResponseEntity<List<UsoRepuesto>> buscarCreadosDespuesDe(@RequestBody LocalDateTime fechaDesde) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarCreadosDespuesDe(fechaDesde);
        return ResponseEntity.ok(usosRepuesto);
    }

    @PostMapping("/buscar-creados-rango")
    public ResponseEntity<List<UsoRepuesto>> buscarCreadosEnRango(@RequestBody LocalDateTime fechaDesde, @RequestBody LocalDateTime fechaHasta) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarCreadosEnRango(fechaDesde, fechaHasta);
        return ResponseEntity.ok(usosRepuesto);
    }

    @PostMapping("/buscar-creados-despues-ordenados")
    public ResponseEntity<List<UsoRepuesto>> buscarCreadosDespuesDeOrdenados(@RequestBody LocalDateTime fechaDesde) {
        List<UsoRepuesto> usosRepuesto = usoRepuestoService.buscarCreadosDespuesDeOrdenados(fechaDesde);
        return ResponseEntity.ok(usosRepuesto);
    }

    // ===============================
    // CÁLCULOS Y OPERACIONES ESPECIALIZADAS
    // ===============================

    @GetMapping("/calcular-total-repuestos/{idOrden}")
    public ResponseEntity<BigDecimal> calcularTotalRepuestosPorOrden(@PathVariable Long idOrden) {
        BigDecimal total = usoRepuestoService.calcularTotalRepuestosPorOrden(idOrden);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/calcular-cantidad-total-usada/{idRepuesto}")
    public ResponseEntity<Integer> calcularCantidadTotalUsadaPorRepuesto(@PathVariable Long idRepuesto) {
        Integer total = usoRepuestoService.calcularCantidadTotalUsadaPorRepuesto(idRepuesto);
        return ResponseEntity.ok(total);
    }

    @PostMapping("/agregar-repuesto-orden/{cantidad}/{precioUnitario}")
    public ResponseEntity<UsoRepuesto> agregarRepuestoAOrden(@RequestBody OrdenTrabajo ordenTrabajo, @RequestBody Repuesto repuesto, @PathVariable Integer cantidad, @PathVariable BigDecimal precioUnitario) {
        UsoRepuesto usoRepuesto = usoRepuestoService.agregarRepuestoAOrden(ordenTrabajo, repuesto, cantidad, precioUnitario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usoRepuesto);
    }

    @PutMapping("/actualizar-cantidad/{idUso}/{nuevaCantidad}")
    public ResponseEntity<UsoRepuesto> actualizarCantidad(@PathVariable Long idUso, @PathVariable Integer nuevaCantidad) {
        try {
            UsoRepuesto usoRepuesto = usoRepuestoService.actualizarCantidad(idUso, nuevaCantidad);
            return ResponseEntity.ok(usoRepuesto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/actualizar-precio/{idUso}/{nuevoPrecio}")
    public ResponseEntity<UsoRepuesto> actualizarPrecioUnitario(@PathVariable Long idUso, @PathVariable BigDecimal nuevoPrecio) {
        try {
            UsoRepuesto usoRepuesto = usoRepuestoService.actualizarPrecioUnitario(idUso, nuevoPrecio);
            return ResponseEntity.ok(usoRepuesto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/obtener-repuestos-orden")
    public ResponseEntity<List<Repuesto>> obtenerRepuestosDeOrden(@RequestBody OrdenTrabajo ordenTrabajo) {
        List<Repuesto> repuestos = usoRepuestoService.obtenerRepuestosDeOrden(ordenTrabajo);
        return ResponseEntity.ok(repuestos);
    }

    @DeleteMapping("/eliminar-todos-usos-orden")
    public ResponseEntity<Void> eliminarTodosLosUsosDeOrden(@RequestBody OrdenTrabajo ordenTrabajo) {
        usoRepuestoService.eliminarTodosLosUsosDeOrden(ordenTrabajo);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/clonar-usos")
    public ResponseEntity<List<UsoRepuesto>> clonarUsosAOtraOrden(@RequestBody OrdenTrabajo ordenOrigen, @RequestBody OrdenTrabajo ordenDestino) {
        List<UsoRepuesto> usosClonados = usoRepuestoService.clonarUsosAOtraOrden(ordenOrigen, ordenDestino);
        return ResponseEntity.status(HttpStatus.CREATED).body(usosClonados);
    }

    @PostMapping("/buscar-uso-especifico")
    public ResponseEntity<UsoRepuesto> buscarUsoEspecifico(@RequestBody OrdenTrabajo ordenTrabajo, @RequestBody Repuesto repuesto) {
        Optional<UsoRepuesto> usoRepuesto = usoRepuestoService.buscarUsoEspecifico(ordenTrabajo, repuesto);
        return usoRepuesto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/incrementar-cantidad/{cantidadAdicional}")
    public ResponseEntity<UsoRepuesto> incrementarCantidadRepuestoEnOrden(@RequestBody OrdenTrabajo ordenTrabajo, @RequestBody Repuesto repuesto, @PathVariable Integer cantidadAdicional) {
        UsoRepuesto usoRepuesto = usoRepuestoService.incrementarCantidadRepuestoEnOrden(ordenTrabajo, repuesto, cantidadAdicional);
        return ResponseEntity.ok(usoRepuesto);
    }

    @GetMapping("/calcular-subtotal/{idUso}")
    public ResponseEntity<BigDecimal> calcularSubtotalUso(@PathVariable Long idUso) {
        try {
            BigDecimal subtotal = usoRepuestoService.calcularSubtotalUso(idUso);
            return ResponseEntity.ok(subtotal);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Verificar si hay stock suficiente para un repuesto
     */
    @GetMapping("/verificar-stock/{idRepuesto}/{cantidad}")
    public ResponseEntity<Boolean> verificarStock(@PathVariable Long idRepuesto, @PathVariable Integer cantidad) {
        try {
            boolean stockSuficiente = usoRepuestoService.verificarStock(idRepuesto, cantidad);
            return ResponseEntity.ok(stockSuficiente);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
}
