import test from 'node:test';
import assert from 'node:assert/strict';
import { readSiteConfig } from '../src/config/site.ts';
import { readSupabaseConfig, backendRequired } from '../src/config/supabase.schema.ts';
import { checkDependencies } from '../src/lib/health.ts';

test('local and preview sites remain noindex even with the indexing flag', () => {
  assert.equal(readSiteConfig({}).indexable, false);
  assert.equal(readSiteConfig({ VERCEL_ENV: 'preview', SITE_INDEXABLE: 'true', SITE_URL: 'https://www.acme.com' }).indexable, false);
});
test('production indexing requires an explicit opt-in', () => {
  const env = { VERCEL_ENV: 'production', SITE_URL: 'https://www.acme.com/' };
  assert.equal(readSiteConfig(env).indexable, false);
  assert.deepEqual(readSiteConfig({ ...env, SITE_INDEXABLE: 'true' }), { origin: 'https://www.acme.com', indexable: true });
});
test('production rejects missing or placeholder canonical domains', () => {
  for (const SITE_URL of [undefined, 'http://www.acme.com', 'https://example.com', 'https://demo.example.org', 'https://demo.test', 'https://demo.invalid']) {
    assert.throws(() => readSiteConfig({ VERCEL_ENV: 'production', SITE_URL }));
  }
});
test('canonical origins reject credentials, paths and query fragments', () => {
  for (const SITE_URL of ['file:///private', 'https://name:secret@acme.com', 'https://acme.com/page', 'https://acme.com/?ref=x', 'https://acme.com/#fragment']) assert.throws(() => readSiteConfig({ SITE_URL }));
});
test('Supabase is optional for the reference site but mandatory when explicitly required', () => {
  assert.equal(backendRequired(undefined), false);
  assert.equal(backendRequired('true'), true);
  assert.throws(() => backendRequired('yes'));
  assert.throws(() => readSupabaseConfig({}));
});
test('Supabase rejects incomplete configuration without exposing secret values', () => {
  const env = { NEXT_PUBLIC_SUPABASE_URL: 'https://project.supabase.co', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-public-key' };
  assert.equal(readSupabaseConfig(env).url, env.NEXT_PUBLIC_SUPABASE_URL);
  assert.throws(() => readSupabaseConfig({ ...env, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'REPLACE_ME' }));
  assert.throws(() => readSupabaseConfig({ ...env, NEXT_PUBLIC_SUPABASE_URL: 'https://name:sensitive@host.com' }), error => !error.message.includes('sensitive'));
});
test('public configuration rejects administrative Supabase keys', () => {
  const payload = Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url');
  for (const key of ['sb_secret_sensitive', `header.${payload}.signature`]) {
    assert.throws(() => readSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: 'https://project.supabase.co', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key }));
  }
});
test('readiness checks Auth and REST with bounded, uncached requests', async () => {
  const requests = [];
  const result = await checkDependencies('https://project.supabase.co/', 'public-key', async (url, options) => {
    requests.push(url);
    assert.equal(options.headers.apikey, 'public-key');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.redirect, 'error');
    assert.ok(options.signal instanceof AbortSignal);
    return new Response('{}');
  });
  assert.equal(result.ready, true);
  assert.equal(requests.length, 2);
});
test('readiness does not report ready if a dependency fails', async () => {
  const unhealthy = await checkDependencies('https://project.supabase.co', 'key', async url => new Response('', { status: url.includes('/rest/') ? 503 : 200 }));
  assert.equal(unhealthy.ready, false);
  const unreachable = await checkDependencies('https://project.supabase.co', 'key', async () => { throw new Error('private detail'); });
  assert.equal(unreachable.ready, false);
  assert.ok(!JSON.stringify(unreachable).includes('private'));
});
