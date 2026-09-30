# Publicar en GitHub y Vercel

Esta carpeta ya es un repositorio Git con un remoto de GitHub configurado. Antes
de enviar cambios, comprobar el estado:

```powershell
git status --short --branch
```

No deben aparecer `.env.local`, `node_modules`, `.next`, `salidas-prueba` ni
archivos de credenciales. `.env.example` sí forma parte del repositorio y no
incluye valores secretos.

## 1. Enviar el repositorio a GitHub

Desde esta carpeta, iniciar sesión en GitHub si hiciera falta y ejecutar:

```powershell
git push origin main
```

También se puede abrir la carpeta con GitHub Desktop y pulsar **Push origin**.
No usar **Publish repository**: el remoto ya existe. En GitHub, comprobar que
el flujo **Website checks** finalice correctamente antes de seguir con Vercel.

Mantener el repositorio como **Private**, ya que el portal trata expedientes de
clientes aunque los secretos no se almacenen en Git.

## 2. Antes de importar en Vercel

Tener a la mano (ver docs/operations/DEPLOYMENT.md):

- Clave pública y secreta de **Cloudflare Turnstile** (gratis, dash.cloudflare.com > Turnstile).
- Dirección de Gmail emisora y su contraseña de aplicación.
- Correos institucionales que reciben.

En Production el build **falla a propósito** si falta el correo o el captcha. Es una protección,
no un error del proyecto.

## 3. Importar en Vercel

1. Add New > Project > importar el repositorio. Framework: Next.js (se detecta solo).
2. Mantener la raíz del proyecto en esta carpeta y confirmar Node.js **22.x**.
   El repositorio fija la versión 22.23.2 para desarrollo y CI.
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

   Configurar primero **Production**. Para **Preview** usar tu propio correo en
   `KYC_MAIL_TO` y las claves de prueba de Turnstile (en `.env.example`), nunca
   los destinatarios reales. No copiar secretos de Production a Preview.
4. Deploy. Cambiar una variable exige un nuevo deploy. Si se añade un dominio
   personalizado después del primer despliegue, actualizar `SITE_URL` y volver
   a desplegar.

## 4. Después de publicar

- Enviar un expediente de prueba con datos ficticios y confirmar que llegan los dos PDF.
- Vercel > Firewall: crear regla de límite de peticiones para `POST /api/kyc`.
- Settings > Deployment Protection: activar para las Preview.
- Sustituir el borrador del aviso de privacidad (`src/content/privacy.ts`) por el texto aprobado.
- Conservar `SITE_INDEXABLE=false` hasta tener contenido, dominio y revisión de
  lanzamiento aprobados.
