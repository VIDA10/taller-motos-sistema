package com.tallermoto.service;

import com.tallermoto.entity.Repuesto;
import com.tallermoto.entity.RepuestoMovimiento;
import com.tallermoto.entity.Usuario;
import com.tallermoto.repository.RepuestoMovimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de RepuestoMovimiento
 * Proporciona la lógica de negocio para operaciones con movimientos de repuestos
 */
@Service
@Transactional
public class RepuestoMovimientoService {

    @Autowired
    private RepuestoMovimientoRepository repuestoMovimientoRepository;

    // ========== OPERACIONES CRUD ==========

    /**
     * Guarda un nuevo movimiento de repuesto
     */
    public RepuestoMovimiento guardarMovimiento(RepuestoMovimiento repuestoMovimiento) {
        return repuestoMovimientoRepository.save(repuestoMovimiento);
    }

    /**
     * Busca un movimiento por ID
     */
    @Transactional(readOnly = true)
    public Optional<RepuestoMovimiento> buscarPorId(Long id) {
        return repuestoMovimientoRepository.findById(id);
    }

    /**
     * Obtiene todos los movimientos
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> obtenerTodos() {
        return repuestoMovimientoRepository.findAll();
    }

    /**
     * Actualiza un movimiento existente
     */
    public RepuestoMovimiento actualizarMovimiento(RepuestoMovimiento repuestoMovimiento) {
        return repuestoMovimientoRepository.save(repuestoMovimiento);
    }

    /**
     * Elimina un movimiento por ID
     */
    public void eliminarMovimiento(Long id) {
        repuestoMovimientoRepository.deleteById(id);
    }

    /**
     * Verifica si existe un movimiento por ID
     */
    @Transactional(readOnly = true)
    public boolean existeMovimiento(Long id) {
        return repuestoMovimientoRepository.existsById(id);
    }

    // ========== CONSULTAS POR REPUESTO ==========

