package com.tallermoto.service;

import com.tallermoto.entity.DetalleOrden;
import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Servicio;
import com.tallermoto.repository.DetalleOrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de detalles de orden
 * Proporciona operaciones CRUD y lógica de negocio para la relación orden-servicios
 */
@Service
@Transactional
public class DetalleOrdenService {

    @Autowired
    private DetalleOrdenRepository detalleOrdenRepository;

    // ===============================
    // OPERACIONES CRUD BÁSICAS
    // ===============================

    /**
     * Crear un nuevo detalle de orden
     */
    public DetalleOrden crearDetalleOrden(DetalleOrden detalleOrden) {
        // Validar que no exista ya la combinación orden-servicio (constraint UNIQUE)
        if (detalleOrdenRepository.existsByOrdenTrabajoAndServicio(
                detalleOrden.getOrdenTrabajo(), detalleOrden.getServicio())) {
            throw new IllegalArgumentException("Ya existe un detalle para la orden " + 
                detalleOrden.getOrdenTrabajo().getIdOrden() + " y el servicio " + 
                detalleOrden.getServicio().getIdServicio());
        }
        
        return detalleOrdenRepository.save(detalleOrden);
    }

    /**
     * Obtener detalle de orden por ID
     */
    @Transactional(readOnly = true)
    public Optional<DetalleOrden> obtenerDetalleOrdenPorId(Long id) {
        return detalleOrdenRepository.findById(id);
    }

    /**
     * Obtener todos los detalles de orden
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> obtenerTodosLosDetallesOrden() {
        return detalleOrdenRepository.findAll();
    }

    /**
     * Obtener detalles de orden con paginación
     */
    @Transactional(readOnly = true)
    public Page<DetalleOrden> obtenerDetallesOrdenPaginados(Pageable pageable) {
        return detalleOrdenRepository.findAll(pageable);
    }

    /**
     * Actualizar detalle de orden
     */
    public DetalleOrden actualizarDetalleOrden(Long id, DetalleOrden detalleOrdenActualizado) {
        Optional<DetalleOrden> detalleOrdenExistente = detalleOrdenRepository.findById(id);
        if (detalleOrdenExistente.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el detalle de orden con ID: " + id);
        }

        DetalleOrden detalleOrden = detalleOrdenExistente.get();
        
        // Validar constraint UNIQUE si se está cambiando orden o servicio
        if (!detalleOrden.getOrdenTrabajo().equals(detalleOrdenActualizado.getOrdenTrabajo()) ||
            !detalleOrden.getServicio().equals(detalleOrdenActualizado.getServicio())) {
            if (detalleOrdenRepository.existsByOrdenTrabajoAndServicio(
                    detalleOrdenActualizado.getOrdenTrabajo(), detalleOrdenActualizado.getServicio())) {
                throw new IllegalArgumentException("Ya existe un detalle para la orden " + 
                    detalleOrdenActualizado.getOrdenTrabajo().getIdOrden() + " y el servicio " + 
                    detalleOrdenActualizado.getServicio().getIdServicio());
            }
        }

        // Actualizar campos
        if (detalleOrdenActualizado.getOrdenTrabajo() != null) {
            detalleOrden.setOrdenTrabajo(detalleOrdenActualizado.getOrdenTrabajo());
        }
        if (detalleOrdenActualizado.getServicio() != null) {
            detalleOrden.setServicio(detalleOrdenActualizado.getServicio());
        }
        if (detalleOrdenActualizado.getPrecioAplicado() != null) {
            detalleOrden.setPrecioAplicado(detalleOrdenActualizado.getPrecioAplicado());
        }
        detalleOrden.setObservaciones(detalleOrdenActualizado.getObservaciones());

        return detalleOrdenRepository.save(detalleOrden);
    }

    /**
     * Eliminar detalle de orden permanentemente
     */
    public void eliminarDetalleOrden(Long id) {
        if (!detalleOrdenRepository.existsById(id)) {
            throw new IllegalArgumentException("No se encontró el detalle de orden con ID: " + id);
        }
        detalleOrdenRepository.deleteById(id);
    }

