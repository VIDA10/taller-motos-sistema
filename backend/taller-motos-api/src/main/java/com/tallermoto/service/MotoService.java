package com.tallermoto.service;

import com.tallermoto.entity.Cliente;
import com.tallermoto.entity.Moto;
import com.tallermoto.repository.MotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de motos del sistema
 * Proporciona operaciones CRUD y lógica de negocio para motos
 */
@Service
@Transactional
public class MotoService {

    @Autowired
    private MotoRepository motoRepository;

    // =====================================================
    // OPERACIONES CRUD BÁSICAS
    // =====================================================

    /**
     * Obtener todas las motos
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerTodas() {
        return motoRepository.findAll();
    }

    /**
     * Obtener moto por ID
     */
    @Transactional(readOnly = true)
    public Optional<Moto> obtenerPorId(Long id) {
        return motoRepository.findById(id);
    }

    /**
     * Crear nueva moto
     */
    public Moto crear(Moto moto) {
        // Validar que placa no exista
        if (motoRepository.existsByPlaca(moto.getPlaca())) {
            throw new IllegalArgumentException("La placa ya existe: " + moto.getPlaca());
        }

        // Validar que VIN no exista (si se proporciona)
        if (moto.getVin() != null && !moto.getVin().isEmpty() && 
            motoRepository.existsByVin(moto.getVin())) {
            throw new IllegalArgumentException("El VIN ya existe: " + moto.getVin());
        }

        return motoRepository.save(moto);
    }

    /**
     * Actualizar moto existente
     */
    public Moto actualizar(Long id, Moto motoActualizada) {
        Moto motoExistente = motoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Moto no encontrada con ID: " + id));

        // Validar placa única (excluyendo la moto actual)
        if (!motoExistente.getPlaca().equals(motoActualizada.getPlaca()) &&
            motoRepository.existsByPlacaAndIdMotoNot(motoActualizada.getPlaca(), id)) {
            throw new IllegalArgumentException("La placa ya existe: " + motoActualizada.getPlaca());
        }

        // Validar VIN único (excluyendo la moto actual)
        if (motoActualizada.getVin() != null && !motoActualizada.getVin().isEmpty()) {
            if (motoExistente.getVin() == null || !motoExistente.getVin().equals(motoActualizada.getVin())) {
                if (motoRepository.existsByVinAndIdMotoNot(motoActualizada.getVin(), id)) {
                    throw new IllegalArgumentException("El VIN ya existe: " + motoActualizada.getVin());
                }
            }
        }

        // Actualizar campos
        motoExistente.setCliente(motoActualizada.getCliente());
        motoExistente.setMarca(motoActualizada.getMarca());
        motoExistente.setModelo(motoActualizada.getModelo());
        motoExistente.setAnio(motoActualizada.getAnio());
        motoExistente.setPlaca(motoActualizada.getPlaca());
        motoExistente.setVin(motoActualizada.getVin());
        motoExistente.setColor(motoActualizada.getColor());
        motoExistente.setKilometraje(motoActualizada.getKilometraje());
        motoExistente.setActivo(motoActualizada.getActivo());

        return motoRepository.save(motoExistente);
    }

    /**
     * Eliminar moto (soft delete - cambiar activo a false)
     */
    public void eliminar(Long id) {
        Moto moto = motoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Moto no encontrada con ID: " + id));
        
        moto.setActivo(false);
        motoRepository.save(moto);
    }

    /**
     * Eliminar moto permanentemente
     */
    public void eliminarPermanente(Long id) {
        if (!motoRepository.existsById(id)) {
            throw new IllegalArgumentException("Moto no encontrada con ID: " + id);
        }
        motoRepository.deleteById(id);
    }

    // =====================================================
    // CONSULTAS POR PLACA
    // =====================================================

    /**
     * Buscar moto por placa
     */
    @Transactional(readOnly = true)
    public Optional<Moto> buscarPorPlaca(String placa) {
        return motoRepository.findByPlaca(placa);
    }

