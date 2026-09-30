# Supabase del website

Los directorios migrations/ y tests/ están preparados; no contienen schema de negocio.
database.generated.ts es un placeholder, no tipos de una base real.

1. Completar docs/product/DATA_PERMISSIONS.md.
2. Crear/configurar proyecto de prueba separado del productivo.
3. Elegir y fijar una versión del CLI compatible al implementar el primer schema.
4. Crear migraciones, constraints, índices y RLS; no editar producción manualmente.
5. Probar permisos positivos y negativos contra datos de prueba.
6. Generar tipos con herramientas Supabase desde la DB real y revisar el diff.
7. Implementar la función y probarla en Preview antes de migración productiva.

No incluir secrets, URLs privadas o datos reales en seed. No aplicar migraciones
automáticamente desde vercel.json. Documentar backups y recuperación según el
proyecto contratado y el alcance de Storage.
