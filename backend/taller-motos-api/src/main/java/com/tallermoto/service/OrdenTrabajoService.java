package com.tallermoto.service;

import com.tallermoto.dto.CreateOrdenTrabajoDTO;
import com.tallermoto.entity.Moto;
import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Usuario;
import com.tallermoto.repository.OrdenTrabajoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de órdenes de trabajo
 * Proporciona operaciones CRUD y lógica de negocio para las órdenes de trabajo
 */
@Service
@Transactional
public class OrdenTrabajoService {

    @Autowired
    private OrdenTrabajoRepository ordenTrabajoRepository;
    
    @Autowired
    private MotoService motoService;
    
    @Autowired
    private UsuarioService usuarioService;

    // ===============================
    // OPERACIONES CRUD BÁSICAS
    // ===============================

    /**
     * Crear una nueva orden de trabajo
     */
    public OrdenTrabajo crearOrdenTrabajo(OrdenTrabajo ordenTrabajo) {
        // Validar que el número de orden no exista si se proporciona
        if (ordenTrabajo.getNumeroOrden() != null && 
            ordenTrabajoRepository.existsByNumeroOrden(ordenTrabajo.getNumeroOrden())) {
            throw new IllegalArgumentException("Ya existe una orden con el número: " + ordenTrabajo.getNumeroOrden());
        }
        
        // Establecer valores por defecto si no están definidos
        if (ordenTrabajo.getFechaIngreso() == null) {
            ordenTrabajo.setFechaIngreso(LocalDateTime.now());
        }
        if (ordenTrabajo.getEstado() == null || ordenTrabajo.getEstado().isEmpty()) {
            ordenTrabajo.setEstado("RECIBIDA");
        }
        if (ordenTrabajo.getPrioridad() == null || ordenTrabajo.getPrioridad().isEmpty()) {
            ordenTrabajo.setPrioridad("NORMAL");
        }
        if (ordenTrabajo.getTotalServicios() == null) {
            ordenTrabajo.setTotalServicios(BigDecimal.ZERO);
        }
        if (ordenTrabajo.getTotalRepuestos() == null) {
            ordenTrabajo.setTotalRepuestos(BigDecimal.ZERO);
        }
        if (ordenTrabajo.getTotalOrden() == null) {
            ordenTrabajo.setTotalOrden(BigDecimal.ZERO);
        }
        if (ordenTrabajo.getEstadoPago() == null || ordenTrabajo.getEstadoPago().isEmpty()) {
            ordenTrabajo.setEstadoPago("PENDIENTE");
        }
        
        return ordenTrabajoRepository.save(ordenTrabajo);
    }

    /**
     * Crear una nueva orden de trabajo desde DTO
     */
    public OrdenTrabajo crearOrdenTrabajoDesdeDTO(CreateOrdenTrabajoDTO createDTO) {
        // Obtener entidades relacionadas
        Moto moto = motoService.obtenerPorId(createDTO.getIdMoto())
            .orElseThrow(() -> new IllegalArgumentException("Moto no encontrada con ID: " + createDTO.getIdMoto()));
            
        Usuario usuarioCreador = usuarioService.obtenerPorId(createDTO.getIdUsuarioCreador())
            .orElseThrow(() -> new IllegalArgumentException("Usuario creador no encontrado con ID: " + createDTO.getIdUsuarioCreador()));
        
        Usuario mecanicoAsignado = null;
        if (createDTO.getIdMecanicoAsignado() != null) {
            mecanicoAsignado = usuarioService.obtenerPorId(createDTO.getIdMecanicoAsignado())
                .orElseThrow(() -> new IllegalArgumentException("Mecánico no encontrado con ID: " + createDTO.getIdMecanicoAsignado()));
        }
        
        // Crear nueva orden
        OrdenTrabajo ordenTrabajo = new OrdenTrabajo();
        
        // Mapear campos del DTO
        ordenTrabajo.setMoto(moto);
        ordenTrabajo.setUsuarioCreador(usuarioCreador);
        ordenTrabajo.setMecanicoAsignado(mecanicoAsignado);
        ordenTrabajo.setFechaEstimadaEntrega(createDTO.getFechaEstimadaEntrega());
        ordenTrabajo.setEstado(createDTO.getEstado() != null ? createDTO.getEstado() : "RECIBIDA");
        ordenTrabajo.setPrioridad(createDTO.getPrioridad() != null ? createDTO.getPrioridad() : "NORMAL");
        ordenTrabajo.setDescripcionProblema(createDTO.getDescripcionProblema());
        ordenTrabajo.setDiagnostico(createDTO.getDiagnostico());
        ordenTrabajo.setObservaciones(createDTO.getObservaciones());
        
        // Usar el método existente para crear
        return crearOrdenTrabajo(ordenTrabajo);
    }

