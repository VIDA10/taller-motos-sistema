package com.tallermoto.service;

import com.tallermoto.entity.Servicio;
import com.tallermoto.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión del catálogo de servicios del taller
 * Proporciona operaciones CRUD y lógica de negocio para servicios
 */
@Service
@Transactional
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    // =====================================================
    // OPERACIONES CRUD BÁSICAS
    // =====================================================

    /**
     * Obtener todos los servicios
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerTodos() {
        return servicioRepository.findAll();
    }

    /**
     * Obtener servicio por ID
     */
    @Transactional(readOnly = true)
    public Optional<Servicio> obtenerPorId(Long id) {
        return servicioRepository.findById(id);
    }

    /**
     * Crear nuevo servicio
     */
    public Servicio crear(Servicio servicio) {
        // Validar que código no exista
        if (servicioRepository.existsByCodigo(servicio.getCodigo())) {
            throw new IllegalArgumentException("El código ya existe: " + servicio.getCodigo());
        }

        return servicioRepository.save(servicio);
    }

    /**
     * Actualizar servicio existente
     */
    public Servicio actualizar(Long id, Servicio servicioActualizado) {
        Servicio servicioExistente = servicioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Servicio no encontrado con ID: " + id));

        // Validar código único (excluyendo el servicio actual)
        if (!servicioExistente.getCodigo().equals(servicioActualizado.getCodigo()) &&
            servicioRepository.existsByCodigoAndIdServicioNot(servicioActualizado.getCodigo(), id)) {
            throw new IllegalArgumentException("El código ya existe: " + servicioActualizado.getCodigo());
        }

        // Actualizar campos
        servicioExistente.setCodigo(servicioActualizado.getCodigo());
        servicioExistente.setNombre(servicioActualizado.getNombre());
        servicioExistente.setDescripcion(servicioActualizado.getDescripcion());
        servicioExistente.setCategoria(servicioActualizado.getCategoria());
        servicioExistente.setPrecioBase(servicioActualizado.getPrecioBase());
        servicioExistente.setTiempoEstimadoMinutos(servicioActualizado.getTiempoEstimadoMinutos());
        servicioExistente.setActivo(servicioActualizado.getActivo());

        return servicioRepository.save(servicioExistente);
    }

    /**
     * Eliminar servicio (soft delete - cambiar activo a false)
     */
    public void eliminar(Long id) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Servicio no encontrado con ID: " + id));
        
        servicio.setActivo(false);
        servicioRepository.save(servicio);
    }

    /**
     * Eliminar servicio permanentemente
     */
    public void eliminarPermanente(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new IllegalArgumentException("Servicio no encontrado con ID: " + id);
        }
        servicioRepository.deleteById(id);
    }

    // =====================================================
    // CONSULTAS POR CÓDIGO
    // =====================================================

    /**
     * Buscar servicio por código
     */
    @Transactional(readOnly = true)
    public Optional<Servicio> buscarPorCodigo(String codigo) {
        return servicioRepository.findByCodigo(codigo);
    }

    /**
     * Buscar servicio activo por código
     */
    @Transactional(readOnly = true)
    public Optional<Servicio> buscarActivoPorCodigo(String codigo) {
        return servicioRepository.findByCodigoAndActivo(codigo, true);
    }

    // =====================================================
    // CONSULTAS POR NOMBRE
    // =====================================================

    /**
     * Buscar servicios por nombre (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Servicio> buscarPorNombre(String nombre) {
        return servicioRepository.findByNombreContainingIgnoreCase(nombre);
    }

    /**
     * Buscar servicios activos por nombre (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Servicio> buscarActivosPorNombre(String nombre) {
        return servicioRepository.findByNombreContainingIgnoreCaseAndActivo(nombre, true);
    }

    // =====================================================
    // CONSULTAS POR CATEGORÍA
    // =====================================================

    /**
     * Obtener servicios por categoría
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerPorCategoria(String categoria) {
        return servicioRepository.findByCategoria(categoria);
    }

    /**
     * Obtener servicios activos por categoría
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerActivosPorCategoria(String categoria) {
        return servicioRepository.findByCategoriaAndActivo(categoria, true);
    }

    /**
     * Obtener servicios por categoría ordenados por nombre
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerPorCategoriaOrdenados(String categoria) {
        return servicioRepository.findByCategoriaOrderByNombre(categoria);
    }

    /**
     * Buscar servicios por categoría (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Servicio> buscarPorCategoria(String categoria) {
        return servicioRepository.findByCategoriaContainingIgnoreCase(categoria);
    }

    /**
     * Obtener todas las categorías activas
     */
    @Transactional(readOnly = true)
    public List<String> obtenerCategoriasActivas() {
        return servicioRepository.findAllCategoriasActivas();
    }

    /**
     * Obtener servicios por categoría ordenados por precio
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerPorCategoriaPorPrecio(String categoria) {
        return servicioRepository.findServiciosByCategoriaPorPrecio(categoria);
    }

    // =====================================================
    // CONSULTAS POR PRECIO BASE
    // =====================================================

    /**
     * Obtener servicios con precio mayor a un valor
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerConPrecioMayorA(BigDecimal precioBase) {
        return servicioRepository.findByPrecioBaseGreaterThan(precioBase);
    }

    /**
     * Obtener servicios con precio menor a un valor
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerConPrecioMenorA(BigDecimal precioBase) {
        return servicioRepository.findByPrecioBaseLessThan(precioBase);
    }

    /**
     * Obtener servicios por rango de precios
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerPorRangoPrecios(BigDecimal precioMin, BigDecimal precioMax) {
        return servicioRepository.findByPrecioBaseBetween(precioMin, precioMax);
    }

    /**
     * Obtener servicios activos con precio mayor o igual a un valor
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerActivosConPrecioMayorIgualA(BigDecimal precioBase) {
        return servicioRepository.findByPrecioBaseGreaterThanEqualAndActivo(precioBase, true);
    }

    /**
     * Obtener servicios activos con precio menor o igual a un valor
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerActivosConPrecioMenorIgualA(BigDecimal precioBase) {
        return servicioRepository.findByPrecioBaseLessThanEqualAndActivo(precioBase, true);
    }

    // =====================================================
    // CONSULTAS POR TIEMPO ESTIMADO
    // =====================================================

    /**
     * Obtener servicios con tiempo mayor a un valor
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerConTiempoMayorA(Integer tiempoEstimado) {
        return servicioRepository.findByTiempoEstimadoMinutosGreaterThan(tiempoEstimado);
    }

    /**
     * Obtener servicios con tiempo menor a un valor
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerConTiempoMenorA(Integer tiempoEstimado) {
        return servicioRepository.findByTiempoEstimadoMinutosLessThan(tiempoEstimado);
    }

    /**
     * Obtener servicios por rango de tiempo estimado
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerPorRangoTiempo(Integer tiempoMin, Integer tiempoMax) {
        return servicioRepository.findByTiempoEstimadoMinutosBetween(tiempoMin, tiempoMax);
    }

    /**
     * Obtener servicios activos con tiempo menor o igual a un valor
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerActivosConTiempoMenorIgualA(Integer tiempoEstimado) {
        return servicioRepository.findByTiempoEstimadoMinutosLessThanEqualAndActivo(tiempoEstimado, true);
    }

    // =====================================================
    // CONSULTAS POR ESTADO ACTIVO
    // =====================================================

    /**
     * Obtener servicios por estado activo
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerPorEstadoActivo(Boolean activo) {
        return servicioRepository.findByActivo(activo);
    }

    /**
     * Obtener servicios activos ordenados por categoría
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerActivosOrdenadosPorCategoria() {
        return servicioRepository.findByActivoOrderByCategoria(true);
    }

    /**
     * Obtener servicios activos ordenados por precio
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerActivosOrdenadosPorPrecio() {
        return servicioRepository.findByActivoOrderByPrecioBase(true);
    }

    /**
     * Obtener servicios activos ordenados por nombre
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerActivosOrdenadosPorNombre() {
        return servicioRepository.findByActivoOrderByNombre(true);
    }

    // =====================================================
    // CONSULTAS POR DESCRIPCIÓN
    // =====================================================

    /**
     * Buscar servicios por descripción (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Servicio> buscarPorDescripcion(String descripcion) {
        return servicioRepository.findByDescripcionContainingIgnoreCase(descripcion);
    }

    /**
     * Obtener servicios sin descripción
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerSinDescripcion() {
        return servicioRepository.findByDescripcionIsNull();
    }

    /**
     * Obtener servicios con descripción
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerConDescripcion() {
        return servicioRepository.findByDescripcionIsNotNull();
    }

    // =====================================================
    // CONSULTAS COMBINADAS
    // =====================================================

    /**
     * Buscar servicios por nombre o descripción
     */
    @Transactional(readOnly = true)
    public List<Servicio> buscarPorNombreODescripcion(String nombre, String descripcion) {
        return servicioRepository.findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(nombre, descripcion);
    }

    /**
     * Obtener servicios por categoría con precio máximo
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerPorCategoriaConPrecioMaximo(String categoria, BigDecimal precioMax) {
        return servicioRepository.findByCategoriaAndPrecioBaseLessThanEqual(categoria, precioMax);
    }

    /**
     * Obtener servicios por categoría con tiempo máximo
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerPorCategoriaConTiempoMaximo(String categoria, Integer tiempoMax) {
        return servicioRepository.findByCategoriaAndTiempoEstimadoMinutosLessThanEqual(categoria, tiempoMax);
    }

    /**
     * Búsqueda general en servicios activos
     */
    @Transactional(readOnly = true)
    public List<Servicio> buscarServiciosActivos(String busqueda) {
        return servicioRepository.buscarServiciosActivos(busqueda, true);
    }

    // =====================================================
    // VALIDACIONES
    // =====================================================

    /**
     * Verificar si existe código
     */
    @Transactional(readOnly = true)
    public boolean existeCodigo(String codigo) {
        return servicioRepository.existsByCodigo(codigo);
    }

    // =====================================================
    // CONTADORES Y ESTADÍSTICAS
    // =====================================================

    /**
     * Contar servicios por estado activo
     */
    @Transactional(readOnly = true)
    public long contarPorEstadoActivo(Boolean activo) {
        return servicioRepository.countByActivo(activo);
    }

    /**
     * Contar servicios por categoría
     */
    @Transactional(readOnly = true)
    public long contarPorCategoria(String categoria) {
        return servicioRepository.countByCategoria(categoria);
    }

    /**
     * Contar servicios activos por categoría
     */
    @Transactional(readOnly = true)
    public long contarActivosPorCategoria(String categoria) {
        return servicioRepository.countByCategoriaAndActivo(categoria, true);
    }

    /**
     * Contar servicios con precio mayor a un valor
     */
    @Transactional(readOnly = true)
    public long contarConPrecioMayorA(BigDecimal precioBase) {
        return servicioRepository.countByPrecioBaseGreaterThan(precioBase);
    }

    // =====================================================
    // CONSULTAS POR FECHAS DE CREACIÓN
    // =====================================================

    /**
     * Obtener servicios creados después de una fecha
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerCreadosDespuesDe(LocalDateTime fechaDesde) {
        return servicioRepository.findByCreatedAtAfter(fechaDesde);
    }

    /**
     * Obtener servicios creados en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerCreadosEnRango(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return servicioRepository.findByCreatedAtBetween(fechaDesde, fechaHasta);
    }

    /**
     * Obtener servicios actualizados después de una fecha
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerActualizadosDespuesDe(LocalDateTime fechaDesde) {
        return servicioRepository.findByUpdatedAtAfter(fechaDesde);
    }

    // =====================================================
    // CONSULTAS NATIVAS
    // =====================================================

    /**
     * Buscar servicio por código usando consulta nativa
     */
    @Transactional(readOnly = true)
    public Optional<Servicio> buscarPorCodigoNativo(String codigo) {
        return servicioRepository.findByCodigoNative(codigo);
    }

    /**
     * Obtener servicios activos por categoría usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerActivosPorCategoriaNativo(String categoria) {
        return servicioRepository.findByCategoriaAndActivoNative(categoria, true);
    }

    /**
     * Obtener servicios activos ordenados por categoría y nombre usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerActivosOrdenadosNativo() {
        return servicioRepository.findByActivoOrderByCategoriaAndNombreNative(true);
    }

    /**
     * Obtener servicios activos por rango de precios usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerActivosPorRangoPreciosNativo(BigDecimal precioMin, BigDecimal precioMax) {
        return servicioRepository.findByPrecioRangeAndActivoNative(precioMin, precioMax, true);
    }

    // =====================================================
    // OPERACIONES ESPECIALES
    // =====================================================

    /**
     * Cambiar estado activo de servicio
     */
    public void cambiarEstadoActivo(Long id, Boolean nuevoEstado) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Servicio no encontrado con ID: " + id));
        
        servicio.setActivo(nuevoEstado);
        servicioRepository.save(servicio);
    }

    /**
     * Actualizar precio base de servicio
     */
    public void actualizarPrecioBase(Long id, BigDecimal nuevoPrecio) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Servicio no encontrado con ID: " + id));

        if (nuevoPrecio.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El precio base no puede ser negativo");
        }
        
        servicio.setPrecioBase(nuevoPrecio);
        servicioRepository.save(servicio);
    }

    /**
     * Actualizar tiempo estimado de servicio
     */
    public void actualizarTiempoEstimado(Long id, Integer nuevoTiempo) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Servicio no encontrado con ID: " + id));

        if (nuevoTiempo <= 0) {
            throw new IllegalArgumentException("El tiempo estimado debe ser mayor a 0");
        }
        
        servicio.setTiempoEstimadoMinutos(nuevoTiempo);
        servicioRepository.save(servicio);
    }

    /**
     * Actualizar código de servicio
     */
    public void actualizarCodigo(Long id, String nuevoCodigo) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Servicio no encontrado con ID: " + id));

        // Validar que el nuevo código no exista
        if (servicioRepository.existsByCodigoAndIdServicioNot(nuevoCodigo, id)) {
            throw new IllegalArgumentException("El código ya existe: " + nuevoCodigo);
        }
        
        servicio.setCodigo(nuevoCodigo);
        servicioRepository.save(servicio);
    }

    /**
     * Actualizar categoría de servicio
     */
    public void actualizarCategoria(Long id, String nuevaCategoria) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Servicio no encontrado con ID: " + id));
        
        servicio.setCategoria(nuevaCategoria);
        servicioRepository.save(servicio);
    }

    /**
     * Actualizar descripción de servicio
     */
    public void actualizarDescripcion(Long id, String nuevaDescripcion) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Servicio no encontrado con ID: " + id));
        
        servicio.setDescripcion(nuevaDescripcion);
        servicioRepository.save(servicio);
    }

    /**
     * Actualizar múltiples precios por categoría
     */
    public void actualizarPreciosPorCategoria(String categoria, BigDecimal porcentajeAumento) {
        List<Servicio> servicios = servicioRepository.findByCategoriaAndActivo(categoria, true);
        
        for (Servicio servicio : servicios) {
            BigDecimal nuevoPrecio = servicio.getPrecioBase()
                    .multiply(BigDecimal.ONE.add(porcentajeAumento.divide(BigDecimal.valueOf(100))));
            servicio.setPrecioBase(nuevoPrecio);
        }
        
        servicioRepository.saveAll(servicios);
    }

    /**
     * Obtener servicios más solicitados (basado en datos del schema inicial)
     */
    @Transactional(readOnly = true)
    public List<Servicio> obtenerServiciosBasicos() {
        // Servicios comunes del taller según datos iniciales del schema
        List<String> codigosBasicos = List.of("MAN001", "MAN002", "MAN003", "REP001", "ELE001");
        return codigosBasicos.stream()
                .map(codigo -> servicioRepository.findByCodigo(codigo))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
    }
}