    /**
     * Buscar moto activa por placa
     */
    @Transactional(readOnly = true)
    public Optional<Moto> buscarActivaPorPlaca(String placa) {
        return motoRepository.findByPlacaAndActivo(placa, true);
    }

    // =====================================================
    // CONSULTAS POR CLIENTE
    // =====================================================

    /**
     * Obtener motos por cliente
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerPorCliente(Cliente cliente) {
        return motoRepository.findByCliente(cliente);
    }

    /**
     * Obtener motos activas por cliente
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerActivasPorCliente(Cliente cliente) {
        return motoRepository.findByClienteAndActivo(cliente, true);
    }

    /**
     * Obtener motos por cliente ordenadas por fecha de creación
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerPorClienteOrdenadas(Cliente cliente) {
        return motoRepository.findByClienteOrderByCreatedAtDesc(cliente);
    }

    // =====================================================
    // CONSULTAS POR MARCA
    // =====================================================

    /**
     * Obtener motos por marca
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerPorMarca(String marca) {
        return motoRepository.findByMarca(marca);
    }

    /**
     * Obtener motos activas por marca
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerActivasPorMarca(String marca) {
        return motoRepository.findByMarcaAndActivo(marca, true);
    }

    /**
     * Buscar motos por marca (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Moto> buscarPorMarca(String marca) {
        return motoRepository.findByMarcaContainingIgnoreCase(marca);
    }

    // =====================================================
    // CONSULTAS POR MODELO
    // =====================================================

    /**
     * Obtener motos por modelo
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerPorModelo(String modelo) {
        return motoRepository.findByModelo(modelo);
    }

    /**
     * Obtener motos activas por modelo
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerActivasPorModelo(String modelo) {
        return motoRepository.findByModeloAndActivo(modelo, true);
    }

    /**
     * Buscar motos por modelo (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Moto> buscarPorModelo(String modelo) {
        return motoRepository.findByModeloContainingIgnoreCase(modelo);
    }

    // =====================================================
    // CONSULTAS POR MARCA Y MODELO
    // =====================================================

    /**
     * Obtener motos por marca y modelo
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerPorMarcaYModelo(String marca, String modelo) {
        return motoRepository.findByMarcaAndModelo(marca, modelo);
    }

    /**
     * Obtener motos activas por marca y modelo
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerActivasPorMarcaYModelo(String marca, String modelo) {
        return motoRepository.findByMarcaAndModeloAndActivo(marca, modelo, true);
    }

    // =====================================================
    // CONSULTAS POR AÑO
    // =====================================================

    /**
     * Obtener motos por año
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerPorAnio(Integer anio) {
        return motoRepository.findByAnio(anio);
    }

    /**
     * Obtener motos activas por año
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerActivasPorAnio(Integer anio) {
        return motoRepository.findByAnioAndActivo(anio, true);
    }

    /**
     * Obtener motos por rango de años
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerPorRangoAnios(Integer anioDesde, Integer anioHasta) {
        return motoRepository.findByAnioBetween(anioDesde, anioHasta);
    }

    /**
     * Obtener motos desde un año específico
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerDesdeAnio(Integer anio) {
        return motoRepository.findByAnioGreaterThanEqual(anio);
    }

    /**
     * Obtener motos hasta un año específico
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerHastaAnio(Integer anio) {
        return motoRepository.findByAnioLessThanEqual(anio);
    }

    // =====================================================
    // CONSULTAS POR VIN
    // =====================================================

    /**
     * Buscar moto por VIN
     */
    @Transactional(readOnly = true)
    public Optional<Moto> buscarPorVin(String vin) {
        return motoRepository.findByVin(vin);
    }

    /**
     * Buscar motos por VIN (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Moto> buscarPorVinContiene(String vin) {
        return motoRepository.findByVinContaining(vin);
    }

    /**
     * Buscar moto activa por VIN
     */
    @Transactional(readOnly = true)
    public Optional<Moto> buscarActivaPorVin(String vin) {
        return motoRepository.findByVinAndActivo(vin, true);
    }

