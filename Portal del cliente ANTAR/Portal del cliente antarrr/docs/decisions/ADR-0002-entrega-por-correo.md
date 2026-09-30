# ADR-0002 — Entrega por correo sin almacenamiento

Estado: Aceptada por el usuario para la fase de pruebas.

El cliente llena un formulario y adjunta documentos. El servidor valida, genera
dos PDF (expediente KYC/CTC unificado y documentos unidos) y los envía por SMTP
desde una cuenta Gmail a destinatarios institucionales. No se guarda nada en
base de datos ni en Storage; Supabase no se usa.

Ventajas: sin infraestructura de datos que proteger en el portal; flujo simple
para el área receptora; mismo código en Vercel y en Node.js propio.

Costes: el correo es el repositorio de facto (retención y acceso en buzones);
límite de 4.5 MB por petición en Vercel; cuota diaria y tamaño máximo de Gmail;
sin reintento durable si el SMTP falla (el cliente ve el error y reintenta).

Revisar si el volumen, los requisitos de auditoría o la retención exigen guardar
los expedientes en Storage privado con un panel interno autenticado.