    /**
     * Busca movimientos por repuesto
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorRepuesto(Repuesto repuesto) {
        return repuestoMovimientoRepository.findByRepuesto(repuesto);
    }

    /**
     * Busca movimientos por repuesto ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorRepuestoOrdenadosPorFechaDesc(Repuesto repuesto) {
        return repuestoMovimientoRepository.findByRepuestoOrderByFechaMovimientoDesc(repuesto);
    }

    /**
     * Busca movimientos por repuesto ordenados por fecha ascendente
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorRepuestoOrdenadosPorFechaAsc(Repuesto repuesto) {
        return repuestoMovimientoRepository.findByRepuestoOrderByFechaMovimientoAsc(repuesto);
    }

    /**
     * Busca movimientos por repuesto y tipo de movimiento
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorRepuestoYTipo(Repuesto repuesto, String tipoMovimiento) {
        return repuestoMovimientoRepository.findByRepuestoAndTipoMovimiento(repuesto, tipoMovimiento);
    }

    /**
     * Busca movimientos por repuesto y usuario
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorRepuestoYUsuario(Repuesto repuesto, Usuario usuarioMovimiento) {
        return repuestoMovimientoRepository.findByRepuestoAndUsuarioMovimiento(repuesto, usuarioMovimiento);
    }

    /**
     * Busca movimientos por repuesto en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorRepuestoEntreFechas(Repuesto repuesto, LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return repuestoMovimientoRepository.findByRepuestoAndFechaMovimientoBetween(repuesto, fechaDesde, fechaHasta);
    }

    // ========== CONSULTAS POR TIPO DE MOVIMIENTO ==========

    /**
     * Busca movimientos por tipo de movimiento
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorTipoMovimiento(String tipoMovimiento) {
        return repuestoMovimientoRepository.findByTipoMovimiento(tipoMovimiento);
    }

    /**
     * Busca movimientos por tipo ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorTipoOrdenadosPorFecha(String tipoMovimiento) {
        return repuestoMovimientoRepository.findByTipoMovimientoOrderByFechaMovimientoDesc(tipoMovimiento);
    }

    /**
     * Busca movimientos por múltiples tipos
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorTiposMovimiento(List<String> tiposMovimiento) {
        return repuestoMovimientoRepository.findByTipoMovimientoIn(tiposMovimiento);
    }

    /**
     * Busca movimientos por tipo en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorTipoEntreFechas(String tipoMovimiento, LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return repuestoMovimientoRepository.findByTipoMovimientoAndFechaMovimientoBetween(tipoMovimiento, fechaDesde, fechaHasta);
    }

    // ========== CONSULTAS POR CANTIDAD ==========

    /**
     * Busca movimientos con cantidad mayor a la especificada
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorCantidadMayorA(Integer cantidad) {
        return repuestoMovimientoRepository.findByCantidadGreaterThan(cantidad);
    }

    /**
     * Busca movimientos con cantidad menor a la especificada
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorCantidadMenorA(Integer cantidad) {
        return repuestoMovimientoRepository.findByCantidadLessThan(cantidad);
    }

    /**
     * Busca movimientos en un rango de cantidades
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorRangoCantidad(Integer cantidadMin, Integer cantidadMax) {
        return repuestoMovimientoRepository.findByCantidadBetween(cantidadMin, cantidadMax);
    }

    /**
     * Busca movimientos con cantidad mayor o igual ordenados por cantidad descendente
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorCantidadMayorIgualOrdenados(Integer cantidad) {
        return repuestoMovimientoRepository.findByCantidadGreaterThanEqualOrderByCantidadDesc(cantidad);
    }

    // ========== CONSULTAS POR STOCK ANTERIOR ==========

    /**
     * Busca movimientos con stock anterior mayor al especificado
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorStockAnteriorMayorA(Integer stockAnterior) {
        return repuestoMovimientoRepository.findByStockAnteriorGreaterThan(stockAnterior);
    }

    /**
     * Busca movimientos con stock anterior menor al especificado
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorStockAnteriorMenorA(Integer stockAnterior) {
        return repuestoMovimientoRepository.findByStockAnteriorLessThan(stockAnterior);
    }

    /**
     * Busca movimientos en un rango de stock anterior
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorRangoStockAnterior(Integer stockMin, Integer stockMax) {
        return repuestoMovimientoRepository.findByStockAnteriorBetween(stockMin, stockMax);
    }

    // ========== CONSULTAS POR STOCK NUEVO ==========

    /**
     * Busca movimientos con stock nuevo mayor al especificado
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorStockNuevoMayorA(Integer stockNuevo) {
        return repuestoMovimientoRepository.findByStockNuevoGreaterThan(stockNuevo);
    }

    /**
     * Busca movimientos con stock nuevo menor al especificado
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorStockNuevoMenorA(Integer stockNuevo) {
        return repuestoMovimientoRepository.findByStockNuevoLessThan(stockNuevo);
    }

    /**
     * Busca movimientos en un rango de stock nuevo
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorRangoStockNuevo(Integer stockMin, Integer stockMax) {
        return repuestoMovimientoRepository.findByStockNuevoBetween(stockMin, stockMax);
    }

    // ========== CONSULTAS POR REFERENCIA ==========

    /**
     * Busca movimientos por referencia exacta
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorReferencia(String referencia) {
        return repuestoMovimientoRepository.findByReferencia(referencia);
    }

    /**
     * Busca movimientos por referencia (búsqueda parcial)
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorReferenciaContiene(String referencia) {
        return repuestoMovimientoRepository.findByReferenciaContainingIgnoreCase(referencia);
    }

    /**
     * Busca movimientos sin referencia
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarSinReferencia() {
        return repuestoMovimientoRepository.findByReferenciaIsNull();
    }

    /**
     * Busca movimientos con referencia
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarConReferencia() {
        return repuestoMovimientoRepository.findByReferenciaIsNotNull();
    }

    // ========== CONSULTAS POR USUARIO DE MOVIMIENTO ==========

    /**
     * Busca movimientos por usuario
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorUsuarioMovimiento(Usuario usuarioMovimiento) {
        return repuestoMovimientoRepository.findByUsuarioMovimiento(usuarioMovimiento);
    }

    /**
     * Busca movimientos por usuario ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorUsuarioOrdenadosPorFecha(Usuario usuarioMovimiento) {
        return repuestoMovimientoRepository.findByUsuarioMovimientoOrderByFechaMovimientoDesc(usuarioMovimiento);
    }

    /**
     * Busca movimientos por usuario en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorUsuarioEntreFechas(Usuario usuarioMovimiento, LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return repuestoMovimientoRepository.findByUsuarioMovimientoAndFechaMovimientoBetween(usuarioMovimiento, fechaDesde, fechaHasta);
    }

    // ========== CONSULTAS POR FECHA DE MOVIMIENTO ==========

    /**
     * Busca movimientos posteriores a una fecha
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorFechaPosteriorA(LocalDateTime fechaDesde) {
        return repuestoMovimientoRepository.findByFechaMovimientoAfter(fechaDesde);
    }

    /**
     * Busca movimientos anteriores a una fecha
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorFechaAnteriorA(LocalDateTime fechaHasta) {
        return repuestoMovimientoRepository.findByFechaMovimientoBefore(fechaHasta);
    }

    /**
     * Busca movimientos en un rango de fechas
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorRangoFechas(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return repuestoMovimientoRepository.findByFechaMovimientoBetween(fechaDesde, fechaHasta);
    }

    /**
     * Busca movimientos posteriores a una fecha ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorFechaPosteriorOrdenados(LocalDateTime fechaDesde) {
        return repuestoMovimientoRepository.findByFechaMovimientoAfterOrderByFechaMovimientoDesc(fechaDesde);
    }

    // ========== MÉTODOS DE CONTEO ==========

    /**
     * Cuenta movimientos por repuesto
     */
    @Transactional(readOnly = true)
    public long contarPorRepuesto(Repuesto repuesto) {
        return repuestoMovimientoRepository.countByRepuesto(repuesto);
    }

