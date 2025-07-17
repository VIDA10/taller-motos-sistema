package com.tallermoto.controller;

import com.tallermoto.entity.Repuesto;
import com.tallermoto.service.RepuestoService;

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
 * Controlador REST para la gestión de repuestos
 * Mapea exactamente los métodos del RepuestoService sin agregar lógica adicional
 */
@RestController
@RequestMapping("/api/repuestos")
@Tag(name = "Repuestos", description = "API para gestión del catálogo de repuestos del taller")
public class RepuestoController {

    @Autowired
    private RepuestoService repuestoService;

    // ===============================
    // OPERACIONES CRUD BÁSICAS
    // ===============================

    /**
     * Crear un nuevo repuesto
     */
    @PostMapping
    public ResponseEntity<Repuesto> crearRepuesto(@Valid @RequestBody Repuesto repuesto) {
        Repuesto nuevoRepuesto = repuestoService.crearRepuesto(repuesto);
        return new ResponseEntity<>(nuevoRepuesto, HttpStatus.CREATED);
    }

    /**
     * Obtener repuesto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Repuesto> obtenerRepuestoPorId(@PathVariable Long id) {
        Optional<Repuesto> repuesto = repuestoService.obtenerRepuestoPorId(id);
        return repuesto.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtener todos los repuestos
     */
    @GetMapping
    public ResponseEntity<List<Repuesto>> obtenerTodosLosRepuestos() {
        List<Repuesto> repuestos = repuestoService.obtenerTodosLosRepuestos();
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Obtener repuestos con paginación
     */
    @GetMapping("/paginados")
    public ResponseEntity<Page<Repuesto>> obtenerRepuestosPaginados(Pageable pageable) {
        Page<Repuesto> repuestos = repuestoService.obtenerRepuestosPaginados(pageable);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Actualizar repuesto
     */
    @PutMapping("/{id}")
    public ResponseEntity<Repuesto> actualizarRepuesto(@PathVariable Long id, @Valid @RequestBody Repuesto repuestoActualizado) {
        Repuesto repuesto = repuestoService.actualizarRepuesto(id, repuestoActualizado);
        return ResponseEntity.ok(repuesto);
    }

    /**
     * Eliminar repuesto (soft delete - marcar como inactivo)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRepuesto(@PathVariable Long id) {
        repuestoService.eliminarRepuesto(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Eliminar repuesto permanentemente
     */
    @DeleteMapping("/{id}/permanente")
    public ResponseEntity<Void> eliminarRepuestoPermanente(@PathVariable Long id) {
        repuestoService.eliminarRepuestoPermanente(id);
        return ResponseEntity.noContent().build();
    }

    // ===============================
    // CONSULTAS POR CÓDIGO
    // ===============================

    /**
     * Buscar repuesto por código
     */
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Repuesto> buscarPorCodigo(@PathVariable String codigo) {
        Optional<Repuesto> repuesto = repuestoService.buscarPorCodigo(codigo);
        return repuesto.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar repuesto por código (nativo)
     */
    @GetMapping("/codigo/{codigo}/nativo")
    public ResponseEntity<Repuesto> buscarPorCodigoNativo(@PathVariable String codigo) {
        Optional<Repuesto> repuesto = repuestoService.buscarPorCodigoNativo(codigo);
        return repuesto.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar repuesto por código y estado activo
     */
    @GetMapping("/codigo/{codigo}/activo/{activo}")
    public ResponseEntity<Repuesto> buscarPorCodigoYActivo(@PathVariable String codigo, @PathVariable Boolean activo) {
        Optional<Repuesto> repuesto = repuestoService.buscarPorCodigoYActivo(codigo, activo);
        return repuesto.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Verificar si existe un código
     */
    @GetMapping("/codigo/{codigo}/existe")
    public ResponseEntity<Boolean> existeCodigo(@PathVariable String codigo) {
        boolean existe = repuestoService.existeCodigo(codigo);
        return ResponseEntity.ok(existe);
    }

    // ===============================
    // CONSULTAS POR NOMBRE
    // ===============================

    /**
     * Buscar repuestos por nombre (contiene, ignora mayúsculas)
     */
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<Repuesto>> buscarPorNombre(@PathVariable String nombre) {
        List<Repuesto> repuestos = repuestoService.buscarPorNombre(nombre);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos por nombre y estado activo
     */
    @GetMapping("/nombre/{nombre}/activo/{activo}")
    public ResponseEntity<List<Repuesto>> buscarPorNombreYActivo(@PathVariable String nombre, @PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarPorNombreYActivo(nombre, activo);
        return ResponseEntity.ok(repuestos);
    }

    // ===============================
    // CONSULTAS POR CATEGORÍA
    // ===============================

    /**
     * Buscar repuestos por categoría exacta
     */
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Repuesto>> buscarPorCategoria(@PathVariable String categoria) {
        List<Repuesto> repuestos = repuestoService.buscarPorCategoria(categoria);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos por categoría y estado activo
     */
    @GetMapping("/categoria/{categoria}/activo/{activo}")
    public ResponseEntity<List<Repuesto>> buscarPorCategoriaYActivo(@PathVariable String categoria, @PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarPorCategoriaYActivo(categoria, activo);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos por categoría ordenados por nombre
     */
    @GetMapping("/categoria/{categoria}/ordenado-nombre")
    public ResponseEntity<List<Repuesto>> buscarPorCategoriaOrdenadoPorNombre(@PathVariable String categoria) {
        List<Repuesto> repuestos = repuestoService.buscarPorCategoriaOrdenadoPorNombre(categoria);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos por categoría (contiene, ignora mayúsculas)
     */
    @GetMapping("/categoria/{categoria}/contiene")
    public ResponseEntity<List<Repuesto>> buscarPorCategoriaContiene(@PathVariable String categoria) {
        List<Repuesto> repuestos = repuestoService.buscarPorCategoriaContiene(categoria);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos sin categoría
     */
    @GetMapping("/sin-categoria")
    public ResponseEntity<List<Repuesto>> buscarSinCategoria() {
        List<Repuesto> repuestos = repuestoService.buscarSinCategoria();
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con categoría
     */
    @GetMapping("/con-categoria")
    public ResponseEntity<List<Repuesto>> buscarConCategoria() {
        List<Repuesto> repuestos = repuestoService.buscarConCategoria();
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Obtener todas las categorías activas
     */
    @GetMapping("/categorias-activas")
    public ResponseEntity<List<String>> obtenerCategoriasActivas() {
        List<String> categorias = repuestoService.obtenerCategoriasActivas();
        return ResponseEntity.ok(categorias);
    }

    /**
     * Buscar repuestos por categoría ordenados por stock (nativo)
     */
    @GetMapping("/categoria/{categoria}/por-stock")
    public ResponseEntity<List<Repuesto>> buscarPorCategoriaPorStock(@PathVariable String categoria) {
        List<Repuesto> repuestos = repuestoService.buscarPorCategoriaPorStock(categoria);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos por categoría y estado activo (nativo)
     */
    @GetMapping("/categoria/{categoria}/activo/{activo}/nativo")
    public ResponseEntity<List<Repuesto>> buscarPorCategoriaYActivoNativo(@PathVariable String categoria, @PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarPorCategoriaYActivoNativo(categoria, activo);
        return ResponseEntity.ok(repuestos);
    }

    // ===============================
    // CONSULTAS POR STOCK
    // ===============================

    /**
     * Buscar repuestos con stock actual mayor a cantidad
     */
    @GetMapping("/stock-mayor/{stockActual}")
    public ResponseEntity<List<Repuesto>> buscarConStockMayorA(@PathVariable Integer stockActual) {
        List<Repuesto> repuestos = repuestoService.buscarConStockMayorA(stockActual);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con stock actual menor a cantidad
     */
    @GetMapping("/stock-menor/{stockActual}")
    public ResponseEntity<List<Repuesto>> buscarConStockMenorA(@PathVariable Integer stockActual) {
        List<Repuesto> repuestos = repuestoService.buscarConStockMenorA(stockActual);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con stock actual en rango
     */
    @GetMapping("/stock-rango/{stockMin}/{stockMax}")
    public ResponseEntity<List<Repuesto>> buscarConStockEnRango(@PathVariable Integer stockMin, @PathVariable Integer stockMax) {
        List<Repuesto> repuestos = repuestoService.buscarConStockEnRango(stockMin, stockMax);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con stock actual mayor a cantidad y activos
     */
    @GetMapping("/stock-mayor/{stockActual}/activo/{activo}")
    public ResponseEntity<List<Repuesto>> buscarConStockMayorAYActivo(@PathVariable Integer stockActual, @PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarConStockMayorAYActivo(stockActual, activo);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con stock actual exacto
     */
    @GetMapping("/stock-exacto/{stockActual}")
    public ResponseEntity<List<Repuesto>> buscarConStockExacto(@PathVariable Integer stockActual) {
        List<Repuesto> repuestos = repuestoService.buscarConStockExacto(stockActual);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos sin stock (stock = 0)
     */
    @GetMapping("/sin-stock")
    public ResponseEntity<List<Repuesto>> buscarSinStock() {
        List<Repuesto> repuestos = repuestoService.buscarSinStock();
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con stock limitado
     */
    @GetMapping("/stock-limitado/{cantidad}")
    public ResponseEntity<List<Repuesto>> buscarConStockLimitado(@PathVariable Integer cantidad) {
        List<Repuesto> repuestos = repuestoService.buscarConStockLimitado(cantidad);
        return ResponseEntity.ok(repuestos);
    }

    // ===============================
    // CONSULTAS POR STOCK MÍNIMO
    // ===============================

    /**
     * Buscar repuestos con stock mínimo mayor a cantidad
     */
    @GetMapping("/stock-minimo-mayor/{stockMinimo}")
    public ResponseEntity<List<Repuesto>> buscarConStockMinimoMayorA(@PathVariable Integer stockMinimo) {
        List<Repuesto> repuestos = repuestoService.buscarConStockMinimoMayorA(stockMinimo);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con stock mínimo menor a cantidad
     */
    @GetMapping("/stock-minimo-menor/{stockMinimo}")
    public ResponseEntity<List<Repuesto>> buscarConStockMinimoMenorA(@PathVariable Integer stockMinimo) {
        List<Repuesto> repuestos = repuestoService.buscarConStockMinimoMenorA(stockMinimo);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con stock mínimo en rango
     */
    @GetMapping("/stock-minimo-rango/{stockMin}/{stockMax}")
    public ResponseEntity<List<Repuesto>> buscarConStockMinimoEnRango(@PathVariable Integer stockMin, @PathVariable Integer stockMax) {
        List<Repuesto> repuestos = repuestoService.buscarConStockMinimoEnRango(stockMin, stockMax);
        return ResponseEntity.ok(repuestos);
    }

    // ===============================
    // CONSULTAS DE STOCK BAJO
    // ===============================

    /**
     * Buscar repuestos con stock bajo (stock actual <= stock mínimo)
     */
    @GetMapping("/stock-bajo/activo/{activo}")
    public ResponseEntity<List<Repuesto>> buscarRepuestosConStockBajo(@PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarRepuestosConStockBajo(activo);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos activos con stock bajo
     */
    @GetMapping("/stock-bajo/activos")
    public ResponseEntity<List<Repuesto>> buscarRepuestosActivosConStockBajo() {
        List<Repuesto> repuestos = repuestoService.buscarRepuestosActivosConStockBajo();
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con stock bajo (nativo)
     */
    @GetMapping("/stock-bajo/activo/{activo}/nativo")
    public ResponseEntity<List<Repuesto>> buscarRepuestosConStockBajoNativo(@PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarRepuestosConStockBajoNativo(activo);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Contar repuestos con stock bajo
     */
    @GetMapping("/stock-bajo/contar/activo/{activo}")
    public ResponseEntity<Long> contarRepuestosConStockBajo(@PathVariable Boolean activo) {
        long contador = repuestoService.contarRepuestosConStockBajo(activo);
        return ResponseEntity.ok(contador);
    }

    // ===============================
    // CONSULTAS POR PRECIO
    // ===============================

    /**
     * Buscar repuestos con precio mayor a cantidad
     */
    @GetMapping("/precio-mayor/{precioUnitario}")
    public ResponseEntity<List<Repuesto>> buscarConPrecioMayorA(@PathVariable BigDecimal precioUnitario) {
        List<Repuesto> repuestos = repuestoService.buscarConPrecioMayorA(precioUnitario);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con precio menor a cantidad
     */
    @GetMapping("/precio-menor/{precioUnitario}")
    public ResponseEntity<List<Repuesto>> buscarConPrecioMenorA(@PathVariable BigDecimal precioUnitario) {
        List<Repuesto> repuestos = repuestoService.buscarConPrecioMenorA(precioUnitario);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con precio en rango
     */
    @GetMapping("/precio-rango/{precioMin}/{precioMax}")
    public ResponseEntity<List<Repuesto>> buscarConPrecioEnRango(@PathVariable BigDecimal precioMin, @PathVariable BigDecimal precioMax) {
        List<Repuesto> repuestos = repuestoService.buscarConPrecioEnRango(precioMin, precioMax);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con precio mayor o igual y activos
     */
    @GetMapping("/precio-mayor-igual/{precioUnitario}/activo/{activo}")
    public ResponseEntity<List<Repuesto>> buscarConPrecioMayorIgualYActivo(@PathVariable BigDecimal precioUnitario, @PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarConPrecioMayorIgualYActivo(precioUnitario, activo);
        return ResponseEntity.ok(repuestos);
    }

    // ===============================
    // CONSULTAS POR ESTADO ACTIVO
    // ===============================

    /**
     * Buscar repuestos por estado activo
     */
    @GetMapping("/activo/{activo}")
    public ResponseEntity<List<Repuesto>> buscarPorActivo(@PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarPorActivo(activo);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos por estado activo ordenados por categoría
     */
    @GetMapping("/activo/{activo}/ordenado-categoria")
    public ResponseEntity<List<Repuesto>> buscarPorActivoOrdenadoPorCategoria(@PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarPorActivoOrdenadoPorCategoria(activo);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos por estado activo ordenados por nombre
     */
    @GetMapping("/activo/{activo}/ordenado-nombre")
    public ResponseEntity<List<Repuesto>> buscarPorActivoOrdenadoPorNombre(@PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarPorActivoOrdenadoPorNombre(activo);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos por estado activo ordenados por stock actual
     */
    @GetMapping("/activo/{activo}/ordenado-stock")
    public ResponseEntity<List<Repuesto>> buscarPorActivoOrdenadoPorStock(@PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarPorActivoOrdenadoPorStock(activo);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos activos ordenados por categoría y nombre (nativo)
     */
    @GetMapping("/activo/{activo}/ordenado-categoria-nombre")
    public ResponseEntity<List<Repuesto>> buscarActivosOrdenadosPorCategoriaYNombre(@PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarActivosOrdenadosPorCategoriaYNombre(activo);
        return ResponseEntity.ok(repuestos);
    }

    // ===============================
    // CONSULTAS POR DESCRIPCIÓN
    // ===============================

    /**
     * Buscar repuestos por descripción (contiene, ignora mayúsculas)
     */
    @GetMapping("/descripcion/{descripcion}")
    public ResponseEntity<List<Repuesto>> buscarPorDescripcion(@PathVariable String descripcion) {
        List<Repuesto> repuestos = repuestoService.buscarPorDescripcion(descripcion);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos sin descripción
     */
    @GetMapping("/sin-descripcion")
    public ResponseEntity<List<Repuesto>> buscarSinDescripcion() {
        List<Repuesto> repuestos = repuestoService.buscarSinDescripcion();
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos con descripción
     */
    @GetMapping("/con-descripcion")
    public ResponseEntity<List<Repuesto>> buscarConDescripcion() {
        List<Repuesto> repuestos = repuestoService.buscarConDescripcion();
        return ResponseEntity.ok(repuestos);
    }

    // ===============================
    // CONSULTAS COMBINADAS
    // ===============================

    /**
     * Buscar repuestos por nombre o descripción
     */
    @GetMapping("/nombre-descripcion/{nombre}/{descripcion}")
    public ResponseEntity<List<Repuesto>> buscarPorNombreODescripcion(@PathVariable String nombre, @PathVariable String descripcion) {
        List<Repuesto> repuestos = repuestoService.buscarPorNombreODescripcion(nombre, descripcion);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos por categoría con precio máximo
     */
    @GetMapping("/categoria/{categoria}/precio-maximo/{precioMax}")
    public ResponseEntity<List<Repuesto>> buscarPorCategoriaConPrecioMaximo(@PathVariable String categoria, @PathVariable BigDecimal precioMax) {
        List<Repuesto> repuestos = repuestoService.buscarPorCategoriaConPrecioMaximo(categoria, precioMax);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos por categoría con stock mínimo
     */
    @GetMapping("/categoria/{categoria}/stock-minimo/{stockMinimo}")
    public ResponseEntity<List<Repuesto>> buscarPorCategoriaConStockMinimo(@PathVariable String categoria, @PathVariable Integer stockMinimo) {
        List<Repuesto> repuestos = repuestoService.buscarPorCategoriaConStockMinimo(categoria, stockMinimo);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Búsqueda general de repuestos activos
     */
    @GetMapping("/buscar/{busqueda}/activo/{activo}")
    public ResponseEntity<List<Repuesto>> buscarRepuestosActivos(@PathVariable String busqueda, @PathVariable Boolean activo) {
        List<Repuesto> repuestos = repuestoService.buscarRepuestosActivos(busqueda, activo);
        return ResponseEntity.ok(repuestos);
    }

    // ===============================
    // CONTADORES
    // ===============================

    /**
     * Contar repuestos por estado activo
     */
    @GetMapping("/contar/activo/{activo}")
    public ResponseEntity<Long> contarPorActivo(@PathVariable Boolean activo) {
        long contador = repuestoService.contarPorActivo(activo);
        return ResponseEntity.ok(contador);
    }

    /**
     * Contar repuestos por categoría
     */
    @GetMapping("/contar/categoria/{categoria}")
    public ResponseEntity<Long> contarPorCategoria(@PathVariable String categoria) {
        long contador = repuestoService.contarPorCategoria(categoria);
        return ResponseEntity.ok(contador);
    }

    /**
     * Contar repuestos por categoría y estado activo
     */
    @GetMapping("/contar/categoria/{categoria}/activo/{activo}")
    public ResponseEntity<Long> contarPorCategoriaYActivo(@PathVariable String categoria, @PathVariable Boolean activo) {
        long contador = repuestoService.contarPorCategoriaYActivo(categoria, activo);
        return ResponseEntity.ok(contador);
    }

    // ===============================
    // CONSULTAS POR FECHAS
    // ===============================

    /**
     * Buscar repuestos creados después de fecha
     */
    @GetMapping("/creados-despues/{fechaDesde}")
    public ResponseEntity<List<Repuesto>> buscarCreadosDespuesDe(@PathVariable LocalDateTime fechaDesde) {
        List<Repuesto> repuestos = repuestoService.buscarCreadosDespuesDe(fechaDesde);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos creados en rango de fechas
     */
    @GetMapping("/creados-rango/{fechaDesde}/{fechaHasta}")
    public ResponseEntity<List<Repuesto>> buscarCreadosEnRango(@PathVariable LocalDateTime fechaDesde, @PathVariable LocalDateTime fechaHasta) {
        List<Repuesto> repuestos = repuestoService.buscarCreadosEnRango(fechaDesde, fechaHasta);
        return ResponseEntity.ok(repuestos);
    }

    /**
     * Buscar repuestos actualizados después de fecha
     */
    @GetMapping("/actualizados-despues/{fechaDesde}")
    public ResponseEntity<List<Repuesto>> buscarActualizadosDespuesDe(@PathVariable LocalDateTime fechaDesde) {
        List<Repuesto> repuestos = repuestoService.buscarActualizadosDespuesDe(fechaDesde);
        return ResponseEntity.ok(repuestos);
    }

    // ===============================
    // OPERACIONES DE INVENTARIO
    // ===============================

    /**
     * Actualizar stock de un repuesto
     */
    @PutMapping("/{id}/stock/{nuevoStock}")
    public ResponseEntity<Repuesto> actualizarStock(@PathVariable Long id, @PathVariable Integer nuevoStock) {
        Repuesto repuesto = repuestoService.actualizarStock(id, nuevoStock);
        return ResponseEntity.ok(repuesto);
    }

    /**
     * Incrementar stock de un repuesto
     */
    @PutMapping("/{id}/incrementar-stock/{cantidad}")
    public ResponseEntity<Repuesto> incrementarStock(@PathVariable Long id, @PathVariable Integer cantidad) {
        Repuesto repuesto = repuestoService.incrementarStock(id, cantidad);
        return ResponseEntity.ok(repuesto);
    }

    /**
     * Decrementar stock de un repuesto
     */
    @PutMapping("/{id}/decrementar-stock/{cantidad}")
    public ResponseEntity<Repuesto> decrementarStock(@PathVariable Long id, @PathVariable Integer cantidad) {
        Repuesto repuesto = repuestoService.decrementarStock(id, cantidad);
        return ResponseEntity.ok(repuesto);
    }

    /**
     * Activar repuesto
     */
    @PutMapping("/{id}/activar")
    public ResponseEntity<Repuesto> activarRepuesto(@PathVariable Long id) {
        Repuesto repuesto = repuestoService.activarRepuesto(id);
        return ResponseEntity.ok(repuesto);
    }

    /**
     * Desactivar repuesto
     */
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<Repuesto> desactivarRepuesto(@PathVariable Long id) {
        Repuesto repuesto = repuestoService.desactivarRepuesto(id);
        return ResponseEntity.ok(repuesto);
    }
}
