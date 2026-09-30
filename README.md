# Portal de alta de clientes (KYC / CTC)

Formulario web para que los clientes de Grupo Antar capturen su información y
adjunten su documentación. La empresa recibe por correo dos PDF:

1. KYC_<folio>.pdf: expediente que une el Formato KYC-CTC y el Modelo KYC, con
   un resumen de respuestas que requieren revisión de cumplimiento.
2. Documentos_<folio>.pdf: todos los documentos del cliente en un solo archivo.

Construido sobre fullstack_website_starter (Next.js, React, TypeScript estricto,
Vercel). El agente comienza por AGENTS.md.

## Inicio local

1. Instalar Node 22.23.2 y pnpm 10.34.5, fijados en el repositorio.
2. Copiar .env.example a .env.local (PowerShell: Copy-Item .env.example .env.local).
3. Para probar sin correo: KYC_DRY_RUN=true y KYC_OUTPUT_DIR=salidas-prueba
   (los PDF se guardan en esa carpeta). Claves de prueba de Turnstile en .env.example.
4. pnpm install --frozen-lockfile
5. pnpm dev y abrir http://localhost:3000
6. pnpm check antes de entregar cambios (lint, tipos, pruebas, build y smoke HTTP).

## Mapa del código

| Ubicación | Responsabilidad |
|---|---|
| src/features/kyc/fields.ts | Preguntas, secciones y documentos: fuente única |
| src/features/kyc/validation.ts | Validación Zod compartida (cliente y servidor) |
| src/features/kyc/submit.ts | Endpoint: controles, validación, PDF y correo |
| src/features/kyc/pdf.ts | Generación de los dos PDF |
| src/features/kyc/files.ts | Tipos reales de archivo y lectura con límite |
| src/features/kyc/security.ts | Origen, límite de frecuencia, captcha, duplicados |
| src/features/kyc/mail.ts | Correo SMTP |
| src/features/kyc/ui/ | Formulario por pasos |
| src/config/kyc.schema.ts | Configuración y reglas de producción |
| src/proxy.ts | CSP con nonce por petición |
| src/app/api/kyc/route.ts | Ruta POST |

Para cambiar una pregunta o un documento, editar fields.ts: el formulario, la
validación y el PDF se actualizan juntos.

## Documentación

- docs/product/BRIEF.md y docs/product/FEATURES.md: alcance y estado.
- docs/engineering/SECURITY_DATA.md: controles y riesgos residuales.
- docs/engineering/ENVIRONMENTS.md: variables.
- docs/operations/DEPLOYMENT.md: Gmail, Turnstile, Vercel y Node.js propio.
- docs/decisions/ADR-0002-entrega-por-correo.md: por qué no hay base de datos.

Consulta STARTER_STATUS.md para distinguir lo implementado de lo pendiente.
No se han creado cuentas, proyectos remotos ni despliegues.
