# Brief del website — Portal de alta de clientes

Estado: DEFINIDO (fase de pruebas). Los puntos marcados como pendientes requieren decisión.

| Campo | Definición |
|---|---|
| Proyecto / marca | Grupo Antar · Alta de clientes. Portal para integrar el expediente KYC / CTC de clientes |
| Objetivo principal | Que el cliente capture su información y adjunte su documentación en línea, y que la empresa reciba un expediente ordenado por correo |
| Audiencia | Representantes y personal administrativo de empresas que solicitan ser clientes |
| Propuesta de valor | Un solo cuestionario en lugar de dos formatos Word; validación inmediata; documentos unidos en un PDF |
| Conversión principal | Enviar el expediente completo y recibir un folio |
| MVP | Formulario por pasos (/), aviso de privacidad, endpoint /api/kyc, dos PDF por correo |
| Fuera de alcance | Cuentas de cliente, panel interno, almacenamiento de expedientes, firma electrónica avanzada |
| Idiomas / mercado | Español, México, zona horaria America/Mexico_City |
| Responsables | Pendiente: contenido legal (aviso de privacidad), cumplimiento (destinatarios), técnica y publicación |
| Restricciones | Datos personales y financieros sensibles; primera fase serverless (Vercel), después Node.js propio; envío desde una cuenta Gmail |

## Material existente

Formatos de origen en la carpeta superior: Formato_KYC-CTC.docx (formato del CENAGAS)
y Modelo KYC.docx (cuestionario de debida diligencia). Ambos se unificaron en
src/features/kyc/fields.ts. Sin logotipos por decisión del usuario.

## Métricas y aceptación

- El cliente completa las 11 secciones y recibe un folio solo cuando el correo se entregó.
- La empresa recibe KYC_<folio>.pdf (información) y Documentos_<folio>.pdf (anexos unidos).
- Las respuestas de riesgo aparecen resumidas en la primera página del expediente.
- pnpm check pasa, incluido el smoke del endpoint.
