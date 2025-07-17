package com.tallermoto.service;

import com.tallermoto.entity.OrdenTrabajo;
import com.tallermoto.entity.Repuesto;
import com.tallermoto.entity.RepuestoMovimiento;
import com.tallermoto.entity.UsoRepuesto;
import com.tallermoto.entity.Usuario;
import com.tallermoto.repository.UsoRepuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de uso de repuestos
 * Proporciona operaciones CRUD y lógica de negocio para la relación orden-repuestos
 */
@Service
@Transactional
public class UsoRepuestoService {

    @Autowired
    private UsoRepuestoRepository usoRepuestoRepository;

    @Autowired
    private RepuestoService repuestoService;

    @Autowired
    private RepuestoMovimientoService repuestoMovimientoService;

    @Autowired
    private OrdenTrabajoService ordenTrabajoService;

    @Autowired
    private UsuarioService usuarioService;

    // ===============================
    // OPERACIONES CRUD BÁSICAS
    // ===============================

    /**
     * Crear un nuevo uso de repuesto
     * AUTOMÁTICAMENTE descuenta el stock del repuesto utilizado
     * y registra el movimiento de inventario
     * 
     * 🔧 SOLUCIÓN ROBUSTA: Recarga la entidad desde BD para evitar datos inconsistentes
     */
    public UsoRepuesto crearUsoRepuesto(UsoRepuesto usoRepuesto) {
        // 🔧 SOLUCIÓN: Recargar la entidad desde la BD para asegurar datos frescos y consistentes
        Repuesto repuesto = usoRepuesto.getRepuesto();
        if (repuesto == null || repuesto.getIdRepuesto() == null) {
            throw new IllegalArgumentException("El repuesto es obligatorio y debe tener un ID válido");
        }
        
        // Recargar desde la base de datos para obtener datos actuales y completos
        Repuesto repuestoDesdeBD = repuestoService.obtenerRepuestoPorId(repuesto.getIdRepuesto())
            .orElseThrow(() -> new IllegalArgumentException("El repuesto con ID " + repuesto.getIdRepuesto() + " no existe"));
        
        System.out.println("🔍 Repuesto desde BD - ID: " + repuestoDesdeBD.getIdRepuesto() + 
                          ", Stock actual: " + repuestoDesdeBD.getStockActual() + 
                          ", Cantidad solicitada: " + usoRepuesto.getCantidad());
        
        // Validar stock con datos frescos de la BD
        if (repuestoDesdeBD.getStockActual() == null) {
            throw new IllegalStateException("El repuesto no tiene stock definido en la base de datos");
        }
        
        int stockAnterior = repuestoDesdeBD.getStockActual();
        
        if (stockAnterior < usoRepuesto.getCantidad()) {
            throw new IllegalArgumentException(
                String.format("Stock insuficiente. Disponible: %d, Solicitado: %d", 
                    stockAnterior, usoRepuesto.getCantidad())
            );
        }
        
        // Descontar stock automáticamente
        int nuevoStock = stockAnterior - usoRepuesto.getCantidad();
        repuestoDesdeBD.setStockActual(nuevoStock);
        repuestoService.actualizarRepuesto(repuestoDesdeBD.getIdRepuesto(), repuestoDesdeBD);
        
        // Actualizar la referencia en el UsoRepuesto con la entidad fresca
        usoRepuesto.setRepuesto(repuestoDesdeBD);
        
        // Registrar movimiento de inventario
        try {
            // Obtener número de orden completo
            String numeroOrden = "N/A";
            if (usoRepuesto.getOrdenTrabajo() != null && usoRepuesto.getOrdenTrabajo().getIdOrden() != null) {
                try {
                    OrdenTrabajo ordenCompleta = ordenTrabajoService.obtenerOrdenTrabajoPorId(
                        usoRepuesto.getOrdenTrabajo().getIdOrden()).orElse(null);
                    if (ordenCompleta != null && ordenCompleta.getNumeroOrden() != null) {
                        numeroOrden = ordenCompleta.getNumeroOrden();
                    }
                } catch (Exception e) {
                    System.err.println("Error al obtener número de orden: " + e.getMessage());
                }
            }
            
            // Obtener usuario autenticado
            Usuario usuarioAutenticado = null;
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated() 
                    && !authentication.getName().equals("anonymousUser")) {
                    // Buscar el usuario real en la base de datos por username
                    String username = authentication.getName();
                    usuarioAutenticado = usuarioService.buscarPorUsername(username).orElse(null);
                    
                    // Si no se encuentra en la BD, crear uno temporal
                    if (usuarioAutenticado == null) {
                        usuarioAutenticado = new Usuario();
                        usuarioAutenticado.setIdUsuario(1L); // ID temporal
                        usuarioAutenticado.setNombreCompleto("Usuario: " + username);
                        usuarioAutenticado.setUsername(username);
                    }
                }
            } catch (Exception e) {
                System.err.println("Error al obtener usuario autenticado: " + e.getMessage());
            }
            
