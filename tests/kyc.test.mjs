import test from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument, PDFName } from 'pdf-lib';
import { validateKyc } from '../src/features/kyc/validation.ts';
import { DOCUMENTS, flaggedFields } from '../src/features/kyc/fields.ts';
import { detectFileType, safeFileName, readLimitedBody, BodyTooLargeError } from '../src/features/kyc/files.ts';
import { buildAttachmentsPdf, buildFormPdf, AttachmentError } from '../src/features/kyc/pdf.ts';
import { isRateLimited, isSameOrigin, clientKey, verifyCaptcha } from '../src/features/kyc/security.ts';
import { readKycConfig } from '../src/config/kyc.schema.ts';
import { validKyc, tinyPng } from './fixtures/kyc.mjs';

async function samplePdf(pages = 1, { annotate = false } = {}) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) {
    const page = doc.addPage([200, 200]);
    page.drawText(`Pagina ${i + 1}`, { x: 20, y: 100, size: 12 });
    if (annotate) page.node.set(PDFName.of('Annots'), doc.context.obj([doc.context.obj({ Type: 'Annot', Subtype: 'Link' })]));
  }
  return doc.save();
}

test('a complete submission validates and normalizes values', () => {
  const result = validateKyc(validKyc());
  assert.deepEqual(result.errors, {});
  assert.equal(result.ok, true);
  assert.equal(result.values.rfc, 'CPR010101AB1');
  assert.equal(result.values.beneficiarios.length, 2);
});

test('required, format and conditional rules are enforced on the server', () => {
  const input = { ...validKyc(), razon_social: '  ', rfc: 'ABC', dom_cp: '123', contacto_email: 'no-es-correo', hay_modif: 'si', ack_veraz: '' };
  const { errors } = validateKyc(input);
  for (const id of ['razon_social', 'rfc', 'dom_cp', 'contacto_email', 'mod_desc', 'mod_numero', 'ack_veraz']) assert.ok(errors[id], `missing error for ${id}`);
});

test('hidden conditional answers are discarded and unknown keys ignored', () => {
  const { values, errors } = validateKyc({ ...validKyc(), cotiza: 'no', cotiza_det: 'Bolsa X', __proto__x: 'y', extra: '<script>' });
  assert.deepEqual(errors, {});
  assert.equal(values.cotiza_det, '');
  assert.equal('extra' in values, false);
});

test('choices only accept declared values and dates cannot be in the future', () => {
  const { errors } = validateKyc({ ...validKyc(), licencia: 'quizas', e_seguridad: 'otro', fecha_constitucion: '2999-01-01', inst_fecha: '2023-02-30' });
  for (const id of ['licencia', 'e_seguridad', 'fecha_constitucion', 'inst_fecha']) assert.ok(errors[id], id);
});

test('tables reject incomplete rows, oversized lists and ownership above 100 %', () => {
  const base = validKyc();
  assert.ok(validateKyc({ ...base, directivos: [{ nombre: 'Solo nombre' }] }).errors.directivos);
  assert.ok(validateKyc({ ...base, beneficiarios: [{ nombre: 'A', apellido: 'B', nacionalidad: 'C', pct: '70' }, { nombre: 'D', apellido: 'E', nacionalidad: 'F', pct: '40' }] }).errors.beneficiarios);
  assert.ok(validateKyc({ ...base, administradores: Array.from({ length: 21 }, () => ({ posicion: 'x', nombre: 'y' })) }).errors.administradores);
  assert.ok(validateKyc({ ...base, administradores: [] }).errors.administradores);
});

test('text is trimmed, control characters removed and lengths bounded', () => {
  const { values, errors } = validateKyc({ ...validKyc(), razon_social: 'Empresa\u0000\u0007 \n Norte', negocio: 'x'.repeat(2001) });
  assert.equal(values.razon_social, 'Empresa Norte');
  assert.ok(errors.negocio);
});

test('answers that need compliance review are flagged', () => {
  const { values } = validateKyc({ ...validKyc(), inhabilitada: 'si', inhab_det: 'Detalle', d_cuenta: 'no' });
  assert.deepEqual(flaggedFields(values).map(field => field.id).sort(), ['d_cuenta', 'inhabilitada']);
});

test('file types are detected by content, not by name', async () => {
  assert.equal(detectFileType(await samplePdf()), 'pdf');
  assert.equal(detectFileType(tinyPng), 'png');
  assert.equal(detectFileType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0])), 'jpg');
  assert.equal(detectFileType(new TextEncoder().encode('<html><script>alert(1)</script>')), null);
  assert.equal(safeFileName('..\\..\\etc/pass wd<>.pdf'), 'pass wd__.pdf');
});

test('request bodies are read with a hard size limit', async () => {
  const request = new Request('http://localhost/api/kyc', { method: 'POST', body: new Uint8Array(2048), duplex: 'half' });
  await assert.rejects(readLimitedBody(request, 1024), BodyTooLargeError);
  const small = new Request('http://localhost/api/kyc', { method: 'POST', body: new Uint8Array(10), duplex: 'half' });
  assert.equal((await readLimitedBody(small, 1024)).byteLength, 10);
});

