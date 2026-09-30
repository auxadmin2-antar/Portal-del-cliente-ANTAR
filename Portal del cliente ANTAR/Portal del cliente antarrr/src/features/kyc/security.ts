// Controles del endpoint público. Los contadores en memoria son de "mejor esfuerzo":
// en serverless cada instancia tiene los suyos. El control global recomendado es una
// regla de rate limit del firewall de Vercel sobre /api/kyc (ver docs/engineering/SECURITY_DATA.md).

const HOUR = 3_600_000;
const attempts = new Map<string, number[]>();
const recent = new Map<string, { folio: string; at: number }>();

export function clientKey(headers: Headers, trustProxy: boolean) {
  if (!trustProxy) return "local";
  const forwarded = headers.get("x-vercel-forwarded-for") ?? headers.get("x-real-ip") ?? headers.get("x-forwarded-for") ?? "";
  return forwarded.split(",")[0]?.trim().slice(0, 64) || "unknown";
}

export function isRateLimited(key: string, maxPerHour: number, now = Date.now()) {
  const list = (attempts.get(key) ?? []).filter(time => now - time < HOUR);
  list.push(now);
  attempts.set(key, list);
  if (attempts.size > 10_000) {
    for (const [entry, times] of attempts) if (!times.some(time => now - time < HOUR)) attempts.delete(entry);
  }
  return list.length > maxPerHour;
}

/** Acepta solo peticiones del mismo origen que atiende la petición o del SITE_URL configurado. */
export function isSameOrigin(request: Request, siteOrigin: string) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const allowed = new Set([siteOrigin]);
  if (host) {
    allowed.add(`https://${host}`);
    if (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) allowed.add(`http://${host}`);
  }
  return allowed.has(origin);
}

/** Verificación de Cloudflare Turnstile en servidor. */
export async function verifyCaptcha(secret: string, token: string, remoteIp: string, fetcher: typeof fetch = fetch) {
  if (!token || token.length > 2048) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp && !["local", "unknown"].includes(remoteIp)) body.set("remoteip", remoteIp);
    const response = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body, signal: AbortSignal.timeout(8000), cache: "no-store", redirect: "error",
    });
    if (!response.ok) return false;
    const result = await response.json() as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

/** Evita reenviar el mismo expediente por doble clic o reintento dentro de 15 minutos. */
export function rememberSubmission(fingerprint: string, folio: string, now = Date.now()) {
  recent.set(fingerprint, { folio, at: now });
  for (const [key, entry] of recent) if (now - entry.at > 15 * 60_000) recent.delete(key);
}

export function previousSubmission(fingerprint: string, now = Date.now()) {
  const entry = recent.get(fingerprint);
  return entry && now - entry.at <= 15 * 60_000 ? entry.folio : null;
}
