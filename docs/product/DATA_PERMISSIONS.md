# Datos y permisos

El portal no tiene base de datos ni cuentas. Cada envío se procesa en memoria,
se entrega por correo y se descarta. No se usan Supabase ni Storage.

| Entidad | Campos/restricciones | Propietario | Sensibilidad | Retención en el portal |
|---|---|---|---|---|
| Expediente KYC | Campos de src/features/kyc/fields.ts; límites de longitud, formato y filas | Empresa solicitante | Alta: identificación, cuenta bancaria, accionistas | Ninguna (solo memoria durante la petición) |
| Documentos adjuntos | Máx. 9, PDF/JPG/PNG, límite por archivo y total | Empresa solicitante | Alta: identificaciones oficiales, actas | Ninguna |
| Borrador del formulario | Texto y paso en sessionStorage; archivos solo en memoria (nunca en disco) | Navegador del cliente | Alta | Mientras la pestaña esté abierta; se borra al cerrarla, al enviar o a petición del usuario |
| Registros (logs) | Evento, folio, código de error, tamaños | Operación | Baja: sin datos del formulario | Según el proveedor de hosting |

| Recurso / operación | Anónimo | Empresa (destinatarios) | Administrador |
|---|---|---|---|
| Ver formulario | Sí | — | — |
| POST /api/kyc | Sí, con mismo origen, captcha y límites | — | — |
| Leer expedientes | No (no se almacenan) | Solo por correo en KYC_MAIL_TO | Buzones de correo |

La retención real ocurre en los buzones de destino y en la cuenta Gmail emisora
(carpeta Enviados). Definir quién accede, cuánto tiempo se conservan y cómo se
eliminan. El tipo Database incluido está vacío y es un placeholder explícito.