    // =====================================================
    // CONSULTAS POR COLOR
    // =====================================================

    /**
     * Obtener motos por color
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerPorColor(String color) {
        return motoRepository.findByColor(color);
    }

    /**
     * Buscar motos por color (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Moto> buscarPorColor(String color) {
        return motoRepository.findByColorContainingIgnoreCase(color);
    }

    /**
     * Obtener motos sin color especificado
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerSinColor() {
        return motoRepository.findByColorIsNull();
    }

    /**
     * Obtener motos con color especificado
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerConColor() {
        return motoRepository.findByColorIsNotNull();
    }

    // =====================================================
    // CONSULTAS POR KILOMETRAJE
    // =====================================================

    /**
     * Obtener motos con kilometraje mayor a un valor
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerConKilometrajeSupA(Integer kilometraje) {
        return motoRepository.findByKilometrajeGreaterThan(kilometraje);
    }

    /**
     * Obtener motos con kilometraje menor a un valor
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerConKilometrajeInfA(Integer kilometraje) {
        return motoRepository.findByKilometrajeLessThan(kilometraje);
    }

    /**
     * Obtener motos por rango de kilometraje
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerPorRangoKilometraje(Integer kilometrajeMin, Integer kilometrajeMax) {
        return motoRepository.findByKilometrajeBetween(kilometrajeMin, kilometrajeMax);
    }

    // =====================================================
    // CONSULTAS POR ESTADO ACTIVO
    // =====================================================

    /**
     * Obtener motos por estado activo
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerPorEstadoActivo(Boolean activo) {
        return motoRepository.findByActivo(activo);
    }

    /**
     * Obtener motos activas ordenadas por marca y modelo
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerActivasOrdenadas() {
        return motoRepository.findByActivoOrderByMarcaAscModeloAsc(true);
    }

    // =====================================================
    // CONSULTAS COMBINADAS
    // =====================================================

    /**
     * Buscar motos por marca o modelo
     */
    @Transactional(readOnly = true)
    public List<Moto> buscarPorMarcaOModelo(String marca, String modelo) {
        return motoRepository.findByMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(marca, modelo);
    }

    /**
     * Búsqueda general en motos activas
     */
    @Transactional(readOnly = true)
    public List<Moto> buscarMotosActivas(String busqueda) {
        return motoRepository.buscarMotosActivas(busqueda, true);
    }

    // =====================================================
    // VALIDACIONES
    // =====================================================

    /**
     * Verificar si existe placa
     */
    @Transactional(readOnly = true)
    public boolean existePlaca(String placa) {
        return motoRepository.existsByPlaca(placa);
    }

    /**
     * Verificar si existe VIN
     */
    @Transactional(readOnly = true)
    public boolean existeVin(String vin) {
        return motoRepository.existsByVin(vin);
    }

    // =====================================================
    // CONTADORES Y ESTADÍSTICAS
    // =====================================================

    /**
     * Contar motos por estado activo
     */
    @Transactional(readOnly = true)
    public long contarPorEstadoActivo(Boolean activo) {
        return motoRepository.countByActivo(activo);
    }

    /**
     * Contar motos por cliente
     */
    @Transactional(readOnly = true)
    public long contarPorCliente(Cliente cliente) {
        return motoRepository.countByCliente(cliente);
    }

    /**
     * Contar motos activas por cliente
     */
    @Transactional(readOnly = true)
    public long contarActivasPorCliente(Cliente cliente) {
        return motoRepository.countByClienteAndActivo(cliente, true);
    }

    /**
     * Contar motos por marca
     */
    @Transactional(readOnly = true)
    public long contarPorMarca(String marca) {
        return motoRepository.countByMarca(marca);
    }

    /**
     * Contar motos por marca y modelo
     */
    @Transactional(readOnly = true)
    public long contarPorMarcaYModelo(String marca, String modelo) {
        return motoRepository.countByMarcaAndModelo(marca, modelo);
    }

    // =====================================================
    // CONSULTAS POR FECHAS DE CREACIÓN
    // =====================================================