    // ===============================
    // CONSULTAS POR ORDEN DE TRABAJO
    // ===============================

    /**
     * Buscar detalles de orden por orden de trabajo
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarPorOrdenTrabajo(OrdenTrabajo ordenTrabajo) {
        return detalleOrdenRepository.findByOrdenTrabajo(ordenTrabajo);
    }

    /**
     * Buscar detalles de orden por orden de trabajo ordenados por fecha de creación
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarPorOrdenTrabajoOrdenados(OrdenTrabajo ordenTrabajo) {
        return detalleOrdenRepository.findByOrdenTrabajoOrderByCreatedAt(ordenTrabajo);
    }

    /**
     * Buscar detalles de orden por ID de orden (nativo)
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarPorOrdenNativo(Long idOrden) {
        return detalleOrdenRepository.findByOrdenNative(idOrden);
    }

    /**
     * Buscar detalles de orden con servicios activos por orden
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarPorOrdenConServiciosActivos(Long idOrden) {
        return detalleOrdenRepository.findByOrdenConServiciosActivos(idOrden);
    }

    /**
     * Buscar detalles con información de servicios por orden
     */
    @Transactional(readOnly = true)
    public List<Object[]> buscarDetallesConServiciosPorOrden(Long idOrden) {
        return detalleOrdenRepository.findDetallesConServiciosPorOrden(idOrden);
    }

    /**
     * Contar detalles de orden por orden de trabajo
     */
    @Transactional(readOnly = true)
    public long contarPorOrdenTrabajo(OrdenTrabajo ordenTrabajo) {
        return detalleOrdenRepository.countByOrdenTrabajo(ordenTrabajo);
    }

    /**
     * Contar servicios por orden (nativo)
     */
    @Transactional(readOnly = true)
    public long contarServiciosPorOrden(Long idOrden) {
        return detalleOrdenRepository.contarServiciosPorOrden(idOrden);
    }

    // ===============================
    // CONSULTAS POR SERVICIO
    // ===============================

    /**
     * Buscar detalles de orden por servicio
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarPorServicio(Servicio servicio) {
        return detalleOrdenRepository.findByServicio(servicio);
    }

    /**
     * Buscar detalles de orden por servicio ordenados por fecha de creación
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarPorServicioOrdenados(Servicio servicio) {
        return detalleOrdenRepository.findByServicioOrderByCreatedAt(servicio);
    }

    /**
     * Buscar detalles de orden por ID de servicio (nativo)
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarPorServicioNativo(Long idServicio) {
        return detalleOrdenRepository.findByServicioNative(idServicio);
    }

    /**
     * Contar detalles de orden por servicio
     */
    @Transactional(readOnly = true)
    public long contarPorServicio(Servicio servicio) {
        return detalleOrdenRepository.countByServicio(servicio);
    }

    // ===============================
    // CONSULTA ÚNICA POR ORDEN Y SERVICIO
    // ===============================

    /**
     * Buscar detalle de orden por orden de trabajo y servicio (constraint UNIQUE)
     */
    @Transactional(readOnly = true)
    public Optional<DetalleOrden> buscarPorOrdenTrabajoYServicio(OrdenTrabajo ordenTrabajo, Servicio servicio) {
        return detalleOrdenRepository.findByOrdenTrabajoAndServicio(ordenTrabajo, servicio);
    }

    /**
     * Buscar detalle de orden por ID de orden y ID de servicio (nativo)
     */
    @Transactional(readOnly = true)
    public Optional<DetalleOrden> buscarPorOrdenYServicioNativo(Long idOrden, Long idServicio) {
        return detalleOrdenRepository.findByOrdenAndServicioNative(idOrden, idServicio);
    }

    /**
     * Verificar si existe detalle por orden de trabajo y servicio
     */
    @Transactional(readOnly = true)
    public boolean existePorOrdenTrabajoYServicio(OrdenTrabajo ordenTrabajo, Servicio servicio) {
        return detalleOrdenRepository.existsByOrdenTrabajoAndServicio(ordenTrabajo, servicio);
    }

    // ===============================
    // CONSULTAS POR PRECIO APLICADO
    // ===============================

