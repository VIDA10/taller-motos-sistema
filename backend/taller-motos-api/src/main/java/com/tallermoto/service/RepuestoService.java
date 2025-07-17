package com.tallermoto.service;

import com.tallermoto.entity.Repuesto;
import com.tallermoto.repository.RepuestoRepository;
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
 * Servicio para la gestión de repuestos
 * Proporciona operaciones CRUD y lógica de negocio para los repuestos
 */
@Service
@Transactional
public class RepuestoService {

    @Autowired
    private RepuestoRepository repuestoRepository;

    // ===============================
    // OPERACIONES CRUD BÁSICAS
    // ===============================

    /**
     * Crear un nuevo repuesto
     */
    public Repuesto crearRepuesto(Repuesto repuesto) {
        // Validar que el código no exista
        if (repuestoRepository.existsByCodigo(repuesto.getCodigo())) {
            throw new IllegalArgumentException("Ya existe un repuesto con el código: " + repuesto.getCodigo());
        }
        
        // Establecer valores por defecto si no están definidos
        if (repuesto.getStockActual() == null) {
            repuesto.setStockActual(0);
        }
        if (repuesto.getStockMinimo() == null) {
            repuesto.setStockMinimo(5);
        }
        if (repuesto.getActivo() == null) {
            repuesto.setActivo(true);
        }
        
        return repuestoRepository.save(repuesto);
    }

    /**
     * Obtener repuesto por ID
     */
    @Transactional(readOnly = true)
    public Optional<Repuesto> obtenerRepuestoPorId(Long id) {
        return repuestoRepository.findById(id);
    }

    /**
     * Obtener todos los repuestos
     */
    @Transactional(readOnly = true)
    public List<Repuesto> obtenerTodosLosRepuestos() {
        return repuestoRepository.findAll();
    }

    /**
     * Obtener repuestos con paginación
     */
    @Transactional(readOnly = true)
    public Page<Repuesto> obtenerRepuestosPaginados(Pageable pageable) {
        return repuestoRepository.findAll(pageable);
    }

    /**
     * Actualizar repuesto
     */
    public Repuesto actualizarRepuesto(Long id, Repuesto repuestoActualizado) {
        Optional<Repuesto> repuestoExistente = repuestoRepository.findById(id);
        if (repuestoExistente.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el repuesto con ID: " + id);
        }

        Repuesto repuesto = repuestoExistente.get();
        
        // Validar código único si se está cambiando
        if (!repuesto.getCodigo().equals(repuestoActualizado.getCodigo())) {
            if (repuestoRepository.existsByCodigoAndIdRepuestoNot(repuestoActualizado.getCodigo(), id)) {
                throw new IllegalArgumentException("Ya existe otro repuesto con el código: " + repuestoActualizado.getCodigo());
            }
        }

        // Actualizar campos
        repuesto.setCodigo(repuestoActualizado.getCodigo());
        repuesto.setNombre(repuestoActualizado.getNombre());
        repuesto.setDescripcion(repuestoActualizado.getDescripcion());
        repuesto.setCategoria(repuestoActualizado.getCategoria());
        repuesto.setStockActual(repuestoActualizado.getStockActual());
        repuesto.setStockMinimo(repuestoActualizado.getStockMinimo());
        repuesto.setPrecioUnitario(repuestoActualizado.getPrecioUnitario());
        repuesto.setActivo(repuestoActualizado.getActivo());

        return repuestoRepository.save(repuesto);
    }

    /**
     * Eliminar repuesto (soft delete - marcar como inactivo)
     */
    public void eliminarRepuesto(Long id) {
        Optional<Repuesto> repuesto = repuestoRepository.findById(id);
        if (repuesto.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el repuesto con ID: " + id);
        }
        
        Repuesto repuestoEntity = repuesto.get();
        repuestoEntity.setActivo(false);
        repuestoRepository.save(repuestoEntity);
    }

    /**
     * Eliminar repuesto permanentemente
     */
    public void eliminarRepuestoPermanente(Long id) {
        if (!repuestoRepository.existsById(id)) {
            throw new IllegalArgumentException("No se encontró el repuesto con ID: " + id);
        }
        repuestoRepository.deleteById(id);
    }

    // ===============================
    // CONSULTAS POR CÓDIGO
    // ===============================

    /**
     * Buscar repuesto por código
     */
    @Transactional(readOnly = true)
    public Optional<Repuesto> buscarPorCodigo(String codigo) {
        return repuestoRepository.findByCodigo(codigo);
    }

    /**
     * Buscar repuesto por código (nativo)
     */
    @Transactional(readOnly = true)
    public Optional<Repuesto> buscarPorCodigoNativo(String codigo) {
        return repuestoRepository.findByCodigoNative(codigo);
    }