    /**
     * Obtener orden de trabajo por ID
     */
    @Transactional(readOnly = true)
    public Optional<OrdenTrabajo> obtenerOrdenTrabajoPorId(Long id) {
        return ordenTrabajoRepository.findById(id);
    }

    /**
     * Obtener todas las órdenes de trabajo con relaciones cargadas
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> obtenerTodasLasOrdenesTrabajo() {
        return ordenTrabajoRepository.findAllWithRelations();
    }

    /**
     * Obtener órdenes de trabajo con paginación
     */
    @Transactional(readOnly = true)
    public Page<OrdenTrabajo> obtenerOrdenesTrabajosPaginadas(Pageable pageable) {
        return ordenTrabajoRepository.findAll(pageable);
    }

    /**
     * Actualizar orden de trabajo
     */
    public OrdenTrabajo actualizarOrdenTrabajo(Long id, OrdenTrabajo ordenTrabajoActualizada) {
        Optional<OrdenTrabajo> ordenTrabajoExistente = ordenTrabajoRepository.findById(id);
        if (ordenTrabajoExistente.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la orden de trabajo con ID: " + id);
        }

        OrdenTrabajo ordenTrabajo = ordenTrabajoExistente.get();
        
        // Validar número de orden único si se está cambiando
        if (ordenTrabajoActualizada.getNumeroOrden() != null && 
            !ordenTrabajo.getNumeroOrden().equals(ordenTrabajoActualizada.getNumeroOrden())) {
            if (ordenTrabajoRepository.existsByNumeroOrdenAndIdOrdenNot(ordenTrabajoActualizada.getNumeroOrden(), id)) {
                throw new IllegalArgumentException("Ya existe otra orden con el número: " + ordenTrabajoActualizada.getNumeroOrden());
            }
        }

        // Actualizar campos
        if (ordenTrabajoActualizada.getNumeroOrden() != null) {
            ordenTrabajo.setNumeroOrden(ordenTrabajoActualizada.getNumeroOrden());
        }
        if (ordenTrabajoActualizada.getMoto() != null) {
            ordenTrabajo.setMoto(ordenTrabajoActualizada.getMoto());
        }
        if (ordenTrabajoActualizada.getUsuarioCreador() != null) {
            ordenTrabajo.setUsuarioCreador(ordenTrabajoActualizada.getUsuarioCreador());
        }
        if (ordenTrabajoActualizada.getMecanicoAsignado() != null) {
            ordenTrabajo.setMecanicoAsignado(ordenTrabajoActualizada.getMecanicoAsignado());
        }
        if (ordenTrabajoActualizada.getFechaIngreso() != null) {
            ordenTrabajo.setFechaIngreso(ordenTrabajoActualizada.getFechaIngreso());
        }
        ordenTrabajo.setFechaEstimadaEntrega(ordenTrabajoActualizada.getFechaEstimadaEntrega());
        if (ordenTrabajoActualizada.getEstado() != null) {
            ordenTrabajo.setEstado(ordenTrabajoActualizada.getEstado());
        }
        if (ordenTrabajoActualizada.getPrioridad() != null) {
            ordenTrabajo.setPrioridad(ordenTrabajoActualizada.getPrioridad());
        }
        if (ordenTrabajoActualizada.getDescripcionProblema() != null) {
            ordenTrabajo.setDescripcionProblema(ordenTrabajoActualizada.getDescripcionProblema());
        }
        ordenTrabajo.setDiagnostico(ordenTrabajoActualizada.getDiagnostico());
        ordenTrabajo.setObservaciones(ordenTrabajoActualizada.getObservaciones());
        if (ordenTrabajoActualizada.getTotalServicios() != null) {
            ordenTrabajo.setTotalServicios(ordenTrabajoActualizada.getTotalServicios());
        }
        if (ordenTrabajoActualizada.getTotalRepuestos() != null) {
            ordenTrabajo.setTotalRepuestos(ordenTrabajoActualizada.getTotalRepuestos());
        }
        if (ordenTrabajoActualizada.getTotalOrden() != null) {
            ordenTrabajo.setTotalOrden(ordenTrabajoActualizada.getTotalOrden());
        }
        if (ordenTrabajoActualizada.getEstadoPago() != null) {
            ordenTrabajo.setEstadoPago(ordenTrabajoActualizada.getEstadoPago());
        }

        return ordenTrabajoRepository.save(ordenTrabajo);
    }

