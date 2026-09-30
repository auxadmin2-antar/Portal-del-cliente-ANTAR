# Mantenimiento

Definir frecuencia y responsables para revisar errores, disponibilidad, conversiones
si se miden, enlaces, contenido, dependencias, costes y crecimiento de Storage.

## Datos

Verificar las capacidades reales de backup y retención del proyecto Supabase
contratado; no asumir que un respaldo de DB incluye objetos de Storage.
Definir exportación/recuperación de datos, objetos y configuración. Probar una
restauración aislada y registrar tiempos y pérdida máxima aceptable.
No ejecutar scripts de Docker del starter local contra servicios gestionados.

## Cambios

Actualizar dependencias de forma controlada, regenerar lockfile y ejecutar QA.
Mantener una versión anterior compatible. Los cambios de DB necesitan plan propio.
Auditar integraciones, permisos, tokens y webhooks según uso real.

## Incidentes

Registrar impacto, hora, release y dependencias afectadas sin exponer secretos.
Verificar health, logs Vercel y estado Supabase. Corregir o revertir de forma
compatible; documentar la causa y una comprobación que evite repetirla.

## Restricción actual de herramientas

Se conserva la combinación probada Next 16.3.5 / ESLint 9.39.5 / TypeScript 5.9.3.
Los plugins de lint actuales no aceptan ESLint 10 / TypeScript 7. ESLint 9 está
marcado como obsoleto: revisar una actualización conjunta compatible, sin ignorar
conflictos peer ni subir versiones mayores durante cambios de contenido.
