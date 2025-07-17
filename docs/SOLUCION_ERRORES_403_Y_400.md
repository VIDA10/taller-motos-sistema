#  Solución Detallada de Errores Críticos (403 y 400)

## Introducción

Este documento detalla el diagnóstico y la solución definitiva para dos errores críticos que afectaron la operatividad del sistema: un error **403 Forbidden** que impedía el acceso a los usuarios, y un error **400 Bad Request** que mostraba un engañoso mensaje de "Stock insuficiente". Las soluciones aplicadas no solo corrigen los síntomas, sino que atacan la causa raíz y refuerzan la robustez y calidad del backend.

---

## 1. Error 403 Forbidden: Problema de Permisos de Rol

### Síntoma

Usuarios con roles de `ADMIN`, `RECEPCIONISTA` o `MECANICO` podían iniciar sesión correctamente, pero al intentar acceder a ciertas secciones de la aplicación (como ver órdenes de trabajo o registrar usos de repuestos), la API devolvía un error `403 Forbidden`, denegando el acceso.

### Diagnóstico y Causa Raíz

El problema residía en una **inconsistencia sutil en el manejo de los roles de usuario** entre el momento de la creación del token JWT y la validación de permisos de Spring Security.

1.  **Expectativa de Spring Security:** Cuando se utiliza una regla de seguridad como `.hasRole("ADMIN")`, Spring Security busca internamente que el usuario autenticado tenga una autoridad llamada **`"ROLE_ADMIN"`** (con el prefijo `ROLE_` añadido automáticamente).
2.  **Realidad del Sistema:** Se descubrió que el sistema generaba tokens JWT cuyo `claim` de rol a veces no incluía el prefijo. Por ejemplo, el token podía contener `"rol": "ADMIN"` en lugar de `"rol": "ROLE_ADMIN"`.
3.  **El Conflicto:** Al procesar el token, nuestro filtro de seguridad creaba una autoridad para el usuario llamada `"ADMIN"`. Cuando Spring Security iba a validar el permiso, no encontraba la autoridad `"ROLE_ADMIN"` que esperaba, y por lo tanto, denegaba el acceso.

### Solución Definitiva y Robusta

La solución se implementó en el filtro `JwtAuthenticationFilter.java`. En lugar de simplemente corregir la generación del token (lo que podría dejar el sistema frágil a futuros cambios), se optó por hacer el **filtro de seguridad más inteligente y resiliente**.

El filtro ahora se asegura de que, sin importar si el rol en el token JWT viene con o sin el prefijo, la autoridad que se registra en el contexto de seguridad de Spring **siempre** tenga el prefijo `ROLE_`.

```java
// Archivo: backend/taller-motos-api/src/main/java/com/tallermoto/config/JwtAuthenticationFilter.java

// ... dentro del método doFilterInternal ...

// Esta lógica asegura que la autoridad SIEMPRE tenga el prefijo 'ROLE_'
// para ser compatible con Spring Security.
String authorityString = rol.startsWith("ROLE_") ? rol : "ROLE_" + rol;
SimpleGrantedAuthority authority = new SimpleGrantedAuthority(authorityString);

// Se crea la autenticación con la autoridad corregida y consistente.
UsernamePasswordAuthenticationToken authentication =
    new UsernamePasswordAuthenticationToken(username, null, Collections.singletonList(authority));
```

Esta solución eliminó por completo el error 403 y estandarizó el manejo de roles en toda la capa de seguridad.

---

## 2. Error 400 Bad Request: Falso Error de "Stock Insuficiente"

### Síntoma

Al intentar registrar el uso de un repuesto desde el perfil de un mecánico, la API devolvía un error `400 Bad Request` con el mensaje: `Stock insuficiente. Disponible: 0, Solicitado: 5`, a pesar de que en la base de datos sí había stock disponible para ese repuesto.

### Diagnóstico y Causa Raíz

El mensaje de "Stock insuficiente" era un **síntoma falso y engañoso**. La verdadera causa raíz era un **fallo silencioso en la conversión de datos (deserialización) en el backend**.

1.  **El Problema Real:** El backend utiliza objetos de fecha y hora modernos de Java 8 (`java.time.LocalDateTime`). Sin embargo, la librería encargada de procesar JSON (Jackson) no tenía soporte nativo para estos tipos de dato por defecto.
2.  **La Consecuencia:** Cuando el frontend enviaba un objeto JSON que contenía fechas, Jackson fallaba al intentar convertirlo a un objeto Java `UsoRepuesto`. Este fallo no detenía la ejecución, sino que resultaba en un objeto **corrupto o incompleto** que se pasaba a la capa de servicio. Típicamente, el objeto `Repuesto` anidado dentro de `UsoRepuesto` se convertía en `null`.
3.  **El Falso Error:** La lógica de negocio en el `UsoRepuestoService` recibía este objeto corrupto e intentaba verificar el stock de un `repuesto` que era `null`. Lógicamente, el sistema determinaba que el stock para un repuesto inexistente era 0, lanzando la excepción de "Stock insuficiente".

### Solución Definitiva y Estándar de la Industria

Se implementó una solución de dos partes para erradicar el problema y mejorar la calidad del código.

1.  **Parte A: Habilitar Soporte de Fechas (Solución Estándar):** Se añadió la dependencia oficial `jackson-datatype-jsr310` al archivo `pom.xml` del proyecto. Esta es la solución recomendada por Spring y la comunidad Java para que Jackson pueda manejar sin problemas los tipos de fecha y hora de Java 8+.

    ```xml
    <!-- Archivo: backend/taller-motos-api/pom.xml -->
    <dependency>
        <groupId>com.fasterxml.jackson.datatype</groupId>
        <artifactId>jackson-datatype-jsr310</artifactId>
    </dependency>
    ```

2.  **Parte B: Aumentar la Robustez del Servicio (Mejora de Calidad):** Para prevenir futuros errores causados por datos desactualizados o incompletos provenientes del cliente, se modificó el `UsoRepuestoService`. Ahora, en lugar de confiar ciegamente en el objeto `Repuesto` que llega en la petición, el servicio **recarga la entidad completa desde la base de datos** usando su ID.

    ```java
    // Archivo: backend/taller-motos-api/src/main/java/com/tallermoto/service/UsoRepuestoService.java

    // ... dentro del método crearUsoRepuesto ...

    // Recargar la entidad desde la BD para asegurar que los datos son frescos y consistentes.
    Repuesto repuestoDesdeBD = repuestoService.obtenerRepuestoPorId(repuesto.getIdRepuesto())
        .orElseThrow(() -> new IllegalArgumentException("El repuesto con ID " + repuesto.getIdRepuesto() + " no existe."));

    // Toda la lógica de negocio ahora usa 'repuestoDesdeBD' en lugar del objeto que vino del cliente.
    if (repuestoDesdeBD.getStockActual() < usoRepuesto.getCantidad()) {
        // ...
    }
    ```

Esta doble solución no solo corrigió el error 400, sino que también hizo que el servicio fuera más seguro, fiable y resistente a datos inconsistentes, alineándose con las mejores prácticas de desarrollo de APIs robustas. 