    /**
     * Buscar repuesto por código y estado activo
     */
    @Transactional(readOnly = true)
    public Optional<Repuesto> buscarPorCodigoYActivo(String codigo, Boolean activo) {
        return repuestoRepository.findByCodigoAndActivo(codigo, activo);
    }

    /**
     * Verificar si existe un código
     */
    @Transactional(readOnly = true)
    public boolean existeCodigo(String codigo) {
        return repuestoRepository.existsByCodigo(codigo);
    }

    // ===============================
    // CONSULTAS POR NOMBRE
    // ===============================

    /**
     * Buscar repuestos por nombre (contiene, ignora mayúsculas)
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorNombre(String nombre) {
        return repuestoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    /**
     * Buscar repuestos por nombre y estado activo
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorNombreYActivo(String nombre, Boolean activo) {
        return repuestoRepository.findByNombreContainingIgnoreCaseAndActivo(nombre, activo);
    }

    // ===============================
    // CONSULTAS POR CATEGORÍA
    // ===============================

    /**
     * Buscar repuestos por categoría exacta
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorCategoria(String categoria) {
        return repuestoRepository.findByCategoria(categoria);
    }

    /**
     * Buscar repuestos por categoría y estado activo
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorCategoriaYActivo(String categoria, Boolean activo) {
        return repuestoRepository.findByCategoriaAndActivo(categoria, activo);
    }

    /**
     * Buscar repuestos por categoría ordenados por nombre
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorCategoriaOrdenadoPorNombre(String categoria) {
        return repuestoRepository.findByCategoriaOrderByNombre(categoria);
    }

    /**
     * Buscar repuestos por categoría (contiene, ignora mayúsculas)
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorCategoriaContiene(String categoria) {
        return repuestoRepository.findByCategoriaContainingIgnoreCase(categoria);
    }

    /**
     * Buscar repuestos sin categoría
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarSinCategoria() {
        return repuestoRepository.findByCategoriaIsNull();
    }

    /**
     * Buscar repuestos con categoría
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConCategoria() {
        return repuestoRepository.findByCategoriaIsNotNull();
    }

    /**
     * Obtener todas las categorías activas
     */
    @Transactional(readOnly = true)
    public List<String> obtenerCategoriasActivas() {
        return repuestoRepository.findAllCategoriasActivas();
    }

    /**
     * Buscar repuestos por categoría ordenados por stock (nativo)
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorCategoriaPorStock(String categoria) {
        return repuestoRepository.findRepuestosByCategoriaPorStock(categoria);
    }

    /**
     * Buscar repuestos por categoría y estado activo (nativo)
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorCategoriaYActivoNativo(String categoria, Boolean activo) {
        return repuestoRepository.findByCategoriaAndActivoNative(categoria, activo);
    }

    // ===============================
    // CONSULTAS POR STOCK
    // ===============================

    /**
     * Buscar repuestos con stock actual mayor a cantidad
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConStockMayorA(Integer stockActual) {
        return repuestoRepository.findByStockActualGreaterThan(stockActual);
    }

    /**
     * Buscar repuestos con stock actual menor a cantidad
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConStockMenorA(Integer stockActual) {
        return repuestoRepository.findByStockActualLessThan(stockActual);
    }

    /**
     * Buscar repuestos con stock actual en rango
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConStockEnRango(Integer stockMin, Integer stockMax) {
        return repuestoRepository.findByStockActualBetween(stockMin, stockMax);
    }

    /**
     * Buscar repuestos con stock actual mayor a cantidad y activos
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConStockMayorAYActivo(Integer stockActual, Boolean activo) {
        return repuestoRepository.findByStockActualGreaterThanAndActivo(stockActual, activo);
    }

    /**
     * Buscar repuestos con stock actual exacto
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConStockExacto(Integer stockActual) {
        return repuestoRepository.findByStockActualEquals(stockActual);
    }

    /**
     * Buscar repuestos sin stock (stock = 0)
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarSinStock() {
        return repuestoRepository.findRepuestosSinStock();
    }

    /**
     * Buscar repuestos con stock limitado
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConStockLimitado(Integer cantidad) {
        return repuestoRepository.findRepuestosConStockLimitado(cantidad);
    }

    // ===============================
    // CONSULTAS POR STOCK MÍNIMO
    // ===============================

    /**
     * Buscar repuestos con stock mínimo mayor a cantidad
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConStockMinimoMayorA(Integer stockMinimo) {
        return repuestoRepository.findByStockMinimoGreaterThan(stockMinimo);
    }

    /**
     * Buscar repuestos con stock mínimo menor a cantidad
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConStockMinimoMenorA(Integer stockMinimo) {
        return repuestoRepository.findByStockMinimoLessThan(stockMinimo);
    }

    /**
     * Buscar repuestos con stock mínimo en rango
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConStockMinimoEnRango(Integer stockMin, Integer stockMax) {
        return repuestoRepository.findByStockMinimoBetween(stockMin, stockMax);
    }

    // ===============================
    // CONSULTAS DE STOCK BAJO
    // ===============================

    /**
     * Buscar repuestos con stock bajo (stock actual <= stock mínimo)
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarRepuestosConStockBajo(Boolean activo) {
        return repuestoRepository.findRepuestosConStockBajo(activo);
    }

    /**
     * Buscar repuestos activos con stock bajo
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarRepuestosActivosConStockBajo() {
        return repuestoRepository.findRepuestosConStockBajoActivos();
    }

    /**
     * Buscar repuestos con stock bajo (nativo)
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarRepuestosConStockBajoNativo(Boolean activo) {
        return repuestoRepository.findRepuestosStockBajoNative(activo);
    }

    /**
     * Contar repuestos con stock bajo
     */
    @Transactional(readOnly = true)
    public long contarRepuestosConStockBajo(Boolean activo) {
        return repuestoRepository.countRepuestosConStockBajo(activo);
    }

