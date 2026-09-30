# Calidad y definición de terminado

## Automatizado

pnpm check ejecuta documentación, lint sin warnings, tipos, pruebas, build y
smoke HTTP sobre el servidor compilado. El smoke no utiliza datos o cuentas reales.
La CI repite las comprobaciones en Linux. vercel.json ejecuta verify y build;
ninguno aplica migraciones ni publica desde el workflow GitHub.

## Según el cambio

- UI: escritorio/móvil, contenido largo, foco, teclado, zoom y estados.
- Formulario: input válido/inválido, doble envío, permisos, backend caído y entrega real.
- DB: constraints, políticas RLS, acceso entre usuarios y migraciones aisladas.
- SEO: HTML final, canonical, metadata, sitemap, robots, redirects y Preview noindex.
- Integración: timeout, firma/autorización, idempotencia y modo de fallo.

## Rendimiento

Medir páginas representativas en Preview con condiciones documentadas.
Objetivos de experiencia real al percentil 75: LCP <= 2.5 s, INP <= 200 ms,
CLS <= 0.1. Una puntuación de Lighthouse de laboratorio no demuestra esas métricas
de usuarios reales. Evitar JS cliente innecesario, imágenes excesivas y scripts
de terceros sin presupuesto. Definir presupuestos por proyecto y revisar regresiones.
Referencia: https://web.dev/articles/vitals

## Checklist de entrega

- [ ] Criterios de aceptación satisfechos y alcance respetado.
- [ ] Copy y assets reales o claramente marcados como referencia no publicable.
- [ ] Comprobaciones automatizadas pasan.
- [ ] Evidencia visual y funcional del cambio relevante.
- [ ] Permisos, RLS y validación comprobados si hay datos.
- [ ] Configuración, operación y documentación actualizadas.
- [ ] Pendientes y limitaciones explícitos.

No declarar terminado un flujo que solo devuelve una respuesta simulada de éxito.
