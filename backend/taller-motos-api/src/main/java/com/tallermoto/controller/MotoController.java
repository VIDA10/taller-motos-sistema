package com.tallermoto.controller;

import com.tallermoto.entity.Cliente;
import com.tallermoto.entity.Moto;
import com.tallermoto.service.MotoService;
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
 * Controlador REST para la gestión de motos
 * Proporciona endpoints para operaciones CRUD y consultas específicas
 */
@RestController
@RequestMapping("/api/motos")
@Tag(name = "Motos", description = "API para gestión de motos del sistema")
public class MotoController {

    @Autowired
    private MotoService motoService;

    // ========== OPERACIONES CRUD ==========

    /**
     * Obtener todas las motos
     */
    @GetMapping
    @Operation(summary = "Obtener todas las motos", description = "Retorna la lista completa de motos del sistema")
    @ApiResponse(responseCode = "200", description = "Lista de motos obtenida exitosamente")
    public ResponseEntity<List<Moto>> obtenerTodas() {
        List<Moto> motos = motoService.obtenerTodas();
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener moto por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener moto por ID", description = "Retorna una moto específica por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Moto encontrada"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada")
    })
    public ResponseEntity<Moto> obtenerPorId(@PathVariable Long id) {
        Optional<Moto> moto = motoService.obtenerPorId(id);
        return moto.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crear nueva moto
     */
    @PostMapping
    @Operation(summary = "Crear nueva moto", description = "Crea una nueva moto en el sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Moto creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    public ResponseEntity<Moto> crear(@Valid @RequestBody Moto moto) {
        try {
            Moto nuevaMoto = motoService.crear(moto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaMoto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar moto existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar moto", description = "Actualiza los datos de una moto existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Moto actualizada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    public ResponseEntity<Moto> actualizar(@PathVariable Long id, @Valid @RequestBody Moto moto) {
        try {
            Moto motoActualizada = motoService.actualizar(id, moto);
            return ResponseEntity.ok(motoActualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Eliminar moto (soft delete)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar moto", description = "Elimina una moto (soft delete - cambia activo a false)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Moto eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada")
    })
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            motoService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Eliminar moto permanentemente
     */
    @DeleteMapping("/{id}/permanente")
    @Operation(summary = "Eliminar moto permanentemente", description = "Elimina una moto de forma permanente de la base de datos")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Moto eliminada permanentemente"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada")
    })
    public ResponseEntity<Void> eliminarPermanente(@PathVariable Long id) {
        try {
            motoService.eliminarPermanente(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ========== CONSULTAS POR PLACA ==========

    /**
     * Buscar moto por placa
     */
    @GetMapping("/placa/{placa}")
    @Operation(summary = "Buscar moto por placa", description = "Busca una moto por su número de placa")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Moto encontrada"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada")
    })
    public ResponseEntity<Moto> buscarPorPlaca(@PathVariable String placa) {
        Optional<Moto> moto = motoService.buscarPorPlaca(placa);
        return moto.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar moto activa por placa
     */
    @GetMapping("/activa/placa/{placa}")
    @Operation(summary = "Buscar moto activa por placa", description = "Busca una moto activa por su número de placa")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Moto activa encontrada"),
        @ApiResponse(responseCode = "404", description = "Moto activa no encontrada")
    })
    public ResponseEntity<Moto> buscarActivaPorPlaca(@PathVariable String placa) {
        Optional<Moto> moto = motoService.buscarActivaPorPlaca(placa);
        return moto.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    // ========== CONSULTAS POR CLIENTE ==========

    /**
     * Obtener motos por cliente
     */
    @PostMapping("/cliente")
    @Operation(summary = "Obtener motos por cliente", description = "Retorna todas las motos de un cliente específico")
    @ApiResponse(responseCode = "200", description = "Lista de motos del cliente")
    public ResponseEntity<List<Moto>> obtenerPorCliente(@RequestBody Cliente cliente) {
        List<Moto> motos = motoService.obtenerPorCliente(cliente);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos activas por cliente
     */
    @PostMapping("/activas/cliente")
    @Operation(summary = "Obtener motos activas por cliente", description = "Retorna todas las motos activas de un cliente específico")
    @ApiResponse(responseCode = "200", description = "Lista de motos activas del cliente")
    public ResponseEntity<List<Moto>> obtenerActivasPorCliente(@RequestBody Cliente cliente) {
        List<Moto> motos = motoService.obtenerActivasPorCliente(cliente);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos por cliente ordenadas por fecha de creación
     */
    @PostMapping("/cliente/ordenadas")
    @Operation(summary = "Obtener motos por cliente ordenadas", description = "Retorna las motos de un cliente ordenadas por fecha de creación")
    @ApiResponse(responseCode = "200", description = "Lista de motos del cliente ordenadas")
    public ResponseEntity<List<Moto>> obtenerPorClienteOrdenadas(@RequestBody Cliente cliente) {
        List<Moto> motos = motoService.obtenerPorClienteOrdenadas(cliente);
        return ResponseEntity.ok(motos);
    }

    // ========== CONSULTAS POR MARCA ==========

    /**
     * Obtener motos por marca
     */
    @GetMapping("/marca/{marca}")
    @Operation(summary = "Obtener motos por marca", description = "Retorna todas las motos de una marca específica")
    @ApiResponse(responseCode = "200", description = "Lista de motos de la marca")
    public ResponseEntity<List<Moto>> obtenerPorMarca(@PathVariable String marca) {
        List<Moto> motos = motoService.obtenerPorMarca(marca);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos activas por marca
     */
    @GetMapping("/activas/marca/{marca}")
    @Operation(summary = "Obtener motos activas por marca", description = "Retorna todas las motos activas de una marca específica")
    @ApiResponse(responseCode = "200", description = "Lista de motos activas de la marca")
    public ResponseEntity<List<Moto>> obtenerActivasPorMarca(@PathVariable String marca) {
        List<Moto> motos = motoService.obtenerActivasPorMarca(marca);
        return ResponseEntity.ok(motos);
    }

    /**
     * Buscar motos por marca (contiene texto)
     */
    @GetMapping("/buscar/marca")
    @Operation(summary = "Buscar motos por marca", description = "Busca motos cuya marca contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de motos encontradas")
    public ResponseEntity<List<Moto>> buscarPorMarca(@RequestParam String marca) {
        List<Moto> motos = motoService.buscarPorMarca(marca);
        return ResponseEntity.ok(motos);
    }

    // ========== CONSULTAS POR MODELO ==========

    /**
     * Obtener motos por modelo
     */
    @GetMapping("/modelo/{modelo}")
    @Operation(summary = "Obtener motos por modelo", description = "Retorna todas las motos de un modelo específico")
    @ApiResponse(responseCode = "200", description = "Lista de motos del modelo")
    public ResponseEntity<List<Moto>> obtenerPorModelo(@PathVariable String modelo) {
        List<Moto> motos = motoService.obtenerPorModelo(modelo);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos activas por modelo
     */
    @GetMapping("/activas/modelo/{modelo}")
    @Operation(summary = "Obtener motos activas por modelo", description = "Retorna todas las motos activas de un modelo específico")
    @ApiResponse(responseCode = "200", description = "Lista de motos activas del modelo")
    public ResponseEntity<List<Moto>> obtenerActivasPorModelo(@PathVariable String modelo) {
        List<Moto> motos = motoService.obtenerActivasPorModelo(modelo);
        return ResponseEntity.ok(motos);
    }

    /**
     * Buscar motos por modelo (contiene texto)
     */
    @GetMapping("/buscar/modelo")
    @Operation(summary = "Buscar motos por modelo", description = "Busca motos cuyo modelo contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de motos encontradas")
    public ResponseEntity<List<Moto>> buscarPorModelo(@RequestParam String modelo) {
        List<Moto> motos = motoService.buscarPorModelo(modelo);
        return ResponseEntity.ok(motos);
    }

    // ========== CONSULTAS POR MARCA Y MODELO ==========

    /**
     * Obtener motos por marca y modelo
     */
    @GetMapping("/marca/{marca}/modelo/{modelo}")
    @Operation(summary = "Obtener motos por marca y modelo", description = "Retorna todas las motos de una marca y modelo específicos")
    @ApiResponse(responseCode = "200", description = "Lista de motos de la marca y modelo")
    public ResponseEntity<List<Moto>> obtenerPorMarcaYModelo(@PathVariable String marca, @PathVariable String modelo) {
        List<Moto> motos = motoService.obtenerPorMarcaYModelo(marca, modelo);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos activas por marca y modelo
     */
    @GetMapping("/activas/marca/{marca}/modelo/{modelo}")
    @Operation(summary = "Obtener motos activas por marca y modelo", description = "Retorna todas las motos activas de una marca y modelo específicos")
    @ApiResponse(responseCode = "200", description = "Lista de motos activas de la marca y modelo")
    public ResponseEntity<List<Moto>> obtenerActivasPorMarcaYModelo(@PathVariable String marca, @PathVariable String modelo) {
        List<Moto> motos = motoService.obtenerActivasPorMarcaYModelo(marca, modelo);
        return ResponseEntity.ok(motos);
    }

    // ========== CONSULTAS POR AÑO ==========

    /**
     * Obtener motos por año
     */
    @GetMapping("/anio/{anio}")
    @Operation(summary = "Obtener motos por año", description = "Retorna todas las motos de un año específico")
    @ApiResponse(responseCode = "200", description = "Lista de motos del año")
    public ResponseEntity<List<Moto>> obtenerPorAnio(@PathVariable Integer anio) {
        List<Moto> motos = motoService.obtenerPorAnio(anio);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos activas por año
     */
    @GetMapping("/activas/anio/{anio}")
    @Operation(summary = "Obtener motos activas por año", description = "Retorna todas las motos activas de un año específico")
    @ApiResponse(responseCode = "200", description = "Lista de motos activas del año")
    public ResponseEntity<List<Moto>> obtenerActivasPorAnio(@PathVariable Integer anio) {
        List<Moto> motos = motoService.obtenerActivasPorAnio(anio);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos por rango de años
     */
    @GetMapping("/anio/rango")
    @Operation(summary = "Obtener motos por rango de años", description = "Retorna motos entre los años especificados")
    @ApiResponse(responseCode = "200", description = "Lista de motos en el rango de años")
    public ResponseEntity<List<Moto>> obtenerPorRangoAnios(@RequestParam Integer anioDesde, @RequestParam Integer anioHasta) {
        List<Moto> motos = motoService.obtenerPorRangoAnios(anioDesde, anioHasta);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos desde un año específico
     */
    @GetMapping("/anio/desde/{anio}")
    @Operation(summary = "Obtener motos desde año", description = "Retorna motos desde el año especificado en adelante")
    @ApiResponse(responseCode = "200", description = "Lista de motos desde el año")
    public ResponseEntity<List<Moto>> obtenerDesdeAnio(@PathVariable Integer anio) {
        List<Moto> motos = motoService.obtenerDesdeAnio(anio);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos hasta un año específico
     */
    @GetMapping("/anio/hasta/{anio}")
    @Operation(summary = "Obtener motos hasta año", description = "Retorna motos hasta el año especificado")
    @ApiResponse(responseCode = "200", description = "Lista de motos hasta el año")
    public ResponseEntity<List<Moto>> obtenerHastaAnio(@PathVariable Integer anio) {
        List<Moto> motos = motoService.obtenerHastaAnio(anio);
        return ResponseEntity.ok(motos);
    }

    // ========== CONSULTAS POR VIN ==========

    /**
     * Buscar moto por VIN
     */
    @GetMapping("/vin/{vin}")
    @Operation(summary = "Buscar moto por VIN", description = "Busca una moto por su número VIN")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Moto encontrada"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada")
    })
    public ResponseEntity<Moto> buscarPorVin(@PathVariable String vin) {
        Optional<Moto> moto = motoService.buscarPorVin(vin);
        return moto.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar motos por VIN (contiene texto)
     */
    @GetMapping("/vin/contiene/{vin}")
    @Operation(summary = "Buscar motos por VIN conteniendo texto", description = "Busca motos cuyo VIN contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de motos encontradas")
    public ResponseEntity<List<Moto>> buscarPorVinContiene(@PathVariable String vin) {
        List<Moto> motos = motoService.buscarPorVinContiene(vin);
        return ResponseEntity.ok(motos);
    }

    /**
     * Buscar moto activa por VIN
     */
    @GetMapping("/activa/vin/{vin}")
    @Operation(summary = "Buscar moto activa por VIN", description = "Busca una moto activa por su número VIN")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Moto activa encontrada"),
        @ApiResponse(responseCode = "404", description = "Moto activa no encontrada")
    })
    public ResponseEntity<Moto> buscarActivaPorVin(@PathVariable String vin) {
        Optional<Moto> moto = motoService.buscarActivaPorVin(vin);
        return moto.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    // ========== CONSULTAS POR COLOR ==========

    /**
     * Obtener motos por color
     */
    @GetMapping("/color/{color}")
    @Operation(summary = "Obtener motos por color", description = "Retorna todas las motos de un color específico")
    @ApiResponse(responseCode = "200", description = "Lista de motos del color")
    public ResponseEntity<List<Moto>> obtenerPorColor(@PathVariable String color) {
        List<Moto> motos = motoService.obtenerPorColor(color);
        return ResponseEntity.ok(motos);
    }

    /**
     * Buscar motos por color (contiene texto)
     */
    @GetMapping("/buscar/color")
    @Operation(summary = "Buscar motos por color", description = "Busca motos cuyo color contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de motos encontradas")
    public ResponseEntity<List<Moto>> buscarPorColor(@RequestParam String color) {
        List<Moto> motos = motoService.buscarPorColor(color);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos sin color especificado
     */
    @GetMapping("/sin-color")
    @Operation(summary = "Obtener motos sin color", description = "Retorna todas las motos que no tienen color especificado")
    @ApiResponse(responseCode = "200", description = "Lista de motos sin color")
    public ResponseEntity<List<Moto>> obtenerSinColor() {
        List<Moto> motos = motoService.obtenerSinColor();
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos con color especificado
     */
    @GetMapping("/con-color")
    @Operation(summary = "Obtener motos con color", description = "Retorna todas las motos que tienen color especificado")
    @ApiResponse(responseCode = "200", description = "Lista de motos con color")
    public ResponseEntity<List<Moto>> obtenerConColor() {
        List<Moto> motos = motoService.obtenerConColor();
        return ResponseEntity.ok(motos);
    }

    // ========== CONSULTAS POR KILOMETRAJE ==========

    /**
     * Obtener motos con kilometraje mayor a un valor
     */
    @GetMapping("/kilometraje/mayor/{kilometraje}")
    @Operation(summary = "Obtener motos con alto kilometraje", description = "Retorna motos con kilometraje mayor al especificado")
    @ApiResponse(responseCode = "200", description = "Lista de motos con alto kilometraje")
    public ResponseEntity<List<Moto>> obtenerConKilometrajeSupA(@PathVariable Integer kilometraje) {
        List<Moto> motos = motoService.obtenerConKilometrajeSupA(kilometraje);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos con kilometraje menor a un valor
     */
    @GetMapping("/kilometraje/menor/{kilometraje}")
    @Operation(summary = "Obtener motos con bajo kilometraje", description = "Retorna motos con kilometraje menor al especificado")
    @ApiResponse(responseCode = "200", description = "Lista de motos con bajo kilometraje")
    public ResponseEntity<List<Moto>> obtenerConKilometrajeInfA(@PathVariable Integer kilometraje) {
        List<Moto> motos = motoService.obtenerConKilometrajeInfA(kilometraje);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos por rango de kilometraje
     */
    @GetMapping("/kilometraje/rango")
    @Operation(summary = "Obtener motos por rango de kilometraje", description = "Retorna motos con kilometraje en el rango especificado")
    @ApiResponse(responseCode = "200", description = "Lista de motos en el rango de kilometraje")
    public ResponseEntity<List<Moto>> obtenerPorRangoKilometraje(@RequestParam Integer kilometrajeMin, @RequestParam Integer kilometrajeMax) {
        List<Moto> motos = motoService.obtenerPorRangoKilometraje(kilometrajeMin, kilometrajeMax);
        return ResponseEntity.ok(motos);
    }

    // ========== CONSULTAS POR ESTADO ACTIVO ==========

    /**
     * Obtener motos por estado activo
     */
    @GetMapping("/estado/{activo}")
    @Operation(summary = "Obtener motos por estado", description = "Filtra motos por su estado activo")
    @ApiResponse(responseCode = "200", description = "Lista de motos filtradas por estado")
    public ResponseEntity<List<Moto>> obtenerPorEstadoActivo(@PathVariable Boolean activo) {
        List<Moto> motos = motoService.obtenerPorEstadoActivo(activo);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos activas ordenadas por marca y modelo
     */
    @GetMapping("/activas/ordenadas")
    @Operation(summary = "Obtener motos activas ordenadas", description = "Retorna todas las motos activas ordenadas por marca y modelo")
    @ApiResponse(responseCode = "200", description = "Lista de motos activas ordenadas")
    public ResponseEntity<List<Moto>> obtenerActivasOrdenadas() {
        List<Moto> motos = motoService.obtenerActivasOrdenadas();
        return ResponseEntity.ok(motos);
    }

    // ========== CONSULTAS COMBINADAS ==========

    /**
     * Buscar motos por marca o modelo
     */
    @GetMapping("/buscar/marca-modelo")
    @Operation(summary = "Buscar motos por marca o modelo", description = "Busca motos cuya marca o modelo contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de motos encontradas")
    public ResponseEntity<List<Moto>> buscarPorMarcaOModelo(@RequestParam String marca, @RequestParam String modelo) {
        List<Moto> motos = motoService.buscarPorMarcaOModelo(marca, modelo);
        return ResponseEntity.ok(motos);
    }

    /**
     * Búsqueda general en motos activas
     */
    @GetMapping("/buscar/activas")
    @Operation(summary = "Búsqueda general en motos activas", description = "Busca en todos los campos de motos activas")
    @ApiResponse(responseCode = "200", description = "Lista de motos activas encontradas")
    public ResponseEntity<List<Moto>> buscarMotosActivas(@RequestParam String busqueda) {
        List<Moto> motos = motoService.buscarMotosActivas(busqueda);
        return ResponseEntity.ok(motos);
    }

    // ========== VALIDACIONES ==========

    /**
     * Verificar si existe placa
     */
    @GetMapping("/existe/placa/{placa}")
    @Operation(summary = "Verificar si existe placa", description = "Verifica si una placa ya está registrada")
    @ApiResponse(responseCode = "200", description = "Resultado de la verificación")
    public ResponseEntity<Boolean> existePlaca(@PathVariable String placa) {
        boolean existe = motoService.existePlaca(placa);
        return ResponseEntity.ok(existe);
    }

    /**
     * Verificar si existe VIN
     */
    @GetMapping("/existe/vin/{vin}")
    @Operation(summary = "Verificar si existe VIN", description = "Verifica si un VIN ya está registrado")
    @ApiResponse(responseCode = "200", description = "Resultado de la verificación")
    public ResponseEntity<Boolean> existeVin(@PathVariable String vin) {
        boolean existe = motoService.existeVin(vin);
        return ResponseEntity.ok(existe);
    }

    // ========== CONTADORES Y ESTADÍSTICAS ==========

    /**
     * Contar motos por estado activo
     */
    @GetMapping("/contar/estado/{activo}")
    @Operation(summary = "Contar motos por estado", description = "Cuenta la cantidad de motos por estado activo")
    @ApiResponse(responseCode = "200", description = "Cantidad de motos")
    public ResponseEntity<Long> contarPorEstadoActivo(@PathVariable Boolean activo) {
        long cantidad = motoService.contarPorEstadoActivo(activo);
        return ResponseEntity.ok(cantidad);
    }

    /**
     * Contar motos por cliente
     */
    @PostMapping("/contar/cliente")
    @Operation(summary = "Contar motos por cliente", description = "Cuenta la cantidad de motos de un cliente")
    @ApiResponse(responseCode = "200", description = "Cantidad de motos del cliente")
    public ResponseEntity<Long> contarPorCliente(@RequestBody Cliente cliente) {
        long cantidad = motoService.contarPorCliente(cliente);
        return ResponseEntity.ok(cantidad);
    }

    /**
     * Contar motos activas por cliente
     */
    @PostMapping("/contar/activas/cliente")
    @Operation(summary = "Contar motos activas por cliente", description = "Cuenta la cantidad de motos activas de un cliente")
    @ApiResponse(responseCode = "200", description = "Cantidad de motos activas del cliente")
    public ResponseEntity<Long> contarActivasPorCliente(@RequestBody Cliente cliente) {
        long cantidad = motoService.contarActivasPorCliente(cliente);
        return ResponseEntity.ok(cantidad);
    }

    /**
     * Contar motos por marca
     */
    @GetMapping("/contar/marca/{marca}")
    @Operation(summary = "Contar motos por marca", description = "Cuenta la cantidad de motos de una marca")
    @ApiResponse(responseCode = "200", description = "Cantidad de motos de la marca")
    public ResponseEntity<Long> contarPorMarca(@PathVariable String marca) {
        long cantidad = motoService.contarPorMarca(marca);
        return ResponseEntity.ok(cantidad);
    }

    /**
     * Contar motos por marca y modelo
     */
    @GetMapping("/contar/marca/{marca}/modelo/{modelo}")
    @Operation(summary = "Contar motos por marca y modelo", description = "Cuenta la cantidad de motos de una marca y modelo específicos")
    @ApiResponse(responseCode = "200", description = "Cantidad de motos de la marca y modelo")
    public ResponseEntity<Long> contarPorMarcaYModelo(@PathVariable String marca, @PathVariable String modelo) {
        long cantidad = motoService.contarPorMarcaYModelo(marca, modelo);
        return ResponseEntity.ok(cantidad);
    }

    // ========== CONSULTAS POR FECHAS DE CREACIÓN ==========

    /**
     * Obtener motos creadas después de una fecha
     */
    @GetMapping("/creadas/despues-de")
    @Operation(summary = "Obtener motos creadas después de fecha", description = "Retorna motos creadas después de la fecha especificada")
    @ApiResponse(responseCode = "200", description = "Lista de motos creadas después de la fecha")
    public ResponseEntity<List<Moto>> obtenerCreadasDespuesDe(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde) {
        List<Moto> motos = motoService.obtenerCreadasDespuesDe(fechaDesde);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos creadas en rango de fechas
     */
    @GetMapping("/creadas/rango")
    @Operation(summary = "Obtener motos creadas en rango de fechas", description = "Retorna motos creadas entre las fechas especificadas")
    @ApiResponse(responseCode = "200", description = "Lista de motos creadas en el rango")
    public ResponseEntity<List<Moto>> obtenerCreadasEnRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHasta) {
        List<Moto> motos = motoService.obtenerCreadasEnRango(fechaDesde, fechaHasta);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos actualizadas después de una fecha
     */
    @GetMapping("/actualizadas/despues-de")
    @Operation(summary = "Obtener motos actualizadas después de fecha", description = "Retorna motos actualizadas después de la fecha especificada")
    @ApiResponse(responseCode = "200", description = "Lista de motos actualizadas después de la fecha")
    public ResponseEntity<List<Moto>> obtenerActualizadasDespuesDe(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde) {
        List<Moto> motos = motoService.obtenerActualizadasDespuesDe(fechaDesde);
        return ResponseEntity.ok(motos);
    }

    // ========== CONSULTAS NATIVAS ==========

    /**
     * Buscar moto por placa usando consulta nativa
     */
    @GetMapping("/nativo/placa/{placa}")
    @Operation(summary = "Buscar moto por placa (consulta nativa)", description = "Busca una moto por placa usando consulta SQL nativa")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Moto encontrada"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada")
    })
    public ResponseEntity<Moto> buscarPorPlacaNativo(@PathVariable String placa) {
        Optional<Moto> moto = motoService.buscarPorPlacaNativo(placa);
        return moto.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtener motos activas por cliente usando consulta nativa
     */
    @GetMapping("/nativo/activas/cliente/{idCliente}")
    @Operation(summary = "Obtener motos activas por cliente (consulta nativa)", description = "Obtiene motos activas por cliente usando consulta SQL nativa")
    @ApiResponse(responseCode = "200", description = "Lista de motos activas del cliente")
    public ResponseEntity<List<Moto>> obtenerActivasPorClienteNativo(@PathVariable Long idCliente) {
        List<Moto> motos = motoService.obtenerActivasPorClienteNativo(idCliente);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos activas por marca y modelo usando consulta nativa
     */
    @GetMapping("/nativo/activas/marca/{marca}/modelo/{modelo}")
    @Operation(summary = "Obtener motos activas por marca y modelo (consulta nativa)", description = "Obtiene motos activas por marca y modelo usando consulta SQL nativa")
    @ApiResponse(responseCode = "200", description = "Lista de motos activas de la marca y modelo")
    public ResponseEntity<List<Moto>> obtenerActivasPorMarcaYModeloNativo(@PathVariable String marca, @PathVariable String modelo) {
        List<Moto> motos = motoService.obtenerActivasPorMarcaYModeloNativo(marca, modelo);
        return ResponseEntity.ok(motos);
    }

    /**
     * Obtener motos activas ordenadas usando consulta nativa
     */
    @GetMapping("/nativo/activas/ordenadas")
    @Operation(summary = "Obtener motos activas ordenadas (consulta nativa)", description = "Obtiene motos activas ordenadas usando consulta SQL nativa")
    @ApiResponse(responseCode = "200", description = "Lista de motos activas ordenadas")
    public ResponseEntity<List<Moto>> obtenerActivasOrdenadasNativo() {
        List<Moto> motos = motoService.obtenerActivasOrdenadasNativo();
        return ResponseEntity.ok(motos);
    }

    // ========== OPERACIONES ESPECIALES ==========

    /**
     * Cambiar estado activo de moto
     */
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado activo", description = "Cambia el estado activo de una moto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estado cambiado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada")
    })
    public ResponseEntity<Void> cambiarEstadoActivo(@PathVariable Long id, @RequestParam Boolean nuevoEstado) {
        try {
            motoService.cambiarEstadoActivo(id, nuevoEstado);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualizar kilometraje de moto
     */
    @PatchMapping("/{id}/kilometraje")
    @Operation(summary = "Actualizar kilometraje", description = "Actualiza el kilometraje de una moto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Kilometraje actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada")
    })
    public ResponseEntity<Void> actualizarKilometraje(@PathVariable Long id, @RequestParam Integer nuevoKilometraje) {
        try {
            motoService.actualizarKilometraje(id, nuevoKilometraje);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualizar placa de moto
     */
    @PatchMapping("/{id}/placa")
    @Operation(summary = "Actualizar placa", description = "Actualiza la placa de una moto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Placa actualizada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada"),
        @ApiResponse(responseCode = "400", description = "Placa ya existe")
    })
    public ResponseEntity<Void> actualizarPlaca(@PathVariable Long id, @RequestParam String nuevaPlaca) {
        try {
            motoService.actualizarPlaca(id, nuevaPlaca);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar VIN de moto
     */
    @PatchMapping("/{id}/vin")
    @Operation(summary = "Actualizar VIN", description = "Actualiza el VIN de una moto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "VIN actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada"),
        @ApiResponse(responseCode = "400", description = "VIN ya existe")
    })
    public ResponseEntity<Void> actualizarVin(@PathVariable Long id, @RequestParam String nuevoVin) {
        try {
            motoService.actualizarVin(id, nuevoVin);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar color de moto
     */
    @PatchMapping("/{id}/color")
    @Operation(summary = "Actualizar color", description = "Actualiza el color de una moto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Color actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada")
    })
    public ResponseEntity<Void> actualizarColor(@PathVariable Long id, @RequestParam String nuevoColor) {
        try {
            motoService.actualizarColor(id, nuevoColor);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cambiar cliente propietario de moto
     */
    @PatchMapping("/{id}/cliente")
    @Operation(summary = "Cambiar cliente propietario", description = "Cambia el cliente propietario de una moto")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente cambiado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Moto no encontrada")
    })
    public ResponseEntity<Void> cambiarCliente(@PathVariable Long id, @RequestBody Cliente nuevoCliente) {
        try {
            motoService.cambiarCliente(id, nuevoCliente);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