    // ===============================
    // CONSULTAS POR PRECIO
    // ===============================

    /**
     * Buscar repuestos con precio mayor a cantidad
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConPrecioMayorA(BigDecimal precioUnitario) {
        return repuestoRepository.findByPrecioUnitarioGreaterThan(precioUnitario);
    }

    /**
     * Buscar repuestos con precio menor a cantidad
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConPrecioMenorA(BigDecimal precioUnitario) {
        return repuestoRepository.findByPrecioUnitarioLessThan(precioUnitario);
    }

    /**
     * Buscar repuestos con precio en rango
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConPrecioEnRango(BigDecimal precioMin, BigDecimal precioMax) {
        return repuestoRepository.findByPrecioUnitarioBetween(precioMin, precioMax);
    }

    /**
     * Buscar repuestos con precio mayor o igual y activos
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConPrecioMayorIgualYActivo(BigDecimal precioUnitario, Boolean activo) {
        return repuestoRepository.findByPrecioUnitarioGreaterThanEqualAndActivo(precioUnitario, activo);
    }

    // ===============================
    // CONSULTAS POR ESTADO ACTIVO
    // ===============================

    /**
     * Buscar repuestos por estado activo
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorActivo(Boolean activo) {
        return repuestoRepository.findByActivo(activo);
    }

    /**
     * Buscar repuestos por estado activo ordenados por categoría
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorActivoOrdenadoPorCategoria(Boolean activo) {
        return repuestoRepository.findByActivoOrderByCategoria(activo);
    }

    /**
     * Buscar repuestos por estado activo ordenados por nombre
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorActivoOrdenadoPorNombre(Boolean activo) {
        return repuestoRepository.findByActivoOrderByNombre(activo);
    }

    /**
     * Buscar repuestos por estado activo ordenados por stock actual
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorActivoOrdenadoPorStock(Boolean activo) {
        return repuestoRepository.findByActivoOrderByStockActual(activo);
    }

    /**
     * Buscar repuestos activos ordenados por categoría y nombre (nativo)
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarActivosOrdenadosPorCategoriaYNombre(Boolean activo) {
        return repuestoRepository.findByActivoOrderByCategoriaAndNombreNative(activo);
    }

    // ===============================
    // CONSULTAS POR DESCRIPCIÓN
    // ===============================

    /**
     * Buscar repuestos por descripción (contiene, ignora mayúsculas)
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorDescripcion(String descripcion) {
        return repuestoRepository.findByDescripcionContainingIgnoreCase(descripcion);
    }

    /**
     * Buscar repuestos sin descripción
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarSinDescripcion() {
        return repuestoRepository.findByDescripcionIsNull();
    }

    /**
     * Buscar repuestos con descripción
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarConDescripcion() {
        return repuestoRepository.findByDescripcionIsNotNull();
    }

    // ===============================
    // CONSULTAS COMBINADAS
    // ===============================

    /**
     * Buscar repuestos por nombre o descripción
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorNombreODescripcion(String nombre, String descripcion) {
        return repuestoRepository.findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(nombre, descripcion);
    }

    /**
     * Buscar repuestos por categoría con precio máximo
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorCategoriaConPrecioMaximo(String categoria, BigDecimal precioMax) {
        return repuestoRepository.findByCategoriaAndPrecioUnitarioLessThanEqual(categoria, precioMax);
    }

    /**
     * Buscar repuestos por categoría con stock mínimo
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarPorCategoriaConStockMinimo(String categoria, Integer stockMinimo) {
        return repuestoRepository.findByCategoriaAndStockActualGreaterThan(categoria, stockMinimo);
    }

    /**
     * Búsqueda general de repuestos activos
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarRepuestosActivos(String busqueda, Boolean activo) {
        return repuestoRepository.buscarRepuestosActivos(busqueda, activo);
    }

    // ===============================
    // CONTADORES
    // ===============================

    /**
     * Contar repuestos por estado activo
     */
    @Transactional(readOnly = true)
    public long contarPorActivo(Boolean activo) {
        return repuestoRepository.countByActivo(activo);
    }

