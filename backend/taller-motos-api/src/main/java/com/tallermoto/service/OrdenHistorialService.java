package com.tallermoto.service;

import com.tallermoto.entity.OrdenHistorial;
import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Usuario;
import com.tallermoto.repository.OrdenHistorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de OrdenHistorial
 * Proporciona la lógica de negocio para operaciones con historial de órdenes
 */
@Service
@Transactional
public class OrdenHistorialService {

    @Autowired
    private OrdenHistorialRepository ordenHistorialRepository;

    // ========== OPERACIONES CRUD ==========

    /**
     * Guarda un nuevo historial de orden
     */
    public OrdenHistorial guardarHistorial(OrdenHistorial ordenHistorial) {
        return ordenHistorialRepository.save(ordenHistorial);
    }

    /**
     * Busca un historial por ID
     */
    @Transactional(readOnly = true)
    public Optional<OrdenHistorial> buscarPorId(Long id) {
        return ordenHistorialRepository.findById(id);
    }

    /**
     * Obtiene todos los historiales
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> obtenerTodos() {
        return ordenHistorialRepository.findAll();
    }

    /**
     * Actualiza un historial existente
     */
    public OrdenHistorial actualizarHistorial(OrdenHistorial ordenHistorial) {
        return ordenHistorialRepository.save(ordenHistorial);
    }

    /**
     * Elimina un historial por ID
     */
    public void eliminarHistorial(Long id) {
        ordenHistorialRepository.deleteById(id);
    }

    /**
     * Verifica si existe un historial por ID
     */
    @Transactional(readOnly = true)
    public boolean existeHistorial(Long id) {
        return ordenHistorialRepository.existsById(id);
    }

    // ========== CONSULTAS POR ORDEN DE TRABAJO ==========