            // Si no se pudo obtener el usuario autenticado, usar usuario sistema
            if (usuarioAutenticado == null) {
                usuarioAutenticado = new Usuario();
                usuarioAutenticado.setIdUsuario(1L);
                usuarioAutenticado.setNombreCompleto("Sistema");
                usuarioAutenticado.setUsername("sistema");
            }
            
            RepuestoMovimiento movimiento = new RepuestoMovimiento();
            movimiento.setRepuesto(repuestoDesdeBD);
            movimiento.setTipoMovimiento("SALIDA");
            movimiento.setCantidad(usoRepuesto.getCantidad());
            movimiento.setStockAnterior(stockAnterior);
            movimiento.setStockNuevo(nuevoStock);
            movimiento.setReferencia("Uso en orden: " + numeroOrden);
            movimiento.setFechaMovimiento(LocalDateTime.now());
            movimiento.setUsuarioMovimiento(usuarioAutenticado);
            
            repuestoMovimientoService.guardarMovimiento(movimiento);
        } catch (Exception e) {
            // Log del error pero no fallar la operación principal
            System.err.println("Error al registrar movimiento de inventario: " + e.getMessage());
        }
        
        // Calcular subtotal automáticamente si no está definido
        if (usoRepuesto.getSubtotal() == null && usoRepuesto.getPrecioUnitario() != null) {
            BigDecimal subtotal = usoRepuesto.getPrecioUnitario()
                .multiply(BigDecimal.valueOf(usoRepuesto.getCantidad()));
            usoRepuesto.setSubtotal(subtotal);
        }
        
        return usoRepuestoRepository.save(usoRepuesto);
    }

    /**
     * Obtener uso de repuesto por ID
     */
    @Transactional(readOnly = true)
    public Optional<UsoRepuesto> obtenerUsoRepuestoPorId(Long id) {
        return usoRepuestoRepository.findById(id);
    }

    /**
     * Obtener todos los usos de repuesto
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> obtenerTodosLosUsosRepuesto() {
        return usoRepuestoRepository.findAll();
    }

    /**
     * Obtener usos de repuesto con paginación
     */
    @Transactional(readOnly = true)
    public Page<UsoRepuesto> obtenerUsosRepuestoPaginados(Pageable pageable) {
        return usoRepuestoRepository.findAll(pageable);
    }

    /**
     * Actualizar uso de repuesto
     */
    public UsoRepuesto actualizarUsoRepuesto(Long id, UsoRepuesto usoRepuestoActualizado) {
        Optional<UsoRepuesto> usoRepuestoExistente = usoRepuestoRepository.findById(id);
        if (usoRepuestoExistente.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el uso de repuesto con ID: " + id);
        }

        UsoRepuesto usoRepuesto = usoRepuestoExistente.get();
        
        // Actualizar campos (el subtotal se calcula automáticamente por ser GENERATED ALWAYS)
        if (usoRepuestoActualizado.getOrdenTrabajo() != null) {
            usoRepuesto.setOrdenTrabajo(usoRepuestoActualizado.getOrdenTrabajo());
        }
        if (usoRepuestoActualizado.getRepuesto() != null) {
            usoRepuesto.setRepuesto(usoRepuestoActualizado.getRepuesto());
        }
        if (usoRepuestoActualizado.getCantidad() != null) {
            usoRepuesto.setCantidad(usoRepuestoActualizado.getCantidad());
        }
        if (usoRepuestoActualizado.getPrecioUnitario() != null) {
            usoRepuesto.setPrecioUnitario(usoRepuestoActualizado.getPrecioUnitario());
        }

        return usoRepuestoRepository.save(usoRepuesto);
    }

    /**
     * Eliminar uso de repuesto permanentemente
     */
    public void eliminarUsoRepuesto(Long id) {
        if (!usoRepuestoRepository.existsById(id)) {
            throw new IllegalArgumentException("No se encontró el uso de repuesto con ID: " + id);
        }
        usoRepuestoRepository.deleteById(id);
    }

    // ===============================
    // CONSULTAS POR ORDEN DE TRABAJO
    // ===============================

    /**
     * Buscar usos de repuesto por orden de trabajo
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorOrdenTrabajo(OrdenTrabajo ordenTrabajo) {
        return usoRepuestoRepository.findByOrdenTrabajo(ordenTrabajo);
    }

    /**
     * Buscar usos de repuesto por orden de trabajo ordenados por fecha de creación
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorOrdenTrabajoOrdenados(OrdenTrabajo ordenTrabajo) {
        return usoRepuestoRepository.findByOrdenTrabajoOrderByCreatedAt(ordenTrabajo);
    }

    /**
     * Buscar usos de repuesto por ID de orden (nativo)
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorOrdenNativo(Long idOrden) {
        return usoRepuestoRepository.findByOrdenNative(idOrden);
    }

    /**
     * Buscar usos de repuesto con repuestos activos por orden
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorOrdenConRepuestosActivos(Long idOrden) {
        return usoRepuestoRepository.findByOrdenConRepuestosActivos(idOrden);
    }

    /**
     * Buscar usos con información de repuestos por orden
     */
    @Transactional(readOnly = true)
    public List<Object[]> buscarUsosConRepuestosPorOrden(Long idOrden) {
        return usoRepuestoRepository.findUsosConRepuestosPorOrden(idOrden);
    }

    /**
     * Contar usos de repuesto por orden de trabajo
     */
    @Transactional(readOnly = true)
    public long contarPorOrdenTrabajo(OrdenTrabajo ordenTrabajo) {
        return usoRepuestoRepository.countByOrdenTrabajo(ordenTrabajo);
    }

    /**
     * Contar repuestos por orden (nativo)
     */
    @Transactional(readOnly = true)
    public long contarRepuestosPorOrden(Long idOrden) {
        return usoRepuestoRepository.contarRepuestosPorOrden(idOrden);
    }

    // ===============================
    // CONSULTAS POR REPUESTO
    // ===============================

    /**
     * Buscar usos de repuesto por repuesto
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorRepuesto(Repuesto repuesto) {
        return usoRepuestoRepository.findByRepuesto(repuesto);
    }

    /**
     * Buscar usos de repuesto por repuesto ordenados por fecha de creación
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorRepuestoOrdenados(Repuesto repuesto) {
        return usoRepuestoRepository.findByRepuestoOrderByCreatedAt(repuesto);
    }

    /**
     * Buscar usos de repuesto por ID de repuesto (nativo)
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorRepuestoNativo(Long idRepuesto) {
        return usoRepuestoRepository.findByRepuestoNative(idRepuesto);
    }

    /**
     * Buscar usos de repuesto por categoría de repuesto
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorRepuestoCategoria(String categoria) {
        return usoRepuestoRepository.findByRepuestoCategoria(categoria);
    }

    /**
     * Contar usos de repuesto por repuesto
     */
    @Transactional(readOnly = true)
    public long contarPorRepuesto(Repuesto repuesto) {
        return usoRepuestoRepository.countByRepuesto(repuesto);
    }

    // ===============================
    // CONSULTAS POR CANTIDAD
    // ===============================

    /**
     * Buscar usos de repuesto con cantidad mayor a valor
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConCantidadMayorA(Integer cantidad) {
        return usoRepuestoRepository.findByCantidadGreaterThan(cantidad);
    }

    /**
     * Buscar usos de repuesto con cantidad menor a valor
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConCantidadMenorA(Integer cantidad) {
        return usoRepuestoRepository.findByCantidadLessThan(cantidad);
    }

    /**
     * Buscar usos de repuesto con cantidad en rango
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConCantidadEnRango(Integer cantidadMin, Integer cantidadMax) {
        return usoRepuestoRepository.findByCantidadBetween(cantidadMin, cantidadMax);
    }

    /**
     * Buscar usos de repuesto con cantidad mayor o igual ordenados por cantidad desc
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConCantidadMayorIgualOrdenados(Integer cantidad) {
        return usoRepuestoRepository.findByCantidadGreaterThanEqualOrderByCantidadDesc(cantidad);
    }

    /**
     * Buscar usos de repuesto por rango de cantidad (nativo)
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorRangoCantidad(Integer cantidadMin, Integer cantidadMax) {
        return usoRepuestoRepository.findByRangoCantidad(cantidadMin, cantidadMax);
    }

    /**
     * Contar usos de repuesto con cantidad mayor a valor
     */
    @Transactional(readOnly = true)
    public long contarConCantidadMayorA(Integer cantidad) {
        return usoRepuestoRepository.countByCantidadGreaterThan(cantidad);
    }

    // ===============================
    // CONSULTAS POR PRECIO UNITARIO
    // ===============================

    /**
     * Buscar usos de repuesto con precio unitario mayor a valor
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConPrecioUnitarioMayorA(BigDecimal precioUnitario) {
        return usoRepuestoRepository.findByPrecioUnitarioGreaterThan(precioUnitario);
    }

    /**
     * Buscar usos de repuesto con precio unitario menor a valor
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConPrecioUnitarioMenorA(BigDecimal precioUnitario) {
        return usoRepuestoRepository.findByPrecioUnitarioLessThan(precioUnitario);
    }

    /**
     * Buscar usos de repuesto con precio unitario en rango
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConPrecioUnitarioEnRango(BigDecimal precioMin, BigDecimal precioMax) {
        return usoRepuestoRepository.findByPrecioUnitarioBetween(precioMin, precioMax);
    }

    /**
     * Buscar usos de repuesto con precio unitario mayor o igual ordenados por precio desc
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConPrecioUnitarioMayorIgualOrdenados(BigDecimal precioUnitario) {
        return usoRepuestoRepository.findByPrecioUnitarioGreaterThanEqualOrderByPrecioUnitarioDesc(precioUnitario);
    }

    // ===============================
    // CONSULTAS POR SUBTOTAL
    // ===============================

    /**
     * Buscar usos de repuesto con subtotal mayor a valor
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConSubtotalMayorA(BigDecimal subtotal) {
        return usoRepuestoRepository.findBySubtotalGreaterThan(subtotal);
    }

    /**
     * Buscar usos de repuesto con subtotal menor a valor
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConSubtotalMenorA(BigDecimal subtotal) {
        return usoRepuestoRepository.findBySubtotalLessThan(subtotal);
    }

    /**
     * Buscar usos de repuesto con subtotal en rango
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConSubtotalEnRango(BigDecimal subtotalMin, BigDecimal subtotalMax) {
        return usoRepuestoRepository.findBySubtotalBetween(subtotalMin, subtotalMax);
    }

    /**
     * Buscar usos de repuesto con subtotal mayor o igual ordenados por subtotal desc
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarConSubtotalMayorIgualOrdenados(BigDecimal subtotal) {
        return usoRepuestoRepository.findBySubtotalGreaterThanEqualOrderBySubtotalDesc(subtotal);
    }

    /**
     * Buscar usos de repuesto por subtotal mínimo (nativo)
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorSubtotalMinimoNativo(BigDecimal subtotalMinimo) {
        return usoRepuestoRepository.findBySubtotalMinimoNative(subtotalMinimo);
    }

    /**
     * Buscar usos con mayor subtotal desde fecha
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarUsosMayorSubtotalDesde(LocalDateTime fechaDesde) {
        return usoRepuestoRepository.findUsosMayorSubtotalDesde(fechaDesde);
    }

    /**
     * Contar usos de repuesto con subtotal mayor a valor
     */
    @Transactional(readOnly = true)
    public long contarConSubtotalMayorA(BigDecimal subtotal) {
        return usoRepuestoRepository.countBySubtotalGreaterThan(subtotal);
    }

    // ===============================
    // CONSULTAS COMBINADAS
    // ===============================

    /**
     * Buscar usos de repuesto por orden de trabajo con cantidad mínima
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorOrdenTrabajoConCantidadMinima(OrdenTrabajo ordenTrabajo, Integer cantidad) {
        return usoRepuestoRepository.findByOrdenTrabajoAndCantidadGreaterThan(ordenTrabajo, cantidad);
    }

    /**
     * Buscar usos de repuesto por repuesto con cantidad mínima
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorRepuestoConCantidadMinima(Repuesto repuesto, Integer cantidad) {
        return usoRepuestoRepository.findByRepuestoAndCantidadGreaterThan(repuesto, cantidad);
    }

    /**
     * Buscar usos de repuesto por orden de trabajo con subtotal en rango
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorOrdenTrabajoConSubtotalEnRango(OrdenTrabajo ordenTrabajo, BigDecimal subtotalMin, BigDecimal subtotalMax) {
        return usoRepuestoRepository.findByOrdenTrabajoAndSubtotalBetween(ordenTrabajo, subtotalMin, subtotalMax);
    }

    /**
     * Buscar usos de repuesto por repuesto con precio unitario en rango
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarPorRepuestoConPrecioUnitarioEnRango(Repuesto repuesto, BigDecimal precioMin, BigDecimal precioMax) {
        return usoRepuestoRepository.findByRepuestoAndPrecioUnitarioBetween(repuesto, precioMin, precioMax);
    }

    // ===============================
    // CONSULTAS POR FECHAS DE CREACIÓN
    // ===============================

    /**
     * Buscar usos de repuesto creados después de fecha
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarCreadosDespuesDe(LocalDateTime fechaDesde) {
        return usoRepuestoRepository.findByCreatedAtAfter(fechaDesde);
    }

    /**
     * Buscar usos de repuesto creados en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarCreadosEnRango(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return usoRepuestoRepository.findByCreatedAtBetween(fechaDesde, fechaHasta);
    }

    /**
     * Buscar usos de repuesto creados después de fecha ordenados por fecha desc
     */
    @Transactional(readOnly = true)
    public List<UsoRepuesto> buscarCreadosDespuesDeOrdenados(LocalDateTime fechaDesde) {
        return usoRepuestoRepository.findByCreatedAtAfterOrderByCreatedAtDesc(fechaDesde);
    }

    // ===============================
    // CÁLCULOS Y OPERACIONES ESPECIALIZADAS
    // ===============================

    /**
     * Calcular total de repuestos por orden
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalRepuestosPorOrden(Long idOrden) {
        BigDecimal total = usoRepuestoRepository.calcularTotalRepuestosPorOrden(idOrden);
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Calcular cantidad total usada por repuesto
     */
    @Transactional(readOnly = true)
    public Integer calcularCantidadTotalUsadaPorRepuesto(Long idRepuesto) {
        Integer total = usoRepuestoRepository.calcularCantidadTotalUsadaPorRepuesto(idRepuesto);
        return total != null ? total : 0;
    }

    /**
     * Agregar repuesto a orden de trabajo
     */
    public UsoRepuesto agregarRepuestoAOrden(OrdenTrabajo ordenTrabajo, Repuesto repuesto, Integer cantidad, BigDecimal precioUnitario) {
        UsoRepuesto usoRepuesto = new UsoRepuesto(ordenTrabajo, repuesto, cantidad, precioUnitario);
        return usoRepuestoRepository.save(usoRepuesto);
    }

    /**
     * Actualizar cantidad de repuesto en orden
     */
    public UsoRepuesto actualizarCantidad(Long idUso, Integer nuevaCantidad) {
        Optional<UsoRepuesto> usoRepuestoOpt = usoRepuestoRepository.findById(idUso);
        if (usoRepuestoOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el uso de repuesto con ID: " + idUso);
        }
        
        UsoRepuesto usoRepuesto = usoRepuestoOpt.get();
        usoRepuesto.setCantidad(nuevaCantidad);
        return usoRepuestoRepository.save(usoRepuesto);
    }

    /**
     * Actualizar precio unitario de repuesto en orden
     */
    public UsoRepuesto actualizarPrecioUnitario(Long idUso, BigDecimal nuevoPrecio) {
        Optional<UsoRepuesto> usoRepuestoOpt = usoRepuestoRepository.findById(idUso);
        if (usoRepuestoOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el uso de repuesto con ID: " + idUso);
        }
        
        UsoRepuesto usoRepuesto = usoRepuestoOpt.get();
        usoRepuesto.setPrecioUnitario(nuevoPrecio);
        return usoRepuestoRepository.save(usoRepuesto);
    }

    /**
     * Obtener todos los repuestos de una orden
     */
    @Transactional(readOnly = true)
    public List<Repuesto> obtenerRepuestosDeOrden(OrdenTrabajo ordenTrabajo) {
        return usoRepuestoRepository.findByOrdenTrabajo(ordenTrabajo)
                .stream()
                .map(UsoRepuesto::getRepuesto)
                .toList();
    }

    /**
     * Eliminar todos los usos de repuesto de una orden
     */
    public void eliminarTodosLosUsosDeOrden(OrdenTrabajo ordenTrabajo) {
        List<UsoRepuesto> usos = usoRepuestoRepository.findByOrdenTrabajo(ordenTrabajo);
        usoRepuestoRepository.deleteAll(usos);
    }

    /**
     * Clonar usos de repuesto de una orden a otra orden
     */
    public List<UsoRepuesto> clonarUsosAOtraOrden(OrdenTrabajo ordenOrigen, OrdenTrabajo ordenDestino) {
        List<UsoRepuesto> usosOrigen = usoRepuestoRepository.findByOrdenTrabajo(ordenOrigen);
        List<UsoRepuesto> usosNuevos = usosOrigen.stream()
                .map(uso -> new UsoRepuesto(
                    ordenDestino,
                    uso.getRepuesto(),
                    uso.getCantidad(),
                    uso.getPrecioUnitario()
                ))
                .toList();
        
        return usoRepuestoRepository.saveAll(usosNuevos);
    }

    /**
     * Buscar uso de repuesto específico por orden y repuesto
     */
    @Transactional(readOnly = true)
    public Optional<UsoRepuesto> buscarUsoEspecifico(OrdenTrabajo ordenTrabajo, Repuesto repuesto) {
        return usoRepuestoRepository.findByOrdenTrabajo(ordenTrabajo)
                .stream()
                .filter(uso -> uso.getRepuesto().equals(repuesto))
                .findFirst();
    }

    /**
     * Incrementar cantidad de repuesto existente en orden
     */
    public UsoRepuesto incrementarCantidadRepuestoEnOrden(OrdenTrabajo ordenTrabajo, Repuesto repuesto, Integer cantidadAdicional) {
        Optional<UsoRepuesto> usoExistente = buscarUsoEspecifico(ordenTrabajo, repuesto);
        
        if (usoExistente.isPresent()) {
            // Incrementar cantidad existente
            UsoRepuesto uso = usoExistente.get();
            uso.setCantidad(uso.getCantidad() + cantidadAdicional);
            return usoRepuestoRepository.save(uso);
        } else {
            // Crear nuevo uso
            return agregarRepuestoAOrden(ordenTrabajo, repuesto, cantidadAdicional, repuesto.getPrecioUnitario());
        }
    }

    /**
     * Calcular subtotal de un uso específico (para verificación)
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularSubtotalUso(Long idUso) {
        Optional<UsoRepuesto> usoOpt = usoRepuestoRepository.findById(idUso);
        if (usoOpt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el uso de repuesto con ID: " + idUso);
        }
        
        UsoRepuesto uso = usoOpt.get();
        return uso.getPrecioUnitario().multiply(BigDecimal.valueOf(uso.getCantidad()));
    }

    /**
     * Verificar si hay stock suficiente para un repuesto
     * Obtiene el stock actual del repuesto y compara con la cantidad solicitada
     */
    public boolean verificarStock(Long idRepuesto, Integer cantidad) {
        try {
            // Obtener el repuesto con stock actual desde la base de datos
            Optional<Repuesto> repuestoOpt = repuestoService.obtenerRepuestoPorId(idRepuesto);
            if (repuestoOpt.isEmpty()) {
                return false;
            }
            
            Repuesto repuesto = repuestoOpt.get();
            Integer stockActual = repuesto.getStockActual();
            
            // Verificar si hay suficiente stock
            return stockActual != null && stockActual >= cantidad;
        } catch (Exception e) {
            // En caso de error, devolver false por seguridad
            return false;
        }
    }
}
