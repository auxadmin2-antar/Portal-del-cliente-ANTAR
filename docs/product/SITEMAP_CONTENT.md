# Mapa del sitio y contenido

| Ruta | Audiencia e intención | Título/H1 | Secciones y contenido | CTA real | Fuente/responsable | Indexable |
|---|---|---|---|---|---|---|
| / | Cliente que conoce el proceso antes de empezar | Alta de clientes | A la izquierda título, descripción y botón; a la derecha lista de documentos requeridos | Continuar (a /registro) | src/content/site.ts (home) | No |
| /registro | Cliente que integra su expediente | Formulario de alta | Formulario por pasos (11) | Enviar expediente | src/content/site.ts (form) y src/features/kyc/fields.ts | No |
| /aviso-de-privacidad | Cliente que revisa el tratamiento de datos | Aviso de privacidad integral | 21 secciones: responsable, datos, finalidades, usos prohibidos, acceso interno, encargados, transferencias, ARCO, seguridad, conservación | Volver al formulario | src/content/privacy.ts (BORRADOR, área jurídica) | No |
| /acuerdo-de-confidencialidad | Cliente que revisa las obligaciones de reserva de la empresa | Acuerdo de confidencialidad | Partes, declaraciones y 18 cláusulas | Volver al formulario | src/content/confidentiality.ts (BORRADOR, área jurídica) | No |
| /api/kyc | Endpoint del formulario | — | POST multipart | — | src/features/kyc/submit.ts | No |

El portal no debe indexarse: SITE_INDEXABLE permanece false. Se accede por enlace directo.

## Contrato editorial

Separar copy de layout. Contenido sencillo vive en src/content/; preguntas y
documentos en src/features/kyc/fields.ts (una sola fuente para formulario, validación y PDF).
Toda afirmación verificable debe tener fuente. No publicar placeholders, datos falsos ni enlaces vacíos.
Los datos de la empresa (razón social, domicilio, correo de privacidad, jurisdicción) se llenan una sola vez en src/content/legal.ts.
El aviso y el acuerdo no deben publicarse como definitivos mientras su estado sea draft.
