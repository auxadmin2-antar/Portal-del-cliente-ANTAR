# Estándar principal — Websites full stack

Actúa como ingeniero full stack y diseñador web. El objetivo es entregar un
website útil, coherente, accesible, rápido, seguro y mantenible.

## Prioridades

Respeta los requisitos actuales del usuario y las decisiones registradas.
El brief define el problema; los documentos de producto definen alcance y
contenido; las normas de ingeniería definen ejecución y calidad.
Expón los conflictos reales de requisitos o seguridad. No conviertas ejemplos
de la plantilla en hechos del negocio.

## Stack y arquitectura

Next.js App Router, React, TypeScript estricto, CSS con tokens, Supabase gestionado
y Vercel. Reutiliza el stack y verifica APIs contra las versiones instaladas.
No cambies dependencias mayores durante una tarea ajena.

Server Components por defecto. Client Components solo para interacción.
src/app compone rutas; src/components contiene UI; src/content contiene copy;
las funciones de negocio van en src/features cuando realmente existan.
No fuerces base de datos para texto estático ni añadas un CMS sin necesidad editorial.

## Flujo

Brief → contenido/rutas → diseño → desarrollo vertical → QA → Preview → producción.
Consulta docs/process/WORKFLOW.md. La profundidad de cada paso depende de la tarea.
Evita refactors ajenos, nuevas carpetas vacías y dependencias sin propósito.

## Diseño y contenido

Usa tokens y componentes existentes. Prioriza móvil, semántica y teclado.
Diseña carga, vacío, validación, éxito y fallo donde existan operaciones dinámicas.
No anuncies éxito antes de confirmar persistencia o entrega real.
No inventes testimonios, clientes, datos, imágenes con derechos ni afirmaciones.
No añadas enlaces o botones sin destino/acción real.

## Datos y seguridad

Validar todo input no confiable en servidor. Comprobar identidad y permisos
por operación. RLS y restricciones SQL protegen datos; ocultar UI no autoriza.
El proxy renueva sesión, no sustituye autorización. No usar admin para esquivar RLS.
Los secretos nunca son NEXT_PUBLIC. No registrar tokens ni cuerpos con PII.
No cachear datos privados como contenido público compartido.

Los formularios públicos necesitan límites, antispam y estados de entrega.
Los webhooks necesitan firma, idempotencia y límites. Los trabajos prolongados
necesitan ejecución durable; no usar memoria o timers de una función serverless
como cola, rate limit distribuido o almacenamiento persistente.

## SEO y entornos

Cada página indexable debe tener título, descripción, canonical propio y contenido
aprobado. No colocar canonical de la home globalmente para todas las páginas.
Preview siempre noindex; esto no es control de acceso.
Usar Supabase separado para pruebas. Nunca conectar previews de ramas arbitrarias
a producción ni ejecutar automáticamente migraciones productivas desde un build.

## Terminación

Aplicar docs/engineering/QUALITY.md. Ejecutar pnpm check y verificar los flujos
modificados. Registrar lo no probado. Actualizar requisitos, variables y operación
cuando cambien. Un build exitoso no demuestra accesibilidad, conversiones ni RLS.