    /**
     * Eliminar orden de trabajo permanentemente
     */
    public void eliminarOrdenTrabajo(Long id) {
        if (!ordenTrabajoRepository.existsById(id)) {
            throw new IllegalArgumentException("No se encontró la orden de trabajo con ID: " + id);
        }
        ordenTrabajoRepository.deleteById(id);
    }

    // ===============================
    // CONSULTAS POR NÚMERO DE ORDEN
    // ===============================

    /**
     * Buscar orden de trabajo por número de orden
     */
    @Transactional(readOnly = true)
    public Optional<OrdenTrabajo> buscarPorNumeroOrden(String numeroOrden) {
        return ordenTrabajoRepository.findByNumeroOrden(numeroOrden);
    }

    /**
     * Buscar orden de trabajo por número de orden (nativo)
     */
    @Transactional(readOnly = true)
    public Optional<OrdenTrabajo> buscarPorNumeroOrdenNativo(String numeroOrden) {
        return ordenTrabajoRepository.findByNumeroOrdenNative(numeroOrden);
    }

    /**
     * Verificar si existe un número de orden
     */
    @Transactional(readOnly = true)
    public boolean existeNumeroOrden(String numeroOrden) {
        return ordenTrabajoRepository.existsByNumeroOrden(numeroOrden);
    }

    // ===============================
    // CONSULTAS POR MOTO
    // ===============================

    /**
     * Buscar órdenes de trabajo por moto
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorMoto(Moto moto) {
        return ordenTrabajoRepository.findByMoto(moto);
    }

    /**
     * Buscar órdenes de trabajo por moto ordenadas por fecha de ingreso desc
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorMotoOrdenadas(Moto moto) {
        return ordenTrabajoRepository.findByMotoOrderByFechaIngresoDesc(moto);
    }

    /**
     * Contar órdenes de trabajo por moto
     */
    @Transactional(readOnly = true)
    public long contarPorMoto(Moto moto) {
        return ordenTrabajoRepository.countByMoto(moto);
    }

    // ===============================
    // CONSULTAS POR USUARIO CREADOR
    // ===============================

    /**
     * Buscar órdenes de trabajo por usuario creador
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorUsuarioCreador(Usuario usuarioCreador) {
        return ordenTrabajoRepository.findByUsuarioCreador(usuarioCreador);
    }

    /**
     * Buscar órdenes de trabajo por usuario creador ordenadas por fecha de ingreso desc
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorUsuarioCreadorOrdenadas(Usuario usuarioCreador) {
        return ordenTrabajoRepository.findByUsuarioCreadorOrderByFechaIngresoDesc(usuarioCreador);
    }

    /**
     * Buscar órdenes de trabajo por usuario creador y estado
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorUsuarioCreadorYEstado(Usuario usuarioCreador, String estado) {
        return ordenTrabajoRepository.findByUsuarioCreadorAndEstado(usuarioCreador, estado);
    }

    // ===============================
    // CONSULTAS POR MECÁNICO ASIGNADO
    // ===============================

    /**
     * Buscar órdenes de trabajo por mecánico asignado
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorMecanicoAsignado(Usuario mecanicoAsignado) {
        return ordenTrabajoRepository.findByMecanicoAsignado(mecanicoAsignado);
    }

    /**
     * Buscar órdenes de trabajo por mecánico asignado ordenadas por fecha de ingreso desc
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorMecanicoAsignadoOrdenadas(Usuario mecanicoAsignado) {
        return ordenTrabajoRepository.findByMecanicoAsignadoOrderByFechaIngresoDesc(mecanicoAsignado);
    }

    /**
     * Buscar órdenes de trabajo por mecánico asignado (nativo)
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorMecanicoAsignadoNativo(Long idMecanico) {
        return ordenTrabajoRepository.findByMecanicoAsignadoNative(idMecanico);
    }

    /**
     * Buscar órdenes de trabajo sin mecánico asignado
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarSinMecanicoAsignado() {
        return ordenTrabajoRepository.findByMecanicoAsignadoIsNull();
    }

    /**
     * Buscar órdenes de trabajo con mecánico asignado
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarConMecanicoAsignado() {
        return ordenTrabajoRepository.findByMecanicoAsignadoIsNotNull();
    }

    /**
     * Buscar órdenes de trabajo por estado y mecánico asignado
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorEstadoYMecanicoAsignado(String estado, Usuario mecanicoAsignado) {
        return ordenTrabajoRepository.findByEstadoAndMecanicoAsignado(estado, mecanicoAsignado);
    }

    /**
     * Contar órdenes de trabajo por mecánico asignado
     */
    @Transactional(readOnly = true)
    public long contarPorMecanicoAsignado(Usuario mecanicoAsignado) {
        return ordenTrabajoRepository.countByMecanicoAsignado(mecanicoAsignado);
    }

