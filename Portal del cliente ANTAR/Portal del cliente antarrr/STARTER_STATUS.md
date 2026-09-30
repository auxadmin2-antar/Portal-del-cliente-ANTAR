# Estado del proyecto

## Implementado y verificado localmente

- [x] Base del starter: Next.js, TypeScript estricto, tokens, componentes, SEO noindex, health.
- [x] Formulario KYC/CTC unificado en 11 pasos con validación, condicionales y tablas.
- [x] Borrador en sessionStorage (solo texto, se borra al cerrar la pestaña o al enviar).
- [x] Carga de documentos con verificación de tipo real y reducción de imágenes.
- [x] Endpoint /api/kyc con controles de origen, captcha, tamaño, frecuencia y duplicados.
- [x] Dos PDF generados (expediente y documentos unidos) y envío SMTP.
- [x] CSP con nonce por petición; cabeceras de seguridad.
- [x] Pruebas unitarias (24), smoke HTTP del endpoint y prueba manual en navegador (modo dry-run).

## Pendiente

- [ ] Texto definitivo del aviso de privacidad (área legal).
- [ ] Cuenta Gmail emisora, contraseña de aplicación y destinatarios reales.
- [ ] Claves reales de Cloudflare Turnstile.
- [ ] Prueba de envío real por SMTP en Preview.
- [ ] Proyecto Vercel, dominio y regla de rate limit en Vercel Firewall.
- [ ] Revisión de accesibilidad con lector de pantalla y QA visual en dispositivos reales.
- [ ] Política de retención de los correos recibidos.
- [ ] Migración a Node.js propio (procedimiento en docs/operations/DEPLOYMENT.md).
