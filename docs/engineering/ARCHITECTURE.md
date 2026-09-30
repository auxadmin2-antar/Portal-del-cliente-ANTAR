# Arquitectura

## Responsabilidades

- Next.js App Router: rutas, renderizado, metadata y operaciones HTTP.
- React Server Components: contenido inicial y lecturas; cliente solo para interacción.
- Supabase gestionado: PostgreSQL, Auth y Storage cuando el producto lo necesita.
- Vercel: builds, previews, hosting y ejecución del servidor.
- CSS con tokens: base visual sin imponer una librería de componentes adicional.

src/app contiene composición; src/components primitivas compartidas;
src/content copy; src/config contratos; src/lib integraciones.
Introducir src/features/[función] para schemas, queries, acciones y UI propia
cuando exista dominio. Evitar lógica de negocio extensa en page.tsx.

## Contenido y caché

Preferir páginas estáticas para contenido editorial estable. Elegir explícitamente
SSR o revalidación cuando los datos lo requieran. El contenido privado no se comparte
en una caché pública. Una integración CMS debe definir invalidación autenticada,
borradores y recuperación ante fallos.

## Serverless

No persistir archivos en disco local ni estado crítico en memoria. Guardar archivos
en Storage y datos en PostgreSQL. No usar setInterval o tareas sin seguimiento para
emails, pagos o exportaciones. Definir ejecución durable si se necesitan jobs.
Aplicar timeouts, límites y reintentos solo cuando sean seguros/idempotentes.

## Lo que no se hereda del starter local

No hay Compose, reverse proxy LAN, scripts de pg_dump por contenedor ni restauración
del host. Las operaciones se adaptan a los servicios gestionados y sus capacidades.
Registrar nuevas decisiones mediante docs/templates/ADR.md.