    /**
     * Contar repuestos por categoría
     */
    @Transactional(readOnly = true)
    public long contarPorCategoria(String categoria) {
        return repuestoRepository.countByCategoria(categoria);
    }

    /**
     * Contar repuestos por categoría y estado activo
     */
    @Transactional(readOnly = true)
    public long contarPorCategoriaYActivo(String categoria, Boolean activo) {
        return repuestoRepository.countByCategoriaAndActivo(categoria, activo);
    }

    // ===============================
    // CONSULTAS POR FECHAS
    // ===============================

    /**
     * Buscar repuestos creados después de fecha
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarCreadosDespuesDe(LocalDateTime fechaDesde) {
        return repuestoRepository.findByCreatedAtAfter(fechaDesde);
    }

    /**
     * Buscar repuestos creados en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarCreadosEnRango(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return repuestoRepository.findByCreatedAtBetween(fechaDesde, fechaHasta);
    }

    /**
     * Buscar repuestos actualizados después de fecha
     */
    @Transactional(readOnly = true)
    public List<Repuesto> buscarActualizadosDespuesDe(LocalDateTime fechaDesde) {
        return repuestoRepository.findByUpdatedAtAfter(fechaDesde);
    }

    // ===============================
    // OPERACIONES DE INVENTARIO
    // ===============================

    /**
     * Actualizar stock de un repuesto
     */
    public Repuesto actualizarStock(Long id, Integer nuevoStock) {
        Optional<Repuesto> repuesto = repuestoRepository.findById(id);
        if (repuesto.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el repuesto con ID: " + id);
        }
        
        Repuesto repuestoEntity = repuesto.get();
        repuestoEntity.setStockActual(nuevoStock);
        return repuestoRepository.save(repuestoEntity);
    }

    /**
     * Incrementar stock de un repuesto
     */
    public Repuesto incrementarStock(Long id, Integer cantidad) {
        Optional<Repuesto> repuesto = repuestoRepository.findById(id);
        if (repuesto.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el repuesto con ID: " + id);
        }
        
        Repuesto repuestoEntity = repuesto.get();
        repuestoEntity.setStockActual(repuestoEntity.getStockActual() + cantidad);
        return repuestoRepository.save(repuestoEntity);
    }

    /**
     * Decrementar stock de un repuesto
     */
    public Repuesto decrementarStock(Long id, Integer cantidad) {
        Optional<Repuesto> repuesto = repuestoRepository.findById(id);
        if (repuesto.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el repuesto con ID: " + id);
        }
        
        Repuesto repuestoEntity = repuesto.get();
        int nuevoStock = repuestoEntity.getStockActual() - cantidad;
        
        if (nuevoStock < 0) {
            throw new IllegalArgumentException("No hay suficiente stock. Stock actual: " + repuestoEntity.getStockActual() + ", cantidad solicitada: " + cantidad);
        }
        
        repuestoEntity.setStockActual(nuevoStock);
        return repuestoRepository.save(repuestoEntity);
    }

    /**
     * Activar repuesto
     */
    public Repuesto activarRepuesto(Long id) {
        Optional<Repuesto> repuesto = repuestoRepository.findById(id);
        if (repuesto.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el repuesto con ID: " + id);
        }
        
        Repuesto repuestoEntity = repuesto.get();
        repuestoEntity.setActivo(true);
        return repuestoRepository.save(repuestoEntity);
    }

    /**
     * Desactivar repuesto
     */
    public Repuesto desactivarRepuesto(Long id) {
        Optional<Repuesto> repuesto = repuestoRepository.findById(id);
        if (repuesto.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el repuesto con ID: " + id);
        }
        
        Repuesto repuestoEntity = repuesto.get();
        repuestoEntity.setActivo(false);
        return repuestoRepository.save(repuestoEntity);
    }
}