    // ===============================
    // CONSULTAS POR FECHA DE INGRESO
    // ===============================

    /**
     * Buscar órdenes de trabajo después de fecha
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarDespuesDeFecha(LocalDateTime fechaDesde) {
        return ordenTrabajoRepository.findByFechaIngresoAfter(fechaDesde);
    }

    /**
     * Buscar órdenes de trabajo antes de fecha
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarAntesDeFecha(LocalDateTime fechaHasta) {
        return ordenTrabajoRepository.findByFechaIngresoBefore(fechaHasta);
    }

    /**
     * Buscar órdenes de trabajo en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarEnRangoDeFechas(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return ordenTrabajoRepository.findByFechaIngresoBetween(fechaDesde, fechaHasta);
    }

    /**
     * Buscar órdenes de trabajo después de fecha ordenadas por fecha desc
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarDespuesDeFechaOrdenadas(LocalDateTime fechaDesde) {
        return ordenTrabajoRepository.findByFechaIngresoAfterOrderByFechaIngresoDesc(fechaDesde);
    }

    /**
     * Buscar órdenes de trabajo después de fecha (nativo)
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarDespuesDeFechaNativo(LocalDateTime fechaDesde) {
        return ordenTrabajoRepository.findByFechaIngresoAfterNative(fechaDesde);
    }

    // ===============================
    // CONSULTAS POR FECHA ESTIMADA ENTREGA
    // ===============================

    /**
     * Buscar órdenes de trabajo por fecha estimada de entrega
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorFechaEstimadaEntrega(LocalDate fechaEstimadaEntrega) {
        return ordenTrabajoRepository.findByFechaEstimadaEntrega(fechaEstimadaEntrega);
    }

    /**
     * Buscar órdenes de trabajo con fecha estimada antes de fecha límite
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarConFechaEstimadaAntesDe(LocalDate fechaLimite) {
        return ordenTrabajoRepository.findByFechaEstimadaEntregaBefore(fechaLimite);
    }

    /**
     * Buscar órdenes de trabajo con fecha estimada después de fecha
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarConFechaEstimadaDespuesDe(LocalDate fechaDesde) {
        return ordenTrabajoRepository.findByFechaEstimadaEntregaAfter(fechaDesde);
    }

    /**
     * Buscar órdenes de trabajo con fecha estimada en rango
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarConFechaEstimadaEnRango(LocalDate fechaDesde, LocalDate fechaHasta) {
        return ordenTrabajoRepository.findByFechaEstimadaEntregaBetween(fechaDesde, fechaHasta);
    }

    /**
     * Buscar órdenes de trabajo sin fecha estimada de entrega
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarSinFechaEstimadaEntrega() {
        return ordenTrabajoRepository.findByFechaEstimadaEntregaIsNull();
    }

    /**
     * Buscar órdenes de trabajo con fecha estimada de entrega
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarConFechaEstimadaEntrega() {
        return ordenTrabajoRepository.findByFechaEstimadaEntregaIsNotNull();
    }

    // ===============================
    // CONSULTAS POR ESTADO
    // ===============================

    /**
     * Buscar órdenes de trabajo por estado
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorEstado(String estado) {
        return ordenTrabajoRepository.findByEstado(estado);
    }

    /**
     * Buscar órdenes de trabajo por estado ordenadas por fecha de ingreso desc
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorEstadoOrdenadas(String estado) {
        return ordenTrabajoRepository.findByEstadoOrderByFechaIngresoDesc(estado);
    }

    /**
     * Buscar órdenes de trabajo por estado (nativo)
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorEstadoNativo(String estado) {
        return ordenTrabajoRepository.findByEstadoNative(estado);
    }

    /**
     * Buscar órdenes de trabajo por múltiples estados
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorEstados(List<String> estados) {
        return ordenTrabajoRepository.findByEstadoIn(estados);
    }

    /**
     * Buscar órdenes de trabajo por estado y prioridad
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorEstadoYPrioridad(String estado, String prioridad) {
        return ordenTrabajoRepository.findByEstadoAndPrioridad(estado, prioridad);
    }

    /**
     * Buscar órdenes de trabajo por estado y estado de pago
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorEstadoYEstadoPago(String estado, String estadoPago) {
        return ordenTrabajoRepository.findByEstadoAndEstadoPago(estado, estadoPago);
    }

    /**
     * Buscar órdenes de trabajo por moto y estado
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorMotoYEstado(Moto moto, String estado) {
        return ordenTrabajoRepository.findByMotoAndEstado(moto, estado);
    }

    /**
     * Obtener todos los estados disponibles
     */
    @Transactional(readOnly = true)
    public List<String> obtenerTodosLosEstados() {
        return ordenTrabajoRepository.findAllEstados();
    }

