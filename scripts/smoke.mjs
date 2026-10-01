import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { buildEnvironment } from './env.mjs';
import { readSiteConfig } from '../src/config/site.ts';
import { validKyc } from '../tests/fixtures/kyc.mjs';

// PDF de una página válido y mínimo, sin dependencias.
function minimalPdf() {
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] >>'];
  let body = '%PDF-1.4\n';
  const offsets = objects.map((object, index) => { const offset = body.length; body += `${index + 1} 0 obj\n${object}\nendobj\n`; return offset; });
  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}`;
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(body);
}

const env = buildEnvironment();
const site = readSiteConfig(env);
async function start(required) {
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], {
    env: {
      ...env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', SUPABASE_REQUIRED: String(required), NEXT_PUBLIC_SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '', SUPABASE_SECRET_KEY: '',
      // The smoke test never sends email nor calls Cloudflare, whatever .env.local contains.
      KYC_DRY_RUN: 'true', KYC_OUTPUT_DIR: '', SMTP_USER: '', SMTP_PASS: '', KYC_MAIL_TO: '',
      TURNSTILE_SITE_KEY: '', TURNSTILE_SECRET_KEY: '', KYC_RATE_LIMIT: '50', KYC_MAX_TOTAL_MB: '1', KYC_MAX_FILE_MB: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', chunk => { output = (output + chunk).slice(-4000); });
  child.stderr.on('data', chunk => { output = (output + chunk).slice(-4000); });
  const base = `http://127.0.0.1:${port}`;
  async function stop() {
    if (child.exitCode !== null || child.signalCode !== null) return;
    const ended = once(child, 'exit'); child.kill(); await ended;
  }
  try {
    for (let i = 0; i < 300; i++) { // hasta ~45 s en equipos lentos
      if (child.exitCode !== null) throw new Error('Server exited: ' + output);
      try { if ((await fetch(base + '/api/health/live', { signal: AbortSignal.timeout(1000) })).ok) return { base, stop }; } catch { /* Startup polling. */ }
      await delay(150);
    }
    throw new Error('Startup timed out: ' + output);
  } catch (error) { await stop(); throw error; }
}
const app = await start(false);
try {
  const response = await fetch(app.base);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  const html = await response.text();
  assert.match(html, /<html lang="es"/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.ok(html.includes('Saltar al contenido'));
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.ok(canonical, 'The rendered page must contain a canonical link');
  assert.equal(new URL(canonical[1]).href, new URL(site.origin).href);
  const robots = await (await fetch(app.base + '/robots.txt')).text();
  const sitemap = await (await fetch(app.base + '/sitemap.xml')).text();
  if (!site.indexable) {
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.match(html, /content="noindex, nofollow"/);
    assert.match(robots, /Disallow: \/\s/);
    assert.ok(!sitemap.includes('<loc>'));
  } else {
    assert.equal(response.headers.get('x-robots-tag'), null);
    assert.ok(sitemap.includes(`<loc>${site.origin}/</loc>`));
  }
  assert.equal((await fetch(app.base + '/ruta-inexistente')).status, 404);
  assert.equal((await fetch(app.base + '/api/health/ready')).status, 200);
  console.log('PASS: homepage, canonical, language, indexing, headers, sitemap, 404 and public health.');

  // Página con CSP por nonce: cada script de Next.js debe llevar el nonce de la cabecera.
  const csp = response.headers.get('content-security-policy') ?? '';
  const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
  assert.ok(nonce, 'The page must send a nonce-based CSP');
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /object-src 'none'/);
  const scripts = html.match(/<script\b[^>]*>/g) ?? [];
  assert.ok(scripts.length > 0 && scripts.every(tag => tag.includes(`nonce="${nonce}"`)), 'Every script must carry the request nonce');
  assert.notEqual((await fetch(app.base)).headers.get('content-security-policy'), csp, 'Nonce must change per request');
  assert.equal((await fetch(app.base + '/aviso-de-privacidad')).status, 200);
  const registro = await fetch(app.base + '/registro');
  assert.equal(registro.status, 200);
  const registroHtml = await registro.text();
  assert.equal((registroHtml.match(/<h1[ >]/g) || []).length, 1);
  assert.match(registroHtml, /rel="canonical" href="[^"]*\/registro"/);
  assert.match(html, /href="\/registro"/, 'Home must link to the form');
  const agreement = await fetch(app.base + '/acuerdo-de-confidencialidad');
  assert.equal(agreement.status, 200);
  assert.match(await agreement.text(), /Acuerdo de confidencialidad/);

  if (env.VERCEL_ENV !== 'production') {
    const endpoint = app.base + '/api/kyc';
    const origin = { origin: app.base };
    const post = (body, headers = origin) => fetch(endpoint, { method: 'POST', body, headers });
    const submission = (data, extra = {}) => {
      const form = new FormData();
      form.set('data', JSON.stringify(data));
      form.set('startedAt', String(Date.now() - 60_000));
      const pdf = new Blob([minimalPdf()], { type: 'application/pdf' });
      for (const id of ['doc_csf', 'doc_acta', 'doc_poder', 'doc_ident', 'doc_sat', 'doc_imss', 'doc_infonavit', 'doc_domicilio']) form.set(id, pdf, `${id}.pdf`);
      for (const [key, value] of Object.entries(extra)) form.set(key, value);
      return form;
    };
    assert.equal((await fetch(endpoint)).status, 405);
    assert.equal((await post(submission(validKyc()), { origin: 'https://evil.example' })).status, 403);
    assert.equal((await post(submission(validKyc()), {})).status, 403);
    assert.equal((await post(JSON.stringify(validKyc()), { ...origin, 'content-type': 'application/json' })).status, 415);
    const big = submission(validKyc());
    big.set('doc_domicilio', new Blob([new Uint8Array(1_200_000)], { type: 'application/pdf' }), 'grande.pdf');
    assert.equal((await post(big)).status, 413);
    const fake = submission(validKyc());
    fake.set('doc_sat', new Blob(['<html><script>alert(1)</script></html>'], { type: 'application/pdf' }), 'falso.pdf');
    const fakeResult = await post(fake);
    assert.equal(fakeResult.status, 422);
    assert.ok((await fakeResult.json()).fields.doc_sat);
    const bot = await post(submission(validKyc(), { hp_confirm: 'spam' }));
    assert.equal(bot.status, 400);
    const invalid = await post(submission({ ...validKyc(), rfc: 'X' }));
    assert.equal(invalid.status, 422);
    const invalidBody = await invalid.json();
    assert.deepEqual(Object.keys(invalidBody.fields), ['rfc']);
    assert.ok(!JSON.stringify(invalidBody).includes('Comercializadora'), 'Errors must not echo submitted data');
    const accepted = await post(submission(validKyc()));
    const acceptedBody = await accepted.json();
    assert.equal(accepted.status, 200, JSON.stringify(acceptedBody));
    assert.match(acceptedBody.folio, /^KYC-\d{8}-[0-9A-F]{8}$/);
    assert.equal(accepted.headers.get('cache-control'), 'no-store');
    const repeated = await (await post(submission(validKyc()))).json();
    assert.equal(repeated.folio, acceptedBody.folio, 'A repeated submission must not be delivered twice');
    console.log('PASS: KYC endpoint origin, type, size, content, honeypot, validation, dry-run delivery and de-duplication.');
  }
} finally { await app.stop(); }

const dependent = await start(true);
try {
  assert.equal((await fetch(dependent.base + '/api/health/live')).status, 200);
  assert.equal((await fetch(dependent.base + '/api/health/ready')).status, 503);
  assert.equal((await fetch(dependent.base)).status, 200);
  console.log('PASS: required backend unavailable -> readiness 503; public pages remain usable.');
} finally { await dependent.stop(); }
