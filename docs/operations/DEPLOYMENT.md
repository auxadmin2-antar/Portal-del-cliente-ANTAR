# Publicación

Una creación de proyecto remoto o publicación requiere autorización del usuario;
este documento prepara el procedimiento y no ejecuta dichas acciones.

## 1. Cuenta de correo emisora (Gmail)

1. Usar una cuenta dedicada al portal, no una personal.
2. Activar la verificación en 2 pasos.
3. Crear una "Contraseña de aplicación" (Cuenta de Google > Seguridad) y usarla en SMTP_PASS.
4. Definir KYC_MAIL_TO con los correos institucionales que recibirán los expedientes.

## 2. Captcha (Cloudflare Turnstile)

Crear un widget en Cloudflare Turnstile para el dominio del portal y copiar la
clave pública (TURNSTILE_SITE_KEY) y la secreta (TURNSTILE_SECRET_KEY).
En Preview se pueden usar las claves de prueba documentadas en .env.example.

## 3. Fase serverless (Vercel)

1. Crear repositorio y proyecto en Vercel como Next.js con Node 22; conservar pnpm y vercel.json.
2. Configurar variables por entorno según docs/engineering/ENVIRONMENTS.md
   (KYC_TRUST_PROXY=true, KYC_MAX_TOTAL_MB=4, KYC_MAX_FILE_MB=4).
3. En Preview usar destinatarios de prueba, nunca los reales.
4. Crear en Vercel Firewall una regla de rate limit para POST /api/kyc.
5. Hacer un envío de prueba en Preview y confirmar que llegan los dos PDF.
6. Publicar Production con dominio final HTTPS y SITE_INDEXABLE=false.

## 4. Fase Node.js propio

1. Servidor con Node 22 y pnpm; clonar el repositorio.
2. pnpm install --frozen-lockfile && pnpm build.
3. Ejecutar pnpm start (puerto 3000) con un gestor de procesos (systemd o pm2).
4. Poner delante un proxy inverso con HTTPS (Caddy o nginx) que fije X-Forwarded-For
   y X-Forwarded-Proto; configurar KYC_TRUST_PROXY=true.
5. Limitar el cuerpo en el proxy (p. ej. client_max_body_size 16m en nginx).
6. Se puede subir KYC_MAX_TOTAL_MB hasta 15 (Gmail rechaza correos de más de 25 MB).
7. VERCEL_ENV no existe fuera de Vercel: para exigir la configuración de producción
   en el build, exportar VERCEL_ENV=production al compilar.

## Protección y rollback

noindex no protege acceso. Configurar Deployment Protection para previews.
Revertir un deployment no afecta correos ya enviados.

Fuentes oficiales:
- https://vercel.com/docs/deployments/environments
- https://vercel.com/docs/deployment-protection
- https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting
- https://developers.cloudflare.com/turnstile/
- https://support.google.com/accounts/answer/185833
