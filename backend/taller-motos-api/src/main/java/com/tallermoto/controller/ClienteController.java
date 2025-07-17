package com.tallermoto.controller;

import com.tallermoto.entity.Cliente;
import com.tallermoto.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para la gestión de clientes
 * Proporciona endpoints para operaciones CRUD y consultas específicas
 */
@RestController
@RequestMapping("/api/clientes")
@Tag(name = "Clientes", description = "API para gestión de clientes del sistema")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // ========== OPERACIONES CRUD ==========

    /**
     * Obtener todos los clientes
     */
    @GetMapping
    @Operation(summary = "Obtener todos los clientes", description = "Retorna la lista completa de clientes del sistema")
    @ApiResponse(responseCode = "200", description = "Lista de clientes obtenida exitosamente")
    public ResponseEntity<List<Cliente>> obtenerTodos() {
        List<Cliente> clientes = clienteService.obtenerTodos();
        return ResponseEntity.ok(clientes);
    }

    /**
     * Obtener cliente por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener cliente por ID", description = "Retorna un cliente específico por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<Cliente> obtenerPorId(@PathVariable Long id) {
        Optional<Cliente> cliente = clienteService.obtenerPorId(id);
        return cliente.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crear nuevo cliente
     */
    @PostMapping
    @Operation(summary = "Crear nuevo cliente", description = "Crea un nuevo cliente en el sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Cliente creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    public ResponseEntity<Cliente> crear(@Valid @RequestBody Cliente cliente) {
        try {
            Cliente nuevoCliente = clienteService.crear(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar cliente existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar cliente", description = "Actualiza los datos de un cliente existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    public ResponseEntity<Cliente> actualizar(@PathVariable Long id, @Valid @RequestBody Cliente cliente) {
        try {
            Cliente clienteActualizado = clienteService.actualizar(id, cliente);
            return ResponseEntity.ok(clienteActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Eliminar cliente (soft delete)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar cliente", description = "Elimina un cliente (soft delete - cambia activo a false)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Cliente eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            clienteService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Eliminar cliente permanentemente
     */
    @DeleteMapping("/{id}/permanente")
    @Operation(summary = "Eliminar cliente permanentemente", description = "Elimina un cliente de forma permanente de la base de datos")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Cliente eliminado permanentemente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<Void> eliminarPermanente(@PathVariable Long id) {
        try {
            clienteService.eliminarPermanente(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ========== CONSULTAS POR TELÉFONO ==========

    /**
     * Buscar cliente por teléfono
     */
    @GetMapping("/telefono/{telefono}")
    @Operation(summary = "Buscar cliente por teléfono", description = "Busca un cliente por su número de teléfono")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<Cliente> buscarPorTelefono(@PathVariable String telefono) {
        Optional<Cliente> cliente = clienteService.buscarPorTelefono(telefono);
        return cliente.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar clientes por teléfono que contenga el texto
     */
    @GetMapping("/telefono/contiene/{telefono}")
    @Operation(summary = "Buscar clientes por teléfono conteniendo texto", description = "Busca clientes cuyo teléfono contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de clientes encontrados")
    public ResponseEntity<List<Cliente>> buscarPorTelefonoContiene(@PathVariable String telefono) {
        List<Cliente> clientes = clienteService.buscarPorTelefonoContiene(telefono);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Buscar cliente activo por teléfono
     */
    @GetMapping("/activo/telefono/{telefono}")
    @Operation(summary = "Buscar cliente activo por teléfono", description = "Busca un cliente activo por su número de teléfono")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente activo encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente activo no encontrado")
    })
    public ResponseEntity<Cliente> buscarActivoPorTelefono(@PathVariable String telefono) {
        Optional<Cliente> cliente = clienteService.buscarActivoPorTelefono(telefono);
        return cliente.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // ========== CONSULTAS POR EMAIL ==========

    /**
     * Buscar cliente por email
     */
    @GetMapping("/email/{email}")
    @Operation(summary = "Buscar cliente por email", description = "Busca un cliente por su dirección de email")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<Cliente> buscarPorEmail(@PathVariable String email) {
        Optional<Cliente> cliente = clienteService.buscarPorEmail(email);
        return cliente.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar clientes por email que contenga el texto
     */
    @GetMapping("/email/contiene/{email}")
    @Operation(summary = "Buscar clientes por email conteniendo texto", description = "Busca clientes cuyo email contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de clientes encontrados")
    public ResponseEntity<List<Cliente>> buscarPorEmailContiene(@PathVariable String email) {
        List<Cliente> clientes = clienteService.buscarPorEmailContiene(email);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Buscar cliente activo por email
     */
    @GetMapping("/activo/email/{email}")
    @Operation(summary = "Buscar cliente activo por email", description = "Busca un cliente activo por su dirección de email")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente activo encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente activo no encontrado")
    })
    public ResponseEntity<Cliente> buscarActivoPorEmail(@PathVariable String email) {
        Optional<Cliente> cliente = clienteService.buscarActivoPorEmail(email);
        return cliente.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // ========== CONSULTAS POR DNI ==========

    /**
     * Buscar cliente por DNI
     */
    @GetMapping("/dni/{dni}")
    @Operation(summary = "Buscar cliente por DNI", description = "Busca un cliente por su número de DNI")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<Cliente> buscarPorDni(@PathVariable String dni) {
        Optional<Cliente> cliente = clienteService.buscarPorDni(dni);
        return cliente.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar cliente activo por DNI
     */
    @GetMapping("/activo/dni/{dni}")
    @Operation(summary = "Buscar cliente activo por DNI", description = "Busca un cliente activo por su número de DNI")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente activo encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente activo no encontrado")
    })
    public ResponseEntity<Cliente> buscarActivoPorDni(@PathVariable String dni) {
        Optional<Cliente> cliente = clienteService.buscarActivoPorDni(dni);
        return cliente.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // ========== CONSULTAS POR ESTADO ACTIVO ==========

    /**
     * Obtener clientes por estado activo
     */
    @GetMapping("/estado/{activo}")
    @Operation(summary = "Obtener clientes por estado", description = "Filtra clientes por su estado activo")
    @ApiResponse(responseCode = "200", description = "Lista de clientes filtrados por estado")
    public ResponseEntity<List<Cliente>> obtenerPorEstadoActivo(@PathVariable Boolean activo) {
        List<Cliente> clientes = clienteService.obtenerPorEstadoActivo(activo);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Obtener clientes activos ordenados por nombre
     */
    @GetMapping("/activos/ordenados")
    @Operation(summary = "Obtener clientes activos ordenados", description = "Retorna todos los clientes activos ordenados alfabéticamente por nombre")
    @ApiResponse(responseCode = "200", description = "Lista de clientes activos ordenados")
    public ResponseEntity<List<Cliente>> obtenerActivosOrdenadosPorNombre() {
        List<Cliente> clientes = clienteService.obtenerActivosOrdenadosPorNombre();
        return ResponseEntity.ok(clientes);
    }

    // ========== BÚSQUEDAS POR NOMBRE ==========

    /**
     * Buscar clientes por nombre (contiene texto)
     */
    @GetMapping("/buscar/nombre")
    @Operation(summary = "Buscar clientes por nombre", description = "Busca clientes cuyo nombre contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de clientes encontrados")
    public ResponseEntity<List<Cliente>> buscarPorNombre(@RequestParam String nombre) {
        List<Cliente> clientes = clienteService.buscarPorNombre(nombre);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Buscar clientes activos por nombre (contiene texto)
     */
    @GetMapping("/buscar/activos/nombre")
    @Operation(summary = "Buscar clientes activos por nombre", description = "Busca clientes activos cuyo nombre contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de clientes activos encontrados")
    public ResponseEntity<List<Cliente>> buscarActivosPorNombre(@RequestParam String nombre) {
        List<Cliente> clientes = clienteService.buscarActivosPorNombre(nombre);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Buscar clientes por nombre que comience con el texto
     */
    @GetMapping("/buscar/nombre/comienza")
    @Operation(summary = "Buscar clientes por nombre que comience con texto", description = "Busca clientes cuyo nombre comience con el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de clientes encontrados")
    public ResponseEntity<List<Cliente>> buscarPorNombreComenzando(@RequestParam String nombre) {
        List<Cliente> clientes = clienteService.buscarPorNombreComenzando(nombre);
        return ResponseEntity.ok(clientes);
    }

    // ========== CONSULTAS POR DIRECCIÓN ==========

    /**
     * Buscar clientes por dirección (contiene texto)
     */
    @GetMapping("/buscar/direccion")
    @Operation(summary = "Buscar clientes por dirección", description = "Busca clientes cuya dirección contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de clientes encontrados")
    public ResponseEntity<List<Cliente>> buscarPorDireccion(@RequestParam String direccion) {
        List<Cliente> clientes = clienteService.buscarPorDireccion(direccion);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Obtener clientes sin dirección
     */
    @GetMapping("/sin-direccion")
    @Operation(summary = "Obtener clientes sin dirección", description = "Retorna todos los clientes que no tienen dirección registrada")
    @ApiResponse(responseCode = "200", description = "Lista de clientes sin dirección")
    public ResponseEntity<List<Cliente>> obtenerSinDireccion() {
        List<Cliente> clientes = clienteService.obtenerSinDireccion();
        return ResponseEntity.ok(clientes);
    }

    /**
     * Obtener clientes con dirección
     */
    @GetMapping("/con-direccion")
    @Operation(summary = "Obtener clientes con dirección", description = "Retorna todos los clientes que tienen dirección registrada")
    @ApiResponse(responseCode = "200", description = "Lista de clientes con dirección")
    public ResponseEntity<List<Cliente>> obtenerConDireccion() {
        List<Cliente> clientes = clienteService.obtenerConDireccion();
        return ResponseEntity.ok(clientes);
    }

    // ========== CONSULTAS COMBINADAS ==========

    /**
     * Buscar clientes por nombre o teléfono
     */
    @GetMapping("/buscar/nombre-telefono")
    @Operation(summary = "Buscar clientes por nombre o teléfono", description = "Busca clientes cuyo nombre o teléfono contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de clientes encontrados")
    public ResponseEntity<List<Cliente>> buscarPorNombreOTelefono(@RequestParam String nombre, @RequestParam String telefono) {
        List<Cliente> clientes = clienteService.buscarPorNombreOTelefono(nombre, telefono);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Búsqueda general en clientes activos
     */
    @GetMapping("/buscar/activos")
    @Operation(summary = "Búsqueda general en clientes activos", description = "Busca en todos los campos de clientes activos")
    @ApiResponse(responseCode = "200", description = "Lista de clientes activos encontrados")
    public ResponseEntity<List<Cliente>> buscarClientesActivos(@RequestParam String busqueda) {
        List<Cliente> clientes = clienteService.buscarClientesActivos(busqueda);
        return ResponseEntity.ok(clientes);
    }

    // ========== VALIDACIONES ==========

    /**
     * Verificar si existe teléfono
     */
    @GetMapping("/existe/telefono/{telefono}")
    @Operation(summary = "Verificar si existe teléfono", description = "Verifica si un número de teléfono ya está registrado")
    @ApiResponse(responseCode = "200", description = "Resultado de la verificación")
    public ResponseEntity<Boolean> existeTelefono(@PathVariable String telefono) {
        boolean existe = clienteService.existeTelefono(telefono);
        return ResponseEntity.ok(existe);
    }

    /**
     * Verificar si existe email
     */
    @GetMapping("/existe/email/{email}")
    @Operation(summary = "Verificar si existe email", description = "Verifica si un email ya está registrado")
    @ApiResponse(responseCode = "200", description = "Resultado de la verificación")
    public ResponseEntity<Boolean> existeEmail(@PathVariable String email) {
        boolean existe = clienteService.existeEmail(email);
        return ResponseEntity.ok(existe);
    }

    /**
     * Verificar si existe DNI
     */
    @GetMapping("/existe/dni/{dni}")
    @Operation(summary = "Verificar si existe DNI", description = "Verifica si un DNI ya está registrado")
    @ApiResponse(responseCode = "200", description = "Resultado de la verificación")
    public ResponseEntity<Boolean> existeDni(@PathVariable String dni) {
        boolean existe = clienteService.existeDni(dni);
        return ResponseEntity.ok(existe);
    }

    // ========== CONTADORES Y ESTADÍSTICAS ==========

    /**
     * Contar clientes por estado activo
     */
    @GetMapping("/contar/estado/{activo}")
    @Operation(summary = "Contar clientes por estado", description = "Cuenta la cantidad de clientes por estado activo")
    @ApiResponse(responseCode = "200", description = "Cantidad de clientes")
    public ResponseEntity<Long> contarPorEstadoActivo(@PathVariable Boolean activo) {
        long cantidad = clienteService.contarPorEstadoActivo(activo);
        return ResponseEntity.ok(cantidad);
    }

    /**
     * Contar clientes con email
     */
    @GetMapping("/contar/con-email")
    @Operation(summary = "Contar clientes con email", description = "Cuenta la cantidad de clientes que tienen email registrado")
    @ApiResponse(responseCode = "200", description = "Cantidad de clientes con email")
    public ResponseEntity<Long> contarConEmail() {
        long cantidad = clienteService.contarConEmail();
        return ResponseEntity.ok(cantidad);
    }

    /**
     * Contar clientes con DNI
     */
    @GetMapping("/contar/con-dni")
    @Operation(summary = "Contar clientes con DNI", description = "Cuenta la cantidad de clientes que tienen DNI registrado")
    @ApiResponse(responseCode = "200", description = "Cantidad de clientes con DNI")
    public ResponseEntity<Long> contarConDni() {
        long cantidad = clienteService.contarConDni();
        return ResponseEntity.ok(cantidad);
    }

    // ========== CONSULTAS POR FECHAS DE CREACIÓN ==========

    /**
     * Obtener clientes creados después de una fecha
     */
    @GetMapping("/creados/despues-de")
    @Operation(summary = "Obtener clientes creados después de fecha", description = "Retorna clientes creados después de la fecha especificada")
    @ApiResponse(responseCode = "200", description = "Lista de clientes creados después de la fecha")
    public ResponseEntity<List<Cliente>> obtenerCreadosDespuesDe(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde) {
        List<Cliente> clientes = clienteService.obtenerCreadosDespuesDe(fechaDesde);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Obtener clientes creados en rango de fechas
     */
    @GetMapping("/creados/rango")
    @Operation(summary = "Obtener clientes creados en rango de fechas", description = "Retorna clientes creados entre las fechas especificadas")
    @ApiResponse(responseCode = "200", description = "Lista de clientes creados en el rango")
    public ResponseEntity<List<Cliente>> obtenerCreadosEnRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHasta) {
        List<Cliente> clientes = clienteService.obtenerCreadosEnRango(fechaDesde, fechaHasta);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Obtener clientes actualizados después de una fecha
     */
    @GetMapping("/actualizados/despues-de")
    @Operation(summary = "Obtener clientes actualizados después de fecha", description = "Retorna clientes actualizados después de la fecha especificada")
    @ApiResponse(responseCode = "200", description = "Lista de clientes actualizados después de la fecha")
    public ResponseEntity<List<Cliente>> obtenerActualizadosDespuesDe(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde) {
        List<Cliente> clientes = clienteService.obtenerActualizadosDespuesDe(fechaDesde);
        return ResponseEntity.ok(clientes);
    }

    // ========== CONSULTAS NATIVAS ==========

    /**
     * Buscar cliente por teléfono usando consulta nativa
     */
    @GetMapping("/nativo/telefono/{telefono}")
    @Operation(summary = "Buscar cliente por teléfono (consulta nativa)", description = "Busca un cliente por teléfono usando consulta SQL nativa")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<Cliente> buscarPorTelefonoNativo(@PathVariable String telefono) {
        Optional<Cliente> cliente = clienteService.buscarPorTelefonoNativo(telefono);
        return cliente.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar cliente por email usando consulta nativa
     */
    @GetMapping("/nativo/email/{email}")
    @Operation(summary = "Buscar cliente por email (consulta nativa)", description = "Busca un cliente por email usando consulta SQL nativa")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<Cliente> buscarPorEmailNativo(@PathVariable String email) {
        Optional<Cliente> cliente = clienteService.buscarPorEmailNativo(email);
        return cliente.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar cliente por DNI usando consulta nativa
     */
    @GetMapping("/nativo/dni/{dni}")
    @Operation(summary = "Buscar cliente por DNI (consulta nativa)", description = "Busca un cliente por DNI usando consulta SQL nativa")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<Cliente> buscarPorDniNativo(@PathVariable String dni) {
        Optional<Cliente> cliente = clienteService.buscarPorDniNativo(dni);
        return cliente.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtener clientes por estado activo usando consulta nativa
     */
    @GetMapping("/nativo/estado/{activo}")
    @Operation(summary = "Obtener clientes por estado (consulta nativa)", description = "Obtiene clientes por estado usando consulta SQL nativa")
    @ApiResponse(responseCode = "200", description = "Lista de clientes obtenida con consulta nativa")
    public ResponseEntity<List<Cliente>> obtenerPorEstadoActivoNativo(@PathVariable Boolean activo) {
        List<Cliente> clientes = clienteService.obtenerPorEstadoActivoNativo(activo);
        return ResponseEntity.ok(clientes);
    }

    // ========== OPERACIONES ESPECIALES ==========

    /**
     * Cambiar estado activo de cliente
     */
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado activo", description = "Cambia el estado activo de un cliente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estado cambiado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<Void> cambiarEstadoActivo(@PathVariable Long id, @RequestParam Boolean nuevoEstado) {
        try {
            clienteService.cambiarEstadoActivo(id, nuevoEstado);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualizar teléfono de cliente
     */
    @PatchMapping("/{id}/telefono")
    @Operation(summary = "Actualizar teléfono", description = "Actualiza el teléfono de un cliente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Teléfono actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado"),
        @ApiResponse(responseCode = "400", description = "Teléfono ya existe")
    })
    public ResponseEntity<Void> actualizarTelefono(@PathVariable Long id, @RequestParam String nuevoTelefono) {
        try {
            clienteService.actualizarTelefono(id, nuevoTelefono);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar email de cliente
     */
    @PatchMapping("/{id}/email")
    @Operation(summary = "Actualizar email", description = "Actualiza el email de un cliente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Email actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado"),
        @ApiResponse(responseCode = "400", description = "Email ya existe")
    })
    public ResponseEntity<Void> actualizarEmail(@PathVariable Long id, @RequestParam String nuevoEmail) {
        try {
            clienteService.actualizarEmail(id, nuevoEmail);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar DNI de cliente
     */
    @PatchMapping("/{id}/dni")
    @Operation(summary = "Actualizar DNI", description = "Actualiza el DNI de un cliente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "DNI actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado"),
        @ApiResponse(responseCode = "400", description = "DNI ya existe")
    })
    public ResponseEntity<Void> actualizarDni(@PathVariable Long id, @RequestParam String nuevoDni) {
        try {
            clienteService.actualizarDni(id, nuevoDni);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar dirección de cliente
     */
    @PatchMapping("/{id}/direccion")
    @Operation(summary = "Actualizar dirección", description = "Actualiza la dirección de un cliente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dirección actualizada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<Void> actualizarDireccion(@PathVariable Long id, @RequestParam String nuevaDireccion) {
        try {
            clienteService.actualizarDireccion(id, nuevaDireccion);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
