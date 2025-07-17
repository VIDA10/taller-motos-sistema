package com.tallermoto.service;

import com.tallermoto.entity.Cliente;
import com.tallermoto.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la gestión de clientes del sistema
 * Proporciona operaciones CRUD y lógica de negocio para clientes
 */
@Service
@Transactional
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    // =====================================================
    // OPERACIONES CRUD BÁSICAS
    // =====================================================

    /**
     * Obtener todos los clientes
     */
    @Transactional(readOnly = true)
    public List<Cliente> obtenerTodos() {
        return clienteRepository.findAll();
    }

    /**
     * Obtener cliente por ID
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> obtenerPorId(Long id) {
        return clienteRepository.findById(id);
    }

    /**
     * Crear nuevo cliente
     */
    public Cliente crear(Cliente cliente) {
        // Validar que teléfono no exista
        if (clienteRepository.existsByTelefono(cliente.getTelefono())) {
            throw new IllegalArgumentException("El teléfono ya existe: " + cliente.getTelefono());
        }

        // Validar que email no exista (si se proporciona)
        if (cliente.getEmail() != null && !cliente.getEmail().isEmpty() && 
            clienteRepository.existsByEmail(cliente.getEmail())) {
            throw new IllegalArgumentException("El email ya existe: " + cliente.getEmail());
        }

        // Validar que DNI no exista (si se proporciona)
        if (cliente.getDni() != null && !cliente.getDni().isEmpty() && 
            clienteRepository.existsByDni(cliente.getDni())) {
            throw new IllegalArgumentException("El DNI ya existe: " + cliente.getDni());
        }

        return clienteRepository.save(cliente);
    }

    /**
     * Actualizar cliente existente
     */
    public Cliente actualizar(Long id, Cliente clienteActualizado) {
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con ID: " + id));

        // Validar teléfono único (excluyendo el cliente actual)
        if (!clienteExistente.getTelefono().equals(clienteActualizado.getTelefono()) &&
            clienteRepository.existsByTelefonoAndIdClienteNot(clienteActualizado.getTelefono(), id)) {
            throw new IllegalArgumentException("El teléfono ya existe: " + clienteActualizado.getTelefono());
        }

        // Validar email único (excluyendo el cliente actual)
        if (clienteActualizado.getEmail() != null && !clienteActualizado.getEmail().isEmpty()) {
            if (clienteExistente.getEmail() == null || !clienteExistente.getEmail().equals(clienteActualizado.getEmail())) {
                if (clienteRepository.existsByEmailAndIdClienteNot(clienteActualizado.getEmail(), id)) {
                    throw new IllegalArgumentException("El email ya existe: " + clienteActualizado.getEmail());
                }
            }
        }

        // Validar DNI único (excluyendo el cliente actual)
        if (clienteActualizado.getDni() != null && !clienteActualizado.getDni().isEmpty()) {
            if (clienteExistente.getDni() == null || !clienteExistente.getDni().equals(clienteActualizado.getDni())) {
                if (clienteRepository.existsByDniAndIdClienteNot(clienteActualizado.getDni(), id)) {
                    throw new IllegalArgumentException("El DNI ya existe: " + clienteActualizado.getDni());
                }
            }
        }

        // Actualizar campos
        clienteExistente.setNombre(clienteActualizado.getNombre());
        clienteExistente.setTelefono(clienteActualizado.getTelefono());
        clienteExistente.setEmail(clienteActualizado.getEmail());
        clienteExistente.setDni(clienteActualizado.getDni());
        clienteExistente.setDireccion(clienteActualizado.getDireccion());
        clienteExistente.setActivo(clienteActualizado.getActivo());

        return clienteRepository.save(clienteExistente);
    }

    /**
     * Eliminar cliente (soft delete - cambiar activo a false)
     */
    public void eliminar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con ID: " + id));
        
        cliente.setActivo(false);
        clienteRepository.save(cliente);
    }

    /**
     * Eliminar cliente permanentemente
     */
    public void eliminarPermanente(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new IllegalArgumentException("Cliente no encontrado con ID: " + id);
        }
        clienteRepository.deleteById(id);
    }

    // =====================================================
    // CONSULTAS POR TELÉFONO
    // =====================================================

    /**
     * Buscar cliente por teléfono
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorTelefono(String telefono) {
        return clienteRepository.findByTelefono(telefono);
    }

    /**
     * Buscar clientes por teléfono que contenga el texto
     */
    @Transactional(readOnly = true)
    public List<Cliente> buscarPorTelefonoContiene(String telefono) {
        return clienteRepository.findByTelefonoContaining(telefono);
    }

    /**
     * Buscar cliente activo por teléfono
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarActivoPorTelefono(String telefono) {
        return clienteRepository.findByTelefonoAndActivo(telefono, true);
    }

    // =====================================================
    // CONSULTAS POR EMAIL
    // =====================================================

    /**
     * Buscar cliente por email
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorEmail(String email) {
        return clienteRepository.findByEmail(email);
    }

    /**
     * Buscar clientes por email que contenga el texto
     */
    @Transactional(readOnly = true)
    public List<Cliente> buscarPorEmailContiene(String email) {
        return clienteRepository.findByEmailContainingIgnoreCase(email);
    }

    /**
     * Buscar cliente activo por email
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarActivoPorEmail(String email) {
        return clienteRepository.findByEmailAndActivo(email, true);
    }

    // =====================================================
    // CONSULTAS POR DNI
    // =====================================================

    /**
     * Buscar cliente por DNI
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorDni(String dni) {
        return clienteRepository.findByDni(dni);
    }

    /**
     * Buscar cliente activo por DNI
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarActivoPorDni(String dni) {
        return clienteRepository.findByDniAndActivo(dni, true);
    }

    // =====================================================
    // CONSULTAS POR ESTADO ACTIVO
    // =====================================================

    /**
     * Obtener clientes por estado activo
     */
    @Transactional(readOnly = true)
    public List<Cliente> obtenerPorEstadoActivo(Boolean activo) {
        return clienteRepository.findByActivo(activo);
    }

    /**
     * Obtener clientes activos ordenados por nombre
     */
    @Transactional(readOnly = true)
    public List<Cliente> obtenerActivosOrdenadosPorNombre() {
        return clienteRepository.findByActivoOrderByNombre(true);
    }

    // =====================================================
    // BÚSQUEDAS POR NOMBRE
    // =====================================================

    /**
     * Buscar clientes por nombre (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Cliente> buscarPorNombre(String nombre) {
        return clienteRepository.findByNombreContainingIgnoreCase(nombre);
    }

    /**
     * Buscar clientes activos por nombre (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Cliente> buscarActivosPorNombre(String nombre) {
        return clienteRepository.findByNombreContainingIgnoreCaseAndActivo(nombre, true);
    }

    /**
     * Buscar clientes por nombre que comience con el texto
     */
    @Transactional(readOnly = true)
    public List<Cliente> buscarPorNombreComenzando(String nombre) {
        return clienteRepository.findByNombreStartingWithIgnoreCase(nombre);
    }

    // =====================================================
    // CONSULTAS POR DIRECCIÓN
    // =====================================================

    /**
     * Buscar clientes por dirección (contiene texto)
     */
    @Transactional(readOnly = true)
    public List<Cliente> buscarPorDireccion(String direccion) {
        return clienteRepository.findByDireccionContainingIgnoreCase(direccion);
    }

    /**
     * Obtener clientes sin dirección
     */
    @Transactional(readOnly = true)
    public List<Cliente> obtenerSinDireccion() {
        return clienteRepository.findByDireccionIsNull();
    }

    /**
     * Obtener clientes con dirección
     */
    @Transactional(readOnly = true)
    public List<Cliente> obtenerConDireccion() {
        return clienteRepository.findByDireccionIsNotNull();
    }

    // =====================================================
    // CONSULTAS COMBINADAS
    // =====================================================

    /**
     * Buscar clientes por nombre o teléfono
     */
    @Transactional(readOnly = true)
    public List<Cliente> buscarPorNombreOTelefono(String nombre, String telefono) {
        return clienteRepository.findByNombreContainingIgnoreCaseOrTelefonoContaining(nombre, telefono);
    }

    /**
     * Búsqueda general en clientes activos
     */
    @Transactional(readOnly = true)
    public List<Cliente> buscarClientesActivos(String busqueda) {
        return clienteRepository.buscarClientesActivos(busqueda, true);
    }

    // =====================================================
    // VALIDACIONES
    // =====================================================

    /**
     * Verificar si existe teléfono
     */
    @Transactional(readOnly = true)
    public boolean existeTelefono(String telefono) {
        return clienteRepository.existsByTelefono(telefono);
    }

    /**
     * Verificar si existe email
     */
    @Transactional(readOnly = true)
    public boolean existeEmail(String email) {
        return clienteRepository.existsByEmail(email);
    }

    /**
     * Verificar si existe DNI
     */
    @Transactional(readOnly = true)
    public boolean existeDni(String dni) {
        return clienteRepository.existsByDni(dni);
    }

    // =====================================================
    // CONTADORES Y ESTADÍSTICAS
    // =====================================================

    /**
     * Contar clientes por estado activo
     */
    @Transactional(readOnly = true)
    public long contarPorEstadoActivo(Boolean activo) {
        return clienteRepository.countByActivo(activo);
    }

    /**
     * Contar clientes con email
     */
    @Transactional(readOnly = true)
    public long contarConEmail() {
        return clienteRepository.countByEmailIsNotNull();
    }

    /**
     * Contar clientes con DNI
     */
    @Transactional(readOnly = true)
    public long contarConDni() {
        return clienteRepository.countByDniIsNotNull();
    }

    // =====================================================
    // CONSULTAS POR FECHAS DE CREACIÓN
    // =====================================================

    /**
     * Obtener clientes creados después de una fecha
     */
    @Transactional(readOnly = true)
    public List<Cliente> obtenerCreadosDespuesDe(LocalDateTime fechaDesde) {
        return clienteRepository.findByCreatedAtAfter(fechaDesde);
    }

    /**
     * Obtener clientes creados en rango de fechas
     */
    @Transactional(readOnly = true)
    public List<Cliente> obtenerCreadosEnRango(LocalDateTime fechaDesde, LocalDateTime fechaHasta) {
        return clienteRepository.findByCreatedAtBetween(fechaDesde, fechaHasta);
    }

    /**
     * Obtener clientes actualizados después de una fecha
     */
    @Transactional(readOnly = true)
    public List<Cliente> obtenerActualizadosDespuesDe(LocalDateTime fechaDesde) {
        return clienteRepository.findByUpdatedAtAfter(fechaDesde);
    }

    // =====================================================
    // CONSULTAS NATIVAS
    // =====================================================

    /**
     * Buscar cliente por teléfono usando consulta nativa
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorTelefonoNativo(String telefono) {
        return clienteRepository.findByTelefonoNative(telefono);
    }

    /**
     * Buscar cliente por email usando consulta nativa
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorEmailNativo(String email) {
        return clienteRepository.findByEmailNative(email);
    }

    /**
     * Buscar cliente por DNI usando consulta nativa
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorDniNativo(String dni) {
        return clienteRepository.findByDniNative(dni);
    }

    /**
     * Obtener clientes por estado activo usando consulta nativa
     */
    @Transactional(readOnly = true)
    public List<Cliente> obtenerPorEstadoActivoNativo(Boolean activo) {
        return clienteRepository.findByActivoNative(activo);
    }

    // =====================================================
    // OPERACIONES ESPECIALES
    // =====================================================

    /**
     * Cambiar estado activo de cliente
     */
    public void cambiarEstadoActivo(Long id, Boolean nuevoEstado) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con ID: " + id));
        
        cliente.setActivo(nuevoEstado);
        clienteRepository.save(cliente);
    }

    /**
     * Actualizar teléfono de cliente
     */
    public void actualizarTelefono(Long id, String nuevoTelefono) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con ID: " + id));

        // Validar que el nuevo teléfono no exista
        if (clienteRepository.existsByTelefonoAndIdClienteNot(nuevoTelefono, id)) {
            throw new IllegalArgumentException("El teléfono ya existe: " + nuevoTelefono);
        }
        
        cliente.setTelefono(nuevoTelefono);
        clienteRepository.save(cliente);
    }

    /**
     * Actualizar email de cliente
     */
    public void actualizarEmail(Long id, String nuevoEmail) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con ID: " + id));

        // Validar que el nuevo email no exista (si se proporciona)
        if (nuevoEmail != null && !nuevoEmail.isEmpty()) {
            if (clienteRepository.existsByEmailAndIdClienteNot(nuevoEmail, id)) {
                throw new IllegalArgumentException("El email ya existe: " + nuevoEmail);
            }
        }
        
        cliente.setEmail(nuevoEmail);
        clienteRepository.save(cliente);
    }

    /**
     * Actualizar DNI de cliente
     */
    public void actualizarDni(Long id, String nuevoDni) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con ID: " + id));

        // Validar que el nuevo DNI no exista (si se proporciona)
        if (nuevoDni != null && !nuevoDni.isEmpty()) {
            if (clienteRepository.existsByDniAndIdClienteNot(nuevoDni, id)) {
                throw new IllegalArgumentException("El DNI ya existe: " + nuevoDni);
            }
        }
        
        cliente.setDni(nuevoDni);
        clienteRepository.save(cliente);
    }

    /**
     * Actualizar dirección de cliente
     */
    public void actualizarDireccion(Long id, String nuevaDireccion) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con ID: " + id));
        
        cliente.setDireccion(nuevaDireccion);
        clienteRepository.save(cliente);
    }
}
