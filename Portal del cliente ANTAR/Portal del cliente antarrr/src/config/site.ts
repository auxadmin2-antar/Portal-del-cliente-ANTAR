import { z } from "zod";

const siteSchema = z.object({
  SITE_URL: z.url().default("http://localhost:3000"),
  SITE_INDEXABLE: z.enum(["true", "false"]).default("false"),
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
});

export function readSiteConfig(values: Record<string, string | undefined>) {
  const parsed = siteSchema.safeParse(values);
  if (!parsed.success) throw new Error("Invalid site configuration: check SITE_URL, SITE_INDEXABLE and VERCEL_ENV");
  const url = new URL(parsed.data.SITE_URL);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment");
  }
  const production = parsed.data.VERCEL_ENV === "production";
  const placeholder = /(^|\.)(localhost|example\.(com|org|net))$|\.(invalid|test)$/.test(url.hostname) || url.hostname === "127.0.0.1";
  if (production && (url.protocol !== "https:" || placeholder)) {
    throw new Error("Configure the final HTTPS SITE_URL before a Production deployment");
  }
  return { origin: url.origin, indexable: production && parsed.data.SITE_INDEXABLE === "true" };
}