    /**
     * Buscar detalles de orden con precio aplicado mayor a cantidad
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarConPrecioAplicadoMayorA(BigDecimal precioAplicado) {
        return detalleOrdenRepository.findByPrecioAplicadoGreaterThan(precioAplicado);
    }

    /**
     * Buscar detalles de orden con precio aplicado menor a cantidad
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarConPrecioAplicadoMenorA(BigDecimal precioAplicado) {
        return detalleOrdenRepository.findByPrecioAplicadoLessThan(precioAplicado);
    }

    /**
     * Buscar detalles de orden con precio aplicado en rango
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarConPrecioAplicadoEnRango(BigDecimal precioMin, BigDecimal precioMax) {
        return detalleOrdenRepository.findByPrecioAplicadoBetween(precioMin, precioMax);
    }

    /**
     * Buscar detalles de orden con precio aplicado mayor o igual ordenados por precio desc
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarConPrecioAplicadoMayorIgualOrdenados(BigDecimal precioAplicado) {
        return detalleOrdenRepository.findByPrecioAplicadoGreaterThanEqualOrderByPrecioAplicadoDesc(precioAplicado);
    }

    /**
     * Buscar detalles de orden por rango de precio (nativo)
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarPorRangoPrecio(BigDecimal precioMin, BigDecimal precioMax) {
        return detalleOrdenRepository.findByRangoPrecio(precioMin, precioMax);
    }

    /**
     * Contar detalles de orden con precio aplicado mayor a cantidad
     */
    @Transactional(readOnly = true)
    public long contarConPrecioAplicadoMayorA(BigDecimal precioAplicado) {
        return detalleOrdenRepository.countByPrecioAplicadoGreaterThan(precioAplicado);
    }

    // ===============================
    // CONSULTAS POR OBSERVACIONES
    // ===============================

    /**
     * Buscar detalles de orden por observaciones (contiene, ignora mayúsculas)
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarPorObservaciones(String observaciones) {
        return detalleOrdenRepository.findByObservacionesContainingIgnoreCase(observaciones);
    }

    /**
     * Buscar detalles de orden sin observaciones
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarSinObservaciones() {
        return detalleOrdenRepository.findByObservacionesIsNull();
    }

    /**
     * Buscar detalles de orden con observaciones
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarConObservaciones() {
        return detalleOrdenRepository.findByObservacionesIsNotNull();
    }

    // ===============================
    // CONSULTAS COMBINADAS
    // ===============================

    /**
     * Buscar detalles de orden por orden de trabajo con precio mínimo
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarPorOrdenTrabajoConPrecioMinimo(OrdenTrabajo ordenTrabajo, BigDecimal precioMinimo) {
        return detalleOrdenRepository.findByOrdenTrabajoAndPrecioAplicadoGreaterThan(ordenTrabajo, precioMinimo);
    }

    /**
     * Buscar detalles de orden por servicio con precio en rango
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarPorServicioConPrecioEnRango(Servicio servicio, BigDecimal precioMin, BigDecimal precioMax) {
        return detalleOrdenRepository.findByServicioAndPrecioAplicadoBetween(servicio, precioMin, precioMax);
    }

    // ===============================
    // CONSULTAS POR FECHAS DE CREACIÓN
    // ===============================

    /**
     * Buscar detalles de orden creados después de fecha
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarCreadosDespuesDe(LocalDateTime fechaDesde) {
        return detalleOrdenRepository.findByCreatedAtAfter(fechaDesde);
    }

    /**
     * Buscar detalles de orden creados en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarCreadosEnRango(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return detalleOrdenRepository.findByCreatedAtBetween(fechaDesde, fechaHasta);
    }

    /**
     * Buscar detalles de orden creados después de fecha ordenados por fecha desc
     */
    @Transactional(readOnly = true)
    public List<DetalleOrden> buscarCreadosDespuesDeOrdenados(LocalDateTime fechaDesde) {
        return detalleOrdenRepository.findByCreatedAtAfterOrderByCreatedAtDesc(fechaDesde);
    }

    // ===============================
    // CÁLCULOS Y OPERACIONES ESPECIALIZADAS
    // ===============================