    /**
     * Busca historiales por orden de trabajo
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorOrdenTrabajo(OrdenTrabajo ordenTrabajo) {
        return ordenHistorialRepository.findByOrdenTrabajo(ordenTrabajo);
    }

    /**
     * Busca historiales por orden ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorOrdenOrdenadosPorFechaDesc(OrdenTrabajo ordenTrabajo) {
        return ordenHistorialRepository.findByOrdenTrabajoOrderByFechaCambioDesc(ordenTrabajo);
    }

    /**
     * Busca historiales por orden ordenados por fecha ascendente
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorOrdenOrdenadosPorFechaAsc(OrdenTrabajo ordenTrabajo) {
        return ordenHistorialRepository.findByOrdenTrabajoOrderByFechaCambioAsc(ordenTrabajo);
    }

    /**
     * Busca historiales por orden y estado nuevo
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorOrdenYEstadoNuevo(OrdenTrabajo ordenTrabajo, String estadoNuevo) {
        return ordenHistorialRepository.findByOrdenTrabajoAndEstadoNuevo(ordenTrabajo, estadoNuevo);
    }

    /**
     * Busca historiales por orden y usuario de cambio
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorOrdenYUsuario(OrdenTrabajo ordenTrabajo, Usuario usuarioCambio) {
        return ordenHistorialRepository.findByOrdenTrabajoAndUsuarioCambio(ordenTrabajo, usuarioCambio);
    }

    /**
     * Busca historiales por orden en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorOrdenEntreFechas(OrdenTrabajo ordenTrabajo, LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return ordenHistorialRepository.findByOrdenTrabajoAndFechaCambioBetween(ordenTrabajo, fechaDesde, fechaHasta);
    }

    // ========== CONSULTAS POR ESTADO ANTERIOR ==========

    /**
     * Busca historiales por estado anterior
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorEstadoAnterior(String estadoAnterior) {
        return ordenHistorialRepository.findByEstadoAnterior(estadoAnterior);
    }

    /**
     * Busca historiales por estado anterior ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorEstadoAnteriorOrdenados(String estadoAnterior) {
        return ordenHistorialRepository.findByEstadoAnteriorOrderByFechaCambioDesc(estadoAnterior);
    }

    /**
     * Busca historiales sin estado anterior (primer cambio)
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarSinEstadoAnterior() {
        return ordenHistorialRepository.findByEstadoAnteriorIsNull();
    }

    /**
     * Busca historiales con estado anterior
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarConEstadoAnterior() {
        return ordenHistorialRepository.findByEstadoAnteriorIsNotNull();
    }

    // ========== CONSULTAS POR ESTADO NUEVO ==========

    /**
     * Busca historiales por estado nuevo
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorEstadoNuevo(String estadoNuevo) {
        return ordenHistorialRepository.findByEstadoNuevo(estadoNuevo);
    }

    /**
     * Busca historiales por estado nuevo ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorEstadoNuevoOrdenados(String estadoNuevo) {
        return ordenHistorialRepository.findByEstadoNuevoOrderByFechaCambioDesc(estadoNuevo);
    }

    /**
     * Busca historiales por múltiples estados nuevos
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorEstadosNuevos(List<String> estadosNuevos) {
        return ordenHistorialRepository.findByEstadoNuevoIn(estadosNuevos);
    }

    /**
     * Busca historiales por transición de estados
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorTransicionEstados(String estadoAnterior, String estadoNuevo) {
        return ordenHistorialRepository.findByEstadoAnteriorAndEstadoNuevo(estadoAnterior, estadoNuevo);
    }

    // ========== CONSULTAS POR COMENTARIO ==========

    /**
     * Busca historiales por comentario (búsqueda parcial)
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorComentarioContiene(String comentario) {
        return ordenHistorialRepository.findByComentarioContainingIgnoreCase(comentario);
    }

    /**
     * Busca historiales sin comentario
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarSinComentario() {
        return ordenHistorialRepository.findByComentarioIsNull();
    }

    /**
     * Busca historiales con comentario
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarConComentario() {
        return ordenHistorialRepository.findByComentarioIsNotNull();
    }

    // ========== CONSULTAS POR USUARIO DE CAMBIO ==========

    /**
     * Busca historiales por usuario de cambio
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorUsuarioCambio(Usuario usuarioCambio) {
        return ordenHistorialRepository.findByUsuarioCambio(usuarioCambio);
    }

    /**
     * Busca historiales por usuario ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorUsuarioOrdenadosPorFecha(Usuario usuarioCambio) {
        return ordenHistorialRepository.findByUsuarioCambioOrderByFechaCambioDesc(usuarioCambio);
    }

    /**
     * Busca historiales por usuario en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorUsuarioEntreFechas(Usuario usuarioCambio, LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return ordenHistorialRepository.findByUsuarioCambioAndFechaCambioBetween(usuarioCambio, fechaDesde, fechaHasta);
    }

    // ========== CONSULTAS POR FECHA DE CAMBIO ==========

    /**
     * Busca historiales posteriores a una fecha
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorFechaPosteriorA(LocalDateTime fechaDesde) {
        return ordenHistorialRepository.findByFechaCambioAfter(fechaDesde);
    }

    /**
     * Busca historiales anteriores a una fecha
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorFechaAnteriorA(LocalDateTime fechaHasta) {
        return ordenHistorialRepository.findByFechaCambioBefore(fechaHasta);
    }

    /**
     * Busca historiales en un rango de fechas
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorRangoFechas(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return ordenHistorialRepository.findByFechaCambioBetween(fechaDesde, fechaHasta);
    }

    /**
     * Busca historiales posteriores a una fecha ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorFechaPosteriorOrdenados(LocalDateTime fechaDesde) {
        return ordenHistorialRepository.findByFechaCambioAfterOrderByFechaCambioDesc(fechaDesde);
    }

    // ========== MÉTODOS DE CONTEO ==========

    /**
     * Cuenta historiales por orden de trabajo
     */
    @Transactional(readOnly = true)
    public long contarPorOrdenTrabajo(OrdenTrabajo ordenTrabajo) {
        return ordenHistorialRepository.countByOrdenTrabajo(ordenTrabajo);
    }

    /**
     * Cuenta historiales por usuario de cambio
     */
    @Transactional(readOnly = true)
    public long contarPorUsuarioCambio(Usuario usuarioCambio) {
        return ordenHistorialRepository.countByUsuarioCambio(usuarioCambio);
    }

    /**
     * Cuenta historiales por estado nuevo
     */
    @Transactional(readOnly = true)
    public long contarPorEstadoNuevo(String estadoNuevo) {
        return ordenHistorialRepository.countByEstadoNuevo(estadoNuevo);
    }

    /**
     * Cuenta historiales en un rango de fechas
     */
    @Transactional(readOnly = true)
    public long contarEntreFechas(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return ordenHistorialRepository.countByFechaCambioBetween(fechaDesde, fechaHasta);
    }