test('the unified PDFs are generated and client annotations removed', async () => {
  const { values } = validateKyc(validKyc());
  const meta = { folio: 'KYC-20260101-TEST', receivedAt: new Date('2026-01-01T12:00:00Z') };
  const files = { doc_csf: { name: 'csf.pdf', bytes: await samplePdf(2, { annotate: true }) }, doc_ident: { name: 'ine.png', bytes: new Uint8Array(tinyPng) } };
  const { bytes, info } = await buildAttachmentsPdf(files, meta);
  const merged = await PDFDocument.load(bytes);
  // índice + (portada + 2 páginas) + (portada + imagen)
  assert.equal(merged.getPageCount(), 6);
  // pdf-lib normaliza cada página con un arreglo Annots; debe quedar vacío.
  assert.ok(merged.getPages().every(page => (page.node.get(PDFName.of('Annots'))?.size() ?? 0) === 0));
  assert.equal(info.length, DOCUMENTS.length);
  assert.equal(info.find(item => item.id === 'doc_csf').pages, 2);
  const form = await PDFDocument.load(await buildFormPdf(values, meta, info));
  assert.ok(form.getPageCount() >= 3);
});

test('damaged or encrypted documents are rejected with the affected field', async () => {
  const meta = { folio: 'KYC-TEST', receivedAt: new Date() };
  await assert.rejects(buildAttachmentsPdf({ doc_sat: { name: 'x.pdf', bytes: new TextEncoder().encode('%PDF-1.7 roto') } }, meta),
    error => error instanceof AttachmentError && error.field === 'doc_sat');
  await assert.rejects(buildAttachmentsPdf({ doc_sat: { name: 'x.pdf', bytes: new TextEncoder().encode('texto') } }, meta),
    error => error instanceof AttachmentError && error.reason === 'invalid');
});

test('only same-origin browser requests are accepted', () => {
  const make = headers => new Request('https://kyc.acme.com/api/kyc', { method: 'POST', headers });
  assert.equal(isSameOrigin(make({ origin: 'https://kyc.acme.com', host: 'kyc.acme.com' }), 'https://kyc.acme.com'), true);
  assert.equal(isSameOrigin(make({ origin: 'https://evil.com', host: 'kyc.acme.com' }), 'https://kyc.acme.com'), false);
  assert.equal(isSameOrigin(make({ host: 'kyc.acme.com' }), 'https://kyc.acme.com'), false);
  assert.equal(isSameOrigin(make({ origin: 'https://kyc.acme.com', host: 'kyc.acme.com', 'sec-fetch-site': 'cross-site' }), 'https://kyc.acme.com'), false);
  assert.equal(isSameOrigin(make({ origin: 'http://kyc.acme.com', host: 'kyc.acme.com' }), 'https://kyc.acme.com'), false);
});

test('rate limiting counts attempts per client within an hour', () => {
  const key = `test-${Math.random()}`;
  const now = Date.now();
  for (let i = 0; i < 3; i++) assert.equal(isRateLimited(key, 3, now), false);
  assert.equal(isRateLimited(key, 3, now), true);
  assert.equal(isRateLimited(key, 3, now + 3_600_001), false);
  assert.equal(clientKey(new Headers({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }), true), '1.2.3.4');
  assert.equal(clientKey(new Headers({ 'x-forwarded-for': '1.2.3.4' }), false), 'local');
});

test('captcha verification fails closed', async () => {
  assert.equal(await verifyCaptcha('secret', '', 'x'), false);
  assert.equal(await verifyCaptcha('secret', 'token', 'x', async () => { throw new Error('down'); }), false);
  assert.equal(await verifyCaptcha('secret', 'token', 'x', async () => Response.json({ success: false })), false);
  assert.equal(await verifyCaptcha('secret', 'token', 'x', async () => Response.json({ success: true })), true);
});

test('KYC configuration requires delivery and captcha in production without leaking secrets', () => {
  const mail = { SMTP_USER: 'envios@gmail.com', SMTP_PASS: 'very-secret-pass', KYC_MAIL_TO: 'a@acme.com, b@acme.com' };
  const captcha = { TURNSTILE_SITE_KEY: 'site', TURNSTILE_SECRET_KEY: 'secret' };
  assert.throws(() => readKycConfig({}));
  assert.equal(readKycConfig({ KYC_DRY_RUN: 'true' }).dryRun, true);
  assert.deepEqual(readKycConfig(mail).mail.to, ['a@acme.com', 'b@acme.com']);
  assert.throws(() => readKycConfig({ VERCEL_ENV: 'production', ...mail }));
  assert.throws(() => readKycConfig({ VERCEL_ENV: 'production', ...mail, ...captcha, KYC_DRY_RUN: 'true' }));
  assert.equal(readKycConfig({ VERCEL_ENV: 'production', ...mail, ...captcha }).production, true);
  assert.throws(() => readKycConfig({ ...mail, KYC_MAIL_TO: 'no-es-correo' }));
  assert.throws(() => readKycConfig({ ...mail, SMTP_PORT: 'abc' }), error => !error.message.includes('very-secret-pass'));
  assert.throws(() => readKycConfig({ SMTP_USER: 'solo@gmail.com', KYC_DRY_RUN: 'true' }));
  const limits = readKycConfig({ ...mail, KYC_MAX_TOTAL_MB: '4', KYC_MAX_FILE_MB: '10' }).limits;
  assert.equal(limits.maxFileBytes, limits.maxTotalBytes);
});
