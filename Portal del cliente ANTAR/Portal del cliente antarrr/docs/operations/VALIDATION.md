# Validación inicial de la plantilla

## Comprobado localmente

Entorno: Windows, Node 22.23.2, pnpm 10.34.5 y navegador integrado.

- Instalación con lockfile congelado y dependencias peer estrictas.
- Referencias documentales, ESLint sin warnings y comprobación TypeScript.
- 9 pruebas: indexación por entorno, canonical de producción, validación de
  Supabase, rechazo de claves administrativas en configuración pública y health.
- Compilación de producción y arranque del servidor compilado.
- Smoke HTTP: página inicial, idioma, H1, canonical, cabeceras, noindex, robots,
  sitemap, 404, liveness y readiness con backend opcional o requerido ausente.
- Revisión en navegador: estructura semántica, referencia móvil, ancho de
  contenido sin desbordamiento en viewports configurados de 390 y 1440 px.
- FAQ: apertura con clic y cierre con Enter, sin errores o warnings de consola
  en la revisión realizada.

El comando pnpm check terminó correctamente. Los procesos y la pestaña temporal
de revisión se cerraron. No se usaron datos o credenciales reales.

## Pendiente por proyecto

- Ejecución de CI en GitHub y despliegue real en Vercel.
- Integración con Supabase real, login, callbacks, permisos/RLS y migraciones.
- Contenido final, marca, assets, formularios y funciones específicas.
- Auditoría completa WCAG, pruebas con lectores de pantalla y todos los estados.
- Medición de rendimiento en Preview y con tráfico real; no se afirma una
  puntuación Lighthouse ni cumplimiento de Core Web Vitals.
- Revisión del dominio productivo, indexación final y restauración de datos.

No se crearon proyectos remotos, cuentas ni publicaciones. Revisar también la
restricción de herramientas de lint en docs/operations/MAINTENANCE.md.