    /**
     * Contar órdenes de trabajo por estado
     */
    @Transactional(readOnly = true)
    public long contarPorEstado(String estado) {
        return ordenTrabajoRepository.countByEstado(estado);
    }

    // ===============================
    // CONSULTAS POR PRIORIDAD
    // ===============================

    /**
     * Buscar órdenes de trabajo por prioridad
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorPrioridad(String prioridad) {
        return ordenTrabajoRepository.findByPrioridad(prioridad);
    }

    /**
     * Buscar órdenes de trabajo por prioridad ordenadas por fecha de ingreso desc
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorPrioridadOrdenadas(String prioridad) {
        return ordenTrabajoRepository.findByPrioridadOrderByFechaIngresoDesc(prioridad);
    }

    /**
     * Buscar órdenes de trabajo por prioridad (nativo)
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorPrioridadNativo(String prioridad) {
        return ordenTrabajoRepository.findByPrioridadNative(prioridad);
    }

    /**
     * Buscar órdenes de trabajo por múltiples prioridades
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorPrioridades(List<String> prioridades) {
        return ordenTrabajoRepository.findByPrioridadIn(prioridades);
    }

    /**
     * Obtener todas las prioridades disponibles
     */
    @Transactional(readOnly = true)
    public List<String> obtenerTodasLasPrioridades() {
        return ordenTrabajoRepository.findAllPrioridades();
    }

    /**
     * Contar órdenes de trabajo por prioridad
     */
    @Transactional(readOnly = true)
    public long contarPorPrioridad(String prioridad) {
        return ordenTrabajoRepository.countByPrioridad(prioridad);
    }

    // ===============================
    // CONSULTAS POR DESCRIPCIÓN PROBLEMA
    // ===============================

