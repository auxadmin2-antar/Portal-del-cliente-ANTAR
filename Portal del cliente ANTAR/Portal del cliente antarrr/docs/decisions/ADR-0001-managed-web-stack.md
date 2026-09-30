# ADR-0001 — Vercel + Supabase gestionados

Estado: Aceptada para esta plantilla por elección del usuario.

Usar Next.js/React/TypeScript para el website, Vercel para ejecución y previews,
y Supabase gestionado cuando haya Auth, datos o archivos. Conservar un proceso
similar al starter local, adaptando operación a servicios gestionados.

La referencia pública funciona sin backend configurado. No forzar servicios
dinámicos en páginas editoriales. Separar datos de Preview y Production.

Ventajas: menos administración de hosts y un flujo explícito de revisión remota.
Costes: dependencia del proveedor, cuotas/costes por revisar y responsabilidad
propia sobre permisos, contenido y recuperación. No se presuponen planes o precios.

Revisar si residencia de datos, requisitos de ejecución o costes justifican un
despliegue distinto. Una migración debe preservar URLs, datos y autenticación.