    /**
     * Obtener motos creadas después de una fecha
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerCreadasDespuesDe(LocalDateTime fechaDesde) {
        return motoRepository.findByCreatedAtAfter(fechaDesde);
    }

    /**
     * Obtener motos creadas en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerCreadasEnRango(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return motoRepository.findByCreatedAtBetween(fechaDesde, fechaHasta);
    }

    /**
     * Obtener motos actualizadas después de una fecha
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerActualizadasDespuesDe(LocalDateTime fechaDesde) {
        return motoRepository.findByUpdatedAtAfter(fechaDesde);
    }

    // =====================================================
    // CONSULTAS NATIVAS
    // =====================================================

    /**
     * Buscar moto por placa usando consulta nativa
     */
    @Transactional(readOnly = true)
    public Optional<Moto> buscarPorPlacaNativo(String placa) {
        return motoRepository.findByPlacaNative(placa);
    }

    /**
     * Obtener motos activas por cliente usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerActivasPorClienteNativo(Long idCliente) {
        return motoRepository.findByClienteAndActivoNative(idCliente, true);
    }

    /**
     * Obtener motos activas por marca y modelo usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerActivasPorMarcaYModeloNativo(String marca, String modelo) {
        return motoRepository.findByMarcaAndModeloAndActivoNative(marca, modelo, true);
    }

    /**
     * Obtener motos activas ordenadas usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<Moto> obtenerActivasOrdenadasNativo() {
        return motoRepository.findByActivoOrderByMarcaModeloNative(true);
    }

    // =====================================================
    // OPERACIONES ESPECIALES
    // =====================================================

    /**
     * Cambiar estado activo de moto
     */
    public void cambiarEstadoActivo(Long id, Boolean nuevoEstado) {
        Moto moto = motoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Moto no encontrada con ID: " + id));
        
        moto.setActivo(nuevoEstado);
        motoRepository.save(moto);
    }

    /**
     * Actualizar kilometraje de moto
     */
    public void actualizarKilometraje(Long id, Integer nuevoKilometraje) {
        Moto moto = motoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Moto no encontrada con ID: " + id));

        if (nuevoKilometraje < 0) {
            throw new IllegalArgumentException("El kilometraje no puede ser negativo");
        }
        
        moto.setKilometraje(nuevoKilometraje);
        motoRepository.save(moto);
    }

    /**
     * Actualizar placa de moto
     */
    public void actualizarPlaca(Long id, String nuevaPlaca) {
        Moto moto = motoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Moto no encontrada con ID: " + id));

        // Validar que la nueva placa no exista
        if (motoRepository.existsByPlacaAndIdMotoNot(nuevaPlaca, id)) {
            throw new IllegalArgumentException("La placa ya existe: " + nuevaPlaca);
        }
        
        moto.setPlaca(nuevaPlaca);
        motoRepository.save(moto);
    }

    /**
     * Actualizar VIN de moto
     */
    public void actualizarVin(Long id, String nuevoVin) {
        Moto moto = motoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Moto no encontrada con ID: " + id));

        // Validar que el nuevo VIN no exista (si se proporciona)
        if (nuevoVin != null && !nuevoVin.isEmpty()) {
            if (motoRepository.existsByVinAndIdMotoNot(nuevoVin, id)) {
                throw new IllegalArgumentException("El VIN ya existe: " + nuevoVin);
            }
        }
        
        moto.setVin(nuevoVin);
        motoRepository.save(moto);
    }

    /**
     * Actualizar color de moto
     */
    public void actualizarColor(Long id, String nuevoColor) {
        Moto moto = motoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Moto no encontrada con ID: " + id));
        
        moto.setColor(nuevoColor);
        motoRepository.save(moto);
    }

    /**
     * Cambiar cliente propietario de moto
     */
    public void cambiarCliente(Long id, Cliente nuevoCliente) {
        Moto moto = motoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Moto no encontrada con ID: " + id));
        
        moto.setCliente(nuevoCliente);
        motoRepository.save(moto);
    }
}