    /**
     * Buscar órdenes de trabajo por descripción del problema
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorDescripcionProblema(String descripcionProblema) {
        return ordenTrabajoRepository.findByDescripcionProblemaContainingIgnoreCase(descripcionProblema);
    }

    // ===============================
    // CONSULTAS POR DIAGNÓSTICO
    // ===============================

    /**
     * Buscar órdenes de trabajo por diagnóstico
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorDiagnostico(String diagnostico) {
        return ordenTrabajoRepository.findByDiagnosticoContainingIgnoreCase(diagnostico);
    }

    /**
     * Buscar órdenes de trabajo sin diagnóstico
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarSinDiagnostico() {
        return ordenTrabajoRepository.findByDiagnosticoIsNull();
    }

    /**
     * Buscar órdenes de trabajo con diagnóstico
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarConDiagnostico() {
        return ordenTrabajoRepository.findByDiagnosticoIsNotNull();
    }

    // ===============================
    // CONSULTAS POR OBSERVACIONES
    // ===============================

    /**
     * Buscar órdenes de trabajo por observaciones
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorObservaciones(String observaciones) {
        return ordenTrabajoRepository.findByObservacionesContainingIgnoreCase(observaciones);
    }

    /**
     * Buscar órdenes de trabajo sin observaciones
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarSinObservaciones() {
        return ordenTrabajoRepository.findByObservacionesIsNull();
    }

    /**
     * Buscar órdenes de trabajo con observaciones
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarConObservaciones() {
        return ordenTrabajoRepository.findByObservacionesIsNotNull();
    }

    // ===============================
    // CONSULTAS POR TOTALES
    // ===============================

    /**
     * Buscar órdenes de trabajo con total de servicios mayor a cantidad
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarConTotalServiciosMayorA(BigDecimal totalServicios) {
        return ordenTrabajoRepository.findByTotalServiciosGreaterThan(totalServicios);
    }

    /**
     * Buscar órdenes de trabajo con total de repuestos mayor a cantidad
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarConTotalRepuestosMayorA(BigDecimal totalRepuestos) {
        return ordenTrabajoRepository.findByTotalRepuestosGreaterThan(totalRepuestos);
    }

    /**
     * Buscar órdenes de trabajo con total de orden mayor a cantidad
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarConTotalOrdenMayorA(BigDecimal totalOrden) {
        return ordenTrabajoRepository.findByTotalOrdenGreaterThan(totalOrden);
    }

    /**
     * Buscar órdenes de trabajo con total de orden en rango
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarConTotalOrdenEnRango(BigDecimal totalMin, BigDecimal totalMax) {
        return ordenTrabajoRepository.findByTotalOrdenBetween(totalMin, totalMax);
    }

    // ===============================
    // CONSULTAS POR ESTADO DE PAGO
    // ===============================

    /**
     * Buscar órdenes de trabajo por estado de pago
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorEstadoPago(String estadoPago) {
        return ordenTrabajoRepository.findByEstadoPago(estadoPago);
    }

    /**
     * Buscar órdenes de trabajo por estado de pago ordenadas por fecha de ingreso desc
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorEstadoPagoOrdenadas(String estadoPago) {
        return ordenTrabajoRepository.findByEstadoPagoOrderByFechaIngresoDesc(estadoPago);
    }

    /**
     * Buscar órdenes de trabajo por estado de pago (nativo)
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorEstadoPagoNativo(String estadoPago) {
        return ordenTrabajoRepository.findByEstadoPagoNative(estadoPago);
    }

    /**
     * Buscar órdenes de trabajo por múltiples estados de pago
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarPorEstadosPago(List<String> estadosPago) {
        return ordenTrabajoRepository.findByEstadoPagoIn(estadosPago);
    }

    /**
     * Obtener todos los estados de pago disponibles
     */
    @Transactional(readOnly = true)
    public List<String> obtenerTodosLosEstadosPago() {
        return ordenTrabajoRepository.findAllEstadosPago();
    }

    /**
     * Contar órdenes de trabajo por estado de pago
     */
    @Transactional(readOnly = true)
    public long contarPorEstadoPago(String estadoPago) {
        return ordenTrabajoRepository.countByEstadoPago(estadoPago);
    }

    // ===============================
    // CONSULTAS POR FECHAS DE CREACIÓN Y ACTUALIZACIÓN
    // ===============================

    /**
     * Buscar órdenes de trabajo creadas después de fecha
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarCreadasDespuesDe(LocalDateTime fechaDesde) {
        return ordenTrabajoRepository.findByCreatedAtAfter(fechaDesde);
    }

    /**
     * Buscar órdenes de trabajo creadas en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarCreadasEnRango(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return ordenTrabajoRepository.findByCreatedAtBetween(fechaDesde, fechaHasta);
    }

    /**
     * Buscar órdenes de trabajo actualizadas después de fecha
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarActualizadasDespuesDe(LocalDateTime fechaDesde) {
        return ordenTrabajoRepository.findByUpdatedAtAfter(fechaDesde);
    }

    // ===============================
    // BÚSQUEDA GENERAL
    // ===============================

    /**
     * Búsqueda general de órdenes de trabajo
     */
    @Transactional(readOnly = true)
    public List<OrdenTrabajo> buscarOrdenes(String busqueda) {
        return ordenTrabajoRepository.buscarOrdenes(busqueda);
    }

    // ===============================
    // OPERACIONES ESPECIALIZADAS
    // ===============================