    /**
     * Calcular total de servicios por orden
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalServiciosPorOrden(Long idOrden) {
        BigDecimal total = detalleOrdenRepository.calcularTotalServiciosPorOrden(idOrden);
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Agregar servicio a orden de trabajo
     */
    public DetalleOrden agregarServicioAOrden(OrdenTrabajo ordenTrabajo, Servicio servicio, BigDecimal precioAplicado, String observaciones) {
        // Verificar que no exista ya
        if (detalleOrdenRepository.existsByOrdenTrabajoAndServicio(ordenTrabajo, servicio)) {
            throw new IllegalArgumentException("El servicio ya está agregado a esta orden de trabajo");
        }
        
        DetalleOrden detalleOrden = new DetalleOrden(ordenTrabajo, servicio, precioAplicado, observaciones);
        return detalleOrdenRepository.save(detalleOrden);
    }

    /**
     * Remover servicio de orden de trabajo
     */
    public void removerServicioDeOrden(OrdenTrabajo ordenTrabajo, Servicio servicio) {
        Optional<DetalleOrden> detalleOrden = detalleOrdenRepository.findByOrdenTrabajoAndServicio(ordenTrabajo, servicio);
        if (detalleOrden.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el servicio en la orden de trabajo");
        }
        
        detalleOrdenRepository.delete(detalleOrden.get());
    }

    /**
     * Actualizar precio aplicado de un servicio en orden
     */
    public DetalleOrden actualizarPrecioAplicado(OrdenTrabajo ordenTrabajo, Servicio servicio, BigDecimal nuevoPrecio) {
        Optional<DetalleOrden> detalleOrdenOpt = detalleOrdenRepository.findByOrdenTrabajoAndServicio(ordenTrabajo, servicio);
        if (detalleOrdenOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el servicio en la orden de trabajo");
        }
        
        DetalleOrden detalleOrden = detalleOrdenOpt.get();
        detalleOrden.setPrecioAplicado(nuevoPrecio);
        return detalleOrdenRepository.save(detalleOrden);
    }

    /**
     * Actualizar observaciones de un servicio en orden
     */
    public DetalleOrden actualizarObservaciones(OrdenTrabajo ordenTrabajo, Servicio servicio, String observaciones) {
        Optional<DetalleOrden> detalleOrdenOpt = detalleOrdenRepository.findByOrdenTrabajoAndServicio(ordenTrabajo, servicio);
        if (detalleOrdenOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el servicio en la orden de trabajo");
        }
        
        DetalleOrden detalleOrden = detalleOrdenOpt.get();
        detalleOrden.setObservaciones(observaciones);
        return detalleOrdenRepository.save(detalleOrden);
    }

    /**
     * Obtener todos los servicios de una orden
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerServiciosDeOrden(OrdenTrabajo ordenTrabajo) {
        return detalleOrdenRepository.findByOrdenTrabajo(ordenTrabajo)
                .stream()
                .map(DetalleOrden::getServicio)
                .toList();
    }

    /**
     * Eliminar todos los detalles de una orden
     */
    public void eliminarTodosLosDetallesDeOrden(OrdenTrabajo ordenTrabajo) {
        List<DetalleOrden> detalles = detalleOrdenRepository.findByOrdenTrabajo(ordenTrabajo);
        detalleOrdenRepository.deleteAll(detalles);
    }

    /**
     * Clonar detalles de una orden a otra orden
     */
    public List<DetalleOrden> clonarDetallesAOtraOrden(OrdenTrabajo ordenOrigen, OrdenTrabajo ordenDestino) {
        List<DetalleOrden> detallesOrigen = detalleOrdenRepository.findByOrdenTrabajo(ordenOrigen);
        List<DetalleOrden> detallesNuevos = detallesOrigen.stream()
                .map(detalle -> new DetalleOrden(
                    ordenDestino,
                    detalle.getServicio(),
                    detalle.getPrecioAplicado(),
                    detalle.getObservaciones()
                ))
                .toList();
        
        return detalleOrdenRepository.saveAll(detallesNuevos);
    }
}