    /**
     * Cuenta movimientos por tipo
     */
    @Transactional(readOnly = true)
    public long contarPorTipoMovimiento(String tipoMovimiento) {
        return repuestoMovimientoRepository.countByTipoMovimiento(tipoMovimiento);
    }

    /**
     * Cuenta movimientos por usuario
     */
    @Transactional(readOnly = true)
    public long contarPorUsuarioMovimiento(Usuario usuarioMovimiento) {
        return repuestoMovimientoRepository.countByUsuarioMovimiento(usuarioMovimiento);
    }

    /**
     * Cuenta movimientos en un rango de fechas
     */
    @Transactional(readOnly = true)
    public long contarEntreFechas(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return repuestoMovimientoRepository.countByFechaMovimientoBetween(fechaDesde, fechaHasta);
    }

    // ========== CONSULTAS NATIVAS ==========

    /**
     * Busca movimientos por repuesto usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorRepuestoNativo(Long idRepuesto) {
        return repuestoMovimientoRepository.findByRepuestoNative(idRepuesto);
    }

    /**
     * Busca movimientos por fecha posterior usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorFechaPosteriorNativo(LocalDateTime fechaDesde) {
        return repuestoMovimientoRepository.findByFechaMovimientoAfterNative(fechaDesde);
    }

    /**
     * Busca movimientos por tipo usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorTipoNativo(String tipoMovimiento) {
        return repuestoMovimientoRepository.findByTipoMovimientoNative(tipoMovimiento);
    }

    /**
     * Busca movimientos por usuario usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarPorUsuarioNativo(Long idUsuario) {
        return repuestoMovimientoRepository.findByUsuarioMovimientoNative(idUsuario);
    }

    // ========== CONSULTAS ESPECÍFICAS DEL DOMINIO ==========

    /**
     * Obtiene movimientos completos con información de repuesto y usuario
     */
    @Transactional(readOnly = true)
    public List<Object[]> obtenerMovimientosCompletosPorRepuesto(Long idRepuesto) {
        return repuestoMovimientoRepository.findMovimientosCompletosByRepuesto(idRepuesto);
    }

