# Publicar en GitHub y Vercel

## 1. Subir a GitHub con GitHub Desktop

1. File > Add local repository > elegir esta carpeta. Si dice que no es un repositorio, pulsar "create a repository".
2. Comprobar que en la lista de cambios NO aparecen `.env.local`, `node_modules` ni `.next`.
   Solo debe aparecer `.env.example` (sin valores).
3. Commit inicial y "Publish repository". Marcarlo como **Private**.

## 2. Antes de importar en Vercel

Tener a la mano (ver docs/operations/DEPLOYMENT.md):

- Clave pública y secreta de **Cloudflare Turnstile** (gratis, dash.cloudflare.com > Turnstile).
- Dirección de Gmail emisora y su contraseña de aplicación.
- Correos institucionales que reciben.

En Production el build **falla a propósito** si falta el correo o el captcha. Es una protección,
no un error del proyecto.

## 3. Importar en Vercel

1. Add New > Project > importar el repositorio. Framework: Next.js (se detecta solo).
2. Settings > General > Node.js Version: **22.x**.
3. Variables de entorno (Settings > Environment Variables):

| Variable | Valor |
|---|---|
| SITE_URL | La URL final con https, por ejemplo https://mi-proyecto.vercel.app (sin barra ni ruta) |
| SITE_INDEXABLE | false |
| SMTP_USER | Gmail emisora |
| SMTP_PASS | Contraseña de aplicación (16 caracteres) |
| KYC_MAIL_TO | Correos institucionales separados por coma |
| TURNSTILE_SITE_KEY | Clave pública |
| TURNSTILE_SECRET_KEY | Clave secreta |
| KYC_TRUST_PROXY | true |
| KYC_MAX_TOTAL_MB / KYC_MAX_FILE_MB | 4 |

   Para **Preview** usar tu propio correo en KYC_MAIL_TO y las claves de prueba de Turnstile
   (en .env.example), nunca los destinatarios reales.
4. Deploy. Cambiar una variable exige un nuevo deploy.

## 4. Después de publicar

- Enviar un expediente de prueba con datos ficticios y confirmar que llegan los dos PDF.
- Vercel > Firewall: crear regla de límite de peticiones para `POST /api/kyc`.
- Settings > Deployment Protection: activar para las Preview.
- Sustituir el borrador del aviso de privacidad (src/content/privacy.ts) por el texto aprobado.
