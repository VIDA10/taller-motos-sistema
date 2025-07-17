package com.tallermoto.controller;

import com.tallermoto.dto.CreateOrdenTrabajoDTO;
import com.tallermoto.entity.Moto;
import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Usuario;
import com.tallermoto.service.OrdenTrabajoService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para la gestión de órdenes de trabajo
 * Mapea exactamente los métodos del OrdenTrabajoService sin agregar lógica adicional
 */
@RestController
@RequestMapping("/api/ordenes-trabajo")
@Tag(name = "Órdenes de Trabajo", description = "API para gestión de las órdenes de trabajo del taller")
public class OrdenTrabajoController {

    @Autowired
    private OrdenTrabajoService ordenTrabajoService;

    // ===============================
    // OPERACIONES CRUD BÁSICAS
    // ===============================

    /**
     * Crear una nueva orden de trabajo usando DTO
     */
    @PostMapping
    public ResponseEntity<OrdenTrabajo> crearOrdenTrabajo(@Valid @RequestBody CreateOrdenTrabajoDTO createDTO) {
        OrdenTrabajo nuevaOrdenTrabajo = ordenTrabajoService.crearOrdenTrabajoDesdeDTO(createDTO);
        return new ResponseEntity<>(nuevaOrdenTrabajo, HttpStatus.CREATED);
    }