    // ========== CONSULTAS NATIVAS ==========

    /**
     * Busca historiales por orden usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorOrdenNativo(Long idOrden) {
        return ordenHistorialRepository.findByOrdenNative(idOrden);
    }

    /**
     * Busca historiales por fecha posterior usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorFechaPosteriorNativo(LocalDateTime fechaDesde) {
        return ordenHistorialRepository.findByFechaCambioAfterNative(fechaDesde);
    }

    /**
     * Busca historiales por usuario usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarPorUsuarioNativo(Long idUsuario) {
        return ordenHistorialRepository.findByUsuarioCambioNative(idUsuario);
    }

    // ========== CONSULTAS ESPECÍFICAS DEL DOMINIO ==========

    /**
     * Obtiene historial completo con información de orden y usuario
     */
    @Transactional(readOnly = true)
    public List<Object[]> obtenerHistorialCompletoByOrden(Long idOrden) {
        return ordenHistorialRepository.findHistorialCompletoByOrden(idOrden);
    }

    /**
     * Cuenta los cambios realizados en una orden específica
     */
    @Transactional(readOnly = true)
    public long contarCambiosPorOrden(Long idOrden) {
        return ordenHistorialRepository.contarCambiosPorOrden(idOrden);
    }

    /**
     * Busca cambios a un estado específico en un rango de fechas
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarCambiosAEstadoEntreFechas(String estadoNuevo, LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return ordenHistorialRepository.findCambiosAEstadoEntreFechas(estadoNuevo, fechaDesde, fechaHasta);
    }

    /**
     * Obtiene todos los estados nuevos registrados
     */
    @Transactional(readOnly = true)
    public List<String> obtenerTodosLosEstadosNuevos() {
        return ordenHistorialRepository.findAllEstadosNuevos();
    }

    /**
     * Obtiene todos los estados anteriores registrados
     */
    @Transactional(readOnly = true)
    public List<String> obtenerTodosLosEstadosAnteriores() {
        return ordenHistorialRepository.findAllEstadosAnteriores();
    }

    /**
     * Obtiene el último cambio realizado en una orden
     */
    @Transactional(readOnly = true)
    public OrdenHistorial buscarUltimoCambioPorOrden(Long idOrden) {
        return ordenHistorialRepository.findUltimoCambioPorOrden(idOrden);
    }

    /**
     * Obtiene resumen de cambios de estado en un período
     */
    @Transactional(readOnly = true)
    public List<Object[]> obtenerResumenCambiosEstado(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return ordenHistorialRepository.obtenerResumenCambiosEstado(fechaDesde, fechaHasta);
    }

    /**
     * Obtiene resumen de cambios por usuario en un período
     */
    @Transactional(readOnly = true)
    public List<Object[]> obtenerResumenCambiosPorUsuario(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return ordenHistorialRepository.obtenerResumenCambiosPorUsuario(fechaDesde, fechaHasta);
    }

    /**
     * Busca cambios con comentario en un rango de fechas
     */
    @Transactional(readOnly = true)
    public List<OrdenHistorial> buscarCambiosConComentarioEntreFechas(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return ordenHistorialRepository.findCambiosConComentarioEntreFechas(fechaDesde, fechaHasta);
    }

    // ========== MÉTODOS DE VALIDACIÓN Y UTILIDAD ==========

    /**
     * Verifica si una orden tiene historial registrado
     */
    @Transactional(readOnly = true)
    public boolean ordenTieneHistorial(OrdenTrabajo ordenTrabajo) {
        return contarPorOrdenTrabajo(ordenTrabajo) > 0;
    }

    /**
     * Verifica si existe un estado específico en el historial
     */
    @Transactional(readOnly = true)
    public boolean existeEstadoEnHistorial(String estado) {
        return !buscarPorEstadoNuevo(estado).isEmpty();
    }

    /**
     * Verifica si un usuario ha realizado cambios
     */
    @Transactional(readOnly = true)
    public boolean usuarioHaRealizadoCambios(Usuario usuarioCambio) {
        return contarPorUsuarioCambio(usuarioCambio) > 0;
    }

    /**
     * Obtiene el total de cambios registrados
     */
    @Transactional(readOnly = true)
    public long contarTotalCambios() {
        return ordenHistorialRepository.count();
    }
}