    /**
     * Asignar mecánico a orden de trabajo
     */
    public OrdenTrabajo asignarMecanico(Long idOrden, Usuario mecanico) {
        Optional<OrdenTrabajo> ordenTrabajoOpt = ordenTrabajoRepository.findById(idOrden);
        if (ordenTrabajoOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la orden de trabajo con ID: " + idOrden);
        }
        
        OrdenTrabajo ordenTrabajo = ordenTrabajoOpt.get();
        ordenTrabajo.setMecanicoAsignado(mecanico);
        return ordenTrabajoRepository.save(ordenTrabajo);
    }

    /**
     * Cambiar estado de orden de trabajo
     */
    public OrdenTrabajo cambiarEstado(Long idOrden, String nuevoEstado) {
        Optional<OrdenTrabajo> ordenTrabajoOpt = ordenTrabajoRepository.findById(idOrden);
        if (ordenTrabajoOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la orden de trabajo con ID: " + idOrden);
        }
        
        OrdenTrabajo ordenTrabajo = ordenTrabajoOpt.get();
        ordenTrabajo.setEstado(nuevoEstado);
        return ordenTrabajoRepository.save(ordenTrabajo);
    }

    /**
     * Cambiar prioridad de orden de trabajo
     */
    public OrdenTrabajo cambiarPrioridad(Long idOrden, String nuevaPrioridad) {
        Optional<OrdenTrabajo> ordenTrabajoOpt = ordenTrabajoRepository.findById(idOrden);
        if (ordenTrabajoOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la orden de trabajo con ID: " + idOrden);
        }
        
        OrdenTrabajo ordenTrabajo = ordenTrabajoOpt.get();
        ordenTrabajo.setPrioridad(nuevaPrioridad);
        return ordenTrabajoRepository.save(ordenTrabajo);
    }

    /**
     * Actualizar diagnóstico de orden de trabajo
     */
    public OrdenTrabajo actualizarDiagnostico(Long idOrden, String diagnostico) {
        Optional<OrdenTrabajo> ordenTrabajoOpt = ordenTrabajoRepository.findById(idOrden);
        if (ordenTrabajoOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la orden de trabajo con ID: " + idOrden);
        }
        
        OrdenTrabajo ordenTrabajo = ordenTrabajoOpt.get();
        ordenTrabajo.setDiagnostico(diagnostico);
        return ordenTrabajoRepository.save(ordenTrabajo);
    }

    /**
     * Actualizar fecha estimada de entrega
     */
    public OrdenTrabajo actualizarFechaEstimadaEntrega(Long idOrden, LocalDate fechaEstimadaEntrega) {
        Optional<OrdenTrabajo> ordenTrabajoOpt = ordenTrabajoRepository.findById(idOrden);
        if (ordenTrabajoOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la orden de trabajo con ID: " + idOrden);
        }
        
        OrdenTrabajo ordenTrabajo = ordenTrabajoOpt.get();
        ordenTrabajo.setFechaEstimadaEntrega(fechaEstimadaEntrega);
        return ordenTrabajoRepository.save(ordenTrabajo);
    }

    /**
     * Actualizar totales de la orden
     */
    public OrdenTrabajo actualizarTotales(Long idOrden, BigDecimal totalServicios, BigDecimal totalRepuestos, BigDecimal totalOrden) {
        Optional<OrdenTrabajo> ordenTrabajoOpt = ordenTrabajoRepository.findById(idOrden);
        if (ordenTrabajoOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la orden de trabajo con ID: " + idOrden);
        }
        
        OrdenTrabajo ordenTrabajo = ordenTrabajoOpt.get();
        ordenTrabajo.setTotalServicios(totalServicios);
        ordenTrabajo.setTotalRepuestos(totalRepuestos);
        ordenTrabajo.setTotalOrden(totalOrden);
        return ordenTrabajoRepository.save(ordenTrabajo);
    }

    /**
     * Cambiar estado de pago
     */
    public OrdenTrabajo cambiarEstadoPago(Long idOrden, String nuevoEstadoPago) {
        Optional<OrdenTrabajo> ordenTrabajoOpt = ordenTrabajoRepository.findById(idOrden);
        if (ordenTrabajoOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró la orden de trabajo con ID: " + idOrden);
        }
        
        OrdenTrabajo ordenTrabajo = ordenTrabajoOpt.get();
        ordenTrabajo.setEstadoPago(nuevoEstadoPago);
        return ordenTrabajoRepository.save(ordenTrabajo);
    }
}
