# Configuración y entornos

| Variable | Tipo / momento | Uso |
|---|---|---|
| SITE_URL | Público, build | Dominio canónico final HTTPS en Production |
| SITE_INDEXABLE | Build, default false | Opt-in para indexar solo Production (mantener false) |
| VERCEL_ENV | Sistema Vercel | Development, Preview o Production; no sobrescribir |
| NEXT_PUBLIC_SUPABASE_URL | Público, build | No usado por el portal KYC |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Público, build | No usado por el portal KYC |
| SUPABASE_REQUIRED | Servidor, runtime | false |
| SUPABASE_SECRET_KEY | Secreto, runtime, opcional | No usado |
| SMTP_HOST / SMTP_PORT | Servidor, runtime | smtp.gmail.com / 465 por defecto |
| SMTP_USER | Secreto, runtime | Cuenta emisora (Gmail) |
| SMTP_PASS | Secreto, runtime | Contraseña de aplicación de Google (no la contraseña normal) |
| MAIL_FROM | Servidor, runtime, opcional | Remitente visible; por defecto SMTP_USER |
| KYC_MAIL_TO | Servidor, runtime | Destinatarios institucionales separados por coma (máx. 20) |
| TURNSTILE_SITE_KEY | Público, runtime | Clave pública de Cloudflare Turnstile; se entrega a la página desde el servidor |
| TURNSTILE_SECRET_KEY | Secreto, runtime | Verificación del captcha en servidor |
| KYC_MAX_TOTAL_MB / KYC_MAX_FILE_MB | Servidor, runtime | 4 en Vercel (límite de 4.5 MB por petición); hasta 15 en Node.js propio |
| KYC_RATE_LIMIT | Servidor, runtime | Envíos por IP y hora (mejor esfuerzo por instancia) |
| KYC_TRUST_PROXY | Servidor, runtime | true en Vercel o detrás de un proxy inverso confiable |
| KYC_DRY_RUN / KYC_OUTPUT_DIR | Solo local | Genera los PDF sin enviar correo y los guarda en una carpeta; prohibido en Production |

En Production el build falla si faltan SMTP_USER, SMTP_PASS, KYC_MAIL_TO o las
claves de Turnstile, o si KYC_DRY_RUN está activo (scripts/validate-build.mjs).
En otros entornos, si la configuración es inválida el formulario muestra
"no disponible" en lugar de aceptar envíos que no se entregarían.

Local: .env.local ignorado por Git. Vercel: valores separados por entorno.
No conectar previews a producción ni usar los destinatarios reales en Preview.
Cambiar SITE_URL, SITE_INDEXABLE o NEXT_PUBLIC requiere nuevo build/deploy.
En Vercel, aplicar cambios de variables mediante un nuevo despliegue.
Usar valores literales sin interpolación entre variables en archivos .env.
Los scripts de validación aplican prioridad: environment exportado >
.env.production.local > .env.local > .env.production > .env.

No fijar NODE_ENV manualmente: el comando de Next selecciona su modo.
No compartir .env ni subirlo al repositorio. Documentar nuevas variables en el
schema (src/config/kyc.schema.ts), .env.example, esta tabla y el procedimiento de publicación.

Referencias: https://vercel.com/docs/environment-variables
y https://vercel.com/docs/deployments/environments
