# Procedimiento de desarrollo web

| Fase | Trabajo | Entregable | Criterio para avanzar |
|---|---|---|---|
| 1. Descubrimiento | Objetivo, audiencia, oferta, alcance y restricciones | BRIEF completo | Objetivo y MVP comprensibles |
| 2. Arquitectura de información | Rutas, navegación, intención y copy | Mapa y fichas de página | Cada página tiene propósito, contenido y acción |
| 3. Diseño | Referencias, tokens, componentes y pantalla principal | Dirección visual y estados | Experiencia móvil y desktop resuelta |
| 4. Desarrollo | Un flujo de principio a fin por tarea | UI + servidor + datos según aplique | Criterios observables satisfechos |
| 5. QA | Código, navegador, permisos, accesibilidad y SEO | Evidencia y defectos corregidos | Sin fallos que bloqueen el flujo principal |
| 6. Preview | Revisión con datos de prueba en Vercel | URL de revisión y decisiones | Contenido y flujos verificados en entorno remoto |
| 7. Lanzamiento | Dominio, secretos, datos, indexación y publicación | Release identificada | Checklist de lanzamiento completado |
| 8. Operación | Fallos, métricas, contenido, dependencias y recuperación | Registro de mantenimiento | Responsables y siguiente revisión definidos |

Los nombres de entregable apuntan a docs/product/ y docs/templates/.
No exigir reuniones o aprobaciones por cada ajuste pequeño: usar los requisitos
ya definidos y registrar decisiones relevantes. La publicación externa requiere
la autorización que corresponda al proyecto.

## Secuencia recomendada para una función dinámica

Contrato y permisos → migración/RLS → tipos → operación servidor → interfaz →
pruebas positivas y negativas → documentación → Preview.

## Gestión del alcance

Usar docs/product/FEATURES.md para estados y prioridades. No expandir el MVP
por iniciativa del agente. Una integración nueva debe justificar coste,
dependencia, manejo de fallos y datos transferidos.

## Evidencia mínima de entrega

Qué cambió; criterio de aceptación; comprobaciones ejecutadas; capturas cuando
hay cambios visuales; migraciones/configuración; limitaciones; acción operativa.