    /**
     * Obtener orden de trabajo por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrdenTrabajo> obtenerOrdenTrabajoPorId(@PathVariable Long id) {
        Optional<OrdenTrabajo> ordenTrabajo = ordenTrabajoService.obtenerOrdenTrabajoPorId(id);
        return ordenTrabajo.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtener todas las órdenes de trabajo
     */
    @GetMapping
    public ResponseEntity<List<OrdenTrabajo>> obtenerTodasLasOrdenesTrabajo() {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.obtenerTodasLasOrdenesTrabajo();
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Obtener órdenes de trabajo con paginación
     */
    @GetMapping("/paginadas")
    public ResponseEntity<Page<OrdenTrabajo>> obtenerOrdenesTrabajosPaginadas(Pageable pageable) {
        Page<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.obtenerOrdenesTrabajosPaginadas(pageable);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Actualizar orden de trabajo
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrdenTrabajo> actualizarOrdenTrabajo(@PathVariable Long id, @Valid @RequestBody OrdenTrabajo ordenTrabajoActualizada) {
        OrdenTrabajo ordenTrabajo = ordenTrabajoService.actualizarOrdenTrabajo(id, ordenTrabajoActualizada);
        return ResponseEntity.ok(ordenTrabajo);
    }

    /**
     * Eliminar orden de trabajo permanentemente
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarOrdenTrabajo(@PathVariable Long id) {
        ordenTrabajoService.eliminarOrdenTrabajo(id);
        return ResponseEntity.noContent().build();
    }

    // ===============================
    // CONSULTAS POR NÚMERO DE ORDEN
    // ===============================

    /**
     * Buscar orden de trabajo por número de orden
     */
    @GetMapping("/numero-orden/{numeroOrden}")
    public ResponseEntity<OrdenTrabajo> buscarPorNumeroOrden(@PathVariable String numeroOrden) {
        Optional<OrdenTrabajo> ordenTrabajo = ordenTrabajoService.buscarPorNumeroOrden(numeroOrden);
        return ordenTrabajo.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar orden de trabajo por número de orden (nativo)
     */
    @GetMapping("/numero-orden/{numeroOrden}/nativo")
    public ResponseEntity<OrdenTrabajo> buscarPorNumeroOrdenNativo(@PathVariable String numeroOrden) {
        Optional<OrdenTrabajo> ordenTrabajo = ordenTrabajoService.buscarPorNumeroOrdenNativo(numeroOrden);
        return ordenTrabajo.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Verificar si existe un número de orden
     */
    @GetMapping("/numero-orden/{numeroOrden}/existe")
    public ResponseEntity<Boolean> existeNumeroOrden(@PathVariable String numeroOrden) {
        boolean existe = ordenTrabajoService.existeNumeroOrden(numeroOrden);
        return ResponseEntity.ok(existe);
    }

    // ===============================
    // CONSULTAS POR MOTO
    // ===============================

    /**
     * Buscar órdenes de trabajo por moto
     */
    @PostMapping("/buscar-por-moto")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorMoto(@RequestBody Moto moto) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorMoto(moto);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por moto ordenadas por fecha de ingreso desc
     */
    @PostMapping("/buscar-por-moto-ordenadas")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorMotoOrdenadas(@RequestBody Moto moto) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorMotoOrdenadas(moto);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Contar órdenes de trabajo por moto
     */
    @PostMapping("/contar-por-moto")
    public ResponseEntity<Long> contarPorMoto(@RequestBody Moto moto) {
        long contador = ordenTrabajoService.contarPorMoto(moto);
        return ResponseEntity.ok(contador);
    }

    // ===============================
    // CONSULTAS POR USUARIO CREADOR
    // ===============================

    /**
     * Buscar órdenes de trabajo por usuario creador
     */
    @PostMapping("/buscar-por-usuario-creador")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorUsuarioCreador(@RequestBody Usuario usuarioCreador) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorUsuarioCreador(usuarioCreador);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por usuario creador ordenadas por fecha de ingreso desc
     */
    @PostMapping("/buscar-por-usuario-creador-ordenadas")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorUsuarioCreadorOrdenadas(@RequestBody Usuario usuarioCreador) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorUsuarioCreadorOrdenadas(usuarioCreador);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por usuario creador y estado
     */
    @PostMapping("/buscar-por-usuario-creador-estado/{estado}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorUsuarioCreadorYEstado(@RequestBody Usuario usuarioCreador, @PathVariable String estado) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorUsuarioCreadorYEstado(usuarioCreador, estado);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    // ===============================
    // CONSULTAS POR MECÁNICO ASIGNADO
    // ===============================

    /**
     * Buscar órdenes de trabajo por mecánico asignado
     */
    @PostMapping("/buscar-por-mecanico-asignado")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorMecanicoAsignado(@RequestBody Usuario mecanicoAsignado) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorMecanicoAsignado(mecanicoAsignado);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por mecánico asignado ordenadas por fecha de ingreso desc
     */
    @PostMapping("/buscar-por-mecanico-asignado-ordenadas")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorMecanicoAsignadoOrdenadas(@RequestBody Usuario mecanicoAsignado) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorMecanicoAsignadoOrdenadas(mecanicoAsignado);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por mecánico asignado (nativo)
     */
    @GetMapping("/buscar-por-mecanico-asignado/{idMecanico}/nativo")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorMecanicoAsignadoNativo(@PathVariable Long idMecanico) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorMecanicoAsignadoNativo(idMecanico);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo sin mecánico asignado
     */
    @GetMapping("/sin-mecanico-asignado")
    public ResponseEntity<List<OrdenTrabajo>> buscarSinMecanicoAsignado() {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarSinMecanicoAsignado();
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo con mecánico asignado
     */
    @GetMapping("/con-mecanico-asignado")
    public ResponseEntity<List<OrdenTrabajo>> buscarConMecanicoAsignado() {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarConMecanicoAsignado();
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por estado y mecánico asignado
     */
    @PostMapping("/buscar-por-estado-mecanico/{estado}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorEstadoYMecanicoAsignado(@PathVariable String estado, @RequestBody Usuario mecanicoAsignado) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorEstadoYMecanicoAsignado(estado, mecanicoAsignado);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Contar órdenes de trabajo por mecánico asignado
     */
    @PostMapping("/contar-por-mecanico-asignado")
    public ResponseEntity<Long> contarPorMecanicoAsignado(@RequestBody Usuario mecanicoAsignado) {
        long contador = ordenTrabajoService.contarPorMecanicoAsignado(mecanicoAsignado);
        return ResponseEntity.ok(contador);
    }

    // ===============================
    // CONSULTAS POR FECHA DE INGRESO
    // ===============================

    /**
     * Buscar órdenes de trabajo después de fecha
     */
    @GetMapping("/despues-fecha/{fechaDesde}")
    public ResponseEntity<List<OrdenTrabajo>> buscarDespuesDeFecha(@PathVariable LocalDateTime fechaDesde) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarDespuesDeFecha(fechaDesde);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo antes de fecha
     */
    @GetMapping("/antes-fecha/{fechaHasta}")
    public ResponseEntity<List<OrdenTrabajo>> buscarAntesDeFecha(@PathVariable LocalDateTime fechaHasta) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarAntesDeFecha(fechaHasta);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo en rango de fechas
     */
    @GetMapping("/rango-fechas/{fechaDesde}/{fechaHasta}")
    public ResponseEntity<List<OrdenTrabajo>> buscarEnRangoDeFechas(@PathVariable LocalDateTime fechaDesde, @PathVariable LocalDateTime fechaHasta) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarEnRangoDeFechas(fechaDesde, fechaHasta);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo después de fecha ordenadas por fecha desc
     */
    @GetMapping("/despues-fecha/{fechaDesde}/ordenadas")
    public ResponseEntity<List<OrdenTrabajo>> buscarDespuesDeFechaOrdenadas(@PathVariable LocalDateTime fechaDesde) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarDespuesDeFechaOrdenadas(fechaDesde);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo después de fecha (nativo)
     */
    @GetMapping("/despues-fecha/{fechaDesde}/nativo")
    public ResponseEntity<List<OrdenTrabajo>> buscarDespuesDeFechaNativo(@PathVariable LocalDateTime fechaDesde) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarDespuesDeFechaNativo(fechaDesde);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    // ===============================
    // CONSULTAS POR FECHA ESTIMADA ENTREGA
    // ===============================

    /**
     * Buscar órdenes de trabajo por fecha estimada de entrega
     */
    @GetMapping("/fecha-estimada/{fechaEstimadaEntrega}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorFechaEstimadaEntrega(@PathVariable LocalDate fechaEstimadaEntrega) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorFechaEstimadaEntrega(fechaEstimadaEntrega);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo con fecha estimada antes de fecha límite
     */
    @GetMapping("/fecha-estimada-antes/{fechaLimite}")
    public ResponseEntity<List<OrdenTrabajo>> buscarConFechaEstimadaAntesDe(@PathVariable LocalDate fechaLimite) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarConFechaEstimadaAntesDe(fechaLimite);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo con fecha estimada después de fecha
     */
    @GetMapping("/fecha-estimada-despues/{fechaDesde}")
    public ResponseEntity<List<OrdenTrabajo>> buscarConFechaEstimadaDespuesDe(@PathVariable LocalDate fechaDesde) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarConFechaEstimadaDespuesDe(fechaDesde);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo con fecha estimada en rango
     */
    @GetMapping("/fecha-estimada-rango/{fechaDesde}/{fechaHasta}")
    public ResponseEntity<List<OrdenTrabajo>> buscarConFechaEstimadaEnRango(@PathVariable LocalDate fechaDesde, @PathVariable LocalDate fechaHasta) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarConFechaEstimadaEnRango(fechaDesde, fechaHasta);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo sin fecha estimada de entrega
     */
    @GetMapping("/sin-fecha-estimada")
    public ResponseEntity<List<OrdenTrabajo>> buscarSinFechaEstimadaEntrega() {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarSinFechaEstimadaEntrega();
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo con fecha estimada de entrega
     */
    @GetMapping("/con-fecha-estimada")
    public ResponseEntity<List<OrdenTrabajo>> buscarConFechaEstimadaEntrega() {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarConFechaEstimadaEntrega();
        return ResponseEntity.ok(ordenesTrabajo);
    }

    // ===============================
    // CONSULTAS POR ESTADO
    // ===============================

    /**
     * Buscar órdenes de trabajo por estado
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorEstado(@PathVariable String estado) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorEstado(estado);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por estado ordenadas por fecha de ingreso desc
     */
    @GetMapping("/estado/{estado}/ordenadas")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorEstadoOrdenadas(@PathVariable String estado) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorEstadoOrdenadas(estado);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por estado (nativo)
     */
    @GetMapping("/estado/{estado}/nativo")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorEstadoNativo(@PathVariable String estado) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorEstadoNativo(estado);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por múltiples estados
     */
    @PostMapping("/buscar-por-estados")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorEstados(@RequestBody List<String> estados) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorEstados(estados);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por estado y prioridad
     */
    @GetMapping("/estado/{estado}/prioridad/{prioridad}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorEstadoYPrioridad(@PathVariable String estado, @PathVariable String prioridad) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorEstadoYPrioridad(estado, prioridad);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por estado y estado de pago
     */
    @GetMapping("/estado/{estado}/estado-pago/{estadoPago}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorEstadoYEstadoPago(@PathVariable String estado, @PathVariable String estadoPago) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorEstadoYEstadoPago(estado, estadoPago);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por moto y estado
     */
    @PostMapping("/buscar-por-moto-estado/{estado}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorMotoYEstado(@RequestBody Moto moto, @PathVariable String estado) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorMotoYEstado(moto, estado);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Obtener todos los estados disponibles
     */
    @GetMapping("/estados")
    public ResponseEntity<List<String>> obtenerTodosLosEstados() {
        List<String> estados = ordenTrabajoService.obtenerTodosLosEstados();
        return ResponseEntity.ok(estados);
    }

    /**
     * Contar órdenes de trabajo por estado
     */
    @GetMapping("/contar/estado/{estado}")
    public ResponseEntity<Long> contarPorEstado(@PathVariable String estado) {
        long contador = ordenTrabajoService.contarPorEstado(estado);
        return ResponseEntity.ok(contador);
    }

    // ===============================
    // CONSULTAS POR PRIORIDAD
    // ===============================

    /**
     * Buscar órdenes de trabajo por prioridad
     */
    @GetMapping("/prioridad/{prioridad}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorPrioridad(@PathVariable String prioridad) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorPrioridad(prioridad);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por prioridad ordenadas por fecha de ingreso desc
     */
    @GetMapping("/prioridad/{prioridad}/ordenadas")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorPrioridadOrdenadas(@PathVariable String prioridad) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorPrioridadOrdenadas(prioridad);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por prioridad (nativo)
     */
    @GetMapping("/prioridad/{prioridad}/nativo")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorPrioridadNativo(@PathVariable String prioridad) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorPrioridadNativo(prioridad);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por múltiples prioridades
     */
    @PostMapping("/buscar-por-prioridades")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorPrioridades(@RequestBody List<String> prioridades) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorPrioridades(prioridades);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Obtener todas las prioridades disponibles
     */
    @GetMapping("/prioridades")
    public ResponseEntity<List<String>> obtenerTodasLasPrioridades() {
        List<String> prioridades = ordenTrabajoService.obtenerTodasLasPrioridades();
        return ResponseEntity.ok(prioridades);
    }

    /**
     * Contar órdenes de trabajo por prioridad
     */
    @GetMapping("/contar/prioridad/{prioridad}")
    public ResponseEntity<Long> contarPorPrioridad(@PathVariable String prioridad) {
        long contador = ordenTrabajoService.contarPorPrioridad(prioridad);
        return ResponseEntity.ok(contador);
    }

    // ===============================
    // CONSULTAS POR DESCRIPCIÓN PROBLEMA
    // ===============================

    /**
     * Buscar órdenes de trabajo por descripción del problema
     */
    @GetMapping("/descripcion-problema/{descripcionProblema}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorDescripcionProblema(@PathVariable String descripcionProblema) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorDescripcionProblema(descripcionProblema);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    // ===============================
    // CONSULTAS POR DIAGNÓSTICO
    // ===============================

    /**
     * Buscar órdenes de trabajo por diagnóstico
     */
    @GetMapping("/diagnostico/{diagnostico}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorDiagnostico(@PathVariable String diagnostico) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorDiagnostico(diagnostico);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo sin diagnóstico
     */
    @GetMapping("/sin-diagnostico")
    public ResponseEntity<List<OrdenTrabajo>> buscarSinDiagnostico() {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarSinDiagnostico();
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo con diagnóstico
     */
    @GetMapping("/con-diagnostico")
    public ResponseEntity<List<OrdenTrabajo>> buscarConDiagnostico() {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarConDiagnostico();
        return ResponseEntity.ok(ordenesTrabajo);
    }

    // ===============================
    // CONSULTAS POR OBSERVACIONES
    // ===============================

    /**
     * Buscar órdenes de trabajo por observaciones
     */
    @GetMapping("/observaciones/{observaciones}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorObservaciones(@PathVariable String observaciones) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorObservaciones(observaciones);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo sin observaciones
     */
    @GetMapping("/sin-observaciones")
    public ResponseEntity<List<OrdenTrabajo>> buscarSinObservaciones() {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarSinObservaciones();
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo con observaciones
     */
    @GetMapping("/con-observaciones")
    public ResponseEntity<List<OrdenTrabajo>> buscarConObservaciones() {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarConObservaciones();
        return ResponseEntity.ok(ordenesTrabajo);
    }

    // ===============================
    // CONSULTAS POR TOTALES
    // ===============================

    /**
     * Buscar órdenes de trabajo con total de servicios mayor a cantidad
     */
    @GetMapping("/total-servicios-mayor/{totalServicios}")
    public ResponseEntity<List<OrdenTrabajo>> buscarConTotalServiciosMayorA(@PathVariable BigDecimal totalServicios) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarConTotalServiciosMayorA(totalServicios);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo con total de repuestos mayor a cantidad
     */
    @GetMapping("/total-repuestos-mayor/{totalRepuestos}")
    public ResponseEntity<List<OrdenTrabajo>> buscarConTotalRepuestosMayorA(@PathVariable BigDecimal totalRepuestos) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarConTotalRepuestosMayorA(totalRepuestos);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo con total de orden mayor a cantidad
     */
    @GetMapping("/total-orden-mayor/{totalOrden}")
    public ResponseEntity<List<OrdenTrabajo>> buscarConTotalOrdenMayorA(@PathVariable BigDecimal totalOrden) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarConTotalOrdenMayorA(totalOrden);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo con total de orden en rango
     */
    @GetMapping("/total-orden-rango/{totalMin}/{totalMax}")
    public ResponseEntity<List<OrdenTrabajo>> buscarConTotalOrdenEnRango(@PathVariable BigDecimal totalMin, @PathVariable BigDecimal totalMax) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarConTotalOrdenEnRango(totalMin, totalMax);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    // ===============================
    // CONSULTAS POR ESTADO DE PAGO
    // ===============================

    /**
     * Buscar órdenes de trabajo por estado de pago
     */
    @GetMapping("/estado-pago/{estadoPago}")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorEstadoPago(@PathVariable String estadoPago) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorEstadoPago(estadoPago);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por estado de pago ordenadas por fecha de ingreso desc
     */
    @GetMapping("/estado-pago/{estadoPago}/ordenadas")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorEstadoPagoOrdenadas(@PathVariable String estadoPago) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorEstadoPagoOrdenadas(estadoPago);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por estado de pago (nativo)
     */
    @GetMapping("/estado-pago/{estadoPago}/nativo")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorEstadoPagoNativo(@PathVariable String estadoPago) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorEstadoPagoNativo(estadoPago);
        return ResponseEntity.ok(ordenesTrabajo);
    }

    /**
     * Buscar órdenes de trabajo por múltiples estados de pago
     */
    @PostMapping("/buscar-por-estados-pago")
    public ResponseEntity<List<OrdenTrabajo>> buscarPorEstadosPago(@RequestBody List<String> estadosPago) {
        List<OrdenTrabajo> ordenesTrabajo = ordenTrabajoService.buscarPorEstadosPago(estadosPago);
        return ResponseEntity.ok(ordenesTrabajo);
    }
}
