# Registro de funciones

Estados: PLANNED, IN_PROGRESS, READY_FOR_REVIEW, DONE, BLOCKED.
Registrar prioridad, criterio de aceptación y dependencias por función.

| ID | Función | Estado | Criterio |
|---|---|---|---|
| REF-01 | Página pública de referencia | REPLACED | Sustituida por el formulario KYC |
| REF-02 | Infraestructura SEO segura | DONE | Preview noindex; canonical y sitemap según entorno |
| F-001 | Formulario KYC/CTC unificado por pasos | READY_FOR_REVIEW | 9 secciones + documentos + revisión; validación por paso; borrador en sessionStorage |
| F-002 | Carga de documentos | READY_FOR_REVIEW | PDF/JPG/PNG verificados por firma binaria; imágenes grandes reducidas en el navegador |
| F-003 | Endpoint /api/kyc | READY_FOR_REVIEW | Valida todo en servidor; genera dos PDF; responde folio solo tras entrega |
| F-004 | Entrega por correo (Gmail SMTP) | READY_FOR_REVIEW | Correo a KYC_MAIL_TO con 2 PDF; probado en modo DRY_RUN, pendiente prueba con cuenta real |
| F-005 | Aviso de privacidad integral y acuerdo de confidencialidad | READY_FOR_REVIEW | Borradores detallados; enlaces en las casillas de aceptación; versión aceptada registrada en el PDF. Pendiente: datos de la empresa en src/content/legal.ts y aprobación jurídica |
| F-007 | Conservación del formulario en la pestaña | READY_FOR_REVIEW | Texto y paso sobreviven a recargas (sessionStorage); archivos y todo lo demás sobreviven a la navegación interna (memoria); se borra al cerrar la pestaña, al enviar o con «Borrar la información capturada» |
| F-006 | Migración a Node.js propio | PLANNED | Ver docs/operations/DEPLOYMENT.md, sección Node.js |

No implementar automáticamente login, formularios, pagos o CMS porque aparezcan
en los documentos. Crear tareas usando docs/templates/TASK.md.
