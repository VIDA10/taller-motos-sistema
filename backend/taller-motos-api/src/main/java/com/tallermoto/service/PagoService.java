package com.tallermoto.service;

import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Pago;
import com.tallermoto.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de Pagos
 * Proporciona la lógica de negocio para operaciones con pagos
 */
@Service
@Transactional
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    // ========== OPERACIONES CRUD ==========

    /**
     * Guarda un nuevo pago
     */
    public Pago guardarPago(Pago pago) {
        return pagoRepository.save(pago);
    }

    /**
     * Busca un pago por ID
     */
    @Transactional(readOnly = true)
    public Optional<Pago> buscarPorId(Long id) {
        return pagoRepository.findById(id);
    }

    /**
     * Obtiene todos los pagos
     */
    @Transactional(readOnly = true)
    public List<Pago> obtenerTodos() {
        return pagoRepository.findAll();
    }

    /**
     * Actualiza un pago existente
     */
    public Pago actualizarPago(Pago pago) {
        return pagoRepository.save(pago);
    }

    /**
     * Elimina un pago por ID
     */
    public void eliminarPago(Long id) {
        pagoRepository.deleteById(id);
    }

    /**
     * Verifica si existe un pago por ID
     */
    @Transactional(readOnly = true)
    public boolean existePago(Long id) {
        return pagoRepository.existsById(id);
    }

    // ========== CONSULTAS POR ORDEN DE TRABAJO ==========

    /**
     * Busca pagos por orden de trabajo
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorOrdenTrabajo(OrdenTrabajo ordenTrabajo) {
        return pagoRepository.findByOrdenTrabajo(ordenTrabajo);
    }

    /**
     * Busca pagos por orden de trabajo ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorOrdenTrabajoOrdenadosPorFecha(OrdenTrabajo ordenTrabajo) {
        return pagoRepository.findByOrdenTrabajoOrderByFechaPagoDesc(ordenTrabajo);
    }

    /**
     * Busca pagos por orden y método de pago
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorOrdenYMetodo(OrdenTrabajo ordenTrabajo, String metodo) {
        return pagoRepository.findByOrdenTrabajoAndMetodo(ordenTrabajo, metodo);
    }

    /**
     * Busca pagos por orden en un rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorOrdenEntreFechas(OrdenTrabajo ordenTrabajo, LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return pagoRepository.findByOrdenTrabajoAndFechaPagoBetween(ordenTrabajo, fechaDesde, fechaHasta);
    }

    // ========== CONSULTAS POR MONTO ==========

    /**
     * Busca pagos con monto mayor al especificado
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorMontoMayorA(BigDecimal monto) {
        return pagoRepository.findByMontoGreaterThan(monto);
    }

    /**
     * Busca pagos con monto menor al especificado
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorMontoMenorA(BigDecimal monto) {
        return pagoRepository.findByMontoLessThan(monto);
    }

    /**
     * Busca pagos en un rango de montos
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorRangoMonto(BigDecimal montoMin, BigDecimal montoMax) {
        return pagoRepository.findByMontoBetween(montoMin, montoMax);
    }

    /**
     * Busca pagos con monto mayor o igual ordenados por monto descendente
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorMontoMayorIgualOrdenados(BigDecimal monto) {
        return pagoRepository.findByMontoGreaterThanEqualOrderByMontoDesc(monto);
    }

    // ========== CONSULTAS POR FECHA DE PAGO ==========

    /**
     * Busca pagos posteriores a una fecha
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorFechaPosteriorA(LocalDateTime fechaDesde) {
        return pagoRepository.findByFechaPagoAfter(fechaDesde);
    }

    /**
     * Busca pagos anteriores a una fecha
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorFechaAnteriorA(LocalDateTime fechaHasta) {
        return pagoRepository.findByFechaPagoBefore(fechaHasta);
    }

    /**
     * Busca pagos en un rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorRangoFechas(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return pagoRepository.findByFechaPagoBetween(fechaDesde, fechaHasta);
    }

    /**
     * Busca pagos posteriores a una fecha ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorFechaPosteriorOrdenados(LocalDateTime fechaDesde) {
        return pagoRepository.findByFechaPagoAfterOrderByFechaPagoDesc(fechaDesde);
    }

    // ========== CONSULTAS POR MÉTODO DE PAGO ==========

    /**
     * Busca pagos por método de pago
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorMetodo(String metodo) {
        return pagoRepository.findByMetodo(metodo);
    }

    /**
     * Busca pagos por método ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorMetodoOrdenadosPorFecha(String metodo) {
        return pagoRepository.findByMetodoOrderByFechaPagoDesc(metodo);
    }

    /**
     * Busca pagos por múltiples métodos
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorMetodos(List<String> metodos) {
        return pagoRepository.findByMetodoIn(metodos);
    }

    /**
     * Busca pagos por método (búsqueda parcial)
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorMetodoContiene(String metodo) {
        return pagoRepository.findByMetodoContainingIgnoreCase(metodo);
    }

    /**
     * Busca pagos por método y rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorMetodoEntreFechas(String metodo, LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return pagoRepository.findByMetodoAndFechaPagoBetween(metodo, fechaDesde, fechaHasta);
    }

    /**
     * Busca pagos por monto mayor y método específico
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorMontoMayorYMetodo(BigDecimal monto, String metodo) {
        return pagoRepository.findByMontoGreaterThanAndMetodo(monto, metodo);
    }

    // ========== CONSULTAS POR REFERENCIA ==========

    /**
     * Busca pagos por referencia exacta
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorReferencia(String referencia) {
        return pagoRepository.findByReferencia(referencia);
    }

    /**
     * Busca pagos por referencia (búsqueda parcial)
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorReferenciaContiene(String referencia) {
        return pagoRepository.findByReferenciaContainingIgnoreCase(referencia);
    }

    /**
     * Busca pagos sin referencia
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarSinReferencia() {
        return pagoRepository.findByReferenciaIsNull();
    }

    /**
     * Busca pagos con referencia
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarConReferencia() {
        return pagoRepository.findByReferenciaIsNotNull();
    }

    // ========== CONSULTAS POR OBSERVACIONES ==========

    /**
     * Busca pagos por observaciones (búsqueda parcial)
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorObservacionesContiene(String observaciones) {
        return pagoRepository.findByObservacionesContainingIgnoreCase(observaciones);
    }

    /**
     * Busca pagos sin observaciones
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarSinObservaciones() {
        return pagoRepository.findByObservacionesIsNull();
    }

    /**
     * Busca pagos con observaciones
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarConObservaciones() {
        return pagoRepository.findByObservacionesIsNotNull();
    }

    // ========== CONSULTAS POR FECHA DE CREACIÓN ==========

    /**
     * Busca pagos creados después de una fecha
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarCreadosDespuesDe(LocalDateTime fechaDesde) {
        return pagoRepository.findByCreatedAtAfter(fechaDesde);
    }

    /**
     * Busca pagos creados en un rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarCreadosEntre(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return pagoRepository.findByCreatedAtBetween(fechaDesde, fechaHasta);
    }

    /**
     * Busca pagos creados después de una fecha ordenados por fecha de creación descendente
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarCreadosDespuesOrdenados(LocalDateTime fechaDesde) {
        return pagoRepository.findByCreatedAtAfterOrderByCreatedAtDesc(fechaDesde);
    }

    // ========== MÉTODOS DE CONTEO ==========

    /**
     * Cuenta pagos por orden de trabajo
     */
    @Transactional(readOnly = true)
    public long contarPorOrdenTrabajo(OrdenTrabajo ordenTrabajo) {
        return pagoRepository.countByOrdenTrabajo(ordenTrabajo);
    }

    /**
     * Cuenta pagos por método
     */
    @Transactional(readOnly = true)
    public long contarPorMetodo(String metodo) {
        return pagoRepository.countByMetodo(metodo);
    }

    /**
     * Cuenta pagos en un rango de fechas
     */
    @Transactional(readOnly = true)
    public long contarEntreFechas(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return pagoRepository.countByFechaPagoBetween(fechaDesde, fechaHasta);
    }

    /**
     * Cuenta pagos con monto mayor al especificado
     */
    @Transactional(readOnly = true)
    public long contarPorMontoMayorA(BigDecimal monto) {
        return pagoRepository.countByMontoGreaterThan(monto);
    }

    // ========== CONSULTAS NATIVAS ==========

    /**
     * Busca pagos por orden usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorOrdenNativo(Long idOrden) {
        return pagoRepository.findByOrdenNative(idOrden);
    }

    /**
     * Busca pagos por fecha posterior usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorFechaPosteriorNativo(LocalDateTime fechaDesde) {
        return pagoRepository.findByFechaPagoAfterNative(fechaDesde);
    }

    /**
     * Busca pagos por método usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorMetodoNativo(String metodo) {
        return pagoRepository.findByMetodoNative(metodo);
    }

    /**
     * Busca pagos en rango de monto usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPorRangoMontoNativo(BigDecimal montoMin, BigDecimal montoMax) {
        return pagoRepository.findByRangoMonto(montoMin, montoMax);
    }

    // ========== CONSULTAS ESPECÍFICAS DEL DOMINIO ==========

    /**
     * Calcula el total pagado por una orden de trabajo
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalPagadoPorOrden(Long idOrden) {
        BigDecimal total = pagoRepository.calcularTotalPagadoPorOrden(idOrden);
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Cuenta los pagos de una orden específica
     */
    @Transactional(readOnly = true)
    public long contarPagosPorOrden(Long idOrden) {
        return pagoRepository.contarPagosPorOrden(idOrden);
    }

    /**
     * Obtiene pagos con información de orden en un rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Object[]> obtenerPagosConOrdenEntreFechas(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return pagoRepository.findPagosConOrdenEntreFechas(fechaDesde, fechaHasta);
    }

    /**
     * Obtiene resumen de pagos por método de pago
     */
    @Transactional(readOnly = true)
    public List<Object[]> obtenerResumenPorMetodoPago(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return pagoRepository.obtenerResumenPorMetodoPago(fechaDesde, fechaHasta);
    }

    /**
     * Obtiene resumen diario de pagos
     */
    @Transactional(readOnly = true)
    public List<Object[]> obtenerResumenDiarioPagos(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return pagoRepository.obtenerResumenDiarioPagos(fechaDesde, fechaHasta);
    }

    /**
     * Obtiene todos los métodos de pago disponibles
     */
    @Transactional(readOnly = true)
    public List<String> obtenerTodosLosMetodosPago() {
        return pagoRepository.findAllMetodosPago();
    }

    /**
     * Busca pagos con mayor monto desde una fecha
     */
    @Transactional(readOnly = true)
    public List<Pago> buscarPagosMayorMontoDesde(LocalDateTime fechaDesde, Integer limite) {
        return pagoRepository.findPagosMayorMontoDesde(fechaDesde, limite);
    }

    // ========== MÉTODOS DE VALIDACIÓN Y UTILIDAD ==========

    /**
     * Verifica si una orden tiene pagos registrados
     */
    @Transactional(readOnly = true)
    public boolean ordenTienePagos(OrdenTrabajo ordenTrabajo) {
        return contarPorOrdenTrabajo(ordenTrabajo) > 0;
    }

    /**
     * Verifica si existe un método de pago específico
     */
    @Transactional(readOnly = true)
    public boolean existeMetodoPago(String metodo) {
        return !buscarPorMetodo(metodo).isEmpty();
    }

    /**
     * Obtiene el total de todos los pagos
     */
    @Transactional(readOnly = true)
    public long contarTotalPagos() {
        return pagoRepository.count();
    }
}
