# Mapa del sitio y contenido

| Ruta | Audiencia e intención | Título/H1 | Secciones y contenido | CTA real | Fuente/responsable | Indexable |
|---|---|---|---|---|---|---|
| / | Cliente que integra su expediente | Alta de clientes | Introducción, lista de documentos, formulario por pasos | Enviar expediente | src/content/site.ts y src/features/kyc/fields.ts | No |
| /aviso-de-privacidad | Cliente que revisa el tratamiento de datos | Aviso de privacidad | Responsable, datos, finalidades, transferencias, ARCO | — | src/content/privacy.ts (BORRADOR, área legal) | No |
| /api/kyc | Endpoint del formulario | — | POST multipart | — | src/features/kyc/submit.ts | No |

El portal no debe indexarse: SITE_INDEXABLE permanece false. Se accede por enlace directo.

## Contrato editorial

Separar copy de layout. Contenido sencillo vive en src/content/; preguntas y
documentos en src/features/kyc/fields.ts (una sola fuente para formulario, validación y PDF).
Toda afirmación verificable debe tener fuente. No publicar placeholders, datos falsos ni enlaces vacíos.
El aviso de privacidad no puede publicarse en producción mientras su estado sea draft.
