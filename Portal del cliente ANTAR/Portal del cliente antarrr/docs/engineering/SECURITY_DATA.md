# Seguridad, formularios y datos

## Portal KYC: controles implementados

| Riesgo | Control | Dónde |
|---|---|---|
| XSS / inyección de scripts | CSP con nonce por petición y strict-dynamic; React escapa todo; sin HTML de usuario | src/proxy.ts |
| Clickjacking | frame-ancestors 'none' y X-Frame-Options DENY | src/proxy.ts, next.config.ts |
| Envíos desde otros sitios (CSRF / abuso) | Origin obligatorio y del mismo sitio; Sec-Fetch-Site | src/features/kyc/security.ts |
| Bots y spam | Cloudflare Turnstile verificado en servidor (falla cerrado), honeypot, tiempo mínimo de llenado | submit.ts, security.ts |
| Abuso por volumen | Límite por IP y hora; cuerpo leído con tope estricto aunque falte Content-Length | security.ts, files.ts |
| Datos malformados | Zod en servidor; campos desconocidos ignorados; condicionales ocultos vaciados; caracteres de control eliminados; longitudes y filas acotadas | validation.ts |
| Archivos maliciosos o disfrazados | Extensión permitida + firma binaria real; PDF re-procesado con pdf-lib; se eliminan anotaciones y acciones (enlaces, JavaScript); PDF cifrados rechazados; límite de páginas | files.ts, pdf.ts |
| Nombres de archivo peligrosos | Se descarta la ruta y se limpian caracteres | files.ts |
| Inyección de cabeceras de correo | Asunto en una línea; destinatarios solo de configuración; Reply-To validado como correo | mail.ts |
| Doble envío | Botón bloqueado mientras envía; huella del expediente evita reenviar en 15 min | kyc-form.tsx, security.ts |
| Fuga de datos en errores o logs | Respuestas con códigos genéricos; logs solo con folio, evento y tamaños | submit.ts |
| Secretos expuestos | Solo en variables de servidor; nunca NEXT_PUBLIC; mensajes de configuración sin valores | kyc.schema.ts |
| Configuración incompleta en producción | Build falla sin correo ni captcha; dry-run prohibido en Production | scripts/validate-build.mjs |

## Riesgos residuales (decisiones del responsable)

- El correo es el canal de entrega: los PDF viajan cifrados en tránsito (TLS) pero
  quedan en la carpeta Enviados de la cuenta Gmail y en los buzones de destino.
  Proteger la cuenta emisora con verificación en 2 pasos y revisar su retención.
- En serverless el límite por IP y la deduplicación son por instancia. Crear en
  Vercel Firewall una regla de rate limit para POST /api/kyc (p. ej. 10 por hora
  por IP). En Node.js propio el límite en memoria es global al proceso.
- Gmail limita envíos diarios y el tamaño del mensaje a 25 MB. Para volumen alto,
  usar un proveedor transaccional o el SMTP del dominio institucional.
- Los PDF del cliente se re-empaquetan pero no se analizan con antivirus. Si se
  requiere, añadir un escaneo antes del envío.
- La aceptación electrónica no es firma electrónica avanzada.

## Autenticación y autorización

No hay login ni rutas privadas. El proxy solo renueva sesión Supabase en /account,
/admin y /auth (sin uso actual). Verificar identidad en servidor si se añaden.

## Formularios públicos

Validación Zod en servidor; límites de tamaño y frecuencia; manejo de spam;
protección frente a peticiones no autorizadas; honeypot/captcha como parte del
control. Un límite en memoria no funciona de forma global en serverless.
Registrar entrega real antes de mostrar éxito. Retener datos mínimos.

## Cabeceras y observabilidad

nosniff, DENY, Referrer-Policy, Permissions-Policy, COOP y HSTS en producción.
CSP diseñada para los orígenes reales: solo 'self' y challenges.cloudflare.com
(Turnstile). No añadir unsafe-inline. Logs con identificador de petición y error
seguro, nunca tokens, claves o formularios completos.