    /**
     * Cuenta los movimientos de un repuesto específico
     */
    @Transactional(readOnly = true)
    public long contarMovimientosPorRepuesto(Long idRepuesto) {
        return repuestoMovimientoRepository.contarMovimientosPorRepuesto(idRepuesto);
    }

    /**
     * Obtiene el último movimiento de un repuesto
     */
    @Transactional(readOnly = true)
    public RepuestoMovimiento buscarUltimoMovimientoPorRepuesto(Long idRepuesto) {
        return repuestoMovimientoRepository.findUltimoMovimientoPorRepuesto(idRepuesto);
    }

    /**
     * Obtiene resumen de movimientos por tipo en un período
     */
    @Transactional(readOnly = true)
    public List<Object[]> obtenerResumenPorTipoMovimiento(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return repuestoMovimientoRepository.obtenerResumenPorTipoMovimiento(fechaDesde, fechaHasta);
    }

    /**
     * Obtiene resumen de movimientos por usuario en un período
     */
    @Transactional(readOnly = true)
    public List<Object[]> obtenerResumenPorUsuario(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return repuestoMovimientoRepository.obtenerResumenPorUsuario(fechaDesde, fechaHasta);
    }

    /**
     * Obtiene todos los tipos de movimiento disponibles
     */
    @Transactional(readOnly = true)
    public List<String> obtenerTodosTiposMovimiento() {
        return repuestoMovimientoRepository.findAllTiposMovimiento();
    }

    /**
     * Obtiene resumen diario de movimientos
     */
    @Transactional(readOnly = true)
    public List<Object[]> obtenerResumenDiarioMovimientos(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return repuestoMovimientoRepository.obtenerResumenDiarioMovimientos(fechaDesde, fechaHasta);
    }

    /**
     * Busca movimientos por categoría de repuesto en un período
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarMovimientosPorCategoriaEntreFechas(String categoria, LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return repuestoMovimientoRepository.findMovimientosPorCategoriaEntreFechas(categoria, fechaDesde, fechaHasta);
    }

    /**
     * Busca movimientos con referencia en un período
     */
    @Transactional(readOnly = true)
    public List<RepuestoMovimiento> buscarMovimientosConReferenciaEntreFechas(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return repuestoMovimientoRepository.findMovimientosConReferenciaEntreFechas(fechaDesde, fechaHasta);
    }

    // ========== MÉTODOS DE VALIDACIÓN Y UTILIDAD ==========

    /**
     * Verifica si un repuesto tiene movimientos registrados
     */
    @Transactional(readOnly = true)
    public boolean repuestoTieneMovimientos(Repuesto repuesto) {
        return contarPorRepuesto(repuesto) > 0;
    }

    /**
     * Verifica si existe un tipo de movimiento específico
     */
    @Transactional(readOnly = true)
    public boolean existeTipoMovimiento(String tipoMovimiento) {
        return !buscarPorTipoMovimiento(tipoMovimiento).isEmpty();
    }

    /**
     * Verifica si un usuario ha realizado movimientos
     */
    @Transactional(readOnly = true)
    public boolean usuarioHaRealizadoMovimientos(Usuario usuarioMovimiento) {
        return contarPorUsuarioMovimiento(usuarioMovimiento) > 0;
    }

    /**
     * Obtiene el total de movimientos registrados
     */
    @Transactional(readOnly = true)
    public long contarTotalMovimientos() {
        return repuestoMovimientoRepository.count();
    }
}
