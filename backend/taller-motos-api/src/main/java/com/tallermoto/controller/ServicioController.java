package com.tallermoto.controller;

import com.tallermoto.entity.Servicio;
import com.tallermoto.service.ServicioService;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para la gestión del catálogo de servicios
 * Proporciona endpoints para operaciones CRUD y consultas específicas
 */
@RestController
@RequestMapping("/api/servicios")
@Tag(name = "Servicios", description = "API para gestión del catálogo de servicios del taller")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    // ========== OPERACIONES CRUD ==========

    /**
     * Obtener todos los servicios
     */
    @GetMapping
    @Operation(summary = "Obtener todos los servicios", description = "Retorna la lista completa de servicios del catálogo")
    @ApiResponse(responseCode = "200", description = "Lista de servicios obtenida exitosamente")
    public ResponseEntity<List<Servicio>> obtenerTodos() {
        List<Servicio> servicios = servicioService.obtenerTodos();
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicio por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener servicio por ID", description = "Retorna un servicio específico por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio encontrado"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    public ResponseEntity<Servicio> obtenerPorId(@PathVariable Long id) {
        Optional<Servicio> servicio = servicioService.obtenerPorId(id);
        return servicio.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crear nuevo servicio
     */
    @PostMapping
    @Operation(summary = "Crear nuevo servicio", description = "Crea un nuevo servicio en el catálogo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Servicio creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    public ResponseEntity<Servicio> crear(@Valid @RequestBody Servicio servicio) {
        try {
            Servicio nuevoServicio = servicioService.crear(servicio);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoServicio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar servicio existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar servicio", description = "Actualiza los datos de un servicio existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    public ResponseEntity<Servicio> actualizar(@PathVariable Long id, @Valid @RequestBody Servicio servicio) {
        try {
            Servicio servicioActualizado = servicioService.actualizar(id, servicio);
            return ResponseEntity.ok(servicioActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Eliminar servicio (soft delete)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar servicio", description = "Elimina un servicio (soft delete - cambia activo a false)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Servicio eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            servicioService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Eliminar servicio permanentemente
     */
    @DeleteMapping("/{id}/permanente")
    @Operation(summary = "Eliminar servicio permanentemente", description = "Elimina un servicio de forma permanente de la base de datos")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Servicio eliminado permanentemente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    public ResponseEntity<Void> eliminarPermanente(@PathVariable Long id) {
        try {
            servicioService.eliminarPermanente(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ========== CONSULTAS POR CÓDIGO ==========

    /**
     * Buscar servicio por código
     */
    @GetMapping("/codigo/{codigo}")
    @Operation(summary = "Buscar servicio por código", description = "Busca un servicio por su código único")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio encontrado"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    public ResponseEntity<Servicio> buscarPorCodigo(@PathVariable String codigo) {
        Optional<Servicio> servicio = servicioService.buscarPorCodigo(codigo);
        return servicio.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar servicio activo por código
     */
    @GetMapping("/activo/codigo/{codigo}")
    @Operation(summary = "Buscar servicio activo por código", description = "Busca un servicio activo por su código único")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio activo encontrado"),
        @ApiResponse(responseCode = "404", description = "Servicio activo no encontrado")
    })
    public ResponseEntity<Servicio> buscarActivoPorCodigo(@PathVariable String codigo) {
        Optional<Servicio> servicio = servicioService.buscarActivoPorCodigo(codigo);
        return servicio.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // ========== CONSULTAS POR NOMBRE ==========

    /**
     * Buscar servicios por nombre (contiene texto)
     */
    @GetMapping("/buscar/nombre")
    @Operation(summary = "Buscar servicios por nombre", description = "Busca servicios cuyo nombre contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios encontrados")
    public ResponseEntity<List<Servicio>> buscarPorNombre(@RequestParam String nombre) {
        List<Servicio> servicios = servicioService.buscarPorNombre(nombre);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Buscar servicios activos por nombre (contiene texto)
     */
    @GetMapping("/buscar/activos/nombre")
    @Operation(summary = "Buscar servicios activos por nombre", description = "Busca servicios activos cuyo nombre contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos encontrados")
    public ResponseEntity<List<Servicio>> buscarActivosPorNombre(@RequestParam String nombre) {
        List<Servicio> servicios = servicioService.buscarActivosPorNombre(nombre);
        return ResponseEntity.ok(servicios);
    }

    // ========== CONSULTAS POR CATEGORÍA ==========

    /**
     * Obtener servicios por categoría
     */
    @GetMapping("/categoria/{categoria}")
    @Operation(summary = "Obtener servicios por categoría", description = "Retorna todos los servicios de una categoría específica")
    @ApiResponse(responseCode = "200", description = "Lista de servicios de la categoría")
    public ResponseEntity<List<Servicio>> obtenerPorCategoria(@PathVariable String categoria) {
        List<Servicio> servicios = servicioService.obtenerPorCategoria(categoria);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios activos por categoría
     */
    @GetMapping("/activos/categoria/{categoria}")
    @Operation(summary = "Obtener servicios activos por categoría", description = "Retorna todos los servicios activos de una categoría específica")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos de la categoría")
    public ResponseEntity<List<Servicio>> obtenerActivosPorCategoria(@PathVariable String categoria) {
        List<Servicio> servicios = servicioService.obtenerActivosPorCategoria(categoria);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios por categoría ordenados por nombre
     */
    @GetMapping("/categoria/{categoria}/ordenados")
    @Operation(summary = "Obtener servicios por categoría ordenados", description = "Retorna servicios de una categoría ordenados alfabéticamente por nombre")
    @ApiResponse(responseCode = "200", description = "Lista de servicios de la categoría ordenados")
    public ResponseEntity<List<Servicio>> obtenerPorCategoriaOrdenados(@PathVariable String categoria) {
        List<Servicio> servicios = servicioService.obtenerPorCategoriaOrdenados(categoria);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Buscar servicios por categoría (contiene texto)
     */
    @GetMapping("/buscar/categoria")
    @Operation(summary = "Buscar servicios por categoría", description = "Busca servicios cuya categoría contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios encontrados")
    public ResponseEntity<List<Servicio>> buscarPorCategoria(@RequestParam String categoria) {
        List<Servicio> servicios = servicioService.buscarPorCategoria(categoria);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener todas las categorías activas
     */
    @GetMapping("/categorias/activas")
    @Operation(summary = "Obtener categorías activas", description = "Retorna la lista de todas las categorías que tienen servicios activos")
    @ApiResponse(responseCode = "200", description = "Lista de categorías activas")
    public ResponseEntity<List<String>> obtenerCategoriasActivas() {
        List<String> categorias = servicioService.obtenerCategoriasActivas();
        return ResponseEntity.ok(categorias);
    }

    /**
     * Obtener servicios por categoría ordenados por precio
     */
    @GetMapping("/categoria/{categoria}/por-precio")
    @Operation(summary = "Obtener servicios por categoría ordenados por precio", description = "Retorna servicios de una categoría ordenados por precio ascendente")
    @ApiResponse(responseCode = "200", description = "Lista de servicios ordenados por precio")
    public ResponseEntity<List<Servicio>> obtenerPorCategoriaPorPrecio(@PathVariable String categoria) {
        List<Servicio> servicios = servicioService.obtenerPorCategoriaPorPrecio(categoria);
        return ResponseEntity.ok(servicios);
    }

    // ========== CONSULTAS POR PRECIO BASE ==========

    /**
     * Obtener servicios con precio mayor a un valor
     */
    @GetMapping("/precio/mayor/{precioBase}")
    @Operation(summary = "Obtener servicios con precio alto", description = "Retorna servicios con precio mayor al especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios con precio alto")
    public ResponseEntity<List<Servicio>> obtenerConPrecioMayorA(@PathVariable BigDecimal precioBase) {
        List<Servicio> servicios = servicioService.obtenerConPrecioMayorA(precioBase);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios con precio menor a un valor
     */
    @GetMapping("/precio/menor/{precioBase}")
    @Operation(summary = "Obtener servicios con precio bajo", description = "Retorna servicios con precio menor al especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios con precio bajo")
    public ResponseEntity<List<Servicio>> obtenerConPrecioMenorA(@PathVariable BigDecimal precioBase) {
        List<Servicio> servicios = servicioService.obtenerConPrecioMenorA(precioBase);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios por rango de precios
     */
    @GetMapping("/precio/rango")
    @Operation(summary = "Obtener servicios por rango de precios", description = "Retorna servicios con precio en el rango especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios en el rango de precios")
    public ResponseEntity<List<Servicio>> obtenerPorRangoPrecios(@RequestParam BigDecimal precioMin, @RequestParam BigDecimal precioMax) {
        List<Servicio> servicios = servicioService.obtenerPorRangoPrecios(precioMin, precioMax);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios activos con precio mayor o igual a un valor
     */
    @GetMapping("/activos/precio/mayor-igual/{precioBase}")
    @Operation(summary = "Obtener servicios activos con precio mayor o igual", description = "Retorna servicios activos con precio mayor o igual al especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos con precio mayor o igual")
    public ResponseEntity<List<Servicio>> obtenerActivosConPrecioMayorIgualA(@PathVariable BigDecimal precioBase) {
        List<Servicio> servicios = servicioService.obtenerActivosConPrecioMayorIgualA(precioBase);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios activos con precio menor o igual a un valor
     */
    @GetMapping("/activos/precio/menor-igual/{precioBase}")
    @Operation(summary = "Obtener servicios activos con precio menor o igual", description = "Retorna servicios activos con precio menor o igual al especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos con precio menor o igual")
    public ResponseEntity<List<Servicio>> obtenerActivosConPrecioMenorIgualA(@PathVariable BigDecimal precioBase) {
        List<Servicio> servicios = servicioService.obtenerActivosConPrecioMenorIgualA(precioBase);
        return ResponseEntity.ok(servicios);
    }

    // ========== CONSULTAS POR TIEMPO ESTIMADO ==========

    /**
     * Obtener servicios con tiempo mayor a un valor
     */
    @GetMapping("/tiempo/mayor/{tiempoEstimado}")
    @Operation(summary = "Obtener servicios con tiempo largo", description = "Retorna servicios con tiempo estimado mayor al especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios con tiempo largo")
    public ResponseEntity<List<Servicio>> obtenerConTiempoMayorA(@PathVariable Integer tiempoEstimado) {
        List<Servicio> servicios = servicioService.obtenerConTiempoMayorA(tiempoEstimado);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios con tiempo menor a un valor
     */
    @GetMapping("/tiempo/menor/{tiempoEstimado}")
    @Operation(summary = "Obtener servicios con tiempo corto", description = "Retorna servicios con tiempo estimado menor al especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios con tiempo corto")
    public ResponseEntity<List<Servicio>> obtenerConTiempoMenorA(@PathVariable Integer tiempoEstimado) {
        List<Servicio> servicios = servicioService.obtenerConTiempoMenorA(tiempoEstimado);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios por rango de tiempo estimado
     */
    @GetMapping("/tiempo/rango")
    @Operation(summary = "Obtener servicios por rango de tiempo", description = "Retorna servicios con tiempo estimado en el rango especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios en el rango de tiempo")
    public ResponseEntity<List<Servicio>> obtenerPorRangoTiempo(@RequestParam Integer tiempoMin, @RequestParam Integer tiempoMax) {
        List<Servicio> servicios = servicioService.obtenerPorRangoTiempo(tiempoMin, tiempoMax);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios activos con tiempo menor o igual a un valor
     */
    @GetMapping("/activos/tiempo/menor-igual/{tiempoEstimado}")
    @Operation(summary = "Obtener servicios activos con tiempo menor o igual", description = "Retorna servicios activos con tiempo estimado menor o igual al especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos con tiempo menor o igual")
    public ResponseEntity<List<Servicio>> obtenerActivosConTiempoMenorIgualA(@PathVariable Integer tiempoEstimado) {
        List<Servicio> servicios = servicioService.obtenerActivosConTiempoMenorIgualA(tiempoEstimado);
        return ResponseEntity.ok(servicios);
    }

    // ========== CONSULTAS POR ESTADO ACTIVO ==========

    /**
     * Obtener servicios por estado activo
     */
    @GetMapping("/estado/{activo}")
    @Operation(summary = "Obtener servicios por estado", description = "Filtra servicios por su estado activo")
    @ApiResponse(responseCode = "200", description = "Lista de servicios filtrados por estado")
    public ResponseEntity<List<Servicio>> obtenerPorEstadoActivo(@PathVariable Boolean activo) {
        List<Servicio> servicios = servicioService.obtenerPorEstadoActivo(activo);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios activos ordenados por categoría
     */
    @GetMapping("/activos/ordenados/categoria")
    @Operation(summary = "Obtener servicios activos ordenados por categoría", description = "Retorna todos los servicios activos ordenados por categoría")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos ordenados por categoría")
    public ResponseEntity<List<Servicio>> obtenerActivosOrdenadosPorCategoria() {
        List<Servicio> servicios = servicioService.obtenerActivosOrdenadosPorCategoria();
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios activos ordenados por precio
     */
    @GetMapping("/activos/ordenados/precio")
    @Operation(summary = "Obtener servicios activos ordenados por precio", description = "Retorna todos los servicios activos ordenados por precio")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos ordenados por precio")
    public ResponseEntity<List<Servicio>> obtenerActivosOrdenadosPorPrecio() {
        List<Servicio> servicios = servicioService.obtenerActivosOrdenadosPorPrecio();
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios activos ordenados por nombre
     */
    @GetMapping("/activos/ordenados/nombre")
    @Operation(summary = "Obtener servicios activos ordenados por nombre", description = "Retorna todos los servicios activos ordenados alfabéticamente por nombre")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos ordenados por nombre")
    public ResponseEntity<List<Servicio>> obtenerActivosOrdenadosPorNombre() {
        List<Servicio> servicios = servicioService.obtenerActivosOrdenadosPorNombre();
        return ResponseEntity.ok(servicios);
    }

    // ========== CONSULTAS POR DESCRIPCIÓN ==========

    /**
     * Buscar servicios por descripción (contiene texto)
     */
    @GetMapping("/buscar/descripcion")
    @Operation(summary = "Buscar servicios por descripción", description = "Busca servicios cuya descripción contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios encontrados")
    public ResponseEntity<List<Servicio>> buscarPorDescripcion(@RequestParam String descripcion) {
        List<Servicio> servicios = servicioService.buscarPorDescripcion(descripcion);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios sin descripción
     */
    @GetMapping("/sin-descripcion")
    @Operation(summary = "Obtener servicios sin descripción", description = "Retorna todos los servicios que no tienen descripción")
    @ApiResponse(responseCode = "200", description = "Lista de servicios sin descripción")
    public ResponseEntity<List<Servicio>> obtenerSinDescripcion() {
        List<Servicio> servicios = servicioService.obtenerSinDescripcion();
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios con descripción
     */
    @GetMapping("/con-descripcion")
    @Operation(summary = "Obtener servicios con descripción", description = "Retorna todos los servicios que tienen descripción")
    @ApiResponse(responseCode = "200", description = "Lista de servicios con descripción")
    public ResponseEntity<List<Servicio>> obtenerConDescripcion() {
        List<Servicio> servicios = servicioService.obtenerConDescripcion();
        return ResponseEntity.ok(servicios);
    }

    // ========== CONSULTAS COMBINADAS ==========

    /**
     * Buscar servicios por nombre o descripción
     */
    @GetMapping("/buscar/nombre-descripcion")
    @Operation(summary = "Buscar servicios por nombre o descripción", description = "Busca servicios cuyo nombre o descripción contenga el texto especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios encontrados")
    public ResponseEntity<List<Servicio>> buscarPorNombreODescripcion(@RequestParam String nombre, @RequestParam String descripcion) {
        List<Servicio> servicios = servicioService.buscarPorNombreODescripcion(nombre, descripcion);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios por categoría con precio máximo
     */
    @GetMapping("/categoria/{categoria}/precio-maximo/{precioMax}")
    @Operation(summary = "Obtener servicios por categoría con precio máximo", description = "Retorna servicios de una categoría con precio menor o igual al máximo especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios de la categoría con precio máximo")
    public ResponseEntity<List<Servicio>> obtenerPorCategoriaConPrecioMaximo(@PathVariable String categoria, @PathVariable BigDecimal precioMax) {
        List<Servicio> servicios = servicioService.obtenerPorCategoriaConPrecioMaximo(categoria, precioMax);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios por categoría con tiempo máximo
     */
    @GetMapping("/categoria/{categoria}/tiempo-maximo/{tiempoMax}")
    @Operation(summary = "Obtener servicios por categoría con tiempo máximo", description = "Retorna servicios de una categoría con tiempo menor o igual al máximo especificado")
    @ApiResponse(responseCode = "200", description = "Lista de servicios de la categoría con tiempo máximo")
    public ResponseEntity<List<Servicio>> obtenerPorCategoriaConTiempoMaximo(@PathVariable String categoria, @PathVariable Integer tiempoMax) {
        List<Servicio> servicios = servicioService.obtenerPorCategoriaConTiempoMaximo(categoria, tiempoMax);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Búsqueda general en servicios activos
     */
    @GetMapping("/buscar/activos")
    @Operation(summary = "Búsqueda general en servicios activos", description = "Busca en todos los campos de servicios activos")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos encontrados")
    public ResponseEntity<List<Servicio>> buscarServiciosActivos(@RequestParam String busqueda) {
        List<Servicio> servicios = servicioService.buscarServiciosActivos(busqueda);
        return ResponseEntity.ok(servicios);
    }

    // ========== VALIDACIONES ==========

    /**
     * Verificar si existe código
     */
    @GetMapping("/existe/codigo/{codigo}")
    @Operation(summary = "Verificar si existe código", description = "Verifica si un código ya está registrado")
    @ApiResponse(responseCode = "200", description = "Resultado de la verificación")
    public ResponseEntity<Boolean> existeCodigo(@PathVariable String codigo) {
        boolean existe = servicioService.existeCodigo(codigo);
        return ResponseEntity.ok(existe);
    }

    // ========== CONTADORES Y ESTADÍSTICAS ==========

    /**
     * Contar servicios por estado activo
     */
    @GetMapping("/contar/estado/{activo}")
    @Operation(summary = "Contar servicios por estado", description = "Cuenta la cantidad de servicios por estado activo")
    @ApiResponse(responseCode = "200", description = "Cantidad de servicios")
    public ResponseEntity<Long> contarPorEstadoActivo(@PathVariable Boolean activo) {
        long cantidad = servicioService.contarPorEstadoActivo(activo);
        return ResponseEntity.ok(cantidad);
    }

    /**
     * Contar servicios por categoría
     */
    @GetMapping("/contar/categoria/{categoria}")
    @Operation(summary = "Contar servicios por categoría", description = "Cuenta la cantidad de servicios de una categoría")
    @ApiResponse(responseCode = "200", description = "Cantidad de servicios de la categoría")
    public ResponseEntity<Long> contarPorCategoria(@PathVariable String categoria) {
        long cantidad = servicioService.contarPorCategoria(categoria);
        return ResponseEntity.ok(cantidad);
    }

    /**
     * Contar servicios activos por categoría
     */
    @GetMapping("/contar/activos/categoria/{categoria}")
    @Operation(summary = "Contar servicios activos por categoría", description = "Cuenta la cantidad de servicios activos de una categoría")
    @ApiResponse(responseCode = "200", description = "Cantidad de servicios activos de la categoría")
    public ResponseEntity<Long> contarActivosPorCategoria(@PathVariable String categoria) {
        long cantidad = servicioService.contarActivosPorCategoria(categoria);
        return ResponseEntity.ok(cantidad);
    }

    /**
     * Contar servicios con precio mayor a un valor
     */
    @GetMapping("/contar/precio/mayor/{precioBase}")
    @Operation(summary = "Contar servicios con precio mayor", description = "Cuenta la cantidad de servicios con precio mayor al especificado")
    @ApiResponse(responseCode = "200", description = "Cantidad de servicios con precio mayor")
    public ResponseEntity<Long> contarConPrecioMayorA(@PathVariable BigDecimal precioBase) {
        long cantidad = servicioService.contarConPrecioMayorA(precioBase);
        return ResponseEntity.ok(cantidad);
    }

    // ========== CONSULTAS POR FECHAS DE CREACIÓN ==========

    /**
     * Obtener servicios creados después de una fecha
     */
    @GetMapping("/creados/despues-de")
    @Operation(summary = "Obtener servicios creados después de fecha", description = "Retorna servicios creados después de la fecha especificada")
    @ApiResponse(responseCode = "200", description = "Lista de servicios creados después de la fecha")
    public ResponseEntity<List<Servicio>> obtenerCreadosDespuesDe(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde) {
        List<Servicio> servicios = servicioService.obtenerCreadosDespuesDe(fechaDesde);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios creados en rango de fechas
     */
    @GetMapping("/creados/rango")
    @Operation(summary = "Obtener servicios creados en rango de fechas", description = "Retorna servicios creados entre las fechas especificadas")
    @ApiResponse(responseCode = "200", description = "Lista de servicios creados en el rango")
    public ResponseEntity<List<Servicio>> obtenerCreadosEnRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHasta) {
        List<Servicio> servicios = servicioService.obtenerCreadosEnRango(fechaDesde, fechaHasta);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios actualizados después de una fecha
     */
    @GetMapping("/actualizados/despues-de")
    @Operation(summary = "Obtener servicios actualizados después de fecha", description = "Retorna servicios actualizados después de la fecha especificada")
    @ApiResponse(responseCode = "200", description = "Lista de servicios actualizados después de la fecha")
    public ResponseEntity<List<Servicio>> obtenerActualizadosDespuesDe(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde) {
        List<Servicio> servicios = servicioService.obtenerActualizadosDespuesDe(fechaDesde);
        return ResponseEntity.ok(servicios);
    }

    // ========== CONSULTAS NATIVAS ==========

    /**
     * Buscar servicio por código usando consulta nativa
     */
    @GetMapping("/nativo/codigo/{codigo}")
    @Operation(summary = "Buscar servicio por código (consulta nativa)", description = "Busca un servicio por código usando consulta SQL nativa")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio encontrado"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    public ResponseEntity<Servicio> buscarPorCodigoNativo(@PathVariable String codigo) {
        Optional<Servicio> servicio = servicioService.buscarPorCodigoNativo(codigo);
        return servicio.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtener servicios activos por categoría usando consulta nativa
     */
    @GetMapping("/nativo/activos/categoria/{categoria}")
    @Operation(summary = "Obtener servicios activos por categoría (consulta nativa)", description = "Obtiene servicios activos por categoría usando consulta SQL nativa")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos de la categoría")
    public ResponseEntity<List<Servicio>> obtenerActivosPorCategoriaNativo(@PathVariable String categoria) {
        List<Servicio> servicios = servicioService.obtenerActivosPorCategoriaNativo(categoria);
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios activos ordenados usando consulta nativa
     */
    @GetMapping("/nativo/activos/ordenados")
    @Operation(summary = "Obtener servicios activos ordenados (consulta nativa)", description = "Obtiene servicios activos ordenados usando consulta SQL nativa")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos ordenados")
    public ResponseEntity<List<Servicio>> obtenerActivosOrdenadosNativo() {
        List<Servicio> servicios = servicioService.obtenerActivosOrdenadosNativo();
        return ResponseEntity.ok(servicios);
    }

    /**
     * Obtener servicios activos por rango de precios usando consulta nativa
     */
    @GetMapping("/nativo/activos/precio-rango")
    @Operation(summary = "Obtener servicios activos por rango de precios (consulta nativa)", description = "Obtiene servicios activos por rango de precios usando consulta SQL nativa")
    @ApiResponse(responseCode = "200", description = "Lista de servicios activos en el rango de precios")
    public ResponseEntity<List<Servicio>> obtenerActivosPorRangoPreciosNativo(@RequestParam BigDecimal precioMin, @RequestParam BigDecimal precioMax) {
        List<Servicio> servicios = servicioService.obtenerActivosPorRangoPreciosNativo(precioMin, precioMax);
        return ResponseEntity.ok(servicios);
    }

    // ========== OPERACIONES ESPECIALES ==========

    /**
     * Cambiar estado activo de servicio
     */
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado activo", description = "Cambia el estado activo de un servicio")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estado cambiado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    public ResponseEntity<Void> cambiarEstadoActivo(@PathVariable Long id, @RequestParam Boolean nuevoEstado) {
        try {
            servicioService.cambiarEstadoActivo(id, nuevoEstado);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualizar precio base de servicio
     */
    @PatchMapping("/{id}/precio")
    @Operation(summary = "Actualizar precio base", description = "Actualiza el precio base de un servicio")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Precio actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    public ResponseEntity<Void> actualizarPrecioBase(@PathVariable Long id, @RequestParam BigDecimal nuevoPrecio) {
        try {
            servicioService.actualizarPrecioBase(id, nuevoPrecio);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualizar tiempo estimado de servicio
     */
    @PatchMapping("/{id}/tiempo")
    @Operation(summary = "Actualizar tiempo estimado", description = "Actualiza el tiempo estimado de un servicio")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tiempo actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    public ResponseEntity<Void> actualizarTiempoEstimado(@PathVariable Long id, @RequestParam Integer nuevoTiempo) {
        try {
            servicioService.actualizarTiempoEstimado(id, nuevoTiempo);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualizar código de servicio
     */
    @PatchMapping("/{id}/codigo")
    @Operation(summary = "Actualizar código", description = "Actualiza el código de un servicio")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Código actualizado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
        @ApiResponse(responseCode = "400", description = "Código ya existe")
    })
    public ResponseEntity<Void> actualizarCodigo(@PathVariable Long id, @RequestParam String nuevoCodigo) {
        try {
            servicioService.actualizarCodigo(id, nuevoCodigo);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Actualizar categoría de servicio
     */
    @PatchMapping("/{id}/categoria")
    @Operation(summary = "Actualizar categoría", description = "Actualiza la categoría de un servicio")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Categoría actualizada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    public ResponseEntity<Void> actualizarCategoria(@PathVariable Long id, @RequestParam String nuevaCategoria) {
        try {
            servicioService.actualizarCategoria(id, nuevaCategoria);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualizar descripción de servicio
     */
    @PatchMapping("/{id}/descripcion")
    @Operation(summary = "Actualizar descripción", description = "Actualiza la descripción de un servicio")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Descripción actualizada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado")
    })
    public ResponseEntity<Void> actualizarDescripcion(@PathVariable Long id, @RequestParam String nuevaDescripcion) {
        try {
            servicioService.actualizarDescripcion(id, nuevaDescripcion);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualizar múltiples precios por categoría
     */
    @PatchMapping("/categoria/{categoria}/actualizar-precios")
    @Operation(summary = "Actualizar precios por categoría", description = "Actualiza los precios de todos los servicios de una categoría aplicando un porcentaje de aumento")
    @ApiResponse(responseCode = "200", description = "Precios actualizados exitosamente")
    public ResponseEntity<Void> actualizarPreciosPorCategoria(@PathVariable String categoria, @RequestParam BigDecimal porcentajeAumento) {
        servicioService.actualizarPreciosPorCategoria(categoria, porcentajeAumento);
        return ResponseEntity.ok().build();
    }

    /**
     * Obtener servicios básicos más solicitados
     */
    @GetMapping("/basicos")
    @Operation(summary = "Obtener servicios básicos", description = "Retorna los servicios básicos más solicitados del taller")
    @ApiResponse(responseCode = "200", description = "Lista de servicios básicos")
    public ResponseEntity<List<Servicio>> obtenerServiciosBasicos() {
        List<Servicio> servicios = servicioService.obtenerServiciosBasicos();
        return ResponseEntity.ok(servicios);
    }
}